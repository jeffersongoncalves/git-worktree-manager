import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function resolveRepoPath(): Promise<string | undefined> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage('Git Worktree Manager: no folder open.');
    return undefined;
  }

  const gitFolders = folders.filter((f) => isGitRepo(f.uri.fsPath));
  if (gitFolders.length === 0) {
    vscode.window.showErrorMessage('Git Worktree Manager: no git repository found in the open folders.');
    return undefined;
  }

  if (gitFolders.length === 1) {
    return gitFolders[0].uri.fsPath;
  }

  const picked = await vscode.window.showQuickPick(
    gitFolders.map((f) => ({ label: f.name, description: f.uri.fsPath, path: f.uri.fsPath })),
    { placeHolder: 'Select the repository' }
  );
  return picked?.path;
}

function isGitRepo(folderPath: string): boolean {
  return fs.existsSync(path.join(folderPath, '.git'));
}
