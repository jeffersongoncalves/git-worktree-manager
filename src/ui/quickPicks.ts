import * as vscode from 'vscode';
import { Worktree } from '../git/worktreeService';

export async function pickBranch(
  local: string[],
  remote: string[],
  placeHolder: string
): Promise<string | undefined> {
  const items: vscode.QuickPickItem[] = [
    ...local.map((b) => ({ label: b, description: 'local' })),
    ...remote.map((b) => ({ label: b, description: 'remote' }))
  ];
  const picked = await vscode.window.showQuickPick(items, { placeHolder, matchOnDescription: true });
  return picked?.label;
}

export async function pickWorktree(
  worktrees: Worktree[],
  placeHolder: string,
  excludeMain = false
): Promise<Worktree | undefined> {
  const filtered = excludeMain ? worktrees.filter((w) => !w.isMain) : worktrees;
  const items = filtered.map((w) => ({
    label: `${w.isMain ? '$(home) ' : '$(git-branch) '}${w.branch}`,
    description: w.path,
    detail: [w.isLocked ? 'locked' : '', w.isPrunable ? 'prunable' : ''].filter(Boolean).join(' · '),
    worktree: w
  }));
  const picked = await vscode.window.showQuickPick(items, { placeHolder });
  return picked?.worktree;
}

export async function pickOpenAction(): Promise<'newWindow' | 'sameWindow' | 'none' | undefined> {
  const picked = await vscode.window.showQuickPick(
    [
      { label: 'Open in New Window', value: 'newWindow' as const },
      { label: 'Open in Current Window', value: 'sameWindow' as const },
      { label: "Don't Open", value: 'none' as const }
    ],
    { placeHolder: 'Open the new worktree?' }
  );
  return picked?.value;
}
