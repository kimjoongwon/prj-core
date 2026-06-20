# @cocrepo/mo-ui

Shared mobile UI library for React Native / Expo apps in this monorepo.

## Overview

`@cocrepo/mo-ui` re-exports HeroUI Native components through the Cocrepo package structure.

Entry points are organized under `src/`:

- `action`: command and pressable controls
- `input`: direct text/value inputs
- `selection`: `Select`, `Radio`, `Checkbox`, `Switch`, `Slider`, 날짜/옵션 picker 같은 제한된 값/범위 선택
- `navigation`: view-switching controls
- `data-display`: avatar, chip, tag group, summary list, 반복 feed card 같은 데이터 표시 컴포넌트
- `feedback`: status and feedback components such as alert, skeleton, spinner, and toast
- `layout`: structural and overlay components
- `surface`: surface primitives
- `widget`: primitive를 조합한 재사용 composite UI
- `design-system`: provider exports

## Usage

```tsx
import { Button, Card, DesignSystemProvider, Textarea } from "@cocrepo/mo-ui";
```
