# @cocrepo/ui

Shared UI library for the Cocrepo monorepo.

## Overview

`@cocrepo/ui` exposes reusable UI building blocks and screen-level visual owners used by the web apps in this repository.

Entry points are organized under `src/`:

- `input`: `Button`, `CloseButton`, `Input`, `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Tabs`, `Pagination`, `Link` 같은 입력/액션/선택/navigation leaf control
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
Prefer semantic screen names such as `RoleListScreen`, `RoleEditScreen`, `UserListScreen`.
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

- Input: `Button`, `CloseButton`, `Input`, `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Tabs`, `Pagination`, `Link`
- Data display: `Avatar`, `Card`, `Chip`, `Table`, `Text`
- Feedback: `EmptyState`, `Message`, `NotFound`, `Skeleton`, `Spinner`
- Overlay: `Modal`, `Drawer`, `Popover`, `Tooltip`, `AlertDialog`
- Layout: `App`, `Page`, `Container`, `Toolbar`
- Rhythm: `VStack`, `HStack`, `Spacer`
- DataGrid: `DataGrid`
- Form: `LoginForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `SignUpForm`
- Page: app-facing page UI such as `RoleListScreen`, `RoleEditScreen`, `UserListScreen`

## DataGrid 상태와 조회 경계

- `DataGrid`에는 `createDataGridState`로 구성한 `state`를 전달합니다. 상태 객체는 변경분, 선택, 펼침, query와 편집 요청의 유일한 원천이고, 동작은 해당 컴포넌트의 `useHandlers(state)`가 소유합니다.
- 원본 행은 기본적으로 `state.table.rows`, 전체 건수는 `pagination.totalCount`, 행 클릭·편집 요청은 `table.row`, 선택 액션 표시는 `actionBar`에 둡니다.
- 외부 원본 행이나 도메인 전용 column·hierarchy 표시가 필요하면 `DataGrid`의 선택적 `table` prop에 `rows`, `columns`, `getSubRows`, `getRowsWithChanges`를 전달합니다. 이는 순수 표시 입력이며 state를 덮어쓰지 않고, 미지정 필드는 `state.table` 설정을 그대로 사용합니다.
- `getRowsWithChanges(state, sourceRows)`를 지정하면 기본 `combineRowsWithChanges` 대신 도메인별 root/hierarchy 행을 계산합니다. 변경분의 소유자는 계속 전달받은 `state` 하나이며, resolver는 render 중 state를 변경하지 않아야 합니다.
- `show`의 `toolbar`, `groupPanel`, `pagination`, `actionBar`는 기본적으로 모두 표시합니다. false를 명시한 영역만 DOM에서 제외합니다.
- DataGrid 연관 목록은 상위 route 또는 feature에서 Suspense로 조회합니다. query·응답·건수 변경은 memoized `createDataGridState`의 입력으로 반영하며, effect로 조회 결과를 다시 대입하지 않습니다.
- 조회 대기는 상위 Suspense 경계가 처리합니다. 저장·삭제·업로드 같은 mutation pending은 해당 동작의 UI에서 유지합니다.

## Storybook

```bash
pnpm --filter tool-storybook start:dev
```

## 입력 상태 계약

입력·선택 컴포넌트는 `state`와 `path`를 생략하면 컴포넌트가 생성한 기본 observable 상태를 사용합니다. `state`와 `path`를 전달하면 해당 외부 경로가 유일한 값 원천이 되며, 컴포넌트 내부 값으로 복제해 동기화하지 않습니다.

`value`, `isSelected` 같은 controlled 값은 외부 값을 우선하고, `defaultValue`, `defaultSelected`는 내부 상태의 초기값으로만 사용합니다. `undefined`만 fallback 대상이며 `false`, `0`, 빈 문자열과 `null`은 입력 계약의 값으로 보존됩니다. `createTextFieldState` 같은 factory와 반환 state type은 각 입력 폴더에서 공개합니다.

## Notes

- The package name is already `@cocrepo/ui`.
- Application state management lives in `@cocrepo/store`.
- New code should prefer semantic rhythm presets such as `gap="page"`, `gap="section"`, `gap="inline"`, `size="inline"` over raw numeric spacing.
