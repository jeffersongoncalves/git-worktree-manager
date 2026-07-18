# Changelog

All notable changes to the "Git Worktree Manager" extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.9] - 2026-07-17

### Fixed
- Backfilled changelog entries for 0.1.1-0.1.8 (was stuck at 0.1.0, so the Marketplace changelog tab never updated).

## [0.1.8] - 2026-07-17

### Changed
- Worktree folders are now always named `{repoName}-{lastBranchSegment}` (e.g. `feature/JSG-2026` on repo `myapp` -> `myapp-JSG-2026`).
- Removed the `gitWorktree.pathNamingConvention` setting; the naming above is now the only behavior.

## [0.1.7] - 2026-07-17

### Added
- Marketplace icon.

## [0.1.6] - 2026-07-17

### Added
- `repository`, `bugs`, `homepage`, `license`, and `keywords` fields in the manifest.

## [0.1.5] - 2026-07-17

### Fixed
- Bumped `esbuild` and pinned transitive `serialize-javascript` to resolve Dependabot alerts (dev-only dependencies).

## [0.1.4] - 2026-07-17

### Fixed
- `displayName` now matches the extension name (Marketplace collision).

## [0.1.3] - 2026-07-17

### Fixed
- Changed `displayName` (Marketplace collision).

## [0.1.2] - 2026-07-17

### Fixed
- Renamed extension to `jsg-git-worktree-manager` (Marketplace name collision).

## [0.1.1] - 2026-07-17

### Fixed
- Corrected `publisher` ID to match the Marketplace account.

## [0.1.0] - 2026-07-17

### Added
- Create worktree from an existing local or remote branch.
- Create worktree with a new branch from a chosen base.
- Tree view in the Activity Bar listing all worktrees, with locked/prunable indicators.
- List worktrees via Quick Pick with open/remove/copy-path actions.
- Remove worktree, with confirmation and force-remove fallback for dirty/locked trees.
- Prune stale worktree references.
- Configurable default path, naming convention, open behavior, and remove confirmation.
