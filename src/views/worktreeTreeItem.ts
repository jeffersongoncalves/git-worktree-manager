import * as vscode from 'vscode';
import { Worktree } from '../git/worktreeService';

export class WorktreeTreeItem extends vscode.TreeItem {
  constructor(public readonly worktree: Worktree) {
    super(worktree.branch, vscode.TreeItemCollapsibleState.None);

    this.description = worktree.path;
    this.tooltip = `${worktree.branch}\n${worktree.path}\n${worktree.head}`;
    this.contextValue = 'worktree';
    this.iconPath = new vscode.ThemeIcon(worktree.isMain ? 'home' : 'git-branch');

    const badges: string[] = [];
    if (worktree.isLocked) badges.push('locked');
    if (worktree.isPrunable) badges.push('prunable');
    if (badges.length) {
      this.description = `${worktree.path} · ${badges.join(', ')}`;
    }

    this.command = {
      command: 'gitWorktree.open',
      title: 'Open Worktree',
      arguments: [this]
    };
  }
}
