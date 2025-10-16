# DashboardLayout Component

A dashboard layout component with responsive behavior for different screen sizes.

## Features

- **Responsive Layout**: Adapts to different screen sizes
- **Desktop Layout**: Full 3-column layout with header, left sidebar, main content, and right sidebar (≥1280px)
- **Tablet/Mobile Layout**: Header, main content, and bottom component (<1280px, including iPad Mini)
- **Bottom Component**: Mobile-only bottom navigation/toolbar (hidden on desktop)
- **Pure Component**: Renders provided components as-is without modification
- **Fallback Components**: Renders placeholder text when no components are provided
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Layout Structure

### Desktop (≥1280px)

```
┌─────────────────────────────────────┐
│              Header                 │
├─────────┬─────────────────┬─────────┤
│   Left  │                 │  Right  │
│ Sidebar │   Main Content  │ Sidebar │
│ (256px) │                 │ (256px) │
└─────────┴─────────────────┴─────────┘
```

### Tablet/Mobile (<1280px, including iPad Mini)

```
┌─────────────────────────────────────┐
│              Header                 │
├─────────────────────────────────────┤
│                                     │
│           Main Content              │
│         (Full Width)                │
│                                     │
├─────────────────────────────────────┤
│          Bottom Component           │
│        (Mobile Only)                │
└─────────────────────────────────────┘
```

## Props

### DashboardLayoutProps

| Prop           | Type                                      | Required | Description                                                                    |
| -------------- | ----------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `children`     | `ReactNode`                               | Yes      | The main content to display in the center area                                 |
| `header`       | `ComponentType<{ children?: ReactNode }>` | No       | Optional header component. Receives children prop for hamburger menu on mobile |
| `leftSidebar`  | `ComponentType`                           | No       | Optional left sidebar component                                                |
| `rightSidebar` | `ComponentType`                           | No       | Optional right sidebar component                                               |
| `bottom`       | `ReactNode`                               | No       | Optional bottom component (mobile only - hidden on desktop ≥1280px)            |
| `breadcrumb`   | `ReactNode`                               | No       | Optional breadcrumb navigation component displayed above main content          |

## Usage Examples

### Full Dashboard Layout

```tsx
import React from "react";
import { DashboardLayout } from "@cocrepo/frontend";

const MyHeader = ({ children }) => (
  <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
    <h1 className="text-xl font-bold">My Dashboard</h1>
    {children} {/* Important: Render children for hamburger menu */}
  </div>
);

const MyLeftSidebar = () => (
  <div className="bg-gray-100 p-4">
    <nav>
      <ul className="space-y-2">
        <li>
          <a href="#" className="block p-2 rounded hover:bg-gray-200">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 rounded hover:bg-gray-200">
            Users
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 rounded hover:bg-gray-200">
            Settings
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

const MyRightSidebar = () => (
  <div className="bg-gray-50 p-4">
    <h3 className="font-semibold mb-3">Quick Stats</h3>
    <div className="space-y-2">
      <div className="p-2 bg-white rounded shadow-sm">
        <div className="text-sm text-gray-600">Active Users</div>
        <div className="text-lg font-bold">1,234</div>
      </div>
    </div>
  </div>
);

const MyBottomComponent = () => (
  <div className="bg-white p-2">
    <nav className="flex justify-around items-center">
      <button className="flex flex-col items-center p-2 text-xs">
        <span className="mb-1">🏠</span>
        <span>Home</span>
      </button>
      <button className="flex flex-col items-center p-2 text-xs">
        <span className="mb-1">👥</span>
        <span>Users</span>
      </button>
      <button className="flex flex-col items-center p-2 text-xs">
        <span className="mb-1">⚙️</span>
        <span>Settings</span>
      </button>
    </nav>
  </div>
);

function MyDashboard() {
  const MyBreadcrumb = () => (
    <Breadcrumb
      showHomeIcon={true}
      homeRouteName="대시보드"
      maxItems={4}
      className="text-sm sm:text-base"
    />
  );

  return (
    <DashboardLayout
      header={MyHeader}
      leftSidebar={MyLeftSidebar}
      rightSidebar={MyRightSidebar}
      bottom={MyBottomComponent}
      breadcrumb={<MyBreadcrumb />}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
        <p>Your main content goes here...</p>
      </div>
    </DashboardLayout>
  );
}
```

### Mobile-Focused Layout (with Bottom Navigation)

