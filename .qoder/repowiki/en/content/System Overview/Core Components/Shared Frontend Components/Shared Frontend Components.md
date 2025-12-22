# Shared Frontend Components

<cite>
**Referenced Files in This Document**   
- [Providers.tsx](file://packages/providers/src/Providers.tsx)
- [ui/README.md](file://packages/ui/README.md)
- [providers/README.md](file://packages/providers/README.md)
- [store/index.ts](file://packages/store/index.ts)
- [providers/index.ts](file://packages/providers/index.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
The shared frontend components in the prj-core repository provide a unified UI and state management system across multiple applications. This documentation details the implementation of the shared-frontend package, focusing on the AppProviders component, UI component library, store system, and their integration with consuming applications (admin and mobile). The system leverages MobX for state management, React Query for data fetching, and Storybook for component isolation and testing.

## Project Structure
The shared frontend components are organized within the monorepo's packages directory, with clear separation between providers, UI components, and state management stores. The structure enables code reuse and consistent implementation across applications.

```mermaid
graph TB
subgraph "Packages"
Providers["packages/providers"]
UI["packages/ui"]
Store["packages/store"]
end
subgraph "Applications"
Admin["apps/admin"]
Mobile["apps/mobile"]
Storybook["apps/storybook"]
end
Providers --> Admin
Providers --> Mobile
UI --> Admin
UI --> Mobile
Store --> Admin
Store --> Mobile
Storybook --> UI
Storybook --> Providers
```

**Diagram sources**
- [packages/providers/src/Providers.tsx](file://packages/providers/src/Providers.tsx)
- [packages/ui/README.md](file://packages/ui/README.md)

**Section sources**
- [packages/providers/src/Providers.tsx](file://packages/providers/src/Providers.tsx)
- [packages/ui/README.md](file://packages/ui/README.md)

## Core Components
The shared frontend system consists of three main component categories: providers for global state and configuration, UI components organized by category, and stores for application state management. These components work together to create a consistent user experience across applications while enabling efficient development workflows.

**Section sources**
- [packages/providers/src/Providers.tsx](file://packages/providers/src/Providers.tsx)
- [packages/ui/README.md](file://packages/ui/README.md)
- [packages/store/index.ts](file://packages/store/index.ts)

## Architecture Overview
The shared frontend architecture follows a layered approach with clear separation of concerns. At the foundation are the providers that establish global context, followed by the UI component library that implements the visual design system, and finally the store system that manages application state.

```mermaid
graph TD
A["App Entry Point"] --> B["AppProviders"]
B --> C["QueryProvider"]
B --> D["LibProvider"]
B --> E["StoreProvider"]
C --> F["React Query Client"]
D --> G["NuqsAdapter"]
D --> H["ToastProvider"]
E --> I["MobX Stores"]
A --> J["UI Components"]
J --> K["Buttons"]
J --> L["Inputs"]
J --> M["Layout"]
J --> N["DataGrid"]
J --> O["DarkModeSwitch"]
```

**Diagram sources**
- [packages/providers/src/Providers.tsx](file://packages/providers/src/Providers.tsx)
- [packages/ui/README.md](file://packages/ui/README.md)

## Detailed Component Analysis

### AppProviders Analysis
The AppProviders component serves as the central configuration point for the application, wrapping the entire app with necessary providers for state management, data fetching, and UI libraries.

#### For API/Service Components:
```mermaid
sequenceDiagram
participant App as "App Component"
participant Providers as "AppProviders"
participant Query as "QueryProvider"
participant Lib as "LibProvider"
participant Store as "StoreProvider"
App->>Providers : Render with children
Providers->>Query : Initialize QueryClient
Query->>Query : Configure React Query defaults
Providers->>Lib : Setup NuqsAdapter
Lib->>Lib : Configure ToastProvider
Providers->>Store : Initialize MobX stores
Store->>Store : Connect to global state
Providers-->>App : Return configured providers
```

**Diagram sources**
- [packages/providers/src/Providers.tsx](file://packages/providers/src/Providers.tsx)

**Section sources**
- [packages/providers/src/Providers.tsx](file://packages/providers/src/Providers.tsx)

### UI Component Library Analysis
The UI component library is organized by category (buttons, inputs, layout components) and follows a consistent API design pattern. Components are designed to be composable and theme-aware.

#### For Object-Oriented Components:
```mermaid
classDiagram
class Button {
+string variant
+string size
+boolean disabled
+string className
+onClick(event) void
+render() JSX
}
class Input {
+string type
+string placeholder
+boolean disabled
+string value
+onChange(event) void
+render() JSX
}
class DataGrid {
+Array data
+Array columns
+string variant
+onSort(column) void
+onFilter(criteria) void
+render() JSX
}
class DarkModeSwitch {
+boolean checked
+onChange(event) void
+render() JSX
}
class Layout {
+string variant
+string className
+children ReactNode
+render() JSX
}
Button <|-- PrimaryButton : "extends"
Button <|-- SecondaryButton : "extends"
Input <|-- TextInput : "extends"
Input <|-- NumberInput : "extends"
Layout <|-- DashboardLayout : "extends"
Layout <|-- MobileLayout : "extends"
```

**Diagram sources**
- [packages/ui/README.md](file://packages/ui/README.md)

**Section sources**
- [packages/ui/README.md](file://packages/ui/README.md)

### Store System Analysis
The store system implements global state management using MobX, providing a reactive state container for authentication, navigation, and other shared application state.

#### For Complex Logic Components:
```mermaid
flowchart TD
Start([Store Initialization]) --> AuthStore["Create authStore instance"]
AuthStore --> TokenStore["Create tokenStore instance"]
TokenStore --> CookieStore["Create cookieStore instance"]
CookieStore --> NavigationStore["Create navigationStore instance"]
NavigationStore --> RouteStore["Create routeStore instance"]
RouteStore --> PlateStore["Create plateStore instance"]
PlateStore --> StorageStore["Create storageStore instance"]
StorageStore --> End([Stores Ready])
subgraph "State Flow"
A["Component Request"] --> B{"Store State Check"}
B --> |Valid| C["Return Cached State"]
B --> |Invalid| D["Fetch New Data"]
D --> E["Update Store State"]
E --> F["Persist to Storage"]
F --> C
end
```

**Diagram sources**
- [packages/store/index.ts](file://packages/store/index.ts)
- [packages/store/src/stores](file://packages/store/src/stores)

**Section sources**
- [packages/store/index.ts](file://packages/store/index.ts)
- [packages/store/src/stores](file://packages/store/src/stores)

## Dependency Analysis
The shared frontend components have well-defined dependencies that enable functionality while maintaining separation of concerns. The dependency graph shows how components relate to each other and to external libraries.

```mermaid
graph TD
A["@cocrepo/frontend"] --> B["@tanstack/react-query"]
A --> C["@heroui/react"]
A --> D["nuqs"]
A --> E["lucide-react"]
A --> F["tailwindcss"]
B --> G["React Query Devtools"]
C --> H["ToastProvider"]
D --> I["URL State Management"]
E --> J["Icon Components"]
F --> K["Styling System"]
subgraph "Internal Dependencies"
L["AppProviders"] --> M["QueryProvider"]
L --> N["LibProvider"]
L --> O["StoreProvider"]
P["UI Components"] --> Q["Theme Context"]
P --> R["Store State"]
end
```

**Diagram sources**
- [packages/providers/README.md](file://packages/providers/README.md)
- [packages/ui/README.md](file://packages/ui/README.md)

**Section sources**
- [packages/providers/README.md](file://packages/providers/README.md)
- [packages/ui/README.md](file://packages/ui/README.md)

## Performance Considerations
The shared frontend components are optimized for performance through several key strategies: tree-shaking to eliminate unused code, memoization to prevent unnecessary re-renders, and lazy loading for improved initial load times. The components are designed to be lightweight and efficient, with careful attention to bundle size and runtime performance.

The implementation follows best practices for React optimization, including the use of React.memo for components that receive the same props, useCallback for function references, and useMemo for expensive calculations. The tree-shakable exports ensure that applications only include the components they actually use, minimizing bundle size.

## Troubleshooting Guide
Common issues with the shared frontend components typically relate to provider configuration, state synchronization, and theme context. When encountering problems, first verify that all necessary providers are properly wrapped around the application components in the correct order.

For state synchronization issues between applications, ensure that the store instances are properly initialized and that state updates are being propagated correctly. When working with the DarkModeSwitch component, verify that the theme context is properly configured and that the CSS variables for light and dark modes are correctly defined.

If components are not rendering as expected, check the Storybook examples to verify the correct usage pattern. The Storybook integration provides isolated component testing and documentation, making it easier to identify and resolve implementation issues.

**Section sources**
- [packages/providers/README.md](file://packages/providers/README.md)
- [packages/ui/README.md](file://packages/ui/README.md)

## Conclusion
The shared frontend components in prj-core provide a robust foundation for building consistent, maintainable user interfaces across multiple applications. By centralizing UI components, state management, and configuration, the system enables efficient development while ensuring a cohesive user experience. The combination of MobX for state management, React Query for data fetching, and Storybook for component isolation creates a powerful development environment that addresses common challenges like prop drilling and state synchronization. With proper implementation and adherence to best practices, these components can significantly improve development velocity and application quality.