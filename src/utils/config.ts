import * as vscode from 'vscode';

export type OpenBehavior = 'newWindow' | 'sameWindow' | 'ask' | 'none';

export function getConfig() {
  const cfg = vscode.workspace.getConfiguration('gitWorktree');
  return {
    defaultPath: cfg.get<string>('defaultPath', '../'),
    openBehavior: cfg.get<OpenBehavior>('openBehavior', 'ask'),
    confirmRemove: cfg.get<boolean>('confirmRemove', true)
  };
}
