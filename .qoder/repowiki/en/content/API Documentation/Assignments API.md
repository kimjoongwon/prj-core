# Assignments API

<cite>
**Referenced Files in This Document**   
- [assignment.dto.ts](file://packages/schema/src/dto/assignment.dto.ts)
- [create-assignment.dto.ts](file://packages/schema/src/dto/create/create-assignment.dto.ts)
- [query-assignment.dto.ts](file://packages/schema/src/dto/query/query-assignment.dto.ts)
- [update-assignment.dto.ts](file://packages/schema/src/dto/update/update-assignment.dto.ts)
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts)
- [assignments.repository.ts](file://apps/server/src/shared/repository/assignments.repository.ts)
- [assignment.module.ts](file://apps/server/src/module/assignment.module.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [Request and Response Format](#request-and-response-format)
4. [Assignment Creation](#assignment-creation)
5. [Retrieve Assignment](#retrieve-assignment)
6. [Query Assignments](#query-assignments)
7. [Update Assignment](#update-assignment)
8. [Remove Assignment](#remove-assignment)
9. [Delete Assignment](#delete-assignment)
10. [Relationships with Other Entities](#relationships-with-other-entities)
11. [Error Handling](#error-handling)
12. [Examples](#examples)

## Introduction

The Assignments API provides CRUD operations for managing role assignments within the system. Assignments link roles to tenants, establishing permissions and access controls for users within specific organizational contexts. This API enables creation, retrieval, updating, and deletion of assignments with comprehensive filtering, sorting, and pagination capabilities.

The API follows RESTful principles with predictable URL patterns and standard HTTP methods. All endpoints require authentication via JWT tokens and appropriate role-based permissions for access.

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L25-L88)
- [assignment.module.ts](file://apps/server/src/module/assignment.module.ts#L1-L13)

## Authentication and Authorization

All endpoints in the Assignments API require authentication using JWT (JSON Web Tokens). Clients must include a valid JWT in the Authorization header of each request:

```
Authorization: Bearer <JWT_TOKEN>
```

Access to assignment operations is controlled by role-based permissions. Users must have appropriate privileges to perform CRUD operations on assignments. The exact permission requirements depend on the user's role and the target tenant context.

The API leverages the system's authentication and authorization framework to validate user identities and check permissions before processing requests. Unauthorized requests will receive a 401 Unauthorized or 403 Forbidden response depending on whether the user is authenticated but lacks sufficient privileges.

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L1-L88)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L1-L57)

## Request and Response Format

The Assignments API uses JSON for request and response payloads. All successful responses follow a standardized format that includes data, metadata, and status information.

### Response Structure

Successful responses return data in a wrapped format that includes pagination metadata when applicable:

```json
{
  "data": {},
  "meta": {
    "message": "success",
    "pageMeta": {
      "skip": 0,
      "take": 10,
      "count": 1
    }
  },
  "httpStatus": 200
}
```

### Common Response Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters or body |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Unexpected server error |

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L32-L37)
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L76-L85)

## Assignment Creation

Creates a new assignment linking a role to a tenant.

### Endpoint
```
POST /assignments
```

### Request Body

The request body must contain the role ID and tenant ID to create the assignment.

```json
{
  "roleId": "string",
  "tenantId": "string"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| roleId | string (UUID) | Yes | The ID of the role to assign |
| tenantId | string (UUID) | Yes | The ID of the tenant for the assignment |

### Response

Returns the created assignment with all properties.

**HTTP Status**: 200 OK

```json
{
  "data": {
    "id": "string",
    "roleId": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "removedAt": "string"
  }
}
```

**Section sources**
- [create-assignment.dto.ts](file://packages/schema/src/dto/create/create-assignment.dto.ts)
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L30-L37)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L20-L24)

## Retrieve Assignment

Retrieves a specific assignment by its ID.

### Endpoint
```
GET /assignments/{assignmentId}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| assignmentId | string (UUID) | Yes | The ID of the assignment to retrieve |

### Response

Returns the requested assignment if found.

**HTTP Status**: 200 OK

```json
{
  "data": {
    "id": "string",
    "roleId": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "removedAt": "string",
    "role": {
      "id": "string",
      "name": "string",
      "type": "string"
    },
    "tenant": {
      "id": "string",
      "name": "string"
    }
  }
}
```

If the assignment is not found, returns 404 Not Found.

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L39-L46)
- [assignment.dto.ts](file://packages/schema/src/dto/assignment.dto.ts#L7-L19)

## Query Assignments

Retrieves a list of assignments with filtering, sorting, and pagination.

### Endpoint
```
GET /assignments
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| skip | number | No | Number of records to skip (for pagination) |
| take | number | No | Number of records to return (for pagination) |
| sortBy | string | No | Field to sort by (e.g., "createdAt", "updatedAt") |
| sortOrder | string | No | Sort order ("ASC" or "DESC") |
| roleId | string (UUID) | No | Filter by role ID |
| tenantId | string (UUID) | No | Filter by tenant ID |
| search | string | No | Text search across relevant fields |

### Response

Returns a paginated list of assignments with metadata.

**HTTP Status**: 200 OK

```json
{
  "data": [
    {
      "id": "string",
      "roleId": "string",
      "tenantId": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "removedAt": "string"
    }
  ],
  "meta": {
    "message": "success",
    "pageMeta": {
      "skip": 0,
      "take": 10,
      "count": 5
    }
  }
}
```

**Section sources**
- [query-assignment.dto.ts](file://packages/schema/src/dto/query/query-assignment.dto.ts)
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L74-L87)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L33-L42)

## Update Assignment

Updates an existing assignment. Note that the API does not expose a direct update endpoint in the controller, but the service supports updating assignments.

### Service Method
```typescript
updateById(id: string, updateAssignmentDto: UpdateAssignmentDto)
```

This functionality could be exposed through a PATCH or PUT endpoint to modify assignment properties when needed.

**Section sources**
- [update-assignment.dto.ts](file://packages/schema/src/dto/update/update-assignment.dto.ts)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L26-L31)

## Remove Assignment

Marks an assignment as removed by setting the removedAt timestamp (soft delete).

### Endpoint
```
PATCH /assignments/{assignmentId}/removedAt
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| assignmentId | string (UUID) | Yes | The ID of the assignment to remove |

### Response

Returns the updated assignment with the removedAt timestamp set.

**HTTP Status**: 200 OK

```json
{
  "data": {
    "id": "string",
    "roleId": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "removedAt": "string"
  }
}
```

### Bulk Remove

```
PATCH /assignments/removedAt
```

Removes multiple assignments by ID.

**Request Body**:
```json
["assignment-id-1", "assignment-id-2"]
```

**Response**: Returns the count of removed assignments.

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L48-L56)
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L58-L64)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L50-L55)

## Delete Assignment

Permanently deletes an assignment from the system.

### Endpoint
```
DELETE /assignments/{assignmentId}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| assignmentId | string (UUID) | Yes | The ID of the assignment to delete |

### Response

Returns the deleted assignment.

**HTTP Status**: 200 OK

```json
{
  "data": {
    "id": "string",
    "roleId": "string",
    "tenantId": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "removedAt": "string"
  }
}
```

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L66-L72)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L44-L48)

## Relationships with Other Entities

Assignments establish relationships between roles and tenants in the system.

### Role Relationship

Each assignment is linked to a role, which defines a set of permissions and capabilities. The role relationship is represented in the response when the role data is included:

```json
"role": {
  "id": "string",
  "name": "string",
  "type": "string"
}
```

### Tenant Relationship

Each assignment is associated with a tenant, which represents an organizational unit or customer in the system. The tenant relationship is represented in the response when the tenant data is included:

```json
"tenant": {
  "id": "string",
  "name": "string"
}
```

These relationships enable the system to determine user permissions based on their role assignments within specific tenant contexts.

**Section sources**
- [assignment.dto.ts](file://packages/schema/src/dto/assignment.dto.ts#L14-L18)
- [assignments.repository.ts](file://apps/server/src/shared/repository/assignments.repository.ts#L1-L94)

## Error Handling

The Assignments API returns standardized error responses for various failure scenarios.

### Common Error Responses

**400 Bad Request**
- Invalid UUID format in path or query parameters
- Missing required fields in request body
- Invalid values for enum fields

**401 Unauthorized**
- Missing or invalid JWT token in Authorization header
- Expired token

**403 Forbidden**
- User lacks sufficient permissions to perform the operation
- Attempting to access assignments outside permitted scope

**404 Not Found**
- Assignment with specified ID does not exist
- Referenced role or tenant does not exist (for creation)

**500 Internal Server Error**
- Unexpected server-side errors
- Database connectivity issues

Error responses follow the same structure as success responses but with appropriate HTTP status codes and error messages in the meta section.

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L30-L88)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L14-L57)

## Examples

### Create Assignment

```bash
curl -X POST https://api.example.com/assignments \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": "c3a5b6e2-4f8d-4e9a-9b7a-1d2c3a4b5c6d",
    "tenantId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
  }'
```

### Get Assignment by ID

```bash
curl -X GET https://api.example.com/assignments/c3a5b6e2-4f8d-4e9a-9b7a-1d2c3a4b5c6d \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Query Assignments with Pagination

```bash
curl -X GET "https://api.example.com/assignments?skip=0&take=10&sortBy=createdAt&sortOrder=DESC" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Remove Assignment (Soft Delete)

```bash
curl -X PATCH https://api.example.com/assignments/c3a5b6e2-4f8d-4e9a-9b7a-1d2c3a4b5c6d/removedAt \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Delete Assignment (Permanent)

```bash
curl -X DELETE https://api.example.com/assignments/c3a5b6e2-4f8d-4e9a-9b7a-1d2c3a4b5c6d \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Section sources**
- [assignments.controller.ts](file://apps/server/src/shared/controller/resources/assignments.controller.ts#L30-L88)
- [assignments.service.ts](file://apps/server/src/shared/service/resources/assignments.service.ts#L20-L57)