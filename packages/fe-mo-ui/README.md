# @cocrepo/mo-ui

Shared mobile UI library for React Native / Expo apps in this monorepo.

## Overview

`@cocrepo/mo-ui` re-exports HeroUI Native components through the Cocrepo package structure.

Entry points are organized under `src/`:

- `action`: command and pressable controls
- `input`: direct text/value inputs
- `selection`: choice and selection controls
- `navigation`: view-switching controls
- `data-display`: data display components such as avatar, chip, and tag group
- `feedback`: status and feedback components such as alert, skeleton, spinner, and toast
- `layout`: structural and overlay components
- `surface`: surface primitives
- `design-system`: provider exports

## Usage

```tsx
import { Button, Card, DesignSystemProvider, Textarea } from "@cocrepo/mo-ui";
```
