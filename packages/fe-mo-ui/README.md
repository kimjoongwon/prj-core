# @cocrepo/mo-ui

Shared mobile UI library for React Native / Expo apps in this monorepo.

## Overview

`@cocrepo/mo-ui` re-exports HeroUI Native components through the Cocrepo package structure.

Entry points are organized under `src/`:

- `input`: command controls, direct text/value inputs, selection controls, and view-switching leaf controls
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

## 입력 상태 계약

입력·선택 leaf는 `state`와 `path`를 함께 전달하면 해당 외부 observable 경로를 유일한 값 원천으로 사용합니다. 외부 상태가 없으면 controlled 값(`value`, `isSelected`, `selectedValue`, `selectedKey` 등)이 있는 경우 그 값을 사용하고 callback으로 변경을 알리며, 둘 다 없을 때만 컴포넌트별 `create[ComponentName]State`가 만드는 내부 상태를 사용합니다. `defaultValue` 계열은 내부 상태의 최초값으로만 사용되며 `false`, `0`, 빈 문자열, `null`도 유효한 값으로 보존됩니다.

공개 input state factory와 `*State` 타입은 각 input barrel에서 re-export됩니다. `InputStateInspectionProvider` 하위에서는 실제 선택된 상태를 inspection reader로 확인할 수 있고, Provider 없이도 일반 앱 입력 동작은 동일합니다.
