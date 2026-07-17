import * as vscode from 'vscode';
import { WorktreeTreeProvider } from './views/worktreeTreeProvider';
import { WorktreeTreeItem } from './views/worktreeTreeItem';
import { registerCreateFromExisting } from './commands/createFromExisting';
import { registerCreateNewBranch } from './commands/createNewBranch';
import { registerList } from './commands/list';
import { registerRemove } from './commands/remove';
import { registerPrune } from './commands/prune';

export function activate(context: vscode.ExtensionContext) {
  const provider = new WorktreeTreeProvider();
  context.subscriptions.push(vscode.window.registerTreeDataProvider('gitWorktree.treeView', provider));

  registerCreateFromExisting(context, provider);
  registerCreateNewBranch(context, provider);
  registerList(context, provider);
  registerRemove(context, provider);
  registerPrune(context, provider);

  context.subscriptions.push(
    vscode.commands.registerCommand('gitWorktree.refresh', () => provider.refresh()),

    vscode.commands.registerCommand('gitWorktree.open', async (item?: WorktreeTreeItem) => {
      if (!item) return;
      await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(item.worktree.path), {
        forceNewWindow: true
      });
    }),

    vscode.commands.registerCommand('gitWorktree.copyPath', async (item?: WorktreeTreeItem) => {
      if (!item) return;
      await vscode.env.clipboard.writeText(item.worktree.path);
      vscode.window.showInformationMessage('Path copied to clipboard.');
    })
  );
}

export function deactivate() {}
