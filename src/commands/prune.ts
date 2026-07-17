import * as vscode from 'vscode';
import * as worktreeService from '../git/worktreeService';
import { resolveRepoPath } from '../utils/repo';
import { WorktreeTreeProvider } from '../views/worktreeTreeProvider';

export function registerPrune(context: vscode.ExtensionContext, provider: WorktreeTreeProvider) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitWorktree.prune', async () => {
      const repoPath = await resolveRepoPath();
      if (!repoPath) return;

      try {
        await worktreeService.prune(repoPath);
        vscode.window.showInformationMessage('Worktree references pruned.');
        provider.refresh();
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to prune worktrees: ${err.message}`);
      }
    })
  );
}
