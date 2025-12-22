# User Management Endpoints

<cite>
**Referenced Files in This Document**   
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)
- [create-user.dto.ts](file://packages/dto/src/create/create-user.dto.ts)
- [update-user.dto.ts](file://packages/dto/src/update/update-user.dto.ts)
- [query-user.dto.ts](file://packages/dto/src/query/query-user.dto.ts)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts)
- [user.entity.ts](file://packages/entity/src/user.entity.ts)
- [user-associations.module.ts](file://apps/server/src/module/user-associations.module.ts)
- [user-classifications.module.ts](file://apps/server/src/module/user-classifications.module.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [User CRUD Operations](#user-crud-operations)
4. [User Classification Management](#user-classification-management)
5. [User Association Management](#user-association-management)
6. [Query Parameters](#query-parameters)
7. [Response Format](#response-format)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Request Examples](#request-examples)

## Introduction

The User Management API provides comprehensive endpoints for managing user accounts within the prj-core system. This documentation covers all RESTful endpoints for user creation, retrieval, updating, and deletion, as well as classification and association management. The API follows standard REST conventions and returns JSON responses with consistent formatting.

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts)

## Authentication and Authorization

All user management endpoints require authentication via JWT tokens. The system implements role-based access control (RBAC) to determine permissions for various operations.

### Authentication Method
- **JWT Token**: Required for all endpoints
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `accessToken` cookie is also accepted

### Access Permissions
- **Admin Role**: Full access to all user operations
- **Manager Role**: Read access to user list, limited update capabilities
- **User Role**: Only allowed to update their own profile information

### Required Headers
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts)

## User CRUD Operations

### Create User
Creates a new user account.

- **HTTP Method**: POST
- **URL Pattern**: `/users`
- **Authentication**: Required (Admin role)
- **Request Body**: `CreateUserDto`

#### Request Parameters
| Parameter | Type | Required | Description | Constraints |
|---------|------|----------|-------------|------------|
| email | string | Yes | User's email address | Must be valid email format |
| name | string | Yes | Full name of the user | Minimum 2 characters |
| phone | string | No | Contact phone number | Valid phone format |
| password | string | Yes | User password | Minimum 8 characters, includes uppercase, lowercase, number, and special character |

#### Response Schema
Returns `UserDto` object with created user information.

**Status Codes**
- `200 OK`: User created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `409 Conflict`: Email already exists

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L35-L43)
- [create-user.dto.ts](file://packages/dto/src/create/create-user.dto.ts)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)

### Get User
Retrieves a specific user by ID.

- **HTTP Method**: GET
- **URL Pattern**: `/users/:userId`
- **Authentication**: Required
- **Path Parameters**: `userId` (string)

#### Response Schema
Returns `UserDto` object with user information including associated tenants and profiles.

**Status Codes**
- `200 OK`: User retrieved successfully
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User not found

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L45-L51)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)

### Update User
Updates an existing user's information.

- **HTTP Method**: PATCH
- **URL Pattern**: `/users/:userId`
- **Authentication**: Required
- **Path Parameters**: `userId` (string)
- **Request Body**: `UpdateUserDto`

#### Request Parameters
All parameters are optional. Only provided fields will be updated.

| Parameter | Type | Description | Constraints |
|---------|------|-------------|------------|
| name | string | Full name of the user | Minimum 2 characters |
| phone | string | Contact phone number | Valid phone format |
| password | string | User password | Minimum 8 characters with complexity requirements |

#### Response Schema
Returns `UserDto` object with updated user information.

**Status Codes**
- `200 OK`: User updated successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User not found

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L64-L73)
- [update-user.dto.ts](file://packages/dto/src/update/update-user.dto.ts)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)

### Delete User
Permanently deletes a user account.

- **HTTP Method**: DELETE
- **URL Pattern**: `/users/:userId`
- **Authentication**: Required (Admin role)
- **Path Parameters**: `userId` (string)

#### Response Schema
Returns `UserDto` object of the deleted user.

**Status Codes**
- `200 OK`: User deleted successfully
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User not found

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L83-L89)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)

### Soft Delete User
Marks a user as removed without permanent deletion.

- **HTTP Method**: PATCH
- **URL Pattern**: `/users/:userId/removedAt`
- **Authentication**: Required (Admin role)
- **Path Parameters**: `userId` (string)

#### Response Schema
Returns `UserDto` object with updated user information (removedAt timestamp set).

**Status Codes**
- `200 OK`: User marked as removed successfully
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User not found

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L75-L81)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)

## User Classification Management

The system supports user classification through role-based assignments. Users are classified based on their roles within specific tenants.

### Classification Structure
- **Role**: Defines permissions and capabilities
- **Tenant**: Organizational unit or workspace
- **Main Tenant**: Primary organizational context for the user

Users can belong to multiple tenants with different roles in each.

**Section sources**
- [user.dto.ts](file://packages/dto/src/user.dto.ts#L40-L45)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L60-L93)

## User Association Management

Users can have various associations within the system, including connections to other entities and resources.

### Association Endpoints
The user-associations module handles relationships between users and other system entities.

- **HTTP Method**: Various (CRUD operations)
- **URL Pattern**: `/user-associations`
- **Authentication**: Required
- **Authorization**: Role-based access control

Associations include connections to spaces, programs, routines, and other system resources.

**Section sources**
- [user-associations.module.ts](file://apps/server/src/module/user-associations.module.ts)
- [user.dto.ts](file://packages/dto/src/user.dto.ts#L47-L52)

## Query Parameters

### List Users
Retrieves a list of users with filtering, sorting, and pagination.

- **HTTP Method**: GET
- **URL Pattern**: `/users`
- **Authentication**: Required
- **Query Parameters**: `QueryUserDto`

#### Supported Query Parameters
| Parameter | Type | Default | Description |
|---------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Number of items per page |
| createdAtSortOrder | SortOrder | DESC | Sort order by creation date (ASC/DESC) |
| email | string | - | Filter by email address |
| name | string | - | Filter by user name |
| tenantId | string | - | Filter by tenant ID |
| roleId | string | - | Filter by role ID |

#### Response Schema
Returns paginated list of `UserDto` objects with metadata.

```json
{
  "data": [
    {
      "id": "string",
      "spaceId": "string",
      "email": "string",
      "name": "string",
      "phone": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "tenants": [
        {
          "id": "string",
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "main": "boolean",
          "createdAt": "string"
        }
      ],
      "profiles": [
        {
          "id": "string",
          "userId": "string",
          "firstName": "string",
          "lastName": "string",
          "birthDate": "string",
          "gender": "string"
        }
      ]
    }
  ],
  "meta": {
    "message": "success",
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 45
  }
}
```

**Status Codes**
- `200 OK`: Users retrieved successfully
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L91-L115)
- [query-user.dto.ts](file://packages/dto/src/query/query-user.dto.ts)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L29-L47)

## Response Format

All API responses follow a consistent format using the `ResponseEntity` pattern.

### Success Response
```json
{
  "data": {},
  "meta": {
    "message": "success",
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Response Fields
| Field | Type | Description |
|------|------|-------------|
| data | object/array | The main response payload |
| meta | object | Metadata about the response |
| meta.message | string | Status message |
| meta.page | number | Current page number |
| meta.limit | number | Items per page |
| meta.totalPages | number | Total number of pages |
| meta.totalItems | number | Total number of items |

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L109-L115)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L29-L47)

## Error Handling

The API returns standardized error responses for various error conditions.

### Common Error Codes
| Status Code | Error Type | Description | Resolution |
|-----------|-----------|-------------|------------|
| 400 | Bad Request | Invalid request parameters or body | Validate input data format |
| 401 | Unauthorized | Missing or invalid authentication | Include valid JWT token |
| 403 | Forbidden | Insufficient permissions | Check user role and permissions |
| 404 | Not Found | Resource not found | Verify resource ID exists |
| 409 | Conflict | Resource already exists | Check for duplicates |
| 422 | Unprocessable Entity | Validation failed | Review validation constraints |
| 429 | Too Many Requests | Rate limit exceeded | Wait and retry later |
| 500 | Internal Server Error | Unexpected server error | Contact support |

### Validation Rules
- **Email**: Must match RFC 5322 standard
- **Password**: Minimum 8 characters with at least one uppercase, lowercase, number, and special character
- **Name**: Minimum 2 characters, maximum 100 characters
- **Phone**: Valid international phone number format

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)
- [create-user.dto.ts](file://packages/dto/src/create/create-user.dto.ts)

## Rate Limiting

The API implements rate limiting to prevent abuse and ensure system stability.

### Rate Limit Rules
| Endpoint | Limit | Window | Notes |
|--------|-------|--------|-------|
| POST /users | 10 requests | 1 hour | Per IP address |
| POST /auth/login | 5 requests | 15 minutes | Per email address |
| POST /auth/password-reset | 3 requests | 24 hours | Per email address |

Exceeding rate limits returns a `429 Too Many Requests` status code with retry-after header.

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L35-L43)
- [auth.controller.ts](file://apps/server/src/shared/controller/domains/auth.controller.ts)

## Request Examples

### Create User (curl)
```bash
curl -X POST https://api.prj-core.com/users \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "+1-555-0123",
    "password": "SecurePass123!"
  }'
```

### Create User (Postman)
```http
POST /users HTTP/1.1
Host: api.prj-core.com
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "email": "jane.smith@example.com",
  "name": "Jane Smith",
  "phone": "+1-555-0456",
  "password": "AnotherSecurePass456!"
}
```

### Update User Profile
```bash
curl -X PATCH https://api.prj-core.com/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated Name",
    "phone": "+1-555-0789"
  }'
```

### List Users with Filtering
```bash
curl -X GET "https://api.prj-core.com/users?page=1&limit=20&createdAtSortOrder=DESC&tenantId=abc123" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Get Specific User
```bash
curl -X GET https://api.prj-core.com/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts)
- [create-user.dto.ts](file://packages/dto/src/create/create-user.dto.ts)
- [update-user.dto.ts](file://packages/dto/src/update/update-user.dto.ts)