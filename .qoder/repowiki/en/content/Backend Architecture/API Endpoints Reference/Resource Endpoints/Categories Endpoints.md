# Categories Endpoints

<cite>
**Referenced Files in This Document**   
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts)
- [category.dto.ts](file://packages/dto/src/category.dto.ts)
- [category.entity.ts](file://packages/entity/src/category.entity.ts)
- [category-types.enum.ts](file://packages/enum/src/category-types.enum.ts)
- [categories.service.ts](file://apps/server/src/shared/service/resources/categories.service.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Request Schema](#request-schema)
4. [Response Structure](#response-structure)
5. [Endpoints](#endpoints)
   - [GET /categories](#get-categories)
   - [GET /categories/:id](#get-categoriesid)
   - [POST /categories](#post-categories)
   - [PATCH /categories/:id](#patch-categoriesid)
   - [DELETE /categories/:id](#delete-categoriesid)
6. [Error Responses](#error-responses)
7. [Examples](#examples)
   - [Creating Hierarchical Categories](#creating-hierarchical-categories)
   - [Retrieving Categories by Type](#retrieving-categories-by-type)

## Introduction

This document provides comprehensive documentation for the category management RESTful API endpoints. The API supports hierarchical category structures with various types including program, exercise, space, and file. Categories are organized in a tree structure with parent-child relationships, enabling complex organizational hierarchies.

The category system supports filtering, pagination, and full CRUD operations with appropriate validation to prevent circular references and type conflicts.

**Section sources**
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts#L27-L83)
- [category.entity.ts](file://packages/entity/src/category.entity.ts#L1-L63)

## Authentication

All category endpoints require authentication via JWT (JSON Web Token). The token must be included in the Authorization header of each request using the Bearer scheme:

```
Authorization: Bearer <your-jwt-token>
```

Without a valid JWT token, requests will be rejected with a 401 Unauthorized status code.

## Request Schema

### Category Properties

The following properties are used in category requests:

- **name**: string - The display name of the category
- **type**: string (enum) - The category type from the allowed values: "Role", "Space", "File", "User"
- **parentId**: string | null - The ID of the parent category for hierarchical organization
- **displayProperties**: object - Additional display configuration (not explicitly defined in DTO but supported by system)

### Create Category Request (POST)

```json
{
  "name": "string",
  "type": "Role|Space|File|User",
  "parentId": "string|null"
}
```

### Update Category Request (PATCH)

```json
{
  "name": "string",
  "type": "Role|Space|File|User",
  "parentId": "string|null"
}
```

**Section sources**
- [category.dto.ts](file://packages/dto/src/category.dto.ts#L10-L28)
- [category-types.enum.ts](file://packages/enum/src/category-types.enum.ts#L1-L25)

## Response Structure

Category responses include full hierarchical information with parent and children relationships.

```json
{
  "id": "string",
  "seq": "number",
  "createdAt": "string",
  "updatedAt": "string",
  "removedAt": "string|null",
  "tenantId": "string",
  "name": "string",
  "type": "Role|Space|File|User",
  "parentId": "string|null",
  "parent": {
    // Parent category object with same structure
  },
  "children": [
    // Array of child category objects
  ]
}
```

The response includes metadata for pagination when retrieving lists of categories.

**Section sources**
- [category.dto.ts](file://packages/dto/src/category.dto.ts#L10-L28)
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts#L30-L40)

## Endpoints

### GET /categories

Retrieve a list of categories with optional filtering, sorting, and pagination.

#### Query Parameters

- **type**: Filter categories by type (Role, Space, File, User)
- **parentId**: Filter categories by parent ID (use "null" for root categories)
- **page**: Page number for pagination (default: 1)
- **limit**: Number of items per page (default: 10)
- **sort**: Sort field (default: "createdAt")
- **order**: Sort order ("ASC" or "DESC", default: "DESC")

#### Response

Returns a paginated list of categories with metadata.

```json
{
  "data": [
    {
      "id": "cat-123",
      "name": "Documents",
      "type": "File",
      "parentId": null,
      "parent": null,
      "children": [],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Successfully fetched categories"
}
```

**Section sources**
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts#L30-L40)
- [categories.service.ts](file://apps/server/src/shared/service/resources/categories.service.ts)

### GET /categories/:id

Retrieve a specific category by ID, including its parent and children.

#### Path Parameters

- **categoryId**: The ID of the category to retrieve

#### Response

Returns the requested category with full hierarchical context.

```json
{
  "data": {
    "id": "cat-123",
    "name": "Work Projects",
    "type": "Space",
    "parentId": "cat-root",
    "parent": {
      "id": "cat-root",
      "name": "Root",
      "type": "Role"
    },
    "children": [
      {
        "id": "cat-456",
        "name": "Q4 Initiative",
        "type": "Space"
      }
    ],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  },
  "message": "Category found"
}
```

**Section sources**
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts#L52-L59)
- [category.entity.ts](file://packages/entity/src/category.entity.ts#L19-L53)

### POST /categories

Create a new category.

#### Request Body

```json
{
  "name": "string",
  "type": "Role|Space|File|User",
  "parentId": "string|null"
}
```

#### Response

Returns the created category with all system-generated fields.

```json
{
  "data": {
    "id": "cat-789",
    "name": "New Category",
    "type": "Space",
    "parentId": "cat-123",
    "parent": {
      "id": "cat-123",
      "name": "Parent Category"
    },
    "children": [],
    "createdAt": "2023-01-03T00:00:00.000Z",
    "updatedAt": "2023-01-03T00:00:00.000Z"
  },
  "message": "Category created"
}
```

**Section sources**
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts#L43-L50)
- [categories.service.ts](file://apps/server/src/shared/service/resources/categories.service.ts)

### PATCH /categories/:id

Update an existing category.

#### Path Parameters

- **categoryId**: The ID of the category to update

#### Request Body

```json
{
  "name": "Updated Name",
  "type": "Space",
  "parentId": "string|null"
}
```

#### Response

Returns the updated category.

```json
{
  "data": {
    "id": "cat-123",
    "name": "Updated Name",
    "type": "Space",
    "parentId": null,
    "parent": null,
    "children": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-04T00:00:00.000Z"
  },
  "message": "Category updated"
}
```

**Section sources**
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts#L62-L73)
- [categories.service.ts](file://apps/server/src/shared/service/resources/categories.service.ts)

### DELETE /categories/:id

Delete a category by ID.

#### Path Parameters

- **categoryId**: The ID of the category to delete

#### Response

Returns a 204 No Content response on successful deletion.

```json
{
  "message": "Category deleted"
}
```

**Section sources**
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts#L75-L81)
- [categories.service.ts](file://apps/server/src/shared/service/resources/categories.service.ts)

## Error Responses

### 400 Bad Request - Circular Reference

When attempting to create a circular reference in the category hierarchy:

```json
{
  "statusCode": 400,
  "message": "Circular reference detected in category hierarchy",
  "error": "Bad Request"
}
```

This occurs when trying to set a category's parent to itself or to one of its descendants.

### 409 Conflict - Type Conflict

When attempting to create or update a category with a type conflict:

```json
{
  "statusCode": 409,
  "message": "Category type conflict",
  "error": "Conflict"
}
```

This occurs when the operation would violate type constraints in the category hierarchy.

### 401 Unauthorized

When the request lacks valid authentication:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found

When the requested category does not exist:

```json
{
  "statusCode": 404,
  "message": "Category not found",
  "error": "Not Found"
}
```

**Section sources**
- [categories.service.ts](file://apps/server/src/shared/service/resources/categories.service.ts)
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts)

## Examples

### Creating Hierarchical Categories

Create a nested category structure for organizing spaces:

```bash
# Create a root category
curl -X POST https://api.example.com/categories \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Departments",
    "type": "Space",
    "parentId": null
  }'

# Create a child category
curl -X POST https://api.example.com/categories \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "type": "Space",
    "parentId": "cat-departments"
  }'

# Create a grandchild category
curl -X POST https://api.example.com/categories \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend",
    "type": "Space",
    "parentId": "cat-engineering"
  }'
```

### Retrieving Categories by Type

Fetch all space categories with pagination:

```bash
curl -X GET "https://api.example.com/categories?type=Space&page=1&limit=20" \
  -H "Authorization: Bearer <your-token>"
```

Fetch all root-level categories (those without parents):

```bash
curl -X GET "https://api.example.com/categories?parentId=null" \
  -H "Authorization: Bearer <your-token>"
```

**Section sources**
- [categories.controller.ts](file://apps/server/src/shared/controller/resources/categories.controller.ts)
- [categories.service.ts](file://apps/server/src/shared/service/resources/categories.service.ts)