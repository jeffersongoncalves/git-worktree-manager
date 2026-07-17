import * as vscode from 'vscode';
import * as fs from 'fs';

export async function inputWorktreePath(suggested: string): Promise<string | undefined> {
  return vscode.window.showInputBox({
    prompt: 'Destination path for the worktree',
    value: suggested,
    validateInput: (value) => {
      if (!value.trim()) {
        return 'Path is required';
      }
      if (fs.existsSync(value)) {
        return 'Path already exists';
      }
      return undefined;
    }
  });
}

export async function inputNewBranchName(): Promise<string | undefined> {
  return vscode.window.showInputBox({
    prompt: 'New branch name',
    validateInput: (value) => (value.trim() ? undefined : 'Branch name is required')
  });
}
