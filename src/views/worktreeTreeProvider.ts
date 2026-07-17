import * as vscode from 'vscode';
import * as worktreeService from '../git/worktreeService';
import { resolveRepoPath } from '../utils/repo';
import { WorktreeTreeItem } from './worktreeTreeItem';

export class WorktreeTreeProvider implements vscode.TreeDataProvider<WorktreeTreeItem> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: WorktreeTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<WorktreeTreeItem[]> {
    const repoPath = await resolveRepoPath();
    if (!repoPath) {
      return [];
    }

    try {
      const worktrees = await worktreeService.list(repoPath);
      return worktrees.map((w) => new WorktreeTreeItem(w));
    } catch (err: any) {
      vscode.window.showErrorMessage(`Git Worktree Manager: ${err.message}`);
      return [];
    }
  }
}
