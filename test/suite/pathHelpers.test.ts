import * as assert from 'assert';
import * as path from 'path';
import { sanitizeBranchForFolder, suggestWorktreePath } from '../../src/utils/pathHelpers';

suite('sanitizeBranchForFolder', () => {
  test('uses the segment after the last slash', () => {
    assert.strictEqual(sanitizeBranchForFolder('feature/nova-branch'), 'nova-branch');
    assert.strictEqual(sanitizeBranchForFolder('feature/JSG-2026'), 'JSG-2026');
  });

  test('strips refs/heads and refs/remotes prefixes', () => {
    assert.strictEqual(sanitizeBranchForFolder('refs/heads/feature/x'), 'x');
    assert.strictEqual(sanitizeBranchForFolder('refs/remotes/origin/main'), 'main');
  });

  test('leaves a branch with no slash untouched', () => {
    assert.strictEqual(sanitizeBranchForFolder('main'), 'main');
  });
});

suite('suggestWorktreePath', () => {
  test('names the folder {repoName}-{lastBranchSegment}', () => {
    const repoPath = path.join('C:', 'PROJETOS', 'jeffersongoncalves.dev.br');
    const suggested = suggestWorktreePath(repoPath, 'feature/novo-login', '../');
    assert.strictEqual(path.basename(suggested), 'jeffersongoncalves.dev.br-novo-login');
  });
});
