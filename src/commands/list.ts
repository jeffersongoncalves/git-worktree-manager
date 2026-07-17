import * as vscode from 'vscode';
import * as worktreeService from '../git/worktreeService';
import { resolveRepoPath } from '../utils/repo';
import { pickWorktree } from '../ui/quickPicks';
import { WorktreeTreeProvider } from '../views/worktreeTreeProvider';
import { removeWorktreeFlow } from './remove';

export function registerList(context: vscode.ExtensionContext, provider: WorktreeTreeProvider) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitWorktree.list', async () => {
      const repoPath = await resolveRepoPath();
      if (!repoPath) return;

      try {
        const worktrees = await worktreeService.list(repoPath);
        const selected = await pickWorktree(worktrees, 'Worktrees');
        if (!selected) return;

        const action = await vscode.window.showQuickPick(
          [
            { label: '$(folder-opened) Open', value: 'open' as const },
            { label: '$(trash) Remove', value: 'remove' as const, description: selected.isMain ? 'unavailable for main worktree' : undefined },
            { label: '$(copy) Copy Path', value: 'copy' as const }
          ],
          { placeHolder: `${selected.branch} — choose an action` }
        );
        if (!action) return;

        if (action.value === 'open') {
          await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(selected.path), {
            forceNewWindow: true
          });
        } else if (action.value === 'remove') {
          if (selected.isMain) {
            vscode.window.showWarningMessage('Cannot remove the main worktree.');
            return;
          }
          await removeWorktreeFlow(repoPath, selected, provider);
        } else if (action.value === 'copy') {
          await vscode.env.clipboard.writeText(selected.path);
          vscode.window.showInformationMessage('Path copied to clipboard.');
        }
      } catch (err: any) {
        vscode.window.showErrorMessage(`Git Worktree Manager: ${err.message}`);
      }
    })
  );
}
