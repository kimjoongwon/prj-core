# @cocrepo/ui

UI component library for the Cocrepo monorepo.

> **Note**: This package will be renamed to `@cocrepo/ui` in the next major version.

## Overview

`@cocrepo/ui` provides a comprehensive collection of reusable React components built with HeroUI, Tailwind CSS, and modern design patterns. Components follow accessibility standards and are optimized for both mobile and desktop experiences.

## Features

- 🎨 **Modern UI Components** - Built with HeroUI and Tailwind CSS
- ♿ **Accessibility First** - WCAG compliant components
- 📱 **Responsive Design** - Mobile-first approach
- 🧩 **Composable** - Flexible component composition
- 🎭 **Form Management** - Integrated form components with validation
- 📊 **Data Display** - Advanced DataGrid, tables, and visualizations
- 🎬 **Media Components** - Video player, image handling, drag-and-drop

## Installation

```bash
pnpm add @cocrepo/frontend
# or after migration
pnpm add @cocrepo/ui
```

## Usage

### Basic Components

```tsx
import { Button, Text, VStack, HStack } from '@cocrepo/frontend';

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

### Form Components

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

### Layout Components

```tsx
import { Section, Navbar, NotFound } from '@cocrepo/frontend';

function Layout() {
  return (
    <>
      <Navbar title="My App" />
      <Section>
        <YourContent />
      </Section>
    </>
  );
}
```

## Component Categories

### Layout
- `VStack`, `HStack` - Flex layout utilities
- `Section` - Page sections with consistent spacing
- `Navbar` - Navigation bar component
- `Spacer` - Flexible spacing component

### Form & Input
- `TextInput` - Text input with validation
- `SelectInput` - Dropdown selection
- `DateInput` - Date picker
- `FileInput` - File upload with drag-and-drop
- `Form` - Form wrapper with submission handling

### Data Display
- `DataGrid` - Advanced data table with sorting, filtering
- `Chip` - Tag/badge component
- `Message` - Alert and notification messages
- `Skeleton` - Loading placeholders

### Media
- `VideoPlayer` - HTML5 video player with controls
- `SortableMedia` - Drag-and-drop media gallery

### Navigation
- `ButtonGroup` - Grouped action buttons
- `NotFound` - 404 page component

### Page Components
- Pre-built page templates for common scenarios
- Admin dashboard pages
- Authentication pages (Login, TenantSelect)

## Styling

Components use Tailwind CSS and support custom styling:

```tsx
<Button className="bg-primary-500 hover:bg-primary-600">
  Custom Styled Button
</Button>
```

### Global Styles

Import global styles in your app:

```tsx
import '@cocrepo/frontend/styles';
```

## Providers

### UIProviders

Wrap your app with UI providers:

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

React Query integration:

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

## TypeScript Support

All components are fully typed with TypeScript:

```tsx
import type { ButtonProps, TextProps } from '@cocrepo/frontend';

const CustomButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Testing

Components include test utilities:

```bash
pnpm test
pnpm test:watch
```

## Storybook

View component documentation and examples:

```bash
pnpm --filter storybook start:dev
```

## Accessibility

All components follow WCAG 2.1 AA standards:
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Focus management

## Performance

- Tree-shakeable exports
- Lazy loading support
- Optimized bundle size
- CSS-in-JS with minimal runtime

## Dependencies

- `@heroui/react` - Core UI framework
- `tailwindcss` - Utility-first CSS
- `framer-motion` - Animations
- `@tanstack/react-table` - Data table functionality
- `lucide-react` - Icon library

## Best Practices

1. **Import only what you need** - Tree-shaking optimizes bundle size
2. **Use semantic HTML** - Components render accessible markup
3. **Leverage composition** - Combine simple components for complex UIs
4. **Follow design system** - Use consistent spacing and colors

## Migration Guide

### Moving to @cocrepo/ui

In the next major version, this package will be renamed:

```tsx
// Current
import { Button } from '@cocrepo/frontend';

// Future (v2.0)
import { Button } from '@cocrepo/ui';
```

### Separating State Management

State management has been moved to `@cocrepo/store`:

```tsx
// Before
import { PlateStore, AppProviders } from '@cocrepo/frontend';

// After
import { PlateStore, AppProviders } from '@cocrepo/store';
import { Button, Text } from '@cocrepo/ui';
```

## Contributing

Contributions are welcome! Please follow the component development guidelines.

## License

ISC
