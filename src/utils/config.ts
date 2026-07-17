import * as vscode from 'vscode';

export type OpenBehavior = 'newWindow' | 'sameWindow' | 'ask' | 'none';
export type NamingConvention = 'branch-name' | 'repo-branch' | 'custom';

export function getConfig() {
  const cfg = vscode.workspace.getConfiguration('gitWorktree');
  return {
    defaultPath: cfg.get<string>('defaultPath', '../'),
    pathNamingConvention: cfg.get<NamingConvention>('pathNamingConvention', 'branch-name'),
    openBehavior: cfg.get<OpenBehavior>('openBehavior', 'ask'),
    confirmRemove: cfg.get<boolean>('confirmRemove', true)
  };
}
