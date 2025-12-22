# Spaces Endpoints

<cite>
**Referenced Files in This Document**   
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts)
- [spaces.service.ts](file://apps/server/src/shared/service/resources/spaces.service.ts)
- [space.dto.ts](file://packages/dto/src/space.dto.ts)
- [createSpaceDto.ts](file://packages/api/src/model/createSpaceDto.ts)
- [updateSpaceDto.ts](file://packages/api/src/model/updateSpaceDto.ts)
- [getSpacesByQueryParams.ts](file://packages/api/src/model/getSpacesByQueryParams.ts)
- [getSpacesByQuery200AllOf.ts](file://packages/api/src/model/getSpacesByQuery200AllOf.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication and Access Control](#authentication-and-access-control)
3. [Request and Response Structure](#request-and-response-structure)
4. [Endpoint Details](#endpoint-details)
   - [GET /spaces](#get-spaces)
   - [GET /spaces/:id](#get-spacesid)
   - [POST /spaces](#post-spaces)
   - [PATCH /spaces/:id](#patch-spacesid)
   - [DELETE /spaces/:id](#delete-spacesid)
5. [Error Responses](#error-responses)
6. [Examples](#examples)

## Introduction
This document provides comprehensive documentation for the space management RESTful API endpoints. The API enables CRUD operations for managing spaces within the system, including listing, retrieving, creating, updating, and deleting spaces. Each space can have associated classifications, location details, capacity constraints, and availability schedules.

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L27-L168)

## Authentication and Access Control
All space management endpoints require authentication via JWT (JSON Web Token). The system implements spatial access controls to ensure users can only access spaces they have permission to view or modify. The authentication context is validated on each request, and users must have appropriate permissions for the target space.

When making requests, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

The system validates tenant and space context from the authentication token, ensuring users can only interact with spaces within their authorized scope.

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L37-L108)

## Request and Response Structure

### Request Body Schema
The request body for space operations includes the following properties:

| Property | Type | Required | Description |
|---------|------|---------|-------------|
| name | string | Yes | Name of the space |
| description | string | No | Detailed description of the space |
| classificationId | string | Yes | ID of the space classification |
| capacity | number | Yes | Maximum capacity of the space |
| locationDetails | object | No | Geographical and physical location information |
| availabilitySchedule | object | No | Schedule defining when the space is available |

### Response Structure
The response structure for space endpoints follows a consistent pattern with space details and associated classifications.

```json
{
  "httpStatus": 200,
  "message": "success",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "capacity": 0,
    "classificationId": "string",
    "spaceClassification": {
      "id": "string",
      "name": "string",
      "type": "string"
    },
    "ground": {
      "id": "string",
      "name": "string",
      "address": "string"
    },
    "locationDetails": {
      "latitude": 0,
      "longitude": 0,
      "floor": "string",
      "building": "string"
    },
    "availabilitySchedule": {
      "daysOfWeek": ["string"],
      "startTime": "string",
      "endTime": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

For list operations, the response includes pagination metadata:

```json
{
  "httpStatus": 200,
  "message": "success",
  "data": [...],
  "meta": {
    "total": 0,
    "page": 0,
    "limit": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Section sources**
- [space.dto.ts](file://packages/dto/src/space.dto.ts#L9-L32)
- [getSpacesByQuery200AllOf.ts](file://packages/api/src/model/getSpacesByQuery200AllOf.ts#L10-L17)

## Endpoint Details

### GET /spaces
Retrieves a list of spaces with pagination and filtering capabilities.

**HTTP Method**: GET  
**Endpoint**: `/spaces`  
**Authentication**: Required (JWT)

#### Query Parameters
| Parameter | Type | Required | Description | Constraints |
|----------|------|---------|-------------|-------------|
| skip | number | No | Number of records to skip for pagination | Minimum: 1 |
| take | number | No | Number of records to return | Minimum: 1, Maximum: 50 |
| classificationId | string | No | Filter spaces by classification ID | - |
| availableFrom | string | No | Filter spaces available from specific datetime | ISO 8601 format |
| availableTo | string | No | Filter spaces available to specific datetime | ISO 8601 format |

#### Response
Returns a paginated list of spaces with metadata.

**Success Response (200 OK)**:
```json
{
  "httpStatus": 200,
  "message": "success",
  "data": [
    {
      "id": "spc_123",
      "name": "Conference Room A",
      "description": "Main conference room with AV equipment",
      "capacity": 20,
      "classificationId": "cls_meeting",
      "spaceClassification": {
        "id": "cls_meeting",
        "name": "Meeting Room",
        "type": "room"
      },
      "ground": {
        "id": "grd_001",
        "name": "Headquarters",
        "address": "123 Main St, City, State"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L153-L167)
- [getSpacesByQueryParams.ts](file://packages/api/src/model/getSpacesByQueryParams.ts#L8-L18)

### GET /spaces/:id
Retrieves detailed information about a specific space by its ID.

**HTTP Method**: GET  
**Endpoint**: `/spaces/:id`  
**Authentication**: Required (JWT)

#### Path Parameters
| Parameter | Type | Required | Description |
|----------|------|---------|-------------|
| id | string | Yes | Unique identifier of the space |

#### Response
Returns detailed information about the specified space.

**Success Response (200 OK)**:
```json
{
  "httpStatus": 200,
  "message": "success",
  "data": {
    "id": "spc_123",
    "name": "Conference Room A",
    "description": "Main conference room with AV equipment",
    "capacity": 20,
    "classificationId": "cls_meeting",
    "spaceClassification": {
      "id": "cls_meeting",
      "name": "Meeting Room",
      "type": "room"
    },
    "ground": {
      "id": "grd_001",
      "name": "Headquarters",
      "address": "123 Main St, City, State"
    },
    "locationDetails": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "floor": "3",
      "building": "Main Tower"
    },
    "availabilitySchedule": {
      "daysOfWeek": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      "startTime": "09:00",
      "endTime": "18:00"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L118-L124)

### POST /spaces
Creates a new space with the specified properties.

**HTTP Method**: POST  
**Endpoint**: `/spaces`  
**Authentication**: Required (JWT)  
**Content-Type**: application/json

#### Request Body
```json
{
  "name": "New Conference Room",
  "description": "Newly renovated conference room with advanced technology",
  "classificationId": "cls_meeting",
  "capacity": 15,
  "locationDetails": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "floor": "2",
    "building": "Main Tower"
  },
  "availabilitySchedule": {
    "daysOfWeek": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    "startTime": "08:00",
    "endTime": "20:00"
  }
}
```

#### Response
Returns the created space object.

**Success Response (200 OK)**:
```json
{
  "httpStatus": 200,
  "message": "success",
  "data": {
    "id": "spc_456",
    "name": "New Conference Room",
    "description": "Newly renovated conference room with advanced technology",
    "capacity": 15,
    "classificationId": "cls_meeting",
    "spaceClassification": {
      "id": "cls_meeting",
      "name": "Meeting Room",
      "type": "room"
    },
    "ground": {
      "id": "grd_001",
      "name": "Headquarters",
      "address": "123 Main St, City, State"
    }
  }
}
```

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L110-L116)
- [createSpaceDto.ts](file://packages/api/src/model/createSpaceDto.ts#L8)

### PATCH /spaces/:id
Updates an existing space with new properties.

**HTTP Method**: PATCH  
**Endpoint**: `/spaces/:id`  
**Authentication**: Required (JWT)  
**Content-Type**: application/json

#### Path Parameters
| Parameter | Type | Required | Description |
|----------|------|---------|-------------|
| id | string | Yes | Unique identifier of the space to update |

#### Request Body
```json
{
  "name": "Updated Conference Room",
  "capacity": 25,
  "availabilitySchedule": {
    "daysOfWeek": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
    "startTime": "07:00",
    "endTime": "21:00"
  }
}
```

#### Response
Returns the updated space object.

**Success Response (200 OK)**:
```json
{
  "httpStatus": 200,
  "message": "success",
  "data": {
    "id": "spc_123",
    "name": "Updated Conference Room",
    "description": "Main conference room with AV equipment",
    "capacity": 25,
    "classificationId": "cls_meeting",
    "spaceClassification": {
      "id": "cls_meeting",
      "name": "Meeting Room",
      "type": "room"
    }
  }
}
```

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L126-L135)
- [updateSpaceDto.ts](file://packages/api/src/model/updateSpaceDto.ts#L8)

### DELETE /spaces/:id
Deletes a space permanently by its ID.

**HTTP Method**: DELETE  
**Endpoint**: `/spaces/:id`  
**Authentication**: Required (JWT)

#### Path Parameters
| Parameter | Type | Required | Description |
|----------|------|---------|-------------|
| id | string | Yes | Unique identifier of the space to delete |

#### Response
Returns the deleted space object.

**Success Response (200 OK)**:
```json
{
  "httpStatus": 200,
  "message": "success",
  "data": {
    "id": "spc_123",
    "name": "Conference Room A",
    "description": "Main conference room with AV equipment",
    "capacity": 20,
    "classificationId": "cls_meeting"
  }
}
```

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L145-L151)

## Error Responses
The API returns standard HTTP status codes for error conditions.

### 400 Bad Request
Returned when the request contains invalid data, such as exceeding capacity limits.

```json
{
  "httpStatus": 400,
  "message": "Capacity must be a positive number and cannot exceed system limits"
}
```

### 401 Unauthorized
Returned when no valid JWT token is provided or the token has expired.

```json
{
  "httpStatus": 401,
  "message": "Tenant information not found.! Please log in again."
}
```

### 404 Not Found
Returned when the requested space ID does not exist.

```json
{
  "httpStatus": 404,
  "message": "ID로 스페이스를 찾을 수 없음: spc_nonexistent"
}
```

### 409 Conflict
Returned when there are conflicting schedules or other resource conflicts.

```json
{
  "httpStatus": 409,
  "message": "The requested availability schedule conflicts with existing bookings"
}
```

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L62-L65)
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L86-L89)

## Examples

### Listing Available Spaces
Retrieve available spaces with pagination:

```bash
curl -X GET "https://api.example.com/spaces?take=10&skip=0&classificationId=cls_meeting" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Retrieving Space Details
Get details of a specific space:

```bash
curl -X GET "https://api.example.com/spaces/spc_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Creating a Space with Classification
Create a new space with classification and availability schedule:

```bash
curl -X POST "https://api.example.com/spaces" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Collaboration Room",
    "description": "Space designed for team collaboration and brainstorming",
    "classificationId": "cls_coworking",
    "capacity": 12,
    "locationDetails": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "floor": "4",
      "building": "Innovation Center"
    },
    "availabilitySchedule": {
      "daysOfWeek": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      "startTime": "08:00",
      "endTime": "20:00"
    }
  }'
```

### Updating Space Availability
Modify the availability schedule of an existing space:

```bash
curl -X PATCH "https://api.example.com/spaces/spc_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "availabilitySchedule": {
      "daysOfWeek": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
      "startTime": "07:00",
      "endTime": "22:00"
    }
  }'
```

**Section sources**
- [spaces.controller.ts](file://apps/server/src/shared/controller/resources/spaces.controller.ts#L110-L167)