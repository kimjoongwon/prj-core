# @cocrepo/ui

Shared UI library for the Cocrepo monorepo.

## Overview

`@cocrepo/ui` exposes reusable UI building blocks and screen-level visual owners used by the web apps in this repository.

Entry points are organized under `src/`:

- `action`: `Button`, `CloseButton` 같은 즉시 실행 command control
- `input`: `Input`, `TextField`, `TextArea`, `NumberField`, `DateField`, `TimeInput`, `FileUploader`, `StringListInput` 같은 자유 형식/타입 값 입력
- `selection`: `Select`, `ComboBox`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `Calendar` 같은 제한된 값/범위 선택
- `navigation`: `Tabs`, `Pagination`, `Breadcrumbs`, `Link` 같은 화면 이동/전환 control
- `data-display`: `Avatar`, `Badge`, `Card`, `Chip`, `Table`, `Text`, `Typography` 같은 데이터 표시 primitive
- `feedback`: `Alert`, `EmptyState`, `Skeleton`, `Spinner`, `Toast` 같은 상태와 피드백 표시
- `overlay`: `Modal`, `Drawer`, `Popover`, `Tooltip`, `AlertDialog` 같은 modal layer UI
- `feature`: feature-level composites
- `form`: form flows and form sections
- `layout`: structural primitives such as `App`, `Page`, `Section`, `Container`
- `collection`: list/table oriented page building blocks
- `screen`: semantic app-facing pure screen UI components
- `rhythm`: spacing and flow primitives such as `VStack`, `HStack`, `Spacer`
- `surface`: surface and elevation primitives
- `widget`: reusable domain widgets

`feature`와 `widget` 바로 아래에는 컴포넌트 폴더 또는 단일 컴포넌트 엔트리만 둡니다. `idp`, `ability`, `course`, `payment`, `common` 같은 단순 분류용 중간 폴더는 만들지 않습니다.

`src/screen` uses folder-based sidecars. Keep each screen in `src/screen/[ScreenName]/`.
Prefer semantic screen names such as `AssetListScreen`, `RoleDetailScreen`, `SecurityPolicyFormScreen`.
Avoid route-mirror names such as `AdminAssetsAssetIdPage` or `IdpConsoleOidcClientsOidcClientIdPage`.

## Installation

```bash
pnpm add @cocrepo/ui
```

## Usage

```tsx
import { Button, NotFound, Section, VStack } from "@cocrepo/ui";

export function Example() {
  return (
    <Section>
      <VStack gap="section">
        <Button>Confirm</Button>
        <NotFound title="Nothing here" description="Try a different route." />
      </VStack>
    </Section>
  );
}
```

## Common Exports

- Action: `Button`, `ButtonGroup`, `CloseButton`
- Input: `Input`, `TextField`, `TextArea`, `NumberField`, `DateField`
- Selection: `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`
- Navigation: `Tabs`, `Pagination`, `Breadcrumbs`, `Link`
- Data display: `Avatar`, `Badge`, `Card`, `Chip`, `Table`, `Text`
- Feedback: `EmptyState`, `Message`, `NotFound`, `Skeleton`, `Spinner`
- Overlay: `Modal`, `Drawer`, `Popover`, `Tooltip`, `AlertDialog`
- Layout: `App`, `Page`, `Container`, `Toolbar`
- Rhythm: `VStack`, `HStack`, `Spacer`
- DataGrid: `DataGrid`
- Form: `LoginForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `OidcClientForm`
- Page: app-facing page UI such as `AssetListScreen`, `AssetDetailScreen`, `AccountListScreen`

## Storybook

```bash
pnpm --filter tool-storybook start:dev
```

## Notes

- The package name is already `@cocrepo/ui`.
- Application state management lives in `@cocrepo/store`.
- New code should prefer semantic rhythm presets such as `gap="page"`, `gap="section"`, `gap="inline"`, `size="inline"` over raw numeric spacing.
