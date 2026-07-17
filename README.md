# Git Worktree Manager

Create and manage git worktrees from VSCode without leaving the editor.

## Features

- **Create worktree from existing branch** — pick a local or remote branch, choose a destination path, and open the new worktree.
- **Create worktree with a new branch** — name a new branch, pick a base branch/commit, and check it out into a new worktree.
- **Tree view** — dedicated Activity Bar view listing every worktree, with the main worktree highlighted and locked/prunable badges.
- **List / remove / prune** — Quick Pick driven flows for listing worktrees, removing one (with confirmation and a force fallback for dirty trees), and pruning stale references.

## Commands

| Command | Description |
|---|---|
| `Git Worktree: Create Worktree from Existing Branch` | `gitWorktree.createFromExisting` |
| `Git Worktree: Create Worktree with New Branch` | `gitWorktree.createNewBranch` |
| `Git Worktree: List Worktrees` | `gitWorktree.list` |
| `Git Worktree: Remove Worktree` | `gitWorktree.remove` |
| `Git Worktree: Prune Worktrees` | `gitWorktree.prune` |

## Settings

| Setting | Default | Description |
|---|---|---|
| `gitWorktree.defaultPath` | `../` | Base directory (relative to the repo) suggested for new worktrees |
| `gitWorktree.openBehavior` | `ask` | `newWindow`, `sameWindow`, `ask`, or `none` |
| `gitWorktree.confirmRemove` | `true` | Ask for confirmation before removing a worktree |

## Development

```bash
npm install
npm run watch
```

Press `F5` in VSCode to launch an Extension Development Host.

```bash
npm test      # run unit tests
npm run lint  # eslint
npm run package && npx vsce package  # build a .vsix
```
