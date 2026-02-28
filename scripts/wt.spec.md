# wt.js Sidecar Spec

## Purpose

- Provide a reusable CLI for git worktree lifecycle management.
- Standardize parallel development setup with optional tmux automation.
- Keep runtime state outside the repo working tree in git common dir.

## Commands

- `init`: create config file if missing.
- `new <ticket>`: allocate slot, create branch/worktree, write env file, create tmux session/windows.
- `new-run <ticket> [--prompt <text>]`: run `new`, enqueue Codex task in tmux, optionally auto-attach.
  - If prompt is omitted, ask interactively in TTY mode.
  - By default, queue `wt:pr <ticket>` after Codex succeeds (`--no-pr` disables this).
- `go <ticket-or-branch>`: attach tmux session when available; otherwise print `cd` path.
- `list`: print registry entries with worktree/tmux status (`--json` supported).
- `plan-merge <ticket|branch>`: analyze branch outputs and recommend `merge|squash|rebase`.
- `pr <ticket|branch>`: push branch and create/reuse PR.
- `merge <ticket|branch>`: merge PR with explicit or recommended strategy.
- `finish <ticket|branch>`: end-to-end flow (rebase, push, PR, merge, cleanup).
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
- For AI orchestration flows, provide machine-readable payloads with `--json`.

## Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-28 | Initial spec for reusable git worktree + tmux automation | codex |
| 2026-02-28 | Align defaults to project workflow (`../wt`, `feat/*`, `origin/main`) and add safe `rm` behavior | codex |
| 2026-02-28 | Add AI-controlled PR/merge lifecycle commands (`plan-merge`, `pr`, `merge`, `finish`) and JSON output mode | codex |
| 2026-02-28 | Add `new-run` command for one-shot worktree creation and Codex task bootstrapping in tmux | codex |
| 2026-02-28 | Replace `which`-based command detection with PATH executable lookup for pnpm compatibility | codex |
| 2026-02-28 | Make `go` non-interactive-safe by printing attach hints when TTY is unavailable | codex |
| 2026-02-28 | Simplify `new-run` to core flow (Codex exec + default auto-PR) and remove interactive mode option | codex |
| 2026-02-28 | Improve ticket sanitization/branch normalization to support Korean tickets and avoid bare `feat` branch collisions | codex |
| 2026-02-28 | Add hash suffix to tmux session naming to avoid collisions for non-ASCII branch names | codex |
