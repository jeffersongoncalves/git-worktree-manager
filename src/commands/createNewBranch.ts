import * as vscode from 'vscode';
import * as worktreeService from '../git/worktreeService';
import { resolveRepoPath } from '../utils/repo';
import { getConfig } from '../utils/config';
import { suggestWorktreePath } from '../utils/pathHelpers';
import { pickBranch, pickOpenAction } from '../ui/quickPicks';
import { inputNewBranchName, inputWorktreePath } from '../ui/inputs';
import { openWorktree } from './openWorktree';
import { WorktreeTreeProvider } from '../views/worktreeTreeProvider';

export function registerCreateNewBranch(
  context: vscode.ExtensionContext,
  provider: WorktreeTreeProvider
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitWorktree.createNewBranch', async () => {
      const repoPath = await resolveRepoPath();
      if (!repoPath) return;

      const newBranch = await inputNewBranchName();
      if (!newBranch) return;

      const current = await worktreeService.currentBranch(repoPath);
      const { local, remote } = await worktreeService.listBranches(repoPath);
      const base =
        (await pickBranch([current, ...local.filter((b) => b !== current)], remote, 'Select base branch/commit')) ??
        current;

      const config = getConfig();
      const suggested = suggestWorktreePath(repoPath, newBranch, config.defaultPath, config.pathNamingConvention);
      const targetPath = await inputWorktreePath(suggested);
      if (!targetPath) return;

      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Creating worktree with branch ${newBranch}...` },
        async () => {
          try {
            await worktreeService.addWithNewBranch(repoPath, targetPath, newBranch, base);
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
