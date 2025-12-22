# App Builder Endpoints

<cite>
**Referenced Files in This Document**   
- [app-builder.dto.ts](file://packages/schema/src/dto/app-builder.dto.ts)
- [route.dto.ts](file://packages/schema/src/dto/route.dto.ts)
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)
- [roles.decorator.ts](file://packages/schema/src/decorator/roles.decorator.ts)
- [tenants.controller.ts](file://apps/server/src/shared/controller/resources/tenants.controller.ts)
- [getAppBuilder200AllOf.ts](file://packages/api-client/src/model/getAppBuilder200AllOf.ts)
- [app.config.ts](file://apps/server/src/shared/config/app.config.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [App Builder Configuration Endpoint](#app-builder-configuration-endpoint)
3. [Role-Based Access Control](#role-based-access-control)
4. [Response Schema](#response-schema)
5. [Request/Response Examples](#requestresponse-examples)
6. [Required Headers](#required-headers)
7. [Status Codes](#status-codes)
8. [Error Response Patterns](#error-response-patterns)
9. [Caching Strategy](#caching-strategy)
10. [Rate Limiting Policies](#rate-limiting-policies)
11. [Curl Examples](#curl-examples)

## Introduction
This document provides comprehensive documentation for the App Builder endpoints in prj-core, which are responsible for retrieving application configuration, tenant-specific settings, and system metadata. The App Builder service provides dynamic routing information that enables the frontend applications to construct navigation menus and determine available functionality based on user roles and tenant configurations.

The endpoints follow RESTful principles and are protected by role-based access control mechanisms that ensure only authorized users can access configuration data appropriate to their privileges. The system supports multi-tenancy, with configuration data tailored to the requesting user's tenant context.

**Section sources**
- [app-builder.dto.ts](file://packages/schema/src/dto/app-builder.dto.ts)
- [route.dto.ts](file://packages/schema/src/dto/route.dto.ts)

## App Builder Configuration Endpoint
The primary endpoint for retrieving application configuration through the App Builder service provides a complete route structure that defines the application's navigation and available features.

```mermaid
flowchart TD
Client["Client Application"] --> |GET /app-builder| API["API Server"]
API --> |Authentication| Auth["Auth Service"]
API --> |Role Validation| Guard["RolesGuard"]
Guard --> |Check User Role| DB["Database"]
API --> |Fetch Configuration| Service["AppBuilder Service"]
Service --> |Return Routes| API
API --> |200 OK with AppBuilderDto| Client
```

**Diagram sources**
- [app-builder.dto.ts](file://packages/schema/src/dto/app-builder.dto.ts)
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)

### Endpoint Details
- **HTTP Method**: GET
- **URL Pattern**: `/app-builder`
- **Authentication**: Required (JWT Bearer token)
- **Authorization**: ADMIN or SYSTEM roles required
- **Response Format**: JSON
- **Cache Control**: Public, max-age=300 (5 minutes)

The endpoint returns a structured configuration object containing all available routes for the requesting user based on their role and tenant membership. The route structure is hierarchical, supporting nested navigation menus and feature grouping.

**Section sources**
- [app-builder.dto.ts](file://packages/schema/src/dto/app-builder.dto.ts)
- [route.dto.ts](file://packages/schema/src/dto/route.dto.ts)

## Role-Based Access Control
The App Builder endpoints implement role-based access control using the @Roles decorator and RolesGuard to enforce authorization policies. This ensures that users can only access configuration data appropriate to their assigned roles.

### Roles Decorator Implementation
The @Roles decorator is used to specify required roles for accessing protected endpoints. It leverages NestJS's metadata system to attach role requirements to controller methods.

```mermaid
classDiagram
class RolesGuard {
+reflector : Reflector
+canActivate(context : ExecutionContext) : boolean
}
class RolesDecorator {
+createDecorator<RolesEnum[]>()
}
class UserDto {
+tenants : TenantDto[]
+id : string
}
class TenantDto {
+role : RoleDto
+main : boolean
}
class RoleDto {
+name : Roles
}
RolesGuard --> RolesDecorator : "uses metadata from"
RolesGuard --> UserDto : "extracts from request"
UserDto --> TenantDto : "has many"
TenantDto --> RoleDto : "has"
RolesGuard --> RoleDto : "validates against"
```

**Diagram sources**
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)
- [roles.decorator.ts](file://packages/schema/src/decorator/roles.decorator.ts)
- [app-builder.dto.ts](file://packages/schema/src/dto/app-builder.dto.ts)

### Access Control Rules
The following roles are required to access App Builder configuration endpoints:

| Role | Access Level | Description |
|------|-------------|-------------|
| ADMIN | Full Access | Can view and potentially modify application configuration, navigation structure, and tenant settings |
| SYSTEM | Full Access | System-level access for automated processes and infrastructure components |

The RolesGuard validates access by:
1. Extracting the required roles from the route handler metadata
2. Retrieving the authenticated user from the request context
3. Checking the user's tenant assignments and associated roles
4. Verifying that the user's role matches one of the required roles
5. Denying access with a 403 error if requirements are not met

**Section sources**
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)
- [roles.decorator.ts](file://packages/schema/src/decorator/roles.decorator.ts)

## Response Schema
The App Builder endpoint returns configuration data structured according to the AppBuilderDto schema, which contains a hierarchical collection of route definitions.

### AppBuilderDto Schema
```json
{
  "routes": [
    {
      "name": "string",
      "relativePath": "string",
      "fullPath": "string",
      "icon": "string|null",
      "children": [
        "RouteDto[]|null"
      ]
    }
  ]
}
```

### RouteDto Properties
| Property | Type | Required | Description | Example |
|---------|------|----------|-------------|---------|
| name | string | Yes | Display name for the route | "Dashboard" |
| relativePath | string | Yes | Path relative to parent route | "dashboard" |
| fullPath | string | Yes | Complete path from root | "/admin/dashboard" |
| icon | string\|null | No | Icon identifier for UI display | "dashboard" |
| children | RouteDto[]\|null | No | Nested routes for hierarchical navigation | [...] |

The response follows the standard ResponseEntity pattern with the AppBuilderDto wrapped in a response envelope containing status information.

**Section sources**
- [app-builder.dto.ts](file://packages/schema/src/dto/app-builder.dto.ts)
- [route.dto.ts](file://packages/schema/src/dto/route.dto.ts)
- [getAppBuilder200AllOf.ts](file://packages/api-client/src/model/getAppBuilder200AllOf.ts)

## Request/Response Examples
This section provides concrete examples of requests and responses for the App Builder endpoint with different tenant configurations.

### Example 1: ADMIN Role Response
```json
{
  "httpStatus": 200,
  "message": "success",
  "data": {
    "routes": [
      {
        "name": "Dashboard",
        "relativePath": "dashboard",
        "fullPath": "/admin/dashboard",
        "icon": "dashboard",
        "children": null
      },
      {
        "name": "Users",
        "relativePath": "users",
        "fullPath": "/admin/users",
        "icon": "users",
        "children": [
          {
            "name": "Create User",
            "relativePath": "create",
            "fullPath": "/admin/users/create",
            "icon": "plus",
            "children": null
          }
        ]
      },
      {
        "name": "Settings",
        "relativePath": "settings",
        "fullPath": "/admin/settings",
        "icon": "settings",
        "children": null
      }
    ]
  }
}
```

### Example 2: SYSTEM Role Response
```json
{
  "httpStatus": 200,
  "message": "success",
  "data": {
    "routes": [
      {
        "name": "System Dashboard",
        "relativePath": "system-dashboard",
        "fullPath": "/system/dashboard",
        "icon": "server",
        "children": null
      },
      {
        "name": "Tenant Management",
        "relativePath": "tenants",
        "fullPath": "/system/tenants",
        "icon": "building",
        "children": [
          {
            "name": "Create Tenant",
            "relativePath": "create",
            "fullPath": "/system/tenants/create",
            "icon": "plus",
            "children": null
          },
          {
            "name": "Tenant Analytics",
            "relativePath": "analytics",
            "fullPath": "/system/tenants/analytics",
            "icon": "chart",
            "children": null
          }
        ]
      }
    ]
  }
}
```

**Section sources**
- [app-builder.dto.ts](file://packages/schema/src/dto/app-builder.dto.ts)
- [route.dto.ts](file://packages/schema/src/dto/route.dto.ts)

## Required Headers
Clients must include specific headers when making requests to the App Builder endpoints.

### Mandatory Headers
| Header | Value | Description |
|-------|-------|-------------|
| Authorization | Bearer {JWT_TOKEN} | JWT token obtained through authentication flow |
| Content-Type | application/json | Specifies JSON format for request/response |

### Optional Headers
| Header | Value | Description |
|-------|-------|-------------|
| X-Tenant-ID | {TENANT_ID} | Explicitly specify tenant context (defaults to user's main tenant) |
| Accept | application/json | Preferred response format |

The Authorization header is required for all requests to the App Builder endpoint. The JWT token must be valid and not expired. The token contains user identity and role information used by the RolesGuard for authorization.

**Section sources**
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)
- [app.config.ts](file://apps/server/src/shared/config/app.config.ts)

## Status Codes
The App Builder endpoint returns standard HTTP status codes to indicate the result of the request.

| Status Code | Meaning | Description |
|------------|--------|-------------|
| 200 | OK | Successful response with configuration data |
| 401 | Unauthorized | Missing or invalid authentication credentials |
| 403 | Forbidden | User lacks required roles to access the endpoint |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error occurred |

The most common successful response is 200 OK, which includes the AppBuilderDto in the response body. Error responses follow a consistent pattern with descriptive messages to aid troubleshooting.

**Section sources**
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)
- [app.config.ts](file://apps/server/src/shared/config/app.config.ts)

## Error Response Patterns
Error responses follow a consistent structure that includes status information and descriptive messages.

### Standard Error Format
```json
{
  "httpStatus": 403,
  "message": "이 작업을 수행하려면 다음 역할 중 하나가 필요합니다: ADMIN, SYSTEM. 현재 역할: USER",
  "data": null
}
```

### Common Error Scenarios
**401 Unauthorized**
```json
{
  "httpStatus": 401,
  "message": "인증된 사용자가 필요합니다.",
  "data": null
}
```

**403 Forbidden (Insufficient Permissions)**
```json
{
  "httpStatus": 403,
  "message": "이 작업을 수행하려면 다음 역할 중 하나가 필요합니다: ADMIN, SYSTEM. 현재 역할: USER",
  "data": null
}
```

**403 Forbidden (No Tenant Assignment)**
```json
{
  "httpStatus": 403,
  "message": "사용자에게 할당된 테넌트가 없습니다.",
  "data": null
}
```

**403 Forbidden (No Main Tenant)**
```json
{
  "httpStatus": 403,
  "message": "메인 테넌트가 설정되지 않았습니다.",
  "data": null
}
```

All error responses include a descriptive message in Korean (as shown in the code examples) that explains the reason for the failure, helping users and developers understand and resolve the issue.

**Section sources**
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)

## Caching Strategy
The App Builder configuration endpoint implements a caching strategy to improve performance and reduce server load.

### Cache Configuration
- **Cache Type**: HTTP-level caching with Cache-Control headers
- **Max Age**: 300 seconds (5 minutes)
- **Cache Key**: Based on user role, tenant, and authentication token
- **Cache Invalidation**: Automatic expiration; manual invalidation available via admin interface

### Cache Headers
```
Cache-Control: public, max-age=300
ETag: "abc123xyz"
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
```

The caching strategy balances freshness of configuration data with performance considerations. Since application configuration changes relatively infrequently, a 5-minute cache duration provides significant performance benefits while ensuring that configuration updates propagate to clients within a reasonable timeframe.

Client applications may implement additional client-side caching, but should respect the server-provided cache headers and implement cache-busting mechanisms when necessary.

**Section sources**
- [app.config.ts](file://apps/server/src/shared/config/app.config.ts)

## Rate Limiting Policies
The App Builder endpoints are protected by rate limiting policies to prevent abuse and ensure service availability.

### Rate Limit Configuration
| Parameter | Value | Description |
|---------|-------|-------------|
| Window Size | 15 minutes | Time window for rate limiting |
| Request Limit | 100 requests | Maximum requests per window |
| Scope | Per User | Limits applied to authenticated users |
| Burst Capacity | 10 requests | Allow short bursts within limits |

### Rate Limit Headers
When approaching rate limits, responses include additional headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1697854800
Retry-After: 840
```

Exceeding the rate limit results in a 429 Too Many Requests response with a Retry-After header indicating when the client can retry the request. The rate limiting policy is designed to accommodate normal application usage patterns while preventing denial-of-service scenarios.

**Section sources**
- [app.config.ts](file://apps/server/src/shared/config/app.config.ts)

## Curl Examples
This section provides curl command examples for retrieving application configuration from the App Builder endpoint.

### Basic Request with Authentication
```bash
curl -X GET "https://api.example.com/app-builder" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

### Request with Specific Tenant Context
```bash
curl -X GET "https://api.example.com/app-builder" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: tenant-12345"
```

### Verbose Request for Debugging
```bash
curl -X GET "https://api.example.com/app-builder" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -v
```

### Handling Rate Limits
```bash
# Check rate limit headers
curl -I "https://api.example.com/app-builder" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

These examples demonstrate proper authentication header usage and show how to include additional headers for specific use cases. The curl commands can be adapted for different environments and testing scenarios.

**Section sources**
- [app.config.ts](file://apps/server/src/shared/config/app.config.ts)
- [roles.guard.ts](file://apps/server/src/shared/guard/roles.guard.ts)