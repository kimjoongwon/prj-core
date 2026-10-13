# @cocrepo/ui

Shared UI library for the Cocrepo monorepo.

## Overview

`@cocrepo/ui` exposes reusable UI building blocks and screen-level visual owners used by the web apps in this repository.

Entry points are organized under `src/`:

- `input`: `Button`, `CloseButton`, `Input`, `TextField`, `TextArea`, `StringListInput`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Tabs`, `Pagination`, `Link` 같은 입력/액션/선택/navigation leaf control
- `data-display`: `Avatar`, `Card`, `Chip`, `Table`, `Text`, `Typography` 같은 데이터 표시 primitive
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

`feature`와 `widget` 바로 아래에는 컴포넌트 폴더 또는 단일 컴포넌트 엔트리만 둡니다. `idp`, `ability`, `admin`, `shared`, `common` 같은 단순 분류용 중간 폴더는 만들지 않습니다.

`src/screen` uses folder-based sidecars. Keep each screen in `src/screen/[ScreenName]/`.
Prefer semantic screen names such as `AssetListScreen`, `RoleEditScreen`, `SecurityPolicyFormScreen`.
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

- Input: `Button`, `CloseButton`, `Input`, `TextField`, `TextArea`, `StringListInput`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Tabs`, `Pagination`, `Link`
- Data display: `Avatar`, `Card`, `Chip`, `Table`, `Text`
- Feedback: `EmptyState`, `Message`, `NotFound`, `Skeleton`, `Spinner`
- Overlay: `Modal`, `Drawer`, `Popover`, `Tooltip`, `AlertDialog`
- Layout: `App`, `Page`, `Container`, `Toolbar`
- Rhythm: `VStack`, `HStack`, `Spacer`
- DataGrid: `DataGrid`
- Form: `LoginForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `OidcClientForm`
- Page: app-facing page UI such as `AssetListScreen`, `AssetDetailScreen`, `AccountListScreen`

## DataGrid 상태와 조회 경계

- `DataGrid`에는 `createDataGridState`로 구성한 `state`만 전달합니다. 상태 객체는 데이터와 주입 설정을 보유하고, 동작은 해당 컴포넌트의 `useHandlers(state)`가 소유합니다.
- 원본 행은 `table.rows`, 전체 건수는 `pagination.totalCount`, 행 클릭·편집 요청은 `table.row`, 선택 액션 표시는 `actionBar`에 둡니다.
- DataGrid 연관 목록은 상위 route 또는 feature에서 Suspense로 조회합니다. query·응답·건수 변경은 memoized `createDataGridState`의 입력으로 반영하며, effect로 조회 결과를 다시 대입하지 않습니다.
- 조회 대기는 상위 Suspense 경계가 처리합니다. 저장·삭제·업로드 같은 mutation pending은 해당 동작의 UI에서 유지합니다.

## Storybook

```bash
pnpm --filter tool-storybook start:dev
```

## Notes

- The package name is already `@cocrepo/ui`.
- Application state management lives in `@cocrepo/store`.
- New code should prefer semantic rhythm presets such as `gap="page"`, `gap="section"`, `gap="inline"`, `size="inline"` over raw numeric spacing.
