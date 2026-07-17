import * as assert from 'assert';
import { parsePorcelain } from '../../src/git/worktreeService';

suite('parsePorcelain', () => {
  test('parses main and linked worktrees, including locked/prunable', () => {
    const output = [
      'worktree /repo',
      'HEAD abc123',
      'branch refs/heads/main',
      '',
      'worktree /repo-feature',
      'HEAD def456',
      'branch refs/heads/feature/x',
      'locked',
      '',
      'worktree /repo-old',
      'HEAD 789abc',
      'detached',
      'prunable gitdir file points to non-existent location'
    ].join('\n');

    const result = parsePorcelain(output);

    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(
      result.map((w) => w.branch),
      ['main', 'feature/x', '(detached)']
    );
    assert.strictEqual(result[0].isMain, true);
    assert.strictEqual(result[1].isMain, false);
    assert.strictEqual(result[1].isLocked, true);
    assert.strictEqual(result[2].isPrunable, true);
  });

  test('returns empty array for empty output', () => {
    assert.deepStrictEqual(parsePorcelain(''), []);
  });
});
