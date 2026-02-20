# prepare-build script spec

## Goal

Create a minimal Electron app directory that avoids pnpm workspace symlink issues during `electron-builder` packaging.

## Input

- `menubar/main.cjs`
- `.next/standalone`
- `.next/static`
- `public` (optional)

## Output

- `dist-electron-app/main.cjs`
- `dist-electron-app/.next/standalone`
- `dist-electron-app/.next/static`
- `dist-electron-app/public` (when source exists)
- `dist-electron-app/package.json` (minimal runtime manifest)

## Behavior

- Removes previous `dist-electron-app` directory.
- Fails fast when required build artifacts are missing.
- Repairs broken top-level pnpm package symlinks in standalone `node_modules`.
- Prints prepared output path on success.

## Change Log

| Date | Change | Author |
| --- | --- | --- |
| 2026-02-21 | Initial creation | opencode |
| 2026-02-21 | Add broken symlink repair for standalone pnpm links | opencode |
