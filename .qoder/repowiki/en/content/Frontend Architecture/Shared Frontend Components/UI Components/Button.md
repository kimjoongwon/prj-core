# Button

<cite>
**Referenced Files in This Document**   
- [Button.tsx](file://packages/ui/src/components/ui/Button/Button.tsx)
- [Button.stories.tsx](file://packages/ui/src/components/ui/Button/Button.stories.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Props API](#props-api)
3. [Styling with Tailwind CSS](#styling-with-tailwind-css)
4. [Usage Patterns](#usage-patterns)
5. [Storybook Examples](#storybook-examples)
6. [Accessibility Attributes](#accessibility-attributes)
7. [Common Issues and Solutions](#common-issues-and-solutions)

## Introduction
The Button component in the shared-frontend library is a highly customizable UI element designed to provide consistent styling and behavior across applications. It wraps the `@heroui/react` Button component, exposing a comprehensive API for various use cases including primary, secondary, and destructive actions. The component supports multiple variants, sizes, loading states, and icon integration, making it suitable for diverse interface requirements.

**Section sources**
- [Button.tsx](file://packages/ui/src/components/ui/Button/Button.tsx#L1-L11)

## Props API
The Button component accepts a wide range of props to control its appearance and behavior:

- **variant**: Controls the visual style with options including "solid", "bordered", "light", "flat", "faded", "shadow", and "ghost"
- **color**: Determines the color theme with values like "primary", "secondary", "success", "warning", and "danger"
- **size**: Sets the button dimensions with "sm", "md", and "lg" options
- **radius**: Controls corner rounding with values from "none" to "full"
- **isDisabled**: Boolean flag to disable interaction
- **isLoading**: Indicates loading state, typically showing a spinner
- **fullWidth**: Makes the button span the entire container width
- **isIconOnly**: Renders the button with only an icon, no text
- **children**: The content displayed within the button
- **onPress**: Callback function triggered on button press

These props are inherited from the `@heroui/react` ButtonProps interface, providing a rich set of customization options while maintaining consistency with the underlying UI library.

**Section sources**
- [Button.stories.tsx](file://packages/ui/src/components/ui/Button/Button.stories.tsx#L16-L83)

## Styling with Tailwind CSS
The Button component leverages Tailwind CSS for styling, inheriting its configuration from the `@heroui/react` library. The component uses a utility-first approach where styles are composed from atomic classes. The styling system responds to the component's props, dynamically applying appropriate classes based on variant, color, size, and other properties. The integration with Tailwind CSS ensures consistent design language across the application while allowing for easy customization through the theme configuration.

The component's styling respects the global theme context, automatically adapting to dark mode when enabled. This is achieved through the `@heroui/use-theme` package which provides theme-aware styling that responds to user preferences and system settings.

**Section sources**
- [Button.tsx](file://packages/ui/src/components/ui/Button/Button.tsx#L1-L11)
- [Button.stories.tsx](file://packages/ui/src/components/ui/Button/Button.stories.tsx#L5-L14)

## Usage Patterns
The Button component supports several common usage patterns for different types of actions:

### Primary Actions
For main actions in an interface, use the primary color with solid variant:
```jsx
<Button color="primary" variant="solid">Submit</Button>
```

### Secondary Actions
For less prominent actions, use secondary color with bordered variant:
```jsx
<Button color="secondary" variant="bordered">Cancel</Button>
```

### Destructive Actions
For actions that delete or remove data, use the danger color:
```jsx
<Button color="danger">Delete</Button>
```

### Icon Integration
Icons can be included as children of the button:
```jsx
<Button isIconOnly={true} color="danger" variant="light">❤️</Button>
```

### Loading States
During asynchronous operations, the loading state provides visual feedback:
```jsx
<Button isLoading={true} color="primary">Processing...</Button>
```

**Section sources**
- [Button.stories.tsx](file://packages/ui/src/components/ui/Button/Button.stories.tsx#L102-L260)

## Storybook Examples
The Button component is thoroughly documented in Storybook with multiple examples demonstrating different configurations:

- **Default**: Basic button with default styling
- **Primary**: Main call-to-action button with primary color
- **Secondary**: Secondary action with bordered style
- **Danger**: Destructive action button in red
- **Success**: Positive action button in green
- **Loading**: Button in loading state with spinner
- **Disabled**: Non-interactive button state
- **Small Size**: Compact button for tight spaces
- **Large Size**: Prominent button for important actions
- **Bordered**: Button with outline style
- **Full Width**: Button that spans container width
- **Icon Only**: Button displaying only an icon
- **Playground**: Interactive example with all props configurable

These stories provide a comprehensive visual reference for all possible configurations and serve as a testing ground for new combinations of props.

**Section sources**
- [Button.stories.tsx](file://packages/ui/src/components/ui/Button/Button.stories.tsx#L89-L276)

## Accessibility Attributes
The Button component includes several accessibility features:

- Proper ARIA roles and attributes are automatically applied
- Keyboard navigation support through tabbing and enter/space activation
- Focus states are clearly visible for keyboard users
- Screen reader compatibility with appropriate labels
- High contrast ratios for text and background colors
- Support for reduced motion preferences
- Proper semantic HTML structure

The component inherits accessibility features from the `@heroui/react` library, ensuring compliance with WCAG guidelines. When using icons without text, it's recommended to include appropriate `aria-label` attributes to ensure screen reader users understand the button's purpose.

**Section sources**
- [Button.tsx](file://packages/ui/src/components/ui/Button/Button.tsx#L1-L11)

## Common Issues and Solutions
### Click Handling
The `onPress` prop should be used instead of traditional click handlers to ensure consistent behavior across devices (mouse, touch, keyboard).

### Disabled States
When a button is disabled, ensure the UI clearly communicates why it's disabled, possibly with tooltips or adjacent text explaining the condition.

### Performance Optimization
For high-frequency rendering scenarios:
- Memoize button props when possible using `React.memo`
- Avoid creating new callback functions on every render
- Use stable references for icon components
- Consider virtualization for lists of buttons

### Dark Mode Integration
The component automatically responds to the global theme context through the `@heroui/use-theme` package. Theme changes are detected and the button's appearance updates accordingly without requiring manual intervention.

### Responsive Design
The button adapts to different screen sizes through responsive Tailwind classes. For mobile interfaces, ensure adequate touch target size (minimum 44x44 pixels) by using appropriate padding and size props.

**Section sources**
- [Button.tsx](file://packages/ui/src/components/ui/Button/Button.tsx#L1-L11)
- [Button.stories.tsx](file://packages/ui/src/components/ui/Button/Button.stories.tsx#L1-L277)