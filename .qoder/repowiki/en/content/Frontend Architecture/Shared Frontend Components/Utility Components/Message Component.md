# Message Component

<cite>
**Referenced Files in This Document**   
- [Message.tsx](file://packages/ui/src/components/ui/Message/Message.tsx)
- [Message.stories.tsx](file://packages/ui/src/components/ui/Message/Message.stories.tsx)
- [Providers.tsx](file://apps/admin/src/providers/Providers.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Components](#core-components)
3. [Architecture Overview](#architecture-overview)
4. [Detailed Component Analysis](#detailed-component-analysis)
5. [Integration with Global Notification Systems](#integration-with-global-notification-systems)
6. [Usage Examples](#usage-examples)
7. [Accessibility and Performance Considerations](#accessibility-and-performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction
The Message component in the shared-frontend library is a UI element designed to display informative alerts to users. It supports various message types including info, success, warning, and error states, with built-in accessibility features and visual indicators. The component is implemented using React and styled with Tailwind CSS, providing a clean and consistent user experience across applications. This documentation details the implementation, props, usage patterns, and integration points for the Message component.

## Core Components

The Message component is a self-contained UI element that displays alert messages with a title and content. It uses semantic HTML and ARIA roles to ensure accessibility, and is styled with utility classes for visual distinction. The component is part of the @cocrepo/ui package and is designed to be used in various contexts including form validation, system notifications, and API error handling.

**Section sources**
- [Message.tsx](file://packages/ui/src/components/ui/Message/Message.tsx)

## Architecture Overview

The Message component follows a simple functional component pattern with TypeScript interfaces for type safety. It is integrated into the larger application architecture through provider patterns that manage global state and notifications. The component is designed to be composable and can be extended with additional functionality as needed.

```mermaid
graph TB
A[Message Component] --> B[Props: title, message]
A --> C[Styling: Tailwind CSS]
A --> D[Accessibility: role="alert"]
A --> E[Text Component]
F[Application] --> G[Providers]
G --> H[ToastProvider]
H --> A
```

**Diagram sources**
- [Message.tsx](file://packages/ui/src/components/ui/Message/Message.tsx)
- [Providers.tsx](file://apps/admin/src/providers/Providers.tsx)

## Detailed Component Analysis

### Message Component Analysis
The Message component accepts two required props: `title` and `message`. It renders these values within a styled container that uses a left border and background color to visually distinguish the message from regular content. The component uses the Text component for consistent typography and applies bold styling to the title for emphasis.

The implementation is minimal and focused, avoiding unnecessary complexity while providing a clear visual hierarchy. The component uses the "alert" role for accessibility, ensuring screen readers properly announce the message to users.

#### Component Implementation
```mermaid
classDiagram
class Message {
+string title
+string message
+render() : JSX.Element
}
Message --> Text : uses
Text : +string className
Text : +children : ReactNode
```

**Diagram sources**
- [Message.tsx](file://packages/ui/src/components/ui/Message/Message.tsx)

**Section sources**
- [Message.tsx](file://packages/ui/src/components/ui/Message/Message.tsx)
- [Message.stories.tsx](file://packages/ui/src/components/ui/Message/Message.stories.tsx)

## Integration with Global Notification Systems

The Message component is integrated into the application's global notification system through the ToastProvider from @heroui/react. This provider is configured in the application's Providers component, which composes all necessary context providers for the application. The ToastProvider manages the display and positioning of toast notifications, including those created from Message components.

The integration allows messages to be triggered from anywhere in the application and displayed in a consistent location (bottom-center) with proper stacking behavior. This centralized approach ensures a cohesive user experience across different parts of the application.

**Section sources**
- [Providers.tsx](file://apps/admin/src/providers/Providers.tsx)

## Usage Examples

### Form Validation Feedback
The Message component can be used to display validation errors or success messages in forms. When a user submits a form with invalid data, a Message with an error severity can be displayed to indicate the issue. Similarly, after successful form submission, a success message can confirm the action.

### System Notifications
For system-level notifications such as maintenance windows or service updates, the Message component provides a clear way to communicate important information to users. These messages typically have a longer duration and may include additional action buttons for user interaction.

### API Error Handling
When API calls fail, the Message component can display error details to users in a user-friendly format. This helps users understand what went wrong and potentially how to resolve the issue. The component's structure allows for both technical details (in the message body) and a concise summary (in the title).

**Section sources**
- [Message.stories.tsx](file://packages/ui/src/components/ui/Message/Message.stories.tsx)

## Accessibility and Performance Considerations

### Accessibility Requirements
The Message component includes several accessibility features:
- Uses the "alert" role to ensure screen readers announce the message immediately
- Provides sufficient color contrast between text and background
- Uses semantic HTML structure with proper heading hierarchy
- Supports keyboard navigation and focus management

These features ensure that users with disabilities can effectively receive and understand the messages displayed by the component.

### Performance and Memory Management
The Message component is designed to be lightweight and efficient:
- Minimal DOM structure with only necessary elements
- No unnecessary re-renders through proper React patterns
- Proper cleanup of auto-dismissing messages to prevent memory leaks
- Efficient styling with utility classes rather than complex CSS

When used with auto-dismiss functionality, the component ensures that timers are properly cleared and references are removed to prevent memory leaks.

**Section sources**
- [Message.tsx](file://packages/ui/src/components/ui/Message/Message.tsx)

## Troubleshooting Guide

### Common Issues and Solutions
- **Message not displaying**: Ensure the ToastProvider is properly configured in the application's provider chain
- **Accessibility issues**: Verify that the message has proper contrast and that screen readers can access the content
- **Memory leaks with auto-dismiss**: Ensure that timers are properly cleared in cleanup functions
- **Styling conflicts**: Check for CSS specificity issues that might override the component's styles

### Debugging Tips
- Use browser developer tools to inspect the component's DOM structure and applied styles
- Check the console for any React warnings or errors related to the component
- Verify that props are being passed correctly from parent components
- Test with different message lengths to ensure proper text wrapping and layout

**Section sources**
- [Message.tsx](file://packages/ui/src/components/ui/Message/Message.tsx)
- [Message.stories.tsx](file://packages/ui/src/components/ui/Message/Message.stories.tsx)