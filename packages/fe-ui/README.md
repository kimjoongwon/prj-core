# @cocrepo/ui

Shared UI library for the Cocrepo monorepo.

## Overview

`@cocrepo/ui` exposes reusable UI building blocks and screen-level visual owners used by the web apps in this repository.

Entry points are organized under `src/`:

- `control`: inputs and action controls
- `display`: feedback, tables, data display
- `feature`: feature-level composites
- `form`: form flows and form sections
- `layout`: structural primitives such as `App`, `Page`, `Section`, `Container`
- `collection`: list/table oriented page building blocks
- `screen`: semantic app-facing pure screen UI components
- `rhythm`: spacing and flow primitives such as `VStack`, `HStack`, `Spacer`
- `surface`: surface and elevation primitives
- `widget`: reusable domain widgets

Domain sub-groups under `feature` and `widget` are allowed when they improve discoverability, for example `src/feature/idp/*` or `src/widget/ability/*`.

`src/screen` uses folder-based sidecars. Keep each screen in `src/screen/[ScreenName]/`.
Prefer semantic screen names such as `AssetListPage`, `RoleDetailPage`, `SecurityPolicyFormPage`.
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

- Layout: `App`, `Page`, `Section`, `Container`, `Modal`
- Rhythm: `VStack`, `HStack`, `Spacer`
- Control: `Button`, `Input`, `Select`, `Tabs`, `Textarea`, `Pagination`
- Display: `DataGrid`, `NotFound`, `EmptyState`, `Message`, `Skeleton`
- Form: `LoginForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `OidcClientForm`
- Page: app-facing page UI such as `AssetListPage`, `AssetDetailPage`, `AccountListPage`

## Storybook

```bash
pnpm --filter tool-storybook start:dev
```

## Notes

- The package name is already `@cocrepo/ui`.
- Application state management lives in `@cocrepo/store`.
- New code should prefer semantic rhythm presets such as `gap="page"`, `gap="section"`, `gap="inline"`, `size="inline"` over raw numeric spacing.
