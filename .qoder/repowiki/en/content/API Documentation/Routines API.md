# Routines API

<cite>
**Referenced Files in This Document**   
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)
- [create-routine.dto.ts](file://packages/schema/src/dto/create/create-routine.dto.ts)
- [update-routine.dto.ts](file://packages/schema/src/dto/update/update-routine.dto.ts)
- [query-routine.dto.ts](file://packages/schema/src/dto/query/query-routine.dto.ts)
- [routine.dto.ts](file://packages/schema/src/dto/routine.dto.ts)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [Endpoint Overview](#endpoint-overview)
4. [Routine Creation](#routine-creation)
5. [Routine Retrieval](#routine-retrieval)
6. [Routine Update](#routine-update)
7. [Routine Deletion](#routine-deletion)
8. [Query Parameters](#query-parameters)
9. [Response Format](#response-format)
10. [Error Responses](#error-responses)
11. [Relationships with Other Entities](#relationships-with-other-entities)
12. [Sample Requests](#sample-requests)

## Introduction
The Routines API provides comprehensive functionality for managing workout routines within the fitness platform. This API enables clients to create, retrieve, update, and delete routines, with support for filtering, sorting, and pagination. Routines are core entities that organize exercises into structured workout plans and can be associated with programs, sessions, and other fitness components.

**Section sources**
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Authentication and Authorization
All endpoints in the Routines API require authentication via JWT (JSON Web Token). The token must be included in the Authorization header using the Bearer scheme. Authorization rules are enforced based on user roles and permissions. Users can only manage routines within their authorized scope, typically limited to their own tenant or organization. Administrative users have broader access privileges for routine management across multiple tenants.

**Section sources**
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Endpoint Overview
The Routines API provides RESTful endpoints for complete routine management:

| HTTP Method | Endpoint | Description |
|-----------|---------|-------------|
| POST | `/routines` | Create a new routine |
| GET | `/routines/{routineId}` | Retrieve a specific routine by ID |
| PATCH | `/routines/{routineId}` | Update a specific routine by ID |
| PATCH | `/routines/{routineId}/removedAt` | Soft delete a routine (mark as removed) |
| DELETE | `/routines/{routineId}` | Hard delete a routine (permanent removal) |
| GET | `/routines` | Retrieve a paginated list of routines with filtering options |

**Section sources**
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Routine Creation
Creates a new routine with the specified properties.

**HTTP Method**: POST  
**URL Pattern**: `/routines`

### Request Payload
The request body must contain a valid `CreateRoutineDto` object with the following required fields:

- `name`: string - The name of the routine (required)
- `description`: string - Detailed description of the routine (optional)
- `programId`: string - ID of the associated program (optional)
- `exerciseIds`: string[] - Array of exercise IDs to include in the routine (optional)
- `order`: number - Display order position (optional, default: 0)

All string fields are validated for proper formatting and length constraints. The routine name must be unique within the user's context.

**Section sources**
- [create-routine.dto.ts](file://packages/schema/src/dto/create/create-routine.dto.ts)
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Routine Retrieval
### Single Routine
Retrieves a specific routine by its unique identifier.

**HTTP Method**: GET  
**URL Pattern**: `/routines/{routineId}`

**Path Parameters**:
- `routineId`: string (required) - The unique identifier of the routine to retrieve

### Routine List
Retrieves a paginated list of routines with optional filtering and sorting.

**HTTP Method**: GET  
**URL Pattern**: `/routines`

**Query Parameters**: See [Query Parameters](#query-parameters) section for details.

**Section sources**
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)
- [routine.dto.ts](file://packages/schema/src/dto/routine.dto.ts)

## Routine Update
Updates an existing routine with new values.

**HTTP Method**: PATCH  
**URL Pattern**: `/routines/{routineId}`

**Path Parameters**:
- `routineId`: string (required) - The unique identifier of the routine to update

**Request Payload**:
The request body must contain an `UpdateRoutineDto` object with any of the following fields to update:
- `name`: string - Updated name of the routine
- `description`: string - Updated description
- `programId`: string - Updated program association
- `exerciseIds`: string[] - Updated list of exercise IDs
- `order`: number - Updated display order

Only the fields provided in the request will be updated; omitted fields remain unchanged.

**Section sources**
- [update-routine.dto.ts](file://packages/schema/src/dto/update/update-routine.dto.ts)
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Routine Deletion
The API provides two deletion methods: soft delete and hard delete.

### Soft Delete
Marks a routine as removed without permanently deleting it, allowing for potential restoration.

**HTTP Method**: PATCH  
**URL Pattern**: `/routines/{routineId}/removedAt`

**Path Parameters**:
- `routineId`: string (required) - The unique identifier of the routine to soft delete

### Hard Delete
Permanently removes a routine from the system. This operation cannot be undone.

**HTTP Method**: DELETE  
**URL Pattern**: `/routines/{routineId}`

**Path Parameters**:
- `routineId`: string (required) - The unique identifier of the routine to hard delete

**Section sources**
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Query Parameters
The GET `/routines` endpoint supports various query parameters for filtering, sorting, and pagination.

### Filtering Parameters
- `programId`: string - Filter routines by associated program ID
- `exerciseId`: string - Filter routines that contain a specific exercise
- `search`: string - Text search across routine name and description

### Sorting Parameters
- `orderBy`: string - Field to sort by (e.g., "name", "createdAt", "order")
- `order`: "ASC" or "DESC" - Sort direction

### Pagination Parameters
- `skip`: number - Number of records to skip (for pagination, default: 0)
- `take`: number - Maximum number of records to return (default: 10, maximum: 100)

**Section sources**
- [query-routine.dto.ts](file://packages/schema/src/dto/query/query-routine.dto.ts)
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Response Format
### Single Routine Response
Returns a `RoutineDto` object with the following structure:

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "programId": "string",
  "exerciseIds": ["string"],
  "order": 0,
  "createdAt": "string",
  "updatedAt": "string",
  "removedAt": "string"
}
```

**Status Code**: 200 OK

### Paginated List Response
Returns a wrapped response containing routines and pagination metadata:

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "programId": "string",
      "exerciseIds": ["string"],
      "order": 0,
      "createdAt": "string",
      "updatedAt": "string",
      "removedAt": "string"
    }
  ],
  "message": "success",
  "meta": {
    "currentPage": 0,
    "perPage": 10,
    "total": 0
  }
}
```

**Status Code**: 200 OK

**Section sources**
- [routine.dto.ts](file://packages/schema/src/dto/routine.dto.ts)
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Error Responses
The API returns standardized error responses with appropriate HTTP status codes:

| Status Code | Error Type | Description |
|-----------|-----------|-------------|
| 400 | Bad Request | Invalid request parameters or payload |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions to perform the operation |
| 404 | Not Found | Requested routine does not exist |
| 409 | Conflict | Resource conflict (e.g., duplicate routine name) |
| 500 | Internal Server Error | Unexpected server error |

Error responses follow the standard response entity format with error details in the message field.

**Section sources**
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)

## Relationships with Other Entities
Routines are connected to several other entities in the system:

- **Programs**: A routine can belong to a program, establishing a hierarchical relationship where programs contain multiple routines.
- **Exercises**: Routines contain references to exercises, defining the specific movements and activities included in the routine.
- **Sessions**: Routines can be scheduled in sessions, linking the planned workout to a specific time and date.
- **Users**: Routines may be associated with users who created them or are assigned to follow them.

These relationships enable the creation of comprehensive fitness plans that integrate various components of the platform.

**Section sources**
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)
- [routine.dto.ts](file://packages/schema/src/dto/routine.dto.ts)

## Sample Requests
### Create a Routine
```bash
curl -X POST https://api.example.com/routines \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Full Body Workout",
    "description": "Complete full body routine",
    "programId": "prog_123",
    "exerciseIds": ["ex_456", "ex_789"],
    "order": 1
  }'
```

### Get All Routines with Pagination
```bash
curl -X GET "https://api.example.com/routines?skip=0&take=10&orderBy=name&order=ASC" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update a Routine
```bash
curl -X PATCH https://api.example.com/routines/rtn_123 \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for full body workout"
  }'
```

### Soft Delete a Routine
```bash
curl -X PATCH https://api.example.com/routines/rtn_123/removedAt \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Section sources**
- [routines.controller.ts](file://apps/server/src/shared/controller/resources/routines.controller.ts)