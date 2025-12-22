# Authentication API

<cite>
**Referenced Files in This Document**   
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)
- [auth.facade.ts](file://apps/server/src/shared/service/facade/auth.facade.ts)
- [auth.domain.ts](file://apps/server/src/shared/service/domain/auth.domain.ts)
- [login-payload.dto.ts](file://packages/schema/src/dto/auth/login-payload.dto.ts)
- [sign-up-payload.dto.ts](file://packages/schema/src/dto/auth/sign-up-payload.dto.ts)
- [token.dto.ts](file://packages/schema/src/dto/auth/token.dto.ts)
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts)
- [auth.config.ts](file://apps/server/src/shared/config/auth.config.ts)
- [cookie.util.ts](file://apps/server/src/shared/utils/cookie.util.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Request Payload Structure](#request-payload-structure)
4. [Response Formats](#response-formats)
5. [Authentication Flow](#authentication-flow)
6. [Token Management](#token-management)
7. [Security Considerations](#security-considerations)
8. [Error Handling](#error-handling)
9. [Sample Requests](#sample-requests)

## Introduction
The Authentication API provides secure user authentication services for the application. It implements JWT-based authentication with access and refresh tokens, following industry best practices for security. The API supports user login, logout, token refresh, and registration operations. All authentication endpoints are designed to work seamlessly with HTTP-only cookies for enhanced security against XSS attacks.

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L53-L254)

## Authentication Endpoints

### Login Endpoint
- **HTTP Method**: POST
- **URL**: `/login`
- **Description**: Authenticates a user with email and password credentials and returns JWT tokens
- **Authentication Required**: No (Public endpoint)
- **Response Status Codes**: 200 (Success), 400 (Bad Request), 401 (Unauthorized), 500 (Internal Server Error)

### Token Refresh Endpoint
- **HTTP Method**: POST
- **URL**: `/token/refresh`
- **Description**: Uses a refresh token to generate new access and refresh tokens
- **Authentication Required**: No (Public endpoint, but requires refresh token in cookies)
- **Response Status Codes**: 200 (Success), 401 (Unauthorized), 500 (Internal Server Error)

### New Token Endpoint
- **HTTP Method**: GET
- **URL**: `/new-token`
- **Description**: Refreshes tokens for an already authenticated user
- **Authentication Required**: Yes (Requires valid access token)
- **Response Status Codes**: 200 (Success), 401 (Unauthorized), 500 (Internal Server Error)

### Sign Up Endpoint
- **HTTP Method**: POST
- **URL**: `/sign-up`
- **Description**: Creates a new user account and returns authentication tokens
- **Authentication Required**: No (Public endpoint)
- **Response Status Codes**: 201 (Created), 400 (Bad Request), 409 (Conflict), 500 (Internal Server Error)

### Verify Token Endpoint
- **HTTP Method**: GET
- **URL**: `/verify-token`
- **Description**: Validates the current access token's authenticity
- **Authentication Required**: Yes
- **Response Status Codes**: 200 (Success), 401 (Unauthorized)

### Logout Endpoint
- **HTTP Method**: POST
- **URL**: `/logout`
- **Description**: Logs out the current user and clears all authentication cookies
- **Authentication Required**: Yes
- **Response Status Codes**: 200 (Success)

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L60-L254)

## Request Payload Structure

### Login Request Payload
The login endpoint requires a JSON payload with email and password fields:

```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Validation Rules**:
- **Email**: Must be a valid email format (regex: `^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$`)
- **Password**: Must contain at least 8 characters with at least one letter, one number, and one special character (regex: `^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`)

### Sign Up Request Payload
The registration endpoint requires user information to create a new account:

```json
{
  "name": "John Doe",
  "nickname": "johndoe",
  "email": "john.doe@example.com",
  "password": "securePassword123!",
  "phone": "010-1234-5678",
  "spaceId": "uuid-string"
}
```

**Validation Rules**:
- All fields are required
- Email must be unique and in valid format
- Password must meet the same complexity requirements as login
- Phone number should follow the format `XXX-XXXX-XXXX`
- Space ID must be a valid UUID

**Section sources**
- [login-payload.dto.ts](file://packages/schema/src/dto/auth/login-payload.dto.ts#L34-L47)
- [sign-up-payload.dto.ts](file://packages/schema/src/dto/auth/sign-up-payload.dto.ts#L3-L22)

## Response Formats

### Successful Authentication Response
Upon successful login or registration, the API returns a TokenDto object containing both access and refresh tokens:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "010-1234-5678",
    "tenants": [
      {
        "id": "tenant-uuid",
        "main": true,
        "spaceId": "space-uuid"
      }
    ]
  },
  "mainTenantId": "tenant-uuid"
}
```

The tokens are also set as HTTP-only cookies in the response headers for enhanced security.

### Token Refresh Response
The token refresh endpoint returns the same TokenDto structure with new tokens:

```json
{
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token",
  "user": { /* user data */ },
  "mainTenantId": "tenant-uuid"
}
```

### Error Response Format
All error responses follow the ResponseEntity structure:

```json
{
  "success": false,
  "data": null,
  "meta": {
    "httpStatus": 401,
    "message": "Invalid credentials"
  }
}
```

**Section sources**
- [token.dto.ts](file://packages/schema/src/dto/auth/token.dto.ts#L5-L34)

## Authentication Flow

```mermaid
sequenceDiagram
participant Client
participant AuthController
participant AuthDomain
participant TokenService
Client->>AuthController : POST /login {email, password}
AuthController->>AuthDomain : validateUser(email, password)
AuthDomain->>AuthDomain : getByEmail(email)
AuthDomain->>PasswordService : validatePassword(password, hashedPassword)
PasswordService-->>AuthDomain : true/false
alt Valid credentials
AuthDomain->>TokenService : generateTokens({userId})
TokenService->>TokenService : sign JWT tokens
TokenService-->>AuthDomain : {accessToken, refreshToken}
AuthDomain-->>AuthController : User + Tokens
AuthController->>TokenService : setAccessTokenCookie()
AuthController->>TokenService : setRefreshTokenCookie()
TokenService-->>AuthController : Set-Cookie headers
AuthController-->>Client : 200 OK + TokenDto + Cookies
else Invalid credentials
AuthDomain-->>AuthController : UnauthorizedException
AuthController-->>Client : 401 Unauthorized
end
```

**Diagram sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L80-L97)
- [auth.domain.ts](file://apps/server/src/shared/service/domain/auth.domain.ts#L35-L56)
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts#L87-L92)

## Token Management

### JWT Token Structure
The system uses two types of JWT tokens:
- **Access Token**: Short-lived token for API access
- **Refresh Token**: Long-lived token for obtaining new access tokens

Both tokens contain a payload with the user ID and standard JWT claims (iss, exp, iat).

### Token Expiration
Token expiration is configured through environment variables:
- **Access Token**: Configured by `AUTH_JWT_TOKEN_EXPIRES_IN` (typically 15 minutes)
- **Refresh Token**: Configured by `AUTH_JWT_TOKEN_REFRESH_IN` (typically 7 days)

The expiration values support human-readable formats like "15m", "7d", "24h", or numeric seconds.

### Cookie Configuration
Tokens are stored in HTTP-only cookies with the following security settings:
- **httpOnly**: true (prevents client-side JavaScript access)
- **secure**: true in production (HTTPS only)
- **sameSite**: strict (prevents CSRF attacks)
- **path**: / (available across the entire domain)

```mermaid
flowchart TD
A[Authentication Request] --> B{Valid Credentials?}
B --> |Yes| C[Generate Access Token]
B --> |No| D[Return 401 Unauthorized]
C --> E[Generate Refresh Token]
E --> F[Set HTTP-only Cookies]
F --> G[Return Token Response]
H[Subsequent Requests] --> I{Has Valid Access Token?}
I --> |Yes| J[Process Request]
I --> |No| K{Has Valid Refresh Token?}
K --> |Yes| L[Generate New Tokens]
L --> M[Set New Cookies]
M --> J
K --> |No| N[Return 401 Unauthorized]
```

**Diagram sources**
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts#L46-L55)
- [cookie.util.ts](file://apps/server/src/shared/utils/cookie.util.ts#L55-L72)

**Section sources**
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts#L17-L119)
- [auth.config.ts](file://apps/server/src/shared/config/auth.config.ts#L20-L39)

## Security Considerations

### Password Handling
- Passwords are hashed using bcrypt with configurable salt rounds
- The default salt round is 10, configurable via `AUTH_JWT_SALT_ROUNDS` environment variable
- Password validation is performed server-side with constant-time comparison

### Rate Limiting
While not explicitly implemented in the provided code, the architecture supports rate limiting integration through NestJS guards and middleware. Recommended rate limiting policies:
- 5 failed login attempts per minute per IP address
- 100 authentication requests per hour per IP address
- Progressive delays after repeated failed attempts

### Brute Force Protection
The system should implement the following brute force protection measures:
- Account lockout after 10 consecutive failed login attempts
- CAPTCHA challenge after 5 failed attempts
- Monitoring and alerting for suspicious authentication patterns

### Secure Token Storage
- Access and refresh tokens are stored in HTTP-only, secure cookies
- Refresh tokens are rotated on each use (implement server-side token revocation tracking)
- Tokens are validated on every authenticated request
- Token secrets are stored in environment variables (`AUTH_JWT_SECRET`)

**Section sources**
- [password.service.ts](file://apps/server/src/shared/service/utils/password.service.ts#L10-L18)
- [token.service.ts](file://apps/server/src/shared/service/utils/token.service.ts#L73-L92)

## Error Handling

### Authentication Error Codes
The API returns specific error messages for different authentication scenarios:

| Status Code | Error Code | Message |
|-----------|----------|--------|
| 400 | INVALID_EMAIL_OR_PASSWORD_FORMAT | "이메일 또는 비밀번호 형식이 올바르지 않습니다" |
| 401 | INVALID_CREDENTIALS | "이메일 또는 비밀번호가 일치하지 않습니다" |
| 401 | REFRESH_TOKEN_NOT_FOUND | "리프레시 토큰이 존재하지 않습니다" |
| 401 | REFRESH_TOKEN_EXPIRED | "리프레시 토큰이 만료되었습니다" |
| 401 | TOKEN_INVALID | "토큰이 유효하지 않습니다" |
| 404 | USER_NOT_FOUND | "사용자를 찾을 수 없습니다" |
| 400 | INVALID_SIGNUP_FORMAT | "입력 형식이 올바르지 않습니다" |
| 409 | EMAIL_ALREADY_EXISTS | "이미 사용 중인 이메일입니다" |

### Error Response Structure
All errors follow a consistent ResponseEntity format with success flag, null data, and metadata containing the HTTP status and message.

```mermaid
stateDiagram-v2
[*] --> Idle
Idle --> LoginAttempt : User submits credentials
LoginAttempt --> AuthenticationSuccess : Valid credentials
LoginAttempt --> InvalidFormatError : Email/password format invalid
LoginAttempt --> InvalidCredentialsError : Credentials don't match
AuthenticationSuccess --> TokenIssuance
TokenIssuance --> CookieSetting
CookieSetting --> ResponseSent
ResponseSent --> [*]
InvalidFormatError --> ResponseSent
InvalidCredentialsError --> ResponseSent
</mermaid>
**Diagram sources**
- [auth.controller.ts](file : //apps/server/src/shared/controller/domains/auth.controller.ts#L31-L49)
- [auth.domain.ts](file : //apps/server/src/shared/service/domain/auth.domain.ts#L35-L56)
**Section sources**
- [auth.controller.ts](file : //apps/server/src/shared/controller/domains/auth.controller.ts#L31-L49)
## Sample Requests
### Login Request
```bash
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123!"
  }'
```

### Token Refresh Request
```bash
curl -X POST https://api.example.com/token/refresh \
  -H "Content-Type: application/json" \
  -b "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Registration Request
```bash
curl -X POST https://api.example.com/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "nickname": "johndoe",
    "email": "john.doe@example.com",
    "password": "securePassword123!",
    "phone": "010-1234-5678",
    "spaceId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
  }'
```

### Verify Token Request
```bash
curl -X GET https://api.example.com/verify-token \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Logout Request
```bash
curl -X POST https://api.example.com/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Section sources**
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts#L60-L254)