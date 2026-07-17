import { runGit } from './gitExecutor';

export interface Worktree {
  path: string;
  branch: string;
  head: string;
  isMain: boolean;
  isLocked: boolean;
  isPrunable: boolean;
}

export interface BranchList {
  local: string[];
  remote: string[];
}

export async function list(repoPath: string): Promise<Worktree[]> {
  const output = await runGit(repoPath, ['worktree', 'list', '--porcelain']);
  return parsePorcelain(output);
}

export function parsePorcelain(output: string): Worktree[] {
  if (!output.trim()) {
    return [];
  }

  const blocks = output.split(/\r?\n\r?\n/).filter((b) => b.trim().length > 0);
  return blocks.map((block, index) => {
    const lines = block.split(/\r?\n/);
    let path = '';
    let head = '';
    let branch = '';
    let isLocked = false;
    let isPrunable = false;

    for (const line of lines) {
      if (line.startsWith('worktree ')) {
        path = line.slice('worktree '.length).trim();
      } else if (line.startsWith('HEAD ')) {
        head = line.slice('HEAD '.length).trim();
      } else if (line.startsWith('branch ')) {
        branch = line.slice('branch '.length).trim().replace(/^refs\/heads\//, '');
      } else if (line === 'detached') {
        branch = '(detached)';
      } else if (line === 'locked' || line.startsWith('locked ')) {
        isLocked = true;
      } else if (line === 'prunable' || line.startsWith('prunable ')) {
        isPrunable = true;
      }
    }

    return {
      path,
      branch: branch || '(detached)',
      head,
      isMain: index === 0,
      isLocked,
      isPrunable
    };
  });
}

export async function add(repoPath: string, path: string, branch: string): Promise<void> {
  await runGit(repoPath, ['worktree', 'add', path, branch]);
}

export async function addWithNewBranch(
  repoPath: string,
  path: string,
  newBranch: string,
  base: string
): Promise<void> {
  await runGit(repoPath, ['worktree', 'add', '-b', newBranch, path, base]);
}

export async function remove(repoPath: string, path: string, force = false): Promise<void> {
  const args = ['worktree', 'remove', path];
  if (force) {
    args.push('--force');
  }
  await runGit(repoPath, args);
}

export async function prune(repoPath: string): Promise<void> {
  await runGit(repoPath, ['worktree', 'prune']);
}

export async function listBranches(repoPath: string): Promise<BranchList> {
  const output = await runGit(repoPath, ['branch', '-a', '--format=%(refname:short)']);
  const local: string[] = [];
  const remote: string[] = [];

  for (const line of output.split(/\r?\n/)) {
    const name = line.trim();
    if (!name) {
      continue;
    }
    if (name.startsWith('origin/') && !name.endsWith('/HEAD')) {
      remote.push(name);
    } else if (!name.includes('/HEAD')) {
      local.push(name);
    }
  }

  return { local, remote };
}

export async function currentBranch(repoPath: string): Promise<string> {
  return runGit(repoPath, ['rev-parse', '--abbrev-ref', 'HEAD']);
}
