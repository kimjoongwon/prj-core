# Global State Management

<cite>
**Referenced Files in This Document**   
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [navigationStore.ts](file://packages/store/src/stores/navigationStore.ts)
- [Store.ts](file://packages/store/src/stores/Store.ts)
- [navigatorStore.ts](file://packages/store/src/stores/navigatorStore.ts)
- [routeStore.ts](file://packages/store/src/stores/routeStore.ts)
- [cookieStore.ts](file://packages/store/src/stores/cookieStore.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core State Management Architecture](#core-state-management-architecture)
3. [MobX Store Implementation](#mobx-store-implementation)
4. [AppProviders Component Orchestration](#appproviders-component-orchestration)
5. [Store Initialization Sequence](#store-initialization-sequence)
6. [Data Flow and Reactivity Patterns](#data-flow-and-reactivity-patterns)
7. [State Consumption Patterns](#state-consumption-patterns)
8. [Authentication State Propagation](#authentication-state-propagation)
9. [Technical Decision Analysis](#technical-decision-analysis)
10. [Conclusion](#conclusion)

## Introduction
The global state management system in prj-core implements a comprehensive solution for managing application state across multiple frontend applications. This system leverages MobX for reactive state management and the provider pattern for dependency injection, creating a scalable architecture that handles authentication, navigation, and token management. The core of this system is the AppProviders component that orchestrates various context providers, ensuring consistent state management across both admin and mobile applications.

## Core State Management Architecture

```mermaid
graph TD
A[AppProviders] --> B[Store]
B --> C[AuthStore]
B --> D[TokenStore]
B --> E[NavigationStore]
B --> F[CookieStore]
C --> D
E --> G[NavigatorStore]
E --> H[RouteStore]
D --> F
C --> F
style A fill:#4C8BF5,stroke:#333
style B fill:#FFB400,stroke:#333
style C fill:#28A745,stroke:#333
style D fill:#28A745,stroke:#333
style E fill:#28A745,stroke:#333
style F fill:#6F42C1,stroke:#333
style G fill:#6F42C1,stroke:#333
style H fill:#6F42C1,stroke:#333
```

**Diagram sources**
- [Store.ts](file://packages/store/src/stores/Store.ts)
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [navigationStore.ts](file://packages/store/src/stores/navigationStore.ts)

**Section sources**
- [Store.ts](file://packages/store/src/stores/Store.ts)
- [authStore.ts](file://packages/store/src/stores/authStore.ts)

## MobX Store Implementation

### AuthStore
The AuthStore manages authentication state and related operations, providing a reactive interface for authentication status and handling logout procedures. It maintains a reference to the main Store instance and tracks logout state.

```mermaid
classDiagram
class AuthStore {
+plateStore : Store
+isLoggingOut : boolean
+isAuthenticated : boolean
+constructor(plateStore : Store)
+handleAuthError(error : unknown) : void
+logout(logoutApi? : () => Promise~any~) : Promise~void~
}
class Store {
+name : string
+navigation : NavigationStore
+tokenStore : TokenStore
+authStore : AuthStore
+cookieStore : CookieStore
+constructor()
}
AuthStore --> Store : "has reference to"
AuthStore ..> TokenStore : "depends on for token validation"
```

**Diagram sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [Store.ts](file://packages/store/src/stores/Store.ts)

**Section sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)

### TokenStore
The TokenStore handles JWT token management, including storage, retrieval, and validation. It uses cookie-based storage with secure settings and provides methods to check token validity and expiration.

```mermaid
classDiagram
class TokenStore {
+cookieStore : CookieStore
+store : Store
+setAccessToken(token : string) : void
+getAccessToken() : string | null
+setRefreshToken(token : string) : void
+getRefreshToken() : string | null
+clearTokens() : void
+hasValidTokens() : boolean
+isAccessTokenExpired() : boolean
+refreshToken() : Promise~void~
+constructor(Store : Store)
}
class CookieStore {
+set(name : string, value : string, options : CookieOptions) : void
+get(name : string) : string | undefined
+remove(name : string, options : CookieOptions) : void
}
TokenStore --> CookieStore : "uses for storage"
TokenStore --> Store : "has reference to"
```

**Diagram sources**
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [cookieStore.ts](file://packages/store/src/stores/cookieStore.ts)

**Section sources**
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)

### NavigationStore
The NavigationStore manages application routing state, tracking the current route and maintaining active states for navigation items. It works with RouteStore instances to represent the application's navigation structure.

```mermaid
classDiagram
class NavigationStore {
+plateStore : Store
+navigator : NavigatorStore
+routes : RouteStore[]
+currentRoute : RouteStore | undefined
+constructor(plateStore : Store, navigator : NavigatorStore, routeDtos : RouteStore[])
+initializeCurrentPath() : void
+updateActiveRoutes() : void
+resetAllActiveStates() : void
+setActiveStatesForPath(targetPath : string) : void
}
class RouteStore {
+name : string
+fullPath : string
+relativePath : string
+active : boolean
+icon : string | null
+children : RouteStore[]
+constructor(route : RouteStore)
}
class NavigatorStore {
+plateStore : Store
+getRouteByFullPath(fullPath : string, routes : RouteStore[]) : RouteStore | undefined
+constructor(plateStore : Store)
}
NavigationStore --> RouteStore : "contains"
NavigationStore --> NavigatorStore : "uses for route lookup"
NavigationStore --> Store : "has reference to"
RouteStore --> RouteStore : "children"
```

**Diagram sources**
- [navigationStore.ts](file://packages/store/src/stores/navigationStore.ts)
- [routeStore.ts](file://packages/store/src/stores/routeStore.ts)
- [navigatorStore.ts](file://packages/store/src/stores/navigatorStore.ts)

**Section sources**
- [navigationStore.ts](file://packages/store/src/stores/navigationStore.ts)
- [routeStore.ts](file://packages/store/src/stores/routeStore.ts)
- [navigatorStore.ts](file://packages/store/src/stores/navigatorStore.ts)

## AppProviders Component Orchestration
The AppProviders component serves as the central orchestrator for all context providers in the application. It initializes the main Store instance which in turn creates and manages all individual stores (AuthStore, TokenStore, NavigationStore, etc.). This component ensures that all providers are properly initialized and available to the entire application tree.

The provider pattern implemented here enables dependency injection, making the state management system easily testable by allowing mock stores to be injected during testing. The AppProviders component wraps the entire application, providing a single entry point for state initialization and ensuring consistent state management across all application components.

**Section sources**
- [Store.ts](file://packages/store/src/stores/Store.ts)

## Store Initialization Sequence

```mermaid
sequenceDiagram
participant App as App Component
participant AppProviders as AppProviders
participant Store as Store
participant AuthStore as AuthStore
participant TokenStore as TokenStore
participant NavigationStore as NavigationStore
participant NavigatorStore as NavigatorStore
participant CookieStore as CookieStore
App->>AppProviders : Render Application
AppProviders->>Store : Create new Store instance
Store->>NavigatorStore : Create new NavigatorStore
Store->>NavigationStore : Create new NavigationStore with NavigatorStore
Store->>TokenStore : Create new TokenStore
Store->>CookieStore : Create new CookieStore
Store->>AuthStore : Create new AuthStore
AuthStore->>TokenStore : Reference for token validation
AuthStore->>Store : Reference to main Store
TokenStore->>CookieStore : Reference for cookie operations
NavigationStore->>Store : Reference to main Store
NavigationStore->>NavigatorStore : Reference for route lookup
Store-->>AppProviders : Return initialized Store
AppProviders-->>App : Application ready with state management
```

**Diagram sources**
- [Store.ts](file://packages/store/src/stores/Store.ts)
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [navigationStore.ts](file://packages/store/src/stores/navigationStore.ts)
- [navigatorStore.ts](file://packages/store/src/stores/navigatorStore.ts)
- [cookieStore.ts](file://packages/store/src/stores/cookieStore.ts)

**Section sources**
- [Store.ts](file://packages/store/src/stores/Store.ts)

## Data Flow and Reactivity Patterns
The state management system employs MobX's reactivity model to automatically track dependencies and update components when state changes. When an authentication state changes, the flow follows a specific pattern:

```mermaid
flowchart TD
A[User Action] --> B{AuthStore Method}
B --> C[State Mutation]
C --> D[MobX Observables Update]
D --> E[Automatic Dependency Tracking]
E --> F[Reactive Components Update]
F --> G[UI Rerender]
subgraph "MobX Reactivity System"
D
E
end
subgraph "Application Layer"
A
B
C
F
G
end
```

The stores use `makeAutoObservable` to automatically make all properties and methods observable, eliminating the need for manual decorators. This creates a transparent reactivity system where components that access store properties automatically become observers and will re-render when those properties change.

**Section sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [navigationStore.ts](file://packages/store/src/stores/navigationStore.ts)

## State Consumption Patterns
Components consume state from the providers through the main Store instance. The reactivity pattern ensures that components automatically update when relevant state changes. For authentication state, components can access the `isAuthenticated` getter which depends on the token store's expiration check.

The dependency chain flows from the main Store down to specific stores, with each store potentially depending on others. For example, the AuthStore depends on the TokenStore to determine authentication status, while the NavigationStore depends on the NavigatorStore for route resolution.

**Section sources**
- [Store.ts](file://packages/store/src/stores/Store.ts)
- [authStore.ts](file://packages/store/src/stores/authStore.ts)

## Authentication State Propagation
Authentication state changes propagate through the system via a well-defined flow. When a user logs out, the AuthStore handles the process by first setting the `isLoggingOut` flag, then calling the logout API if provided, clearing client-side storage, and finally navigating to the login page.

The authentication error handling is implemented through commented-out Axios interceptors in the AuthStore, suggesting a planned mechanism to automatically redirect users when receiving 401 responses. The `isAuthenticated` getter provides a reactive way to check authentication status by delegating to the TokenStore's `isAccessTokenExpired` method.

```mermaid
sequenceDiagram
participant Component as React Component
participant AuthStore as AuthStore
participant TokenStore as TokenStore
participant CookieStore as CookieStore
participant Browser as Browser
Component->>AuthStore : Access isAuthenticated
AuthStore->>TokenStore : isAccessTokenExpired()
TokenStore->>TokenStore : Parse JWT payload
TokenStore->>TokenStore : Check expiration
TokenStore-->>AuthStore : Return expiration status
AuthStore-->>Component : Return authentication status
Component->>AuthStore : Call logout()
AuthStore->>AuthStore : Set isLoggingOut = true
AuthStore->>Backend : Call logout API (optional)
AuthStore->>CookieStore : Clear accessToken and refreshToken
AuthStore->>Browser : Navigate to login page
AuthStore->>AuthStore : Set isLoggingOut = false
```

**Diagram sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [cookieStore.ts](file://packages/store/src/stores/cookieStore.ts)

**Section sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)

## Technical Decision Analysis
The decision to use MobX over other state management solutions like Redux or Context API alone was likely driven by several factors:

1. **Reactivity Model**: MobX provides transparent reactivity, reducing boilerplate code compared to Redux's explicit action/reducer patterns.
2. **Performance**: MobX's fine-grained reactivity updates only the components that need to render, avoiding the prop-drilling issues of Context API.
3. **Developer Experience**: The observable pattern is more intuitive than Redux's functional programming approach, especially for developers familiar with OOP.
4. **Scalability**: The store pattern allows for organized, scalable state management as the application grows.

The provider pattern was chosen for dependency injection and testing benefits. By injecting the Store instance, components can be easily tested with mock stores, and the entire state management system can be replaced or modified without changing component implementations.

The use of cookie-based token storage with secure flags (secure, sameSite: strict) enhances security by preventing XSS attacks and ensuring tokens are only sent over HTTPS connections.

**Section sources**
- [Store.ts](file://packages/store/src/stores/Store.ts)
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)

## Conclusion
The global state management system in prj-core provides a robust, scalable solution for managing application state across multiple frontend applications. By combining MobX's reactivity model with the provider pattern for dependency injection, the system achieves a balance of performance, maintainability, and developer experience. The AppProviders component effectively orchestrates the initialization and dependency relationships between various state management stores, ensuring consistent behavior across the application. The architecture supports easy testing and future enhancements while maintaining strong security practices for authentication state management.