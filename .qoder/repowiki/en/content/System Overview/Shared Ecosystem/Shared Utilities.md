# Shared Utilities

<cite>
**Referenced Files in This Document**   
- [DateTime.ts](file://packages/toolkit/src/DateTime.ts)
- [Logger.ts](file://packages/toolkit/src/Logger.ts)
- [Path.ts](file://packages/toolkit/src/Path.ts)
- [Form.ts](file://packages/toolkit/src/Form.ts)
- [Browser.ts](file://packages/toolkit/src/Browser.ts)
- [Environment.ts](file://packages/toolkit/src/Environment.ts)
- [Tool.ts](file://packages/toolkit/src/Tool.ts)
- [customAxios.ts](file://packages/api-client/src/libs/customAxios.ts)
- [Providers.tsx](file://packages/providers/src/Providers.tsx)
- [useFormField.ts](file://packages/hooks/src/useFormField.ts)
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
The toolkit package in prj-core provides a comprehensive collection of reusable utility functions that are shared across all applications in the monorepo. This documentation thoroughly explains how these utilities support consistent functionality, improve development efficiency, and maintain code quality across the admin app, server, and mobile applications. The toolkit package serves as a foundational layer that enables functional programming patterns and promotes code reuse throughout the ecosystem.

## Project Structure

```mermaid
graph TD
subgraph "Applications"
Admin[Admin App]
Server[Server]
Mobile[Mobile App]
end
subgraph "Shared Packages"
Toolkit[toolkit]
ApiClient[api-client]
Providers[providers]
Hooks[hooks]
Schema[schema]
Store[store]
Ui[ui]
Constants[constants]
Types[types]
end
Admin --> Toolkit
Server --> Toolkit
Mobile --> Toolkit
ApiClient --> Toolkit
Providers --> Toolkit
Hooks --> Toolkit
Schema --> Toolkit
Store --> Toolkit
Ui --> Toolkit
Toolkit --> "es-toolkit"
Toolkit --> "dayjs"
style Toolkit fill:#4CAF50,stroke:#388E3C
```

**Diagram sources**
- [package.json](file://packages/toolkit/package.json#L1-L50)

**Section sources**
- [package.json](file://packages/toolkit/package.json#L1-L50)

## Core Components

The toolkit package contains several key utility modules that provide essential functionality across the monorepo. These include DateTime for date manipulation, Logger for consistent logging, Path for URL/path operations, Form for input validation, Browser for browser-specific utilities, Environment for environment detection, and Tool for general-purpose utilities. These components are designed to be lightweight, tree-shakable, and compatible with both client and server environments.

**Section sources**
- [DateTime.ts](file://packages/toolkit/src/DateTime.ts#L1-L82)
- [Logger.ts](file://packages/toolkit/src/Logger.ts#L1-L78)
- [Path.ts](file://packages/toolkit/src/Path.ts#L1-L49)
- [Form.ts](file://packages/toolkit/src/Form.ts#L1-L97)

## Architecture Overview

```mermaid
graph TD
subgraph "Toolkit Utilities"
DateTime[DateTime.ts]
Logger[Logger.ts]
Path[Path.ts]
Form[Form.ts]
Browser[Browser.ts]
Environment[Environment.ts]
Tool[Tool.ts]
end
subgraph "Core Applications"
Admin[Admin App]
Server[Server]
Mobile[Mobile App]
end
subgraph "Shared Libraries"
ApiClient[api-client]
SharedFrontend[shared-frontend]
SharedHooks[shared-hooks]
end
DateTime --> Admin
DateTime --> Server
DateTime --> Mobile
Logger --> Admin
Logger --> Server
Logger --> Mobile
Path --> Admin
Path --> Mobile
Form --> Admin
Form --> Mobile
Browser --> Admin
Browser --> Mobile
Environment --> Admin
Environment --> Mobile
Tool --> Admin
Tool --> Mobile
Tool --> ApiClient
Tool --> SharedHooks
ApiClient --> Server
SharedFrontend --> Admin
SharedHooks --> Admin
SharedFrontend --> Mobile
style DateTime fill:#2196F3,stroke:#1976D2
style Logger fill:#2196F3,stroke:#1976D2
style Path fill:#2196F3,stroke:#1976D2
style Form fill:#2196F3,stroke:#1976D2
style Browser fill:#2196F3,stroke:#1976D2
style Environment fill:#2196F3,stroke:#1976D2
style Tool fill:#2196F3,stroke:#1976D2
```

**Diagram sources**
- [DateTime.ts](file://packages/toolkit/src/DateTime.ts#L1-L82)
- [Logger.ts](file://packages/toolkit/src/Logger.ts#L1-L78)
- [Path.ts](file://packages/toolkit/src/Path.ts#L1-L49)
- [Form.ts](file://packages/toolkit/src/Form.ts#L1-L97)
- [Browser.ts](file://packages/toolkit/src/Browser.ts#L1-L122)
- [Environment.ts](file://packages/toolkit/src/Environment.ts#L1-L90)
- [Tool.ts](file://packages/toolkit/src/Tool.ts#L1-L42)

## Detailed Component Analysis

### DateTime Utilities
The DateTime module provides comprehensive date manipulation and formatting capabilities using the dayjs library. It offers functions for formatting dates in various patterns, manipulating dates by adding or subtracting time units, comparing dates, and extracting date components.

```mermaid
classDiagram
class DateTime {
+getNow() string
+formatDate(date : string | Date, format : string) string
+formatDateTime(date : string | Date, format : string) string
+formatDateTimeWithSeconds(date : string | Date, format : string) string
+startOf(date : string | Date, unit : string) Date
+subtract(date : string | Date, amount : number, unit : string) Date
+add(date : string | Date, amount : number, unit : string) Date
+isSame(date1 : string | Date, date2 : string | Date, unit : string) boolean
+getDate(date : string | Date) number
+getYear() number
+formatTime(format : string) string
+toISOString(date : string | Date) string
}
```

**Diagram sources**
- [DateTime.ts](file://packages/toolkit/src/DateTime.ts#L1-L82)

#### Usage Example: Admin App Session Scheduling
The admin app utilizes DateTime utilities for session scheduling functionality. When creating or editing sessions, the application uses `formatDateTime` to display session times in a consistent format and `add`/`subtract` functions to calculate session durations and recurrence patterns.

**Section sources**
- [DateTime.ts](file://packages/toolkit/src/DateTime.ts#L1-L82)

### Logger Utilities
The Logger module provides a consistent logging interface with emoji indicators for different log levels. It supports creating named loggers with prefixes for better traceability and offers methods for info, success, warning, error, and debug messages.

```mermaid
classDiagram
class Logger {
+info(message : string, data? : any) void
+success(message : string, data? : any) void
+warning(message : string, data? : any) void
+error(message : string, data? : any) void
+debug(message : string, data? : any) void
}
class LoggerUtil {
+createLogger(prefix : string) Logger
}
LoggerUtil --> Logger : "creates"
```

**Diagram sources**
- [Logger.ts](file://packages/toolkit/src/Logger.ts#L1-L78)

#### Usage Example: Server Request Sanitization
The server uses Logger utilities to maintain consistent logging across request handling. During request sanitization, the server employs `logger.warning` for validation warnings and `logger.error` for failed validation cases, ensuring that all security-related events are properly logged with appropriate context.

**Section sources**
- [Logger.ts](file://packages/toolkit/src/Logger.ts#L1-L78)

### Path Utilities
The Path module provides functions for URL path manipulation, including building paths with parameters and handling query strings. It enables dynamic URL construction based on route templates and parameter objects.

```mermaid
classDiagram
class Path {
+buildPath(template : string, params : object) string
+getUrlWithParamsAndQueryString(url : string, params : object, queryString? : string) string
+convertFromPathParamsToQueryParams(pathParamKeys : string[], pathParams : object) object
}
```

**Diagram sources**
- [Path.ts](file://packages/toolkit/src/Path.ts#L1-L49)

#### Usage Example: Mobile App Navigation
The mobile app leverages Path utilities for navigation between screens. When navigating to user profile pages or content details, the app uses `getUrlWithParamsAndQueryString` to construct URLs with dynamic parameters, ensuring consistent URL patterns across the application.

**Section sources**
- [Path.ts](file://packages/toolkit/src/Path.ts#L1-L49)

### Form Validation Utilities
The Form module provides robust input validation capabilities with support for required fields, length constraints, numerical ranges, and pattern matching. It offers both single field validation and batch validation for multiple fields.

```mermaid
classDiagram
class Validation {
+timings : ("onBlur" | "onChange" | "onFocus")[]
+required : {value : boolean, message : string}
+minLength : {value : number, message : string}
+maxLength : {value : number, message : string}
+min : {value : number, message : string}
+max : {value : number, message : string}
+patterns : {value : RegExp | string, message : string}[]
}
class Form {
+validateSingleField(value : any, validation : Validation) {isValid : boolean, errorMessage? : string}
+validateFields(state : any, validationFields : Record<string, Validation>) {isValid : boolean, errorMessage? : string}
}
```

**Diagram sources**
- [Form.ts](file://packages/toolkit/src/Form.ts#L1-L97)

## Dependency Analysis

```mermaid
graph TD
Toolkit[toolkit] --> Dayjs[dayjs]
Toolkit --> EsToolkit[es-toolkit]
ApiClient[api-client] --> Toolkit
Providers[providers] --> Toolkit
Hooks[hooks] --> Toolkit
Schema[schema] --> Toolkit
Store[store] --> Toolkit
Ui[ui] --> Toolkit
Admin[Admin App] --> Toolkit
Server[Server] --> Toolkit
Mobile[Mobile App] --> Toolkit
subgraph "Toolkit Modules"
DateTime[DateTime.ts]
Logger[Logger.ts]
Path[Path.ts]
Form[Form.ts]
Browser[Browser.ts]
Environment[Environment.ts]
Tool[Tool.ts]
end
DateTime --> Dayjs
Path --> EsToolkit
Tool --> EsToolkit
style Toolkit fill:#4CAF50,stroke:#388E3C
style Dayjs fill:#FF9800,stroke:#F57C00
style EsToolkit fill:#FF9800,stroke:#F57C00
```

**Diagram sources**
- [package.json](file://packages/toolkit/package.json#L1-L50)
- [DateTime.ts](file://packages/toolkit/src/DateTime.ts#L1-L82)
- [Path.ts](file://packages/toolkit/src/Path.ts#L1-L49)
- [Tool.ts](file://packages/toolkit/src/Tool.ts#L1-L42)

## Performance Considerations

The toolkit package is designed with performance and bundle size optimization in mind. All utilities are implemented as standalone functions that support tree-shaking, ensuring that applications only include the code they actually use. The package has minimal dependencies, relying primarily on dayjs for date operations and es-toolkit for utility functions, both of which are lightweight and well-maintained libraries.

To address tree-shaking optimization, the toolkit package exports functions individually in addition to providing a default export, allowing bundlers to eliminate unused code effectively. Version compatibility is maintained through strict version pinning in the package.json file and comprehensive testing across different environments.

Testing strategies for utility functions include unit tests for each function with various input scenarios, edge cases, and error conditions. The __tests__ directory contains comprehensive test coverage to ensure reliability and prevent regressions.

**Section sources**
- [package.json](file://packages/toolkit/package.json#L1-L50)
- [vitest.config.ts](file://packages/toolkit/vitest.config.ts#L1-L20)

## Troubleshooting Guide

Common issues with the toolkit package typically relate to environment detection, date formatting inconsistencies, or logging configuration. For environment detection issues, ensure that the hostname and port configurations in Environment.ts match your deployment setup. For date formatting problems, verify that the dayjs library is properly imported and that format strings follow dayjs conventions.

When experiencing tree-shaking issues, confirm that your bundler configuration supports dead code elimination and that you're importing functions directly rather than the entire module. For version compatibility problems between packages, use the workspace's package manager (pnpm) to ensure consistent dependency resolution across all packages.

**Section sources**
- [Environment.ts](file://packages/toolkit/src/Environment.ts#L1-L90)
- [DateTime.ts](file://packages/toolkit/src/DateTime.ts#L1-L82)
- [Logger.ts](file://packages/toolkit/src/Logger.ts#L1-L78)

## Conclusion

The toolkit package serves as a foundational utility library that provides essential functionality across the prj-core monorepo. By offering consistent implementations for date manipulation, logging, path operations, form validation, and other common tasks, it promotes code reuse, reduces duplication, and ensures uniform behavior across applications. The modular design supports tree-shaking for optimal bundle sizes, while the comprehensive testing strategy ensures reliability and stability. As the central utility package, toolkit enables other shared packages like api-client and providers to build upon a solid foundation of well-tested, reusable functions.