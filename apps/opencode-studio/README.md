# OpenCode Studio

OpenCode Studio is an internal monitor for OpenCode sessions only.

## Scope

- OpenCode-only support (`opencode` CLI)
- Live stream monitoring for OpenCode terminal sessions
- Subagent activity visualization based on OpenCode session exports

## Out of Scope

- Claude Code integration
- Any non-OpenCode runtime adapters

## Prerequisite

`opencode` must be installed and available in `PATH`.

If the binary is missing, the app shows a runtime error banner in the UI.

## macOS menu bar launcher

You can run Studio as a menu bar app on macOS:

```bash
pnpm --filter=opencode-studio mac:dev
```

What it does:

- Starts an Electron menu bar wrapper
- Reuses an existing Studio server on `http://127.0.0.1:3010` when available
- Otherwise starts `pnpm start:dev` automatically
- Shows quick status in the menu bar title (`OC`, `OC <n>`, `OC !`)

## Build `.app` bundle (macOS)

Build unsigned macOS app bundle:

```bash
pnpm --filter=opencode-studio mac:build
```

Output path example:

`apps/opencode-studio/dist-mac/mac-arm64/OpenCode Studio.app`

If you need a distributable archive (zip):

```bash
pnpm --filter=opencode-studio mac:dist
```

### Project folder selection

- In tray menu, choose **Select Project Folder...** to pin a workspace
- Or choose **Use All Sessions** to monitor every detected session directory
- The selected folder is saved in Electron user data settings
