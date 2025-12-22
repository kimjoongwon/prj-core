# Authentication Endpoints

<cite>
**Referenced Files in This Document**   
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts)
- [context.service.ts](file://apps/server/src/shared/service/utils/context.service.ts)
- [token.dto.ts](file://packages/schema/src/dto/auth/token.dto.ts)
- [login-payload.dto.ts](file://packages/schema/src/dto/auth/login-payload.dto.ts)
- [auth.config.ts](file://apps/server/src/shared/config/auth.config.ts)
- [cookie.util.ts](file://apps/server/src/shared/utils/cookie.util.ts)
- [select-tenant.dto.ts](file://packages/schema/src/dto/select-tenant.dto.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication Flow Overview](#authentication-flow-overview)
3. [Endpoint Specifications](#endpoint-specifications)
4. [Token Management](#token-management)
5. [Security Implementation](#security-implementation)
6. [Error Handling](#error-handling)
7. [Usage Examples](#usage-examples)
8. [Session Management](#session-management)

## Introduction

This document provides comprehensive documentation for the authentication endpoints in the prj-core system. The authentication system implements JWT-based authentication with refresh token rotation and CSRF protection through HttpOnly cookies. The endpoints support login, logout, token refresh, and tenant selection workflows for multi-tenant applications.

The authentication system follows industry best practices with access tokens valid for 15 minutes and refresh tokens valid for 7 days. All authentication tokens are securely stored in HttpOnly cookies to prevent XSS attacks, and the system implements proper token invalidation during logout.

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)

## Authentication Flow Overview

The authentication flow in prj-core follows a standard JWT-based authentication pattern with refresh token rotation:

1. User submits credentials to the login endpoint
2. Server validates credentials and generates JWT tokens
3. Access and refresh tokens are set in HttpOnly cookies
4. Subsequent requests include the access token in the Authorization header or automatically via cookies
5. When the access token expires, the client uses the refresh token to obtain new tokens
6. Users can log out, which clears all authentication cookies

```mermaid
sequenceDiagram
participant Client
participant AuthController
participant TokenService
participant AuthFacade
Client->>AuthController : POST /api/v1/auth/login
AuthController->>AuthFacade : Validate credentials
AuthFacade-->>AuthController : User data
AuthController->>TokenService : Generate tokens
TokenService-->>AuthController : accessToken, refreshToken
AuthController->>Client : Set cookies & return tokens
Client->>AuthController : GET /protected (with token)
AuthController->>TokenService : Verify token
TokenService-->>AuthController : Valid/Invalid
AuthController-->>Client : Resource or 401
Client->>AuthController : POST /api/v1/auth/token/refresh
AuthController->>TokenService : Validate refresh token
TokenService-->>AuthController : New tokens
AuthController->>Client : Set new cookies
```

**Diagram sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts)

## Endpoint Specifications

### Login Endpoint

**HTTP Method**: POST  
**URL Pattern**: `/api/v1/auth/login`  
**Public Route**: Yes (no authentication required)

#### Request Parameters
- **Content-Type**: `application/json`
- **Body** (application/json):
  - `email` (string): User's email address
  - `password` (string): User's password

#### Response Schema (200 OK)
```json
{
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "tenants": [
        {
          "id": "string",
          "name": "string",
          "main": "boolean",
          "spaceId": "string"
        }
      ]
    },
    "mainTenantId": "string"
  },
  "status": "OK",
  "message": "로그인 성공"
}
```

#### Headers
- **Set-Cookie**: `accessToken=...; Path=/; HttpOnly; SameSite=Strict`
- **Set-Cookie**: `refreshToken=...; Path=/; HttpOnly; SameSite=Strict`

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L60-L97)
- [token.dto.ts](file://packages/schema/src/dto/auth/token.dto.ts)

### Token Refresh Endpoint

**HTTP Method**: POST  
**URL Pattern**: `/api/v1/auth/token/refresh`  
**Public Route**: Yes (no authentication required)

#### Request Parameters
- **Content-Type**: `application/json`
- **Cookies**: `refreshToken` must be present

#### Response Schema (200 OK)
```json
{
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "tenants": [
        {
          "id": "string",
          "name": "string",
          "main": "boolean",
          "spaceId": "string"
        }
      ]
    },
    "mainTenantId": "string"
  },
  "status": "OK",
  "message": "토큰 재발급 성공"
}
```

#### Headers
- **Set-Cookie**: `accessToken=...; Path=/; HttpOnly; SameSite=Strict`
- **Set-Cookie**: `refreshToken=...; Path=/; HttpOnly; SameSite=Strict`

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L99-L144)

### Logout Endpoint

**HTTP Method**: POST  
**URL Pattern**: `/api/v1/auth/logout`  
**Public Route**: No (authentication required)

#### Request Parameters
- **Content-Type**: `application/json`

#### Response Schema (200 OK)
```json
{
  "data": true,
  "status": "OK",
  "message": "로그아웃 성공"
}
```

#### Headers
- **Set-Cookie**: `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
- **Set-Cookie**: `refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
- **Set-Cookie**: `tenantId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
- **Set-Cookie**: `workspaceId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L222-L252)

### Token Verification Endpoint

**HTTP Method**: GET  
**URL Pattern**: `/api/v1/auth/verify-token`  
**Public Route**: No (authentication required)

#### Request Parameters
- **Authorization Header**: `Bearer <accessToken>` or accessToken cookie

#### Response Schema (200 OK)
```json
{
  "data": true,
  "status": "OK",
  "message": "토큰 유효성 검증 완료"
}
```

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L202-L220)

## Token Management

### Token Expiration Policies

The authentication system implements the following token expiration policies:

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

These values are configured in the application's configuration system and can be adjusted based on security requirements.

```mermaid
flowchart TD
A[User Login] --> B[Access Token: 15m]
A --> C[Refresh Token: 7d]
B --> D{Access Token Expired?}
D --> |No| E[Access Protected Resources]
D --> |Yes| F[Use Refresh Token]
F --> G[Get New Access Token]
G --> H[Continue Access]
C --> I{Refresh Token Expired?}
I --> |Yes| J[User Must Login Again]
```

**Diagram sources**
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts)
- [auth.config.ts](file://apps/server/src/shared/config/auth.config.ts)

### Token Generation Process

When a user successfully authenticates, the system generates two JWT tokens:

1. **Access Token**: Used for authenticating API requests
2. **Refresh Token**: Used to obtain new access tokens when they expire

The tokens contain the user's ID as the payload and are signed using the application's secret key. The refresh token has a longer expiration time and is stored in an HttpOnly cookie to prevent client-side access.

**Section sources**
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts#L73-L92)

## Security Implementation

### CSRF Protection

The authentication system implements CSRF protection through the use of HttpOnly cookies:

- All authentication tokens are stored in HttpOnly cookies
- Cookies are marked with SameSite=Strict to prevent CSRF attacks
- The server automatically handles token validation without client-side token storage

This approach prevents XSS attacks from stealing authentication tokens while also protecting against CSRF attacks through the SameSite cookie attribute.

```mermaid
graph TD
A[Client Request] --> B{Has Valid Cookie?}
B --> |Yes| C[Process Request]
B --> |No| D[Return 401 Unauthorized]
C --> E[Validate Token Signature]
E --> F{Valid Signature?}
F --> |Yes| G[Process Request]
F --> |No| H[Return 401 Unauthorized]
```

**Diagram sources**
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts)
- [cookie.util.ts](file://apps/server/src/shared/utils/cookie.util.ts)

### Public Route Accessibility

The system uses the `@Public()` decorator to mark endpoints that do not require authentication:

- `/api/v1/auth/login`
- `/api/v1/auth/token/refresh`
- `/api/v1/auth/sign-up`

All other endpoints require valid authentication tokens unless explicitly marked as public. The decorator works in conjunction with the authentication guard to bypass token validation for public routes.

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)

## Error Handling

### Standard Error Response Structure

All authentication endpoints follow a consistent error response structure:

```json
{
  "data": null,
  "status": "ERROR",
  "message": "Error description"
}
```

### Common Status Codes

| Status Code | Error Type | Description |
|-----------|-----------|-------------|
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Invalid credentials or expired/missing token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 409 | Conflict | Resource conflict (e.g., email already exists) |
| 429 | Too Many Requests | Rate limiting applied |
| 500 | Internal Server Error | Unexpected server error |

### Specific Error Scenarios

**401 Unauthorized Scenarios:**
- Invalid email or password during login
- Missing refresh token during token refresh
- Expired or invalid access token during protected requests
- User not found in the system

**403 Forbidden Scenarios:**
- Valid token but attempting to access restricted resources
- Tenant mismatch or invalid tenant permissions

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts)

## Usage Examples

### Complete Authentication Flow with curl

```bash
# 1. Login and receive tokens
curl -X POST https://api.prj-core.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }' \
  -c ./cookies.txt

# 2. Access protected resource using received tokens (cookies)
curl -X GET https://api.prj-core.com/api/v1/protected-resource \
  -H "Content-Type: application/json" \
  -b ./cookies.txt

# 3. Refresh tokens when access token expires
curl -X POST https://api.prj-core.com/api/v1/auth/token/refresh \
  -H "Content-Type: application/json" \
  -b ./cookies.txt \
  -c ./cookies.txt

# 4. Logout and clear all authentication cookies
curl -X POST https://api.prj-core.com/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -b ./cookies.txt \
  -c ./cookies.txt
```

### Successful Authentication Response

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjQwOTkwODAwLCJleHAiOjE2NDA5OTE3MDB9.7Z3jRZJY9X2JZ3jRZJY9X2JZ3jRZJY9X2JZ3jRZJY9X",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjQwOTkwODAwLCJleHAiOjE2NDE1OTU2MDB9.8Z4kSZKZ0Y3KZ4kSZKZ0Y3KZ4kSZKZ0Y3KZ4kSZKZ0Y",
    "user": {
      "id": "1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "tenants": [
        {
          "id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
          "name": "Main Organization",
          "main": true,
          "spaceId": "s1p2a3c4-e5f6-7890-g1h2-i3j4k5l6m7n8"
        }
      ]
    },
    "mainTenantId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
  },
  "status": "OK",
  "message": "로그인 성공"
}
```

### Error Response Examples

**401 Unauthorized - Invalid Credentials:**
```json
{
  "data": null,
  "status": "ERROR",
  "message": "이메일 또는 비밀번호가 일치하지 않습니다"
}
```

**401 Unauthorized - Refresh Token Not Found:**
```json
{
  "data": null,
  "status": "ERROR",
  "message": "리프레시 토큰이 존재하지 않습니다"
}
```

**400 Bad Request - Invalid Email Format:**
```json
{
  "data": null,
  "status": "ERROR",
  "message": "이메일 또는 비밀번호 형식이 올바르지 않습니다"
}
```

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)
- [token.dto.ts](file://packages/schema/src/dto/auth/token.dto.ts)

## Session Management

### Cookie Configuration

The authentication system uses the following cookie configuration for secure session management:

- **HttpOnly**: True (prevents client-side script access)
- **Secure**: True (transmitted over HTTPS only)
- **SameSite**: Strict (prevents CSRF attacks)
- **Path**: / (available across the entire domain)

These settings ensure that authentication tokens are protected from common web vulnerabilities like XSS and CSRF attacks.

### Token Rotation

The system implements refresh token rotation:
- Each time a refresh token is used, a new refresh token is issued
- The previous refresh token is invalidated
- This prevents replay attacks and enhances security

The token rotation is handled automatically by the `getNewToken` method in the `AuthFacade`, which generates a new refresh token each time the endpoint is called.

### Session Expiration

Sessions expire based on the following rules:
- Access tokens expire after 15 minutes of inactivity
- Refresh tokens expire after 7 days of inactivity
- Sessions are immediately terminated on logout
- Users must re-authenticate after refresh token expiration

This session management strategy balances security with user experience, requiring frequent re-authentication for sensitive operations while allowing longer sessions for regular use.

**Section sources**
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts)
- [cookie.util.ts](file://apps/server/src/shared/utils/cookie.util.ts)
- [auth.config.ts](file://apps/server/src/shared/config/auth.config.ts)