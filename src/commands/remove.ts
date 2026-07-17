import * as vscode from 'vscode';
import * as worktreeService from '../git/worktreeService';
import { Worktree } from '../git/worktreeService';
import { resolveRepoPath } from '../utils/repo';
import { getConfig } from '../utils/config';
import { pickWorktree } from '../ui/quickPicks';
import { WorktreeTreeProvider } from '../views/worktreeTreeProvider';
import { WorktreeTreeItem } from '../views/worktreeTreeItem';

export function registerRemove(context: vscode.ExtensionContext, provider: WorktreeTreeProvider) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitWorktree.remove', async (item?: WorktreeTreeItem) => {
      const repoPath = await resolveRepoPath();
      if (!repoPath) return;

      let target = item?.worktree;
      if (!target) {
        const worktrees = await worktreeService.list(repoPath);
        target = await pickWorktree(worktrees, 'Select a worktree to remove', true);
      }
      if (!target) return;

      if (target.isMain) {
        vscode.window.showWarningMessage('Cannot remove the main worktree.');
        return;
      }

      await removeWorktreeFlow(repoPath, target, provider);
    })
  );
}

export async function removeWorktreeFlow(
  repoPath: string,
  worktree: Worktree,
  provider: WorktreeTreeProvider
): Promise<void> {
  const config = getConfig();

  if (config.confirmRemove) {
    const confirmed = await vscode.window.showWarningMessage(
      `Remove worktree "${worktree.branch}" at ${worktree.path}?`,
      { modal: true },
      'Remove'
    );
    if (confirmed !== 'Remove') return;
  }

  try {
    await worktreeService.remove(repoPath, worktree.path);
    vscode.window.showInformationMessage(`Worktree removed: ${worktree.path}`);
    provider.refresh();
  } catch (err: any) {
    const message: string = err.message ?? '';
    if (/uncommitted|dirty|not clean|locked/i.test(message)) {
      const force = await vscode.window.showWarningMessage(
        `Worktree has uncommitted changes or is locked. Force remove "${worktree.branch}"?`,
        { modal: true },
        'Force Remove'
      );
      if (force === 'Force Remove') {
        try {
          await worktreeService.remove(repoPath, worktree.path, true);
          vscode.window.showInformationMessage(`Worktree removed: ${worktree.path}`);
          provider.refresh();
        } catch (forceErr: any) {
          vscode.window.showErrorMessage(`Failed to remove worktree: ${forceErr.message}`);
        }
      }
    } else {
      vscode.window.showErrorMessage(`Failed to remove worktree: ${message}`);
    }
  }
}
