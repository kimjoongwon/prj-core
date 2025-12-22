# Layout Components

<cite>
**Referenced Files in This Document**   
- [DashboardLayout.tsx](file://packages/ui/src/components/layout/Dashboard/DashboardLayout.tsx)
- [DashboardLayout.stories.tsx](file://packages/ui/src/components/layout/Dashboard/README.md)
- [AuthLayout.tsx](file://packages/ui/src/components/layout/Auth/AuthLayout.tsx)
- [AuthLayout.stories.tsx](file://packages/ui/src/components/layout/Auth/AuthLayout.stories.tsx)
- [CollapsibleSidebarLayout.tsx](file://packages/ui/src/components/layout/CollapsibleSidebar/CollapsibleSidebarLayout.tsx)
- [CollapsibleSidebarLayout.stories.tsx](file://packages/ui/src/components/layout/CollapsibleSidebar/CollapsibleSidebarLayout.stories.tsx)
- [Header.tsx](file://packages/ui/src/components/layout/Header/Header.tsx)
- [Main.tsx](file://packages/ui/src/components/layout/Main/Main.tsx)
- [index.ts](file://packages/ui/src/components/layout/index.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Layout Components](#core-layout-components)
3. [Dashboard Layout](#dashboard-layout)
4. [Auth Layout](#auth-layout)
5. [Collapsible Sidebar](#collapsible-sidebar)
6. [Header Component](#header-component)
7. [Main Layout](#main-layout)
8. [Component Composition and Usage](#component-composition-and-usage)
9. [Responsive Design Implementation](#responsive-design-implementation)
10. [Accessibility Features](#accessibility-features)
11. [Integration with AppProviders](#integration-with-appproviders)
12. [Usage in Admin and Mobile Applications](#usage-in-admin-and-mobile-applications)
13. [Common Issues and Solutions](#common-issues-and-solutions)

## Introduction
The shared-frontend library provides a comprehensive set of layout components designed to create consistent user interfaces across different applications. These components include Dashboard, Auth, CollapsibleSidebar, Header, and Main layouts, each serving specific UI patterns and use cases. The layout system is built with responsiveness, accessibility, and state management in mind, enabling developers to create applications that work seamlessly across desktop and mobile devices. This documentation details the implementation, composition patterns, and usage scenarios for these layout components.

## Core Layout Components
The shared-frontend library offers five primary layout components that form the foundation of application interfaces. These components are designed to be composable, allowing developers to create complex UI structures by combining simpler building blocks. The core layout components include DashboardLayout for complex dashboard interfaces, AuthLayout for authentication screens, CollapsibleSidebar for navigation menus, Header for top navigation bars, and MainLayout for general content areas. Each component is implemented as a React functional component with TypeScript interfaces for type safety.

**Section sources**
- [index.ts](file://packages/ui/src/components/layout/index.ts)

## Dashboard Layout
The DashboardLayout component provides a responsive three-column layout structure optimized for dashboard interfaces. It adapts its layout based on screen size, offering a full three-column layout on desktop devices (≥1280px) and a simplified single-column layout on mobile devices (<1280px). The component supports multiple optional sections including header, left sidebar, right sidebar, breadcrumb navigation, and a mobile-only bottom component. When components are not provided, the layout renders placeholder content to aid development and visualization.

### Layout Structure
The DashboardLayout implements a responsive design that changes based on viewport width:

#### Desktop Layout (≥1280px)
```
┌─────────────────────────────────────┐
│              Header                 │
├─────────┬─────────────────┬─────────┤
│   Left  │                 │  Right  │
│ Sidebar │   Main Content  │ Sidebar │
│ (256px) │                 │ (256px) │
└─────────┴─────────────────┴─────────┘
```

#### Mobile Layout (<1280px)
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

### Props Interface
The DashboardLayout accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | The main content to display in the center area |
| `header` | `ReactNode` | No | Optional header component |
| `leftSidebar` | `ReactNode` | No | Optional left sidebar component |
| `rightSidebar` | `ReactNode` | No | Optional right sidebar component |
| `bottom` | `ReactNode` | No | Optional bottom component (mobile only) |
| `breadcrumb` | `ReactNode` | No | Optional breadcrumb navigation component |

### Responsive Behavior
The DashboardLayout uses Tailwind CSS classes to implement responsive behavior. On desktop devices (≥1280px), it displays a full three-column layout with fixed-width sidebars. On mobile devices (<1280px), it collapses to a single-column layout with the main content taking full width. The right sidebar is hidden on mobile, and an optional bottom component can be displayed for mobile navigation. The component uses the `xl:` breakpoint prefix to control visibility of certain elements.

### Header Component Children Prop
When providing a custom header component, it's important to render the `children` prop. On mobile devices, the DashboardLayout passes a hamburger menu button as children to the header component. This allows the mobile navigation drawer to be triggered from within the header.

```tsx
// Correct implementation - renders children for mobile hamburger menu
const MyHeader = ({ children }) => (
  <div className="header-container">
    <h1>My App</h1>
    {children} {/* Hamburger menu will appear here on mobile */}
  </div>
);
```

**Section sources**
- [DashboardLayout.tsx](file://packages/ui/src/components/layout/Dashboard/DashboardLayout.tsx)
- [DashboardLayout.stories.tsx](file://packages/ui/src/components/layout/Dashboard/README.md)

## Auth Layout
The AuthLayout component is designed specifically for authentication screens such as login, registration, and password recovery. It implements a responsive two-column layout on desktop devices and a single-column layout on mobile devices. The component supports both a form component for authentication fields and an advertisement component for marketing content or branding.

### Layout Structure
The AuthLayout adapts its layout based on screen size:

#### Desktop Layout (≥768px)
```
┌─────────────────────────────────────┐
│                                     │
│         Authentication Form         │
│           (Left Column)             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│        Advertisement/Image          │
│           (Right Column)            │
│                                     │
└─────────────────────────────────────┘
```

#### Mobile Layout (<768px)
```
┌─────────────────────────────────────┐
│                                     │
│         Authentication Form         │
│           (Full Width)              │
│                                     │
└─────────────────────────────────────┘
```

### Props Interface
The AuthLayout accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `formComponent` | `ReactNode` | No | The authentication form content |
| `adComponent` | `ReactNode` | No | Custom advertisement component |
| `adImageSrc` | `string` | No | Source URL for advertisement image |
| `adImageAlt` | `string` | No | Alternative text for advertisement image |

### Implementation Details
The AuthLayout implements a flexible content system where the advertisement component can be provided directly or generated from an image source. If an `adImageSrc` is provided but no `adComponent`, the layout automatically creates a default image component with proper styling. This allows for simple image-based advertisements without requiring additional component creation.

The layout uses a flexbox-based structure with conditional rendering based on screen size. On mobile devices, only the form component is displayed in a full-width column. On desktop devices, the layout switches to a two-column arrangement with the form on the left and advertisement on the right.

**Section sources**
- [AuthLayout.tsx](file://packages/ui/src/components/layout/Auth/AuthLayout.tsx)
- [AuthLayout.stories.tsx](file://packages/ui/src/components/layout/Auth/AuthLayout.stories.tsx)

## Collapsible Sidebar
The CollapsibleSidebar component provides a navigation sidebar that can be collapsed and expanded. It's designed to save horizontal space while maintaining access to navigation options. The component displays parent menu information and supports custom content for menu items.

### Props Interface
The CollapsibleSidebar accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to display in the sidebar |
| `parentMenuInfo` | `ParentMenuInfo` | No | Information about the parent menu |
| `isCollapsed` | `boolean` | Yes | Current collapsed state |
| `onToggle` | `() => void` | Yes | Callback function for toggle events |

The `ParentMenuInfo` interface includes:
- `name`: Display name of the parent menu
- `pathname`: Route path for the parent menu
- `icon`: Optional icon name for the parent menu

### Visual States
The CollapsibleSidebar has two primary visual states:

#### Expanded State
- Width: 288px (w-72)
- Displays full parent menu information including icon, name, and toggle button
- Shows complete content for menu items

#### Collapsed State
- Width: 80px (w-20)
- Displays only icons and compact representations
- Parent menu shows only the icon and toggle button
- Menu items are represented by icon-only buttons

### Animation and Transitions
The component uses CSS transitions to provide smooth animation when collapsing and expanding. The transition affects the width property with a duration of 300ms. This provides a responsive user experience when toggling the sidebar state.

**Section sources**
- [CollapsibleSidebarLayout.tsx](file://packages/ui/src/components/layout/CollapsibleSidebar/CollapsibleSidebarLayout.tsx)
- [CollapsibleSidebarLayout.stories.tsx](file://packages/ui/src/components/layout/CollapsibleSidebar/CollapsibleSidebarLayout.stories.tsx)

## Header Component
The Header component provides a flexible top navigation bar that can be customized with content in three distinct regions: left, center, and right. It's designed to be used as the primary navigation element in applications.

### Props Interface
The Header component accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `left` | `ReactNode` | No | Content to display on the left side |
| `center` | `ReactNode` | No | Content to display in the center |
| `right` | `ReactNode` | No | Content to display on the right side |

### Layout Structure
The Header implements a three-section layout using flexbox:

```
┌─────────────────────────────────────────────────┐
│  Left Content    Center Content    Right Content  │
└─────────────────────────────────────────────────┘
```

Each section takes up one-third of the available width, allowing for balanced distribution of navigation elements. The component uses the Navbar component from @heroui/react with custom styling for borders, background, and backdrop blur effects.

### Styling and Appearance
The Header has the following visual characteristics:
- Height: 4rem
- Background: Semi-transparent with backdrop blur effect
- Bottom border with divider color
- Sticky positioning to remain visible during scrolling

**Section sources**
- [Header.tsx](file://packages/ui/src/components/layout/Header/Header.tsx)

## Main Layout
The MainLayout component provides a simple container for general content areas. It's designed to be a lightweight wrapper that applies consistent styling to content sections.

### Props Interface
The MainLayout accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to display within the layout |

### Implementation
The MainLayout is a minimal component that wraps its children in a VStack (vertical stack) with the following styling:
- Margin: 1rem (m-4)
- Width: Full width
- Border: 1px border with default styling
- Rounded corners: Default border radius

This creates a clean, card-like container for content that maintains consistent spacing and appearance throughout the application.

**Section sources**
- [Main.tsx](file://packages/ui/src/components/layout/Main/Main.tsx)

## Component Composition and Usage
The layout components are designed to be composed together to create complex application interfaces. Developers can combine these components in various ways to achieve different UI patterns.

### Typical Composition Patterns
#### Dashboard Interface
A typical dashboard interface combines multiple layout components:

```tsx
<DashboardLayout
  header={<Header />}
  leftSidebar={<CollapsibleSidebar />}
  rightSidebar={<RightSidebarContent />}
  bottom={<MobileNavigation />}
>
  <MainLayout>
    {/* Page content */}
  </MainLayout>
</DashboardLayout>
```

#### Authentication Flow
Authentication screens typically use the AuthLayout as the primary container:

```tsx
<AuthLayout
  formComponent={<LoginForm />}
  adImageSrc="/images/login-background.jpg"
  adImageAlt="Company branding"
/>
```

### Customization Options
Each layout component provides various customization options through props and CSS classes. Developers can override default styling by passing custom className props or by wrapping components in additional div elements with custom styles.

## Responsive Design Implementation
The layout components implement responsive design using Tailwind CSS utility classes and media queries. The responsive behavior is primarily controlled through the following mechanisms:

### Breakpoint System
The components use Tailwind's responsive prefixes to control layout at different screen sizes:
- `md:` prefix for medium screens (≥768px)
- `xl:` prefix for extra large screens (≥1280px)

### Mobile-First Approach
The layout components follow a mobile-first design philosophy, with base styles optimized for mobile devices and desktop-specific enhancements added through media queries. This ensures optimal performance and usability on smaller screens.

### Conditional Rendering
Components use conditional rendering based on screen size to show or hide specific elements. For example, the DashboardLayout hides the right sidebar on mobile devices and shows a bottom navigation component only on smaller screens.

## Accessibility Features
The layout components include several accessibility features to ensure usability for all users:

### Semantic HTML
The components use appropriate HTML elements and ARIA attributes to provide semantic meaning. For example, the Header component uses Navbar elements with proper role attributes.

### Keyboard Navigation
Interactive elements are designed to be keyboard accessible, with proper focus management and keyboard event handling.

### Screen Reader Support
The components include appropriate labels, alt text for images, and ARIA attributes to support screen readers.

### Color Contrast
The default styling ensures sufficient color contrast between text and background elements to meet accessibility standards.

## Integration with AppProviders
The layout components are designed to work seamlessly with the global AppProviders for state management. They integrate with the following provider systems:

### State Management
The components can access application state through MobX stores such as navigationStore and routeStore. This allows them to respond to changes in application state, such as sidebar collapse state or user authentication status.

### Theme Context
The components respect the application's theme context, adapting their appearance based on light or dark mode settings.

### Internationalization
The components support internationalization through the use of translation functions and locale-aware formatting.

## Usage in Admin and Mobile Applications
The layout components are used in both admin and mobile applications, with slight variations in implementation based on the specific requirements of each platform.

### Admin Application Usage
In the admin application, the DashboardLayout is used as the primary container for administrative interfaces. The layout typically includes:
- Header with user profile and notifications
- Left sidebar with main navigation
- Right sidebar with contextual tools and information
- Main content area for administrative functions

### Mobile Application Usage
In mobile applications, the layout components are adapted for smaller screens:
- The DashboardLayout uses the mobile layout with bottom navigation
- The Header component is simplified to conserve vertical space
- The CollapsibleSidebar is typically hidden by default and accessed via a hamburger menu

## Common Issues and Solutions
### Sidebar State Persistence
To maintain sidebar collapse state across page reloads, applications should store the state in localStorage or a similar persistent storage mechanism. The component's `isCollapsed` prop should be controlled by state that persists between sessions.

### Responsive Breakpoints
When customizing responsive behavior, developers should ensure that breakpoints are consistent across all components. The standard breakpoints (md: 768px, xl: 1280px) should be used throughout the application to maintain a consistent user experience.

### Performance Optimization
For complex layouts with multiple nested components, performance can be optimized by:
- Using React.memo for components that don't frequently update
- Implementing virtualization for long lists in sidebars
- Debouncing resize events that trigger layout calculations
- Minimizing re-renders through proper state management