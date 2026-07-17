import * as path from 'path';
import { NamingConvention } from './config';

export function sanitizeBranchForFolder(branch: string): string {
  return branch.replace(/^refs\/(heads|remotes)\//, '').replace(/[\\/:]+/g, '-');
}

export function suggestWorktreePath(
  repoPath: string,
  branch: string,
  defaultBase: string,
  convention: NamingConvention
): string {
  const repoName = path.basename(repoPath);
  const folder = sanitizeBranchForFolder(branch);

  const name = convention === 'repo-branch' ? `${repoName}-${folder}` : folder;
  return path.resolve(repoPath, defaultBase, name);
}