```tsx
function MobileLayout() {
  const MyMobileHeader = ({ children }) => (
    <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <h1 className="text-lg font-bold">Mobile App</h1>
      {children}
    </div>
  );

  const MyBottomNav = () => (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <nav className="flex justify-around items-center">
        <button className="flex flex-col items-center p-2 text-xs text-blue-600">
          <span className="text-lg mb-1">🏠</span>
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center p-2 text-xs text-gray-500">
          <span className="text-lg mb-1">🔍</span>
          <span>Search</span>
        </button>
        <button className="flex flex-col items-center p-2 text-xs text-gray-500">
          <span className="text-lg mb-1">❤️</span>
          <span>Favorites</span>
        </button>
        <button className="flex flex-col items-center p-2 text-xs text-gray-500">
          <span className="text-lg mb-1">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );

  return (
    <DashboardLayout header={MyMobileHeader} bottom={MyBottomNav}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Mobile Layout</h2>
        <p>This layout is optimized for mobile with bottom navigation.</p>
        <p className="text-sm text-gray-600 mt-4">
          Note: Bottom navigation is only visible on mobile devices
          (&lt;1280px).
        </p>
      </div>
    </DashboardLayout>
  );
}
```

### Layout with Breadcrumb Navigation

```tsx
import {
  DashboardLayout,
  Breadcrumb,
  BreadcrumbBuilder,
} from "@cocrepo/frontend";

function DashboardWithBreadcrumb() {
  // Using Breadcrumb component
  const MyBreadcrumb = () => (
    <Breadcrumb
      showHomeIcon={true}
      homeRouteName="대시보드"
      maxItems={4}
      className="text-sm sm:text-base"
    />
  );

  // Or using BreadcrumbBuilder for automatic route-based breadcrumbs
  const MyBreadcrumbBuilder = () => (
    <BreadcrumbBuilder
      routeNames={["대시보드", "사용자 관리", "사용자 목록"]}
      className="text-sm sm:text-base"
    />
  );

  return (
    <DashboardLayout
      header={<MyHeader />}
      leftSidebar={<MySidebar />}
      breadcrumb={<MyBreadcrumb />}
      // breadcrumb={<MyBreadcrumbBuilder />} // Alternative approach
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Content</h1>
        <p>The breadcrumb navigation will appear above this content.</p>
      </div>
    </DashboardLayout>
  );
}
```

### Simple Layout (Header Only)

```tsx
function SimpleLayout() {
  return (
    <DashboardLayout headerComponent={MyHeader}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Simple Layout</h2>
        <p>This layout only has a header component.</p>
      </div>
    </DashboardLayout>
  );
}
```

### Minimal Layout (No Custom Components)

```tsx
function MinimalLayout() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Minimal Layout</h2>
        <p>This layout uses default placeholder components.</p>
      </div>
    </DashboardLayout>
  );
}
```

## Important Notes

### Header Component Children Prop

When providing a custom header component, make sure to render the `children` prop. On mobile devices, the DashboardLayout will pass a hamburger menu button as children to your header component.

```tsx
// ✅ Correct - renders children for mobile hamburger menu
const MyHeader = ({ children }) => (
  <div className="header-container">
    <h1>My App</h1>
    {children} {/* Hamburger menu will appear here on mobile */}
  </div>
);

// ❌ Incorrect - hamburger menu won't appear on mobile
const MyHeader = () => (
  <div className="header-container">
    <h1>My App</h1>
  </div>
);
```

### Responsive Behavior

- **Desktop (≥1280px)**: 3-column layout with fixed sidebars
- **Mobile (<1280px)**: Single column layout with optional bottom component
- The component uses Tailwind CSS classes for responsive design
- MobX is used for state management of the mobile drawer

### Bottom Component

The `bottomComponent` is designed specifically for mobile interfaces:

- **Visibility**: Only visible on mobile devices (below xl breakpoint, <1280px)
- **Position**: Fixed at the bottom of the screen
- **Common Use Cases**: Mobile navigation tabs, action buttons, floating toolbars
- **Styling**: Automatically styled with border-top and proper spacing

### Placeholder Components

When no custom components are provided, the layout renders placeholder text components:

- "HeaderComponent" for missing header
- "LeftSidebarComponent" for missing left sidebar
- "RightSidebarComponent" for missing right sidebar

Note: No placeholder is shown for `bottomComponent` - it only appears when explicitly provided.

This makes it easy to see the layout structure during development.

## Integration with LayoutBuilder

The DashboardLayout is integrated with the LayoutBuilder component and can be used with the layout type `'Dashboard'`:

```tsx
import { LayoutBuilder } from "@cocrepo/frontend";

function App() {
  return (
    <LayoutBuilder
      type="Dashboard"
      headerComponent={MyHeader}
      leftSidebarComponent={MyLeftSidebar}
      rightSidebarComponent={MyRightSidebar}
    >
      <div>Main content</div>
    </LayoutBuilder>
  );
}
```

## Dependencies

- React 18+
- @heroui/react (for Drawer component)
- MobX and mobx-react-lite (for state management)
- Tailwind CSS (for styling)

## Testing

The component includes comprehensive Storybook stories for testing different configurations:

- Full layout with all components
- Partial layouts with some components
- Minimal layout with no custom components
- Custom content examples

Run Storybook to see interactive examples:

```bash
pnpm run start:dev
```

Then navigate to the "Layouts/DashboardLayout" section in Storybook.
