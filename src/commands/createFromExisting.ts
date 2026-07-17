import * as vscode from 'vscode';
import * as worktreeService from '../git/worktreeService';
import { resolveRepoPath } from '../utils/repo';
import { getConfig } from '../utils/config';
import { suggestWorktreePath } from '../utils/pathHelpers';
import { pickBranch, pickOpenAction } from '../ui/quickPicks';
import { inputWorktreePath } from '../ui/inputs';
import { openWorktree } from './openWorktree';
import { WorktreeTreeProvider } from '../views/worktreeTreeProvider';

export function registerCreateFromExisting(
  context: vscode.ExtensionContext,
  provider: WorktreeTreeProvider
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitWorktree.createFromExisting', async () => {
      const repoPath = await resolveRepoPath();
      if (!repoPath) return;

      const { local, remote } = await worktreeService.listBranches(repoPath);
      const branch = await pickBranch(local, remote, 'Select a branch for the new worktree');
      if (!branch) return;

      const config = getConfig();
      const suggested = suggestWorktreePath(repoPath, branch, config.defaultPath);
      const targetPath = await inputWorktreePath(suggested);
      if (!targetPath) return;

      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Creating worktree for ${branch}...` },
        async () => {
          try {
            await worktreeService.add(repoPath, targetPath, branch);
            vscode.window.showInformationMessage(`Worktree created at ${targetPath}`);
            provider.refresh();
            await openWorktree(targetPath, config.openBehavior, pickOpenAction);
          } catch (err: any) {
            vscode.window.showErrorMessage(`Failed to create worktree: ${err.message}`);
          }
        }
      );
    })
  );
}
