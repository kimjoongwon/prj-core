# Frontend Components Package

<cite>
**Referenced Files in This Document**   
- [packages/ui/README.md](file://packages/ui/README.md)
- [apps/storybook/tailwind.css](file://apps/storybook/tailwind.css)
- [apps/storybook/vitest.config.js](file://apps/storybook/vitest.config.js)
- [apps/admin/tsconfig.app.json](file://apps/admin/tsconfig.app.json)
- [packages/ui/src/components/index.ts](file://packages/ui/src/components/index.ts)
- [packages/ui/src/utils/index.ts](file://packages/ui/src/utils/index.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Component Categories](#component-categories)
4. [Provider System](#provider-system)
5. [Consuming Components](#consuming-components)
6. [Component Development](#component-development)
7. [Theming and Responsive Design](#theming-and-responsive-design)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Performance Considerations](#performance-considerations)

## Introduction

The shared frontend component library, currently published as `@cocrepo/frontend` and soon to be renamed to `@cocrepo/ui`, serves as the central UI component repository for the prj-core monorepo. This package provides a comprehensive collection of reusable React components used across both admin and mobile applications, ensuring design consistency and reducing code duplication. Built with HeroUI and Tailwind CSS, the components follow accessibility standards and are optimized for both mobile and desktop experiences.

The library follows modern design patterns with a focus on accessibility, responsiveness, and composability. It includes a wide range of components from basic UI elements to complex data display components, all designed to work seamlessly together while maintaining flexibility for customization.

**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)

## Architecture Overview

The shared-frontend package follows a modular architecture with components organized into logical categories. The library is designed to be tree-shakeable, allowing applications to import only the components they need, which optimizes bundle size and performance.

The component structure is organized into several main directories:
- `components/cell` - Data cell components for tables and grids
- `components/form` - Form components and templates
- `components/inputs` - Various input components with validation
- `components/layout` - Layout and structural components
- `components/page` - Pre-built page templates
- `components/ui` - Basic UI building blocks

The library leverages Tailwind CSS for styling, with global styles imported through the package. Components are fully typed with TypeScript, providing excellent developer experience with type safety and IntelliSense support.

```mermaid
graph TB
subgraph "Component Categories"
A[Layout Components]
B[Form & Input]
C[Data Display]
D[Media Components]
E[Navigation]
F[Page Templates]
end
subgraph "Infrastructure"
G[Storybook]
H[Vitest]
I[Tailwind CSS]
J[TypeScript]
end
A --> Library
B --> Library
C --> Library
D --> Library
E --> Library
F --> Library
G --> Library
H --> Library
I --> Library
J --> Library
Library["@cocrepo/frontend"]
**Diagram sources**
- [packages/ui/README.md](file://packages/ui/README.md)
- [apps/storybook/tailwind.css](file://apps/storybook/tailwind.css)
**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)
- [apps/storybook/tailwind.css](file://apps/storybook/tailwind.css)
## Component Categories
The component library is organized into several categories, each serving a specific purpose in the UI development process.
### Layout Components
Layout components provide structural organization for applications. These include:
- `VStack` and `HStack` - Flex layout utilities for vertical and horizontal stacking
- `Section` - Page sections with consistent spacing and styling
- `Container` - Content containers with responsive behavior
- `Spacer` - Flexible spacing component
### Form & Input Components
Form components offer a comprehensive solution for data input and validation:
- `TextInput`, `Textarea` - Text input fields with validation
- `SelectInput`, `Dropdown` - Selection components
- `Checkbox`, `RadioGroup` - Option selection
- `DatePicker`, `DateRangePicker` - Date input components
- `FileUploader`, `VideoUploader` - Media upload components
- `Form` - Form wrapper with submission handling and validation
### Data Display Components
Data display components handle the presentation of information:
- `DataGrid` - Advanced data table with sorting, filtering, and pagination
- `Chip` - Tag/badge component for categorization
- `Message` - Alert and notification messages
- `Skeleton` - Loading placeholders
- Various cell components (`BooleanCell`, `DateCell`, `NumberCell`) for table cells
### Media Components
Media components handle rich media content:
- `VideoPlayer` - HTML5 video player with controls
- `SortableMedia` - Drag-and-drop media gallery
- `Avatar` - User avatar component
### Navigation Components
Navigation components facilitate user movement through the application:
- `Button`, `ButtonGroup` - Action buttons
- `Navbar` - Navigation bar component
- `Tabs` - Tabbed navigation
- `LinkCell` - Link components for tables
### Page Templates
Pre-built page templates for common scenarios:
- Authentication pages (Login, TenantSelect)
- Admin dashboard layouts
- Error pages (NotFound)
**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)
- [packages/ui/src/components/index.ts](file://packages/ui/src/components/index.ts)
## Provider System
The component library includes a provider system that wraps applications with necessary context providers. This system ensures that components have access to shared state and functionality.
### UIProviders
The `UIProviders` component wraps the application and provides access to UI-related functionality:
```tsx
import { UIProviders } from '@cocrepo/frontend';

function App() {
  return (
    <UIProviders>
      <YourApp />
    </UIProviders>
  );
}
```

### QueryProvider
For data fetching and state management, the library integrates with React Query through the `QueryProvider`:
```tsx
import { QueryProvider } from '@cocrepo/frontend';

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

These providers ensure that components have access to consistent theming, data fetching capabilities, and other shared functionality across the application.

**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)

## Consuming Components

### Installation
The component library can be installed via pnpm:
```bash
pnpm add @cocrepo/frontend
# or after migration
pnpm add @cocrepo/ui
```

### Basic Usage
Components can be imported and used directly in React applications:
```tsx
import { Button, Text, VStack } from '@cocrepo/frontend';

function MyComponent() {
  return (
    <VStack spacing={4}>
      <Text variant="h1">Welcome</Text>
      <Button onPress={() => console.log('clicked')}>
        Click me
      </Button>
    </VStack>
  );
}
```

### Form Usage
Form components provide integrated validation and submission handling:
```tsx
import { Form, TextInput, SelectInput } from '@cocrepo/frontend';

function MyForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        name="username"
        label="Username"
        placeholder="Enter username"
      />
      <SelectInput
        name="role"
        label="Role"
        options={roleOptions}
      />
    </Form>
  );
}
```

### Data Display
DataGrid component for displaying tabular data:
```tsx
import { DataGrid } from '@cocrepo/frontend';

function UserTable() {
  return (
    <DataGrid
      columns={columns}
      data={users}
      onRowClick={handleRowClick}
    />
  );
}
```

**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)

## Component Development

### Storybook Integration
The component library uses Storybook for component development and documentation. Storybook can be started with:
```bash
pnpm --filter storybook start:dev
```

Each component includes stories that demonstrate its usage and variations. Stories are written in `.stories.tsx` files alongside the component implementation.

### Testing with Vitest
Components are tested using Vitest, with tests located in `.test.tsx` files. The test configuration is set up in the storybook package's vitest.config.js, which includes the shared-frontend source directory for testing.

Tests cover component rendering, user interactions, and edge cases to ensure reliability and accessibility.

### Global Styles
Global styles are imported from the package:
```tsx
import '@cocrepo/frontend/styles';
```

These styles include Tailwind CSS configurations and custom HeroUI styles that ensure consistent appearance across components.

**Section sources**
- [apps/storybook/vitest.config.js](file://apps/storybook/vitest.config.js)
- [apps/storybook/tailwind.css](file://apps/storybook/tailwind.css)
- [packages/ui/README.md](file://packages/ui/README.md)

## Theming and Responsive Design

### Theming Support
The component library supports theming through Tailwind CSS and CSS variables. Components can be customized using the `className` prop:
```tsx
<Button className="bg-primary-500 hover:bg-primary-600">
  Custom Styled Button
</Button>
```

### Responsive Design
Components follow a mobile-first approach with responsive design patterns:
```tsx
// Using responsive props
<VStack spacing={{ base: 2, md: 4, lg: 6 }}>
  <Text>Responsive spacing</Text>
</VStack>
```

The library includes breakpoints defined in the constants package, allowing for consistent responsive behavior across applications.

**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)
- [apps/admin/tsconfig.app.json](file://apps/admin/tsconfig.app.json)

## Troubleshooting Guide

### Styling Conflicts
If experiencing styling conflicts:
1. Ensure global styles are imported: `import '@cocrepo/frontend/styles';`
2. Check for conflicting Tailwind CSS configurations
3. Use specific className overrides for component styling

### State Synchronization
For state synchronization issues:
1. Ensure providers are properly wrapped around the application
2. Verify React Query cache configuration
3. Check for stale data in the query cache

### Hydration Errors
To resolve hydration errors:
1. Ensure server and client environments have consistent component rendering
2. Use React's `useEffect` for client-only operations
3. Implement proper loading states with Skeleton components

**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)

## Performance Considerations

### Component Composition
When composing components:
1. Favor simple component combinations over complex single components
2. Use React.memo for components with expensive renders
3. Avoid unnecessary re-renders with proper prop management

### Tree Shaking
To optimize bundle size:
1. Import components directly: `import { Button } from '@cocrepo/frontend/components/ui/Button';`
2. Use build tool configuration to enable tree shaking
3. Avoid importing from the root index when possible

### Lazy Loading
For large components or pages:
1. Use React.lazy for code splitting
2. Implement Suspense for loading states
3. Consider dynamic imports for less frequently used components

The library is designed with performance in mind, featuring tree-shakeable exports, optimized bundle size, and minimal runtime overhead.

**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)