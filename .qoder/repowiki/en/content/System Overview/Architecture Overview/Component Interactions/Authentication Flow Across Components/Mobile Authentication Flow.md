# Mobile Authentication Flow

<cite>
**Referenced Files in This Document**   
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [apis.ts](file://packages/api/src/apis.ts)
- [login.tsx](file://apps/admin/src/routes/admin/auth/login.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication Architecture](#authentication-architecture)
3. [Login Process Flow](#login-process-flow)
4. [State Management with authStore](#state-management-with-authstore)
5. [Token Management and Refresh Mechanism](#token-management-and-refresh-mechanism)
6. [Error Handling](#error-handling)
7. [Security Considerations](#security-considerations)
8. [Conclusion](#conclusion)

## Introduction
This document details the mobile application's authentication flow, focusing on the integration between frontend components, state management, and backend services. The system implements a JWT-based authentication mechanism with secure token storage and automatic token refresh capabilities. The documentation covers the complete authentication journey from user login to session management and logout.

## Authentication Architecture

```mermaid
graph TD
A[Login Screen] --> B[Authentication API]
B --> C{Authentication Success?}
C --> |Yes| D[Store Tokens Securely]
C --> |No| E[Display Error]
D --> F[Update authStore State]
F --> G[Redirect to Main App]
G --> H[Protected Routes]
H --> I[API Requests with JWT]
I --> J[Token Expiration Check]
J --> |Expired| K[Refresh Token Flow]
J --> |Valid| L[Process Request]
K --> M[New Tokens]
M --> D
```

**Diagram sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [apis.ts](file://packages/api/src/apis.ts)

**Section sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)

## Login Process Flow

```mermaid
sequenceDiagram
participant User as "Mobile User"
participant LoginScreen as "Login Screen"
participant AuthStore as "AuthStore"
participant API as "Authentication API"
participant TokenStore as "TokenStore"
User->>LoginScreen : Enter credentials
LoginScreen->>AuthStore : initiateLogin(credentials)
AuthStore->>API : POST /api/v1/auth/login
API-->>AuthStore : Return JWT tokens
AuthStore->>TokenStore : Store accessToken and refreshToken
TokenStore->>Browser : Set HttpOnly cookies
AuthStore->>LoginScreen : Update authentication state
LoginScreen->>User : Redirect to main application
```

**Diagram sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [apis.ts](file://packages/api/src/apis.ts)
- [login.tsx](file://apps/admin/src/routes/admin/auth/login.tsx)

**Section sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [login.tsx](file://apps/admin/src/routes/admin/auth/login.tsx)

## State Management with authStore

The authentication state is managed through the `AuthStore` class which provides a centralized location for authentication-related state and operations. The store maintains the current authentication status and handles authentication errors across the application.

```mermaid
classDiagram
class AuthStore {
+plateStore : Store
+isLoggingOut : boolean
+isAuthenticated() : boolean
+handleAuthError(error : unknown) : Promise
+logout(logoutApi? : () => Promise<any>) : Promise
}
class Store {
+tokenStore : TokenStore
}
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
+refreshToken() : Promise
}
AuthStore --> Store : "uses"
Store --> TokenStore : "contains"
```

**Diagram sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)

**Section sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)

## Token Management and Refresh Mechanism

The token management system implements a secure approach to handling JWT tokens with automatic refresh capabilities. Access tokens are stored in HttpOnly cookies for security, while refresh tokens are used to obtain new access tokens when they expire.

```mermaid
flowchart TD
A[API Request] --> B{Access Token Valid?}
B --> |Yes| C[Include Token in Request]
B --> |No| D{Refresh Token Available?}
D --> |Yes| E[Call Refresh Token API]
E --> F{Refresh Successful?}
F --> |Yes| G[Store New Tokens]
F --> |No| H[Logout User]
G --> C
H --> I[Clear All Tokens]
I --> J[Redirect to Login]
```

**Diagram sources**
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [authStore.ts](file://packages/store/src/stores/authStore.ts)

**Section sources**
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)

## Error Handling

The authentication system implements comprehensive error handling for various failure scenarios including network issues, invalid credentials, and expired sessions. The error handling is centralized in the AuthStore to ensure consistent behavior across the application.

```mermaid
flowchart TD
A[Error Occurs] --> B{Error Type}
B --> |Network Error| C[Display Network Error Message]
B --> |401 Unauthorized| D[Check Token Expiration]
D --> |Access Token Expired| E[Attempt Token Refresh]
D --> |Refresh Token Invalid| F[Logout User]
B --> |403 Forbidden| G[Display Permission Error]
B --> |Other Error| H[Display Generic Error]
C --> I[Allow Retry]
E --> J{Refresh Successful?}
J --> |Yes| K[Retry Original Request]
J --> |No| F
F --> L[Clear Tokens]
L --> M[Redirect to Login]
```

**Diagram sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)

**Section sources**
- [authStore.ts](file://packages/store/src/stores/authStore.ts)

## Security Considerations

The authentication implementation follows security best practices including:
- Use of HttpOnly cookies to prevent XSS attacks
- Secure flag on cookies to ensure transmission over HTTPS only
- Strict SameSite policy to prevent CSRF attacks
- JWT token validation with expiration checks
- Automatic token refresh to minimize exposure of refresh tokens
- Centralized error handling to prevent information leakage

The system also implements secure storage mechanisms that persist authentication state across app restarts while maintaining security. The token refresh mechanism ensures uninterrupted user experience while maintaining security by automatically obtaining new access tokens before they expire.

**Section sources**
- [tokenStore.ts](file://packages/store/src/stores/tokenStore.ts)
- [authStore.ts](file://packages/store/src/stores/authStore.ts)

## Conclusion
The mobile application's authentication flow provides a secure and user-friendly experience with robust state management and error handling. The integration between the authStore and tokenStore ensures consistent authentication state across the application, while the JWT-based system with automatic token refresh provides both security and convenience. The architecture supports secure storage, proper error handling, and seamless user experience across different scenarios including network interruptions and token expiration.