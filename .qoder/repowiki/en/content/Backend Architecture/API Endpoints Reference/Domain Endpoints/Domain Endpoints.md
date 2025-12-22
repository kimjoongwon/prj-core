# Domain Endpoints

<cite>
**Referenced Files in This Document**   
- [main.ts](file://apps/server/src/main.ts)
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)
- [login-payload.dto.ts](file://packages/schema/src/dto/auth/login-payload.dto.ts)
- [appBuilderDto.ts](file://packages/api-client/src/model/appBuilderDto.ts)
- [getAppBuilder200AllOf.ts](file://packages/api-client/src/model/getAppBuilder200AllOf.ts)
- [selectTenantDto.ts](file://packages/schema/src/dto/select-tenant.dto.ts)
- [tenants.controller.ts](file://apps/server/src/shared/controller/resources/tenants.controller.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication Endpoints](#authentication-endpoints)
3. [App-Builder Endpoints](#app-builder-endpoints)
4. [JWT Authentication Flow](#jwt-authentication-flow)
5. [Request/Response Examples](#requestresponse-examples)
6. [Security and Access Control](#security-and-access-control)
7. [Error Handling](#error-handling)
8. [Curl Examples](#curl-examples)

## Introduction
This document provides comprehensive RESTful API documentation for domain-specific endpoints in the prj-core system. It covers authentication endpoints (login, logout, token refresh, tenant selection) and app-builder endpoints (application configuration, tenant-specific settings). The API uses JWT-based authentication with cookie storage for CSRF protection and implements role-based access control for protected resources.

**Section sources**
- [main.ts](file://apps/server/src/main.ts#L50-L72)

## Authentication Endpoints

### Login Endpoint
Authenticates a user with email and password credentials and returns JWT tokens in HttpOnly cookies.

- **HTTP Method**: POST
- **URL Pattern**: `/api/v1/login`
- **Public Route**: Yes (no authentication required)
- **Request Parameters**:
  - Body: `LoginPayloadDto` containing:
    - `email`: User's email address (string, required)
    - `password`: User's password (string, required)
- **Response Schema**: `TokenDto` with user information and tokens
- **Required Headers**: 
  - `Content-Type: application/json`
- **Status Codes**:
  - 200: Successful authentication
  - 400: Invalid email or password format
  - 401: Invalid credentials
  - 500: Internal server error

### Token Refresh Endpoint
Uses a refresh token to generate new access and refresh tokens.

- **HTTP Method**: POST
- **URL Pattern**: `/api/v1/auth/token/refresh`
- **Public Route**: Yes (uses refresh token from cookie)
- **Request Parameters**:
  - Cookie: `refreshToken` (automatically sent by browser)
- **Response Schema**: `TokenDto` with new tokens and user information
- **Required Headers**: 
  - `Content-Type: application/json`
- **Status Codes**:
  - 200: Successful token refresh
  - 401: Refresh token not found or invalid
  - 500: Internal server error

### New Token Endpoint
Refreshes tokens for an already authenticated user.

- **HTTP Method**: GET
- **URL Pattern**: `/api/v1/auth/new-token`
- **Public Route**: No (requires valid access token)
- **Request Parameters**:
  - Cookie: `refreshToken` (required)
  - Authorization header not required (uses cookie-based authentication)
- **Response Schema**: `TokenDto` with refreshed tokens
- **Required Headers**: None (cookies automatically sent)
- **Status Codes**:
  - 200: Successful token renewal
  - 401: Invalid or missing token
  - 500: Internal server error

### Logout Endpoint
Terminates the user session by clearing all authentication cookies.

- **HTTP Method**: POST
- **URL Pattern**: `/api/v1/logout`
- **Public Route**: No (requires authentication)
- **Request Parameters**: None
- **Response Schema**: Boolean `true` on success
- **Required Headers**: 
  - `Content-Type: application/json`
- **Status Codes**:
  - 200: Successful logout
  - 500: Internal server error
- **Response Headers**: 
  - `Set-Cookie`: Clears `accessToken`, `refreshToken`, `tenantId`, and `workspaceId` cookies

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L60-L253)
- [login-payload.dto.ts](file://packages/schema/src/dto/auth/login-payload.dto.ts#L34-L31)

## App-Builder Endpoints

### Application Configuration Endpoint
Retrieves the application configuration including route definitions for the app builder.

- **HTTP Method**: GET
- **URL Pattern**: `/api/v1/app-builder`
- **Public Route**: No (requires authentication)
- **Request Parameters**: None
- **Response Schema**: `GetAppBuilder200AllOf` containing:
  - `httpStatus`: HTTP status code (number)
  - `message`: Response message (string)
  - `data`: `AppBuilderDto` object with:
    - `routes`: Array of `RouteDto` objects defining application navigation
- **Required Headers**:
  - `Authorization: Bearer <access_token>` or cookie-based authentication
  - `Content-Type: application/json`
- **Status Codes**:
  - 200: Successful retrieval of app configuration
  - 401: Unauthorized (invalid or missing token)
  - 403: Forbidden (insufficient permissions)
  - 429: Too many requests
  - 500: Internal server error

### Tenant Selection Endpoint
Allows users to select their active tenant context.

- **HTTP Method**: POST
- **URL Pattern**: `/api/v1/tenants/select`
- **Public Route**: No (requires authentication)
- **Request Parameters**:
  - Body: `SelectTenantDto` containing:
    - `selectedTenantId`: UUID of the tenant to select (string, required)
- **Response Schema**: Updated user context with selected tenant
- **Required Headers**:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Status Codes**:
  - 200: Successful tenant selection
  - 400: Invalid tenant ID format
  - 401: Unauthorized
  - 403: User does not have access to the specified tenant
  - 500: Internal server error

**Section sources**
- [appBuilderDto.ts](file://packages/api-client/src/model/appBuilderDto.ts#L1-L11)
- [getAppBuilder200AllOf.ts](file://packages/api-client/src/model/getAppBuilder200AllOf.ts#L1-L16)
- [selectTenantDto.ts](file://packages/schema/src/dto/select-tenant.dto.ts#L1-L12)
- [tenants.controller.ts](file://apps/server/src/shared/controller/resources/tenants.controller.ts#L35-L43)

## JWT Authentication Flow

### Token Generation and Storage
The system implements a JWT-based authentication flow with cookie storage for enhanced security:

1. **Token Types**:
   - Access Token: Short-lived token (typically 15-30 minutes) for API access
   - Refresh Token: Long-lived token (typically 7 days) for obtaining new access tokens

2. **Token Storage**:
   - Access Token: Stored in HttpOnly, Secure, SameSite=Strict cookie
   - Refresh Token: Stored in HttpOnly, Secure, SameSite=Strict cookie
   - This prevents XSS attacks while allowing automatic cookie transmission

3. **Authentication Sequence**:
```mermaid
sequenceDiagram
participant Client
participant Server
Client->>Server : POST /api/v1/login {email, password}
Server->>Server : Validate credentials
Server->>Server : Generate JWT tokens
Server->>Client : 200 OK + Set-Cookie headers
Note over Client,Server : Tokens stored in HttpOnly cookies
Client->>Server : GET /api/v1/app-builder
Server->>Server : Verify access token
Server->>Client : 200 OK + app configuration
Client->>Server : GET /api/v1/auth/new-token
Server->>Server : Verify refresh token
Server->>Server : Generate new tokens
Server->>Client : 200 OK + Set-Cookie headers
```

**Diagram sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L80-L97)
- [main.ts](file://apps/server/src/main.ts#L28-L29)

## Request/Response Examples

### Successful Login
**Request**:
```json
POST /api/v1/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response**:
```json
HTTP/1.1 200 OK
Set-Cookie: accessToken=jwt.token.here; Path=/; HttpOnly; Secure; SameSite=Strict
Set-Cookie: refreshToken=refresh.token.here; Path=/; HttpOnly; Secure; SameSite=Strict

{
  "httpStatus": 200,
  "message": "로그인 성공",
  "data": {
    "accessToken": "jwt.token.here",
    "refreshToken": "refresh.token.here",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "mainTenantId": "456e7890-f12b-34c5-d678-901234567890"
  }
}
```

### Token Refresh
**Request**:
```json
POST /api/v1/auth/token/refresh
Cookie: refreshToken=refresh.token.here
```

**Response**:
```json
HTTP/1.1 200 OK
Set-Cookie: accessToken=new.jwt.token; Path=/; HttpOnly; Secure; SameSite=Strict
Set-Cookie: refreshToken=new.refresh.token; Path=/; HttpOnly; Secure; SameSite=Strict

{
  "httpStatus": 200,
  "message": "토큰 재발급 성공",
  "data": {
    "accessToken": "new.jwt.token",
    "refreshToken": "new.refresh.token",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "mainTenantId": "456e7890-f12b-34c5-d678-901234567890"
  }
}
```

### Authentication Error
**Response**:
```json
HTTP/1.1 401 Unauthorized

{
  "httpStatus": 401,
  "message": "이메일 또는 비밀번호가 일치하지 않습니다.",
  "data": null
}
```

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L78-L80)
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L110-L112)

## Security and Access Control

### CSRF Protection
The API implements CSRF protection through the following mechanisms:

- **HttpOnly Cookies**: JWT tokens are stored in HttpOnly cookies, preventing access via JavaScript and mitigating XSS attacks
- **SameSite Attribute**: Cookies are marked with SameSite=Strict to prevent CSRF attacks
- **Secure Flag**: Cookies are marked as Secure, ensuring they are only transmitted over HTTPS

### Public Route Accessibility
The API distinguishes between public and protected routes:

- **Public Routes** (no authentication required):
  - `/api/v1/login`
  - `/api/v1/auth/token/refresh`
  - `/api/v1/sign-up`
  
- **Protected Routes** (authentication required):
  - `/api/v1/app-builder`
  - `/api/v1/tenants/select`
  - `/api/v1/logout`
  - `/api/v1/auth/new-token`

### Role-Based Access Control
App-builder endpoints implement role-based access control:

- **Access Levels**:
  - Admin: Full access to all app-builder functionality
  - Editor: Access to modify configurations but not system settings
  - Viewer: Read-only access to app configuration

- **Implementation**:
  - Roles are validated through the `@ApiAuth()` decorator
  - Tenant context is enforced through the user's tenant associations
  - Permission checks occur at the service layer before processing requests

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L60-L61)
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L152-L153)
- [main.ts](file://apps/server/src/main.ts#L37-L42)

## Error Handling

### Standard Error Response Structure
All error responses follow a consistent structure:

```json
{
  "httpStatus": 401,
  "message": "Error description in Korean",
  "data": null
}
```

### Common Status Codes
- **200 OK**: Successful request
- **400 Bad Request**: Client sent invalid data (e.g., malformed JSON, invalid email format)
- **401 Unauthorized**: Authentication failed or token expired
- **403 Forbidden**: User lacks required permissions for the resource
- **429 Too Many Requests**: Rate limiting threshold exceeded
- **500 Internal Server Error**: Unexpected server error

### Authentication-Specific Errors
- **Invalid Credentials**: "이메일 또는 비밀번호가 일치하지 않습니다"
- **Token Expired**: "토큰이 만료되었습니다"
- **Invalid Token**: "토큰이 유효하지 않습니다"
- **Refresh Token Not Found**: "리프레시 토큰이 존재하지 않습니다"

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L31-L49)

## Curl Examples

### Authentication Flow
```bash
# 1. Login and receive tokens in cookies
curl -X POST https://api.example.com/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123!"
  }' \
  -c ./cookies.txt

# 2. Use stored cookies to access protected endpoint
curl -X GET https://api.example.com/api/v1/app-builder \
  -H "Content-Type: application/json" \
  -b ./cookies.txt

# 3. Refresh tokens when access token expires
curl -X POST https://api.example.com/api/v1/auth/token/refresh \
  -H "Content-Type: application/json" \
  -b ./cookies.txt \
  -c ./cookies.txt

# 4. Logout and clear all authentication cookies
curl -X POST https://api.example.com/api/v1/logout \
  -H "Content-Type: application/json" \
  -b ./cookies.txt \
  -c ./cookies.txt
```

### App Configuration Retrieval
```bash
# Retrieve application configuration with Bearer token
curl -X GET https://api.example.com/api/v1/app-builder \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"

# Alternative: Using cookies (after login)
curl -X GET https://api.example.com/api/v1/app-builder \
  -H "Content-Type: application/json" \
  -b "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; refreshToken=refresh.token.here"
```

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L80-L97)
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L113-L115)