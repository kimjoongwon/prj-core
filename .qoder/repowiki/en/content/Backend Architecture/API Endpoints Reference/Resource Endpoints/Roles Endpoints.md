# Roles Endpoints

<cite>
**Referenced Files in This Document**   
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts)
- [roles.service.ts](file://apps/server/src/shared/service/resources/roles.service.ts)
- [role.dto.ts](file://packages/dto/src/role.dto.ts)
- [createRoleDto.ts](file://packages/api/src/model/createRoleDto.ts)
- [updateRoleDto.ts](file://packages/api/src/model/updateRoleDto.ts)
- [role-association.dto.ts](file://packages/dto/src/role-association.dto.ts)
- [role-classification.dto.ts](file://packages/dto/src/role-classification.dto.ts)
- [abstract.dto.ts](file://packages/dto/src/abstract.dto.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [Request Schema](#request-schema)
4. [Response Structure](#response-structure)
5. [Endpoint Details](#endpoint-details)
6. [Query Parameters](#query-parameters)
7. [Error Handling](#error-handling)
8. [Examples](#examples)

## Introduction
This document provides comprehensive documentation for the role management RESTful API endpoints. The API enables CRUD operations for roles within the system, including creation, retrieval, updating, and deletion of roles. Roles are fundamental entities that define permissions and access levels within the application, and they can be associated with categories and groups to organize access control hierarchically.

The role management system supports pagination, filtering by category and group, and proper soft deletion mechanisms. All endpoints follow REST conventions and return standardized JSON responses with appropriate HTTP status codes.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L27-L88)

## Authentication and Authorization
All role management endpoints require authentication and administrative authorization. Users must be authenticated with a valid JWT token and possess administrative privileges to access these endpoints. The API enforces role-based access control (RBAC) at the service layer, ensuring that only authorized administrators can modify role configurations.

Protected operations such as creating, updating, or deleting roles are restricted to users with elevated permissions. The system validates user roles and permissions before processing any role modification requests, preventing unauthorized access to sensitive role management functionality.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L27-L88)
- [roles.service.ts](file://apps/server/src/shared/service/resources/roles.service.ts#L6-L49)

## Request Schema
The request schema for role operations includes the following properties:

- **name**: The role name, which must be one of the predefined role types (enum value)
- **serviceId**: Identifier for the service associated with the role
- **categoryId**: Identifier for the category to which the role belongs

When creating a role (POST), all fields are required. When updating a role (PATCH), fields are optional and only provided values will be updated.

```json
{
  "name": "ADMIN",
  "serviceId": "string",
  "categoryId": "string"
}
```

**Section sources**
- [createRoleDto.ts](file://packages/api/src/model/createRoleDto.ts#L9-L14)
- [updateRoleDto.ts](file://packages/api/src/model/updateRoleDto.ts#L9-L14)

## Response Structure
The response structure for role endpoints includes role details and associated metadata. The RoleDto extends AbstractDto, providing standard fields for all entities.

Response fields include:
- **id**: Unique identifier for the role
- **seq**: Sequence number
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update
- **removedAt**: Timestamp of soft deletion (nullable)
- **name**: Role name (enum value)
- **classification**: Role classification details including category association
- **associations**: Array of role associations with groups

```json
{
  "id": "string",
  "seq": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "removedAt": "2023-01-01T00:00:00.000Z",
  "name": "ADMIN",
  "classification": {
    "roleId": "string",
    "categoryId": "string",
    "category": {
      "id": "string",
      "seq": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "removedAt": "2023-01-01T00:00:00.000Z",
      "name": "string",
      "type": "ROLE"
    }
  },
  "associations": [
    {
      "roleId": "string",
      "groupId": "string",
      "group": {
        "id": "string",
        "seq": 0,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "removedAt": "2023-01-01T00:00:00.000Z",
        "name": "string",
        "type": "SYSTEM"
      }
    }
  ]
}
```

**Section sources**
- [role.dto.ts](file://packages/dto/src/role.dto.ts#L7-L17)
- [role-association.dto.ts](file://packages/dto/src/role-association.dto.ts#L5-L15)
- [role-classification.dto.ts](file://packages/dto/src/role-classification.dto.ts#L5-L21)
- [abstract.dto.ts](file://packages/dto/src/abstract.dto.ts#L3-L19)

## Endpoint Details

### GET /roles
Retrieves a paginated list of roles with optional filtering. Returns an array of RoleDto objects with pagination metadata in the response envelope.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L73-L87)

### GET /roles/:id
Retrieves a specific role by its ID. Returns a single RoleDto object with complete role details including associations and classification.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L38-L44)

### POST /roles
Creates a new role with the specified properties. Requires a CreateRoleDto in the request body. Returns the created RoleDto object.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L30-L36)

### PATCH /roles/:id
Updates an existing role with the provided properties. Only the fields included in the UpdateRoleDto will be modified. Returns the updated RoleDto object.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L46-L55)

### DELETE /roles/:id
Permanently deletes a role by its ID. This is a hard deletion operation that removes the role record from the database.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L65-L71)

### PATCH /roles/:id/removedAt
Soft deletes a role by setting the removedAt timestamp. The role record remains in the database but is marked as deleted. This allows for potential restoration and maintains referential integrity.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L57-L63)

## Query Parameters
The GET /roles endpoint supports the following query parameters for filtering and pagination:

- **page**: Page number for pagination (default: 1)
- **limit**: Number of items per page (default: 10)
- **categoryId**: Filter roles by category ID
- **groupId**: Filter roles by group ID
- **name**: Filter roles by role name (exact match)
- **sort**: Sort order for results (e.g., "createdAt:desc")

These parameters enable clients to retrieve specific subsets of roles based on category, group, or other criteria, with proper pagination support for large datasets.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L76-L87)
- [roles.service.ts](file://apps/server/src/shared/service/resources/roles.service.ts#L26-L33)

## Error Handling
The role management API implements standardized error handling with appropriate HTTP status codes:

- **400 Bad Request**: Returned when request validation fails, such as when there are permission conflicts in role assignments or invalid data is provided
- **403 Forbidden**: Returned when attempting to modify protected roles that cannot be altered by the current user
- **404 Not Found**: Returned when attempting to access a role with an ID that does not exist
- **500 Internal Server Error**: Returned for unexpected server errors during role operations

The API follows consistent error response patterns, providing clear error messages and codes to help clients understand and handle errors appropriately.

**Section sources**
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L30-L88)
- [roles.service.ts](file://apps/server/src/shared/service/resources/roles.service.ts#L10-L48)

## Examples

### Creating a Role with Ability Assignments
```bash
curl -X POST https://api.example.com/roles \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "EDITOR",
    "serviceId": "content-management",
    "categoryId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Updating Role Permissions
```bash
curl -X PATCH https://api.example.com/roles/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ADMIN",
    "categoryId": "550e8400-e29b-41d4-a716-446655440002"
  }'
```

### Retrieving Roles by Category
```bash
curl -X GET "https://api.example.com/roles?categoryId=550e8400-e29b-41d4-a716-446655440000&page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

**Section sources**
- [createRoleDto.ts](file://packages/api/src/model/createRoleDto.ts#L9-L14)
- [updateRoleDto.ts](file://packages/api/src/model/updateRoleDto.ts#L9-L14)
- [roles.controller.ts](file://apps/server/src/shared/controller/resources/roles.controller.ts#L73-L87)