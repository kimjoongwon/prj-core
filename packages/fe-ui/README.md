# @cocrepo/ui

Shared UI library for the Cocrepo monorepo.

## Overview

`@cocrepo/ui` exposes reusable UI building blocks and page-level components used by the web apps in this repository.

Entry points are organized under `src/`:

- `control`: inputs and action controls
- `display`: feedback, tables, data display
- `feature`: feature-level composites
- `form`: form flows and form sections
- `layout`: layout primitives such as `Page`, `Section`, `VStack`, `HStack`
- `master`: list/table oriented page building blocks
- `page`: route-level page UI components
- `surface`: surface and elevation primitives
- `widget`: reusable domain widgets

Domain sub-groups under `feature` and `widget` are allowed when they improve discoverability, for example `src/feature/idp/*` or `src/widget/ability/*`.

`src/page` uses folder-based sidecars. Keep each page in `src/page/[PageName]/`.

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
      <VStack spacing={4}>
        <Button>Confirm</Button>
        <NotFound title="Nothing here" description="Try a different route." />
      </VStack>
    </Section>
  );
}
```

## Common Exports

- Layout: `Page`, `Section`, `VStack`, `HStack`, `Spacer`
- Control: `Button`, `Input`, `Select`, `Tabs`, `Textarea`, `Pagination`
- Display: `DataGrid`, `NotFound`, `EmptyState`, `Message`, `Skeleton`
- Form: `LoginForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `OidcClientForm`
- Page: app-facing page UI such as `AdminAssetsPage`, `AdminAssetsAssetIdPage`, `IdpConsoleAccountsPage`

## Storybook

```bash
pnpm --filter tool-storybook start:dev
```

## Notes

- The package name is already `@cocrepo/ui`.
- Application state management lives in `@cocrepo/store`.
