# Sessions Endpoints

<cite>
**Referenced Files in This Document**   
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts)
- [session.dto.ts](file://packages/dto/src/session.dto.ts)
- [create-session.dto.ts](file://packages/dto/src/create/create-session.dto.ts)
- [update-session.dto.ts](file://packages/dto/src/update/update-session.dto.ts)
- [query-session.dto.ts](file://packages/dto/src/query/query-session.dto.ts)
- [session.entity.ts](file://packages/entity/src/session.entity.ts)
- [session-types.enum.ts](file://packages/enum/src/session-types.enum.ts)
- [response.util.ts](file://apps/server/src/shared/util/response.util.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [Request Schema](#request-schema)
4. [Response Structure](#response-structure)
5. [Endpoint Details](#endpoint-details)
   - [GET /sessions](#get-sessions)
   - [GET /sessions/:id](#get-sessionsid)
   - [POST /sessions](#post-sessions)
   - [PATCH /sessions/:id](#patch-sessionsid)
   - [DELETE /sessions/:id](#delete-sessionsid)
6. [Error Handling](#error-handling)
7. [Examples](#examples)
   - [Creating a Recurring Session](#creating-a-recurring-session)
   - [Updating Session Schedule](#updating-session-schedule)
   - [Curl Examples](#curl-examples)

## Introduction
This document provides comprehensive documentation for the session management endpoints in the RESTful API. The session management system enables creation, retrieval, updating, and deletion of sessions with support for various session types, scheduling options, and filtering capabilities. Sessions are associated with routines (via timelineId) and can be configured as one-time or recurring events.

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L26-L99)
- [session.dto.ts](file://packages/dto/src/session.dto.ts#L22-L55)

## Authentication and Authorization
All session endpoints require authentication via a valid JWT token in the Authorization header. The API uses token-based authentication where clients must include the token in the request header:

```
Authorization: Bearer <your-jwt-token>
```

Authorization is enforced through role-based access control, where users must have appropriate permissions to perform operations on sessions. The specific permissions required depend on the user's role and the session's associated resources.

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L1-L99)

## Request Schema
The request schema for session operations is defined by DTOs (Data Transfer Objects) that validate and structure the input data.

### Create Session Request Schema
When creating a session, the following fields are required or optional:

- **type** (string, required): Session type - one of "ONE_TIME" or "RECURRING"
- **timelineId** (string, required): UUID reference to the associated routine/timeline
- **name** (string, required): Session name
- **startDateTime** (string, optional): ISO 8601 datetime for session start
- **endDateTime** (string, optional): ISO 8601 datetime for session end
- **repeatCycleType** (string, optional): For recurring sessions - frequency type
- **recurringDayOfWeek** (string, optional): For weekly recurring sessions - day of week
- **description** (string, optional): Session description

### Update Session Request Schema
The update operation uses a partial update pattern, allowing modification of specific fields:

- All fields from Create Session Request Schema are optional
- Only provided fields will be updated
- Fields not included in the request remain unchanged

### Query Parameters for List Endpoint
The GET /sessions endpoint supports the following query parameters:

- **timelineId** (string, optional): Filter by routine/timeline ID
- **startDateTimeSortOrder** (string, optional): Sort order for startDateTime - "ASC" or "DESC" (default: "DESC")
- **skip** (number, optional): Number of records to skip for pagination
- **take** (number, optional): Number of records to return for pagination

**Section sources**
- [create-session.dto.ts](file://packages/dto/src/create/create-session.dto.ts#L5-L9)
- [update-session.dto.ts](file://packages/dto/src/update/update-session.dto.ts#L4)
- [query-session.dto.ts](file://packages/dto/src/query/query-session.dto.ts#L5-L11)
- [session.dto.ts](file://packages/dto/src/session.dto.ts#L22-L55)

## Response Structure
All successful responses follow a standardized wrapper format that includes data, metadata, and status information.

```json
{
  "data": {},
  "meta": {
    "message": "success",
    "meta": {
      "skip": 0,
      "take": 10,
      "count": 1
    }
  }
}
```

### Session Response Object
The session response object contains the following properties:

- **id** (string): Unique session identifier (UUID)
- **type** (string): Session type - "ONE_TIME" or "RECURRING"
- **timelineId** (string): Associated routine/timeline identifier
- **name** (string): Session name
- **startDateTime** (string): ISO 8601 datetime for session start
- **endDateTime** (string): ISO 8601 datetime for session end
- **repeatCycleType** (string, nullable): Recurrence pattern type
- **recurringDayOfWeek** (string, nullable): Day of week for recurring sessions
- **description** (string, nullable): Session description
- **createdAt** (string): ISO 8601 datetime of creation
- **updatedAt** (string): ISO 8601 datetime of last update
- **removedAt** (string, nullable): ISO 8601 datetime if soft-deleted

**Section sources**
- [session.dto.ts](file://packages/dto/src/session.dto.ts#L22-L55)
- [response.util.ts](file://apps/server/src/shared/util/response.util.ts#L17-L26)

## Endpoint Details

### GET /sessions
Retrieves a paginated list of sessions with optional filtering and sorting.

**Method**: GET  
**Path**: /sessions  
**Authentication**: Required  
**Response Code**: 200 (OK)

**Query Parameters**:
- timelineId: Filter by routine ID
- startDateTimeSortOrder: Sort by start time ("ASC" or "DESC")
- skip: Pagination offset
- take: Pagination limit

**Response**:
Returns an array of session objects wrapped in the standard response format with pagination metadata.

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L86-L98)
- [query-session.dto.ts](file://packages/dto/src/query/query-session.dto.ts#L5-L11)

### GET /sessions/:id
Retrieves a specific session by its unique identifier.

**Method**: GET  
**Path**: /sessions/:id  
**Authentication**: Required  
**Response Code**: 200 (OK)  
**Error Codes**: 404 (Not Found)

**Path Parameters**:
- id: The UUID of the session to retrieve

**Response**:
Returns a single session object in the standard response format.

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L40-L46)
- [session.dto.ts](file://packages/dto/src/session.dto.ts#L22-L55)

### POST /sessions
Creates a new session with the specified properties.

**Method**: POST  
**Path**: /sessions  
**Authentication**: Required  
**Response Code**: 200 (OK)  
**Error Codes**: 400 (Bad Request), 409 (Conflict)

**Request Body**:
A session object containing the required fields for session creation.

**Response**:
Returns the created session object with all fields including system-generated values (id, timestamps).

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L31-L38)
- [create-session.dto.ts](file://packages/dto/src/create/create-session.dto.ts#L5-L9)

### PATCH /sessions/:id
Updates specific fields of an existing session.

**Method**: PATCH  
**Path**: /sessions/:id  
**Authentication**: Required  
**Response Code**: 200 (OK)  
**Error Codes**: 400 (Bad Request), 404 (Not Found), 409 (Conflict)

**Path Parameters**:
- id: The UUID of the session to update

**Request Body**:
A partial session object containing only the fields to be updated.

**Response**:
Returns the updated session object with all fields.

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L59-L68)
- [update-session.dto.ts](file://packages/dto/src/update/update-session.dto.ts#L4)

### DELETE /sessions/:id
Permanently removes a session from the system.

**Method**: DELETE  
**Path**: /sessions/:id  
**Authentication**: Required  
**Response Code**: 200 (OK)  
**Error Codes**: 404 (Not Found)

**Path Parameters**:
- id: The UUID of the session to delete

**Response**:
Returns the deleted session object with removedAt timestamp set.

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L78-L84)
- [session.entity.ts](file://packages/entity/src/session.entity.ts#L11-L24)

## Error Handling
The API returns standardized error responses for various failure scenarios.

### Common Error Codes
- **400 Bad Request**: Invalid request data, missing required fields, or invalid field values
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions to perform the operation
- **404 Not Found**: Requested resource does not exist
- **409 Conflict**: Scheduling conflict or resource constraint violation
- **500 Internal Server Error**: Unexpected server error

### Specific Error Scenarios
- **Scheduling Conflicts (409)**: Returned when creating or updating a session that overlaps with existing sessions for the same user or resource
- **Invalid Routine References (400)**: Returned when the provided timelineId does not reference a valid routine
- **Invalid Session Type (400)**: Returned when the session type is not one of the allowed values ("ONE_TIME", "RECURRING")

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L31-L98)
- [session.dto.ts](file://packages/dto/src/session.dto.ts#L23-L29)

## Examples

### Creating a Recurring Session
```json
{
  "type": "RECURRING",
  "timelineId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "name": "Weekly Yoga Class",
  "startDateTime": "2023-12-01T09:00:00Z",
  "endDateTime": "2023-12-01T10:00:00Z",
  "repeatCycleType": "WEEKLY",
  "recurringDayOfWeek": "FRIDAY",
  "description": "Weekly yoga session for intermediate level"
}
```

**Section sources**
- [create-session.dto.ts](file://packages/dto/src/create/create-session.dto.ts#L5-L9)
- [session.dto.ts](file://packages/dto/src/session.dto.ts#L22-L55)

### Updating Session Schedule
```json
{
  "startDateTime": "2023-12-08T10:30:00Z",
  "endDateTime": "2023-12-08T11:30:00Z",
  "description": "Updated time for yoga session"
}
```

**Section sources**
- [update-session.dto.ts](file://packages/dto/src/update/update-session.dto.ts#L4)
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L59-L68)

### Curl Examples

#### Retrieving Sessions by Date Range
```bash
curl -X GET "https://api.example.com/sessions?timelineId=a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8&startDateTimeSortOrder=ASC&skip=0&take=10" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

#### Creating a Scheduled Session
```bash
curl -X POST "https://api.example.com/sessions" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ONE_TIME",
    "timelineId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    "name": "Special Workshop",
    "startDateTime": "2023-12-15T14:00:00Z",
    "endDateTime": "2023-12-15T16:00:00Z",
    "description": "Special workshop event"
  }'
```

**Section sources**
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L31-L38)
- [sessions.controller.ts](file://apps/server/src/shared/controller/resources/sessions.controller.ts#L86-L98)