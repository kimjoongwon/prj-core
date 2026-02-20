# menubar launcher spec

## Goal

Expose OpenCode Studio as a macOS menu bar app so users can monitor activity from the top bar without keeping a browser tab open.

## Runtime behavior

- Launches an Electron tray app.
- Uses a menu bar title (`OC`, `OC 2`, `OC !`) as a compact status indicator.
- Polls `/api/runs/summary` for live counters.
- Opens/hides a popover-like window anchored near the tray icon.

## Server boot strategy

- If an existing Studio server is reachable, it reuses that server.
- If not reachable in dev mode, it starts `pnpm start:dev` from `apps/opencode-studio`.
- If packaged, it starts the bundled Next standalone server.
- On quit, it stops only the server process started by this launcher.

## Packaging compatibility

- Uses files copied into `dist-electron-app` by `menubar/prepare-build.cjs`.
- Resolves bundled Next server from app-relative `.next/standalone` paths.

## Project directory strategy

- Reads `OPENCODE_PROJECT_DIR` first.
- Falls back to saved settings in Electron `userData/settings.json`.
- Supports selecting/clearing project folder from tray menu.
- Restarts managed server when project folder changes.

## Tray menu actions

- Open Studio
- Open in Browser
- Select Project Folder...
- Use All Sessions
- Reload
- Quit

## Change Log

| Date | Change | Author |
| --- | --- | --- |
| 2026-02-20 | Initial creation | opencode |
| 2026-02-21 | Add packaged standalone boot and project folder settings | opencode |
