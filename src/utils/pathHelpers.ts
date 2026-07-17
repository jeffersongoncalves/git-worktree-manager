import * as path from 'path';

export function sanitizeBranchForFolder(branch: string): string {
  const stripped = branch.replace(/^refs\/(heads|remotes)\//, '');
  const lastSegment = stripped.split('/').pop() ?? stripped;
  return lastSegment.replace(/[\\:]+/g, '-');
}

export function suggestWorktreePath(repoPath: string, branch: string, defaultBase: string): string {
  const repoName = path.basename(repoPath);
  const folder = sanitizeBranchForFolder(branch);

  return path.resolve(repoPath, defaultBase, `${repoName}-${folder}`);
}
