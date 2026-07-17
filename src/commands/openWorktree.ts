import * as vscode from 'vscode';
import { OpenBehavior } from '../utils/config';

export async function openWorktree(
  targetPath: string,
  behavior: OpenBehavior,
  askFn: () => Promise<'newWindow' | 'sameWindow' | 'none' | undefined>
): Promise<void> {
  let effective = behavior;
  if (behavior === 'ask') {
    const answer = await askFn();
    if (!answer) return;
    effective = answer;
  }

  if (effective === 'none') return;

  const uri = vscode.Uri.file(targetPath);
  await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: effective === 'newWindow' });
}
