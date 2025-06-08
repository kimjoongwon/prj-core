# DashboardLayout Component

A dashboard layout component with responsive behavior for different screen sizes.

## Features

- **Responsive Layout**: Adapts to different screen sizes
- **Desktop Layout**: Full 3-column layout with header, left sidebar, main content, and right sidebar (≥1280px)
- **Tablet/Mobile Layout**: Header and main content only, sidebars are hidden (<1280px, including iPad Mini)
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
└─────────────────────────────────────┘
```

## Props

### DashboardLayoutProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | The main content to display in the center area |
| `headerComponent` | `ComponentType<{ children?: ReactNode }>` | No | Optional header component. Receives children prop for hamburger menu on mobile |
| `leftSidebarComponent` | `ComponentType` | No | Optional left sidebar component |
| `rightSidebarComponent` | `ComponentType` | No | Optional right sidebar component |

## Usage Examples

### Full Dashboard Layout

```tsx
import React from 'react';
import { DashboardLayout } from '@shared/frontend';

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
        <li><a href="#" className="block p-2 rounded hover:bg-gray-200">Dashboard</a></li>
        <li><a href="#" className="block p-2 rounded hover:bg-gray-200">Users</a></li>
        <li><a href="#" className="block p-2 rounded hover:bg-gray-200">Settings</a></li>
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

function MyDashboard() {
  return (
    <DashboardLayout
      headerComponent={MyHeader}
      leftSidebarComponent={MyLeftSidebar}
      rightSidebarComponent={MyRightSidebar}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
        <p>Your main content goes here...</p>
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

- **Desktop (≥768px)**: 3-column layout with fixed sidebars
- **Mobile (<768px)**: Single column layout with drawer for sidebars
- The component uses Tailwind CSS classes for responsive design
- MobX is used for state management of the mobile drawer

### Placeholder Components

When no custom components are provided, the layout renders placeholder text components:
- "HeaderComponent" for missing header
- "LeftSidebarComponent" for missing left sidebar  
- "RightSidebarComponent" for missing right sidebar

This makes it easy to see the layout structure during development.

## Integration with LayoutBuilder

The DashboardLayout is integrated with the LayoutBuilder component and can be used with the layout type `'Dashboard'`:

```tsx
import { LayoutBuilder } from '@shared/frontend';

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
