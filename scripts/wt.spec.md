# wt.js Sidecar Spec

## Purpose

- Provide a reusable CLI for git worktree lifecycle management.
- Standardize parallel development setup with optional tmux automation.
- Keep runtime state outside the repo working tree in git common dir.

## Commands

- `init`: create config file if missing.
- `new <ticket>`: allocate slot, create branch/worktree, write env file, create tmux session/windows.
- `go <ticket-or-branch>`: attach tmux session when available; otherwise print `cd` path.
- `list`: print registry entries with worktree/tmux status.
- `rm <ticket-or-branch>`: stop tmux, remove worktree, delete local branch by default.
  - Safe default: `git worktree remove` and `git branch -d`
  - Force option: `--force` uses `git worktree remove --force` and `git branch -D`
  - If `-d` fails (unmerged), branch is kept and cleanup continues.
- `help`: show command usage.

## Config Contract

- External JSON config (default: `.wt/config.json`, override: `--config`).
- Required behavior keys:
  - `worktreeRoot`, `directoryNameTemplate`, `branchPrefix`, `baseRef`, `envFileName`
  - `port.offsetStep`, `port.map`
  - `tmux.enabled`, `tmux.sessionPrefix`, `tmux.windows`

## Runtime Data

- Registry path: `<git-common-dir>/wt-tool/registry.json`
- Registry stores:
  - `ticket`, `branch`, `slot`
  - `worktreePath`, `envFilePath`, `sessionName`
  - `createdAt`

## Error Handling

- Validate config shape and values before command execution.
- Fail with concise `error: ...` output and non-zero exit code.
- Keep console output short for normal flows.

## Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-28 | Initial spec for reusable git worktree + tmux automation | codex |
| 2026-02-28 | Align defaults to project workflow (`../wt`, `feat/*`, `origin/main`) and add safe `rm` behavior | codex |
