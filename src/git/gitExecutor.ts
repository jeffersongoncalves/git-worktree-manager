import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitError extends Error {
  constructor(message: string, public readonly stderr: string) {
    super(message);
    this.name = 'GitError';
  }
}

export async function runGit(cwd: string, args: string[]): Promise<string> {
  const command = `git ${args.map(quoteArg).join(' ')}`;
  try {
    const { stdout } = await execAsync(command, { cwd, maxBuffer: 10 * 1024 * 1024 });
    return stdout.trim();
  } catch (err: any) {
    const stderr: string = err.stderr ?? err.message ?? '';
    throw new GitError(stderr.trim() || 'git command failed', stderr);
  }
}

function quoteArg(arg: string): string {
  if (/^[A-Za-z0-9_\-./:]+$/.test(arg)) {
    return arg;
  }
  return `"${arg.replace(/"/g, '\\"')}"`;
}
