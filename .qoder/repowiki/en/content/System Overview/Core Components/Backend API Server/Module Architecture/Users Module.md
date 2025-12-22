# Users Module

<cite>
**Referenced Files in This Document**   
- [users.module.ts](file://apps/server/src/module/users.module.ts)
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts)
- [users.repository.ts](file://apps/server/src/shared/repository/users.repository.ts)
- [user.dto.ts](file://packages/dto/src/user.dto.ts)
- [create-user.dto.ts](file://packages/dto/src/create/create-user.dto.ts)
- [update-user.dto.ts](file://packages/dto/src/update/update-user.dto.ts)
- [query-user.dto.ts](file://packages/dto/src/query/query-user.dto.ts)
- [user.entity.ts](file://packages/entity/src/user.entity.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Module Architecture](#module-architecture)
3. [Core Components](#core-components)
4. [User Lifecycle Management](#user-lifecycle-management)
5. [Data Transfer Objects and Validation](#data-transfer-objects-and-validation)
6. [Integration with Classification and Association Modules](#integration-with-classification-and-association-modules)
7. [Data Consistency and Soft Deletion](#data-consistency-and-soft-deletion)
8. [User Search and Query Capabilities](#user-search-and-query-capabilities)
9. [Error Handling and Logging](#error-handling-and-logging)
10. [Performance Considerations](#performance-considerations)

## Introduction
The Users Module in prj-core provides a comprehensive system for managing user lifecycle operations including creation, retrieval, update, and deletion. Built on NestJS architecture, this module follows a clean separation of concerns with distinct layers for controllers, services, and repositories. The module integrates with tenant, role, and classification systems to provide a complete user management solution for multi-tenancy applications. This documentation details the implementation patterns, data flow, and integration points that make up the robust user management system.

## Module Architecture

```mermaid
graph TB
subgraph "Users Module"
Controller[UsersController]
Service[UsersService]
Repository[UsersRepository]
end
subgraph "External Dependencies"
Prisma[PrismaService]
DTOs[DTOs]
Entities[Entities]
end
Controller --> Service
Service --> Repository
Repository --> Prisma
Controller --> DTOs
Service --> DTOs
Repository --> Entities
```

**Diagram sources**
- [users.module.ts](file://apps/server/src/module/users.module.ts#L4-L8)
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L30-L125)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L7-L151)
- [users.repository.ts](file://apps/server/src/shared/repository/users.repository.ts#L9-L84)

**Section sources**
- [users.module.ts](file://apps/server/src/module/users.module.ts#L1-L9)

## Core Components

The Users Module consists of three primary components that follow the NestJS architectural pattern: UsersController, UsersService, and UsersRepository. The controller handles HTTP requests and responses, the service contains business logic, and the repository manages data persistence operations.

```mermaid
classDiagram
class UsersController {
+createUser(createUserDto : CreateUserDto)
+getUser(userId : string)
+getUsersByQuery(query : QueryUserDto)
+updateUser(userId : string, updateUserDto : UpdateUserDto)
+removeUser(userId : string)
+removeUsers(userIds : string[])
+deleteUser(userId : string)
}
class UsersService {
+getById(id : string)
+getByEmail(email : string)
+getByIdWithTenants(id : string)
+getUserWithMainTenant(userId : string)
+getManyByQuery(query : QueryUserDto)
+create(args : any)
+updateById(id : string, data : Prisma.UserUpdateInput)
+removeById(id : string)
+removeMany(ids : string[])
+deleteById(id : string)
}
class UsersRepository {
+create(args : any)
+upsert(args : any)
+update(args : any)
+updateMany(args : any)
+delete(args : any)
+findMany(args : any)
+findUnique(args : any)
+count(args : any)
}
UsersController --> UsersService : "depends on"
UsersService --> UsersRepository : "depends on"
UsersRepository --> PrismaService : "uses"
```

**Diagram sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L30-L125)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L7-L151)
- [users.repository.ts](file://apps/server/src/shared/repository/users.repository.ts#L9-L84)

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L30-L125)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L7-L151)
- [users.repository.ts](file://apps/server/src/shared/repository/users.repository.ts#L9-L84)

## User Lifecycle Management

The Users Module implements a complete CRUD (Create, Read, Update, Delete) interface for user management with specialized endpoints for different operations. The module supports both hard deletion (permanent removal) and soft deletion (marking as removed) to accommodate different business requirements.

```mermaid
sequenceDiagram
participant Client
participant Controller
participant Service
participant Repository
participant Database
Client->>Controller : POST /users
Controller->>Service : create({data : createUserDto})
Service->>Repository : create(args)
Repository->>Database : prisma.user.create()
Database-->>Repository : User record
Repository-->>Service : User instance
Service-->>Controller : User object
Controller-->>Client : 200 OK with UserDto
Client->>Controller : GET /users/{id}
Controller->>Service : getById(id)
Service->>Repository : findUnique({where : {id}})
Repository->>Database : prisma.user.findUnique()
Database-->>Repository : User record
Repository-->>Service : User instance
Service-->>Controller : User object
Controller-->>Client : 200 OK with UserDto
Client->>Controller : PATCH /users/{id}
Controller->>Service : updateById(id, updateUserDto)
Service->>Repository : update({where : {id}, data})
Repository->>Database : prisma.user.update()
Database-->>Repository : Updated user
Repository-->>Service : Updated User instance
Service-->>Controller : Updated User object
Controller-->>Client : 200 OK with UserDto
Client->>Controller : PATCH /users/{id}/removedAt
Controller->>Service : removeById(id)
Service->>Repository : update({where : {id}, data : {removedAt : now}})
Repository->>Database : prisma.user.update()
Database-->>Repository : Soft-deleted user
Repository-->>Service : User instance
Service-->>Controller : User object
Controller-->>Client : 200 OK with UserDto
```

**Diagram sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L35-L89)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L10-L58)
- [users.repository.ts](file://apps/server/src/shared/repository/users.repository.ts#L16-L32)

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L35-L89)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L10-L58)

## Data Transfer Objects and Validation

The Users Module employs Data Transfer Objects (DTOs) to define the structure and validation rules for user-related operations. These DTOs ensure type safety, provide documentation for API endpoints, and validate incoming data before processing.

```mermaid
classDiagram
class UserDto {
+string spaceId
+string email
+string name
+string phone
+ProfileDto[] profiles
+TenantDto[] tenants
+UserAssociationDto[] associations
+UserClassificationDto classification
}
class CreateUserDto {
+string spaceId
+string email
+string name
+string phone
+string password
}
class UpdateUserDto {
+string name
+string phone
+string password
}
class QueryUserDto {
+string search
+string email
+string name
+number page
+number limit
+string orderBy
+string orderDirection
}
UserDto <|-- CreateUserDto : "extends"
UserDto <|-- UpdateUserDto : "extends"
UserDto <|-- QueryUserDto : "extends"
```

**Diagram sources**
- [user.dto.ts](file://packages/dto/src/user.dto.ts#L16-L60)
- [create-user.dto.ts](file://packages/dto/src/create/create-user.dto.ts)
- [update-user.dto.ts](file://packages/dto/src/update/update-user.dto.ts)
- [query-user.dto.ts](file://packages/dto/src/query/query-user.dto.ts)

**Section sources**
- [user.dto.ts](file://packages/dto/src/user.dto.ts#L16-L60)
- [create-user.dto.ts](file://packages/dto/src/create/create-user.dto.ts)
- [update-user.dto.ts](file://packages/dto/src/update/update-user.dto.ts)
- [query-user.dto.ts](file://packages/dto/src/query/query-user.dto.ts)

## Integration with Classification and Association Modules

The Users Module integrates with classification and association systems to provide role-based access control and tenant management capabilities. This integration enables complex user management scenarios in multi-tenant applications.

```mermaid
erDiagram
USER {
string id PK
string email UK
string name
string phone
datetime createdAt
datetime updatedAt
datetime removedAt
}
TENANT {
string id PK
string userId FK
string roleId FK
string spaceId FK
boolean main
datetime createdAt
datetime updatedAt
}
ROLE {
string id PK
string name
string description
datetime createdAt
datetime updatedAt
}
SPACE {
string id PK
string name
string description
datetime createdAt
datetime updatedAt
}
USER ||--o{ TENANT : "has"
TENANT }o--|| ROLE : "has"
TENANT }o--|| SPACE : "belongs to"
```

**Diagram sources**
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L60-L94)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L96-L130)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L131-L149)

**Section sources**
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L60-L149)

## Data Consistency and Soft Deletion

The Users Module implements a soft deletion pattern to maintain data integrity and support audit requirements. Instead of permanently removing records, the system marks them as deleted by setting a removedAt timestamp, allowing for potential restoration and maintaining referential integrity.

```mermaid
flowchart TD
A[Delete Request] --> B{Soft or Hard Delete?}
B --> |Soft| C[Update removedAt field]
B --> |Hard| D[Delete record from database]
C --> E[Return updated user]
D --> F[Return deleted user]
E --> G[User appears deleted to clients]
F --> G
G --> H[Related data preserved]
H --> I[Audit trail maintained]
```

**Diagram sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L75-L81)
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L83-L89)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L53-L58)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L21-L23)

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L75-L89)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L53-L58)

## User Search and Query Capabilities

The Users Module provides robust search and filtering capabilities through the getUsersByQuery endpoint. This feature supports pagination, sorting, and various filtering options to efficiently retrieve user data from potentially large datasets.

```mermaid
flowchart TD
A[GET /users] --> B[Parse Query Parameters]
B --> C[Build Prisma Query]
C --> D[Execute findMany with include]
D --> E[Execute count for pagination]
E --> F[Map results to UserDto]
F --> G[Wrap response with meta]
G --> H[Return paginated results]
subgraph "Query Parameters"
Q1[search: string]
Q2[email: string]
Q3[name: string]
Q4[page: number]
Q5[limit: number]
Q6[orderBy: string]
Q7[orderDirection: string]
end
subgraph "Include Relations"
I1[tenants with role]
I2[profiles]
end
Q1 --> C
Q2 --> C
Q3 --> C
Q4 --> C
Q5 --> C
Q6 --> C
Q7 --> C
I1 --> D
I2 --> D
```

**Diagram sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L91-L115)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L29-L47)

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L91-L115)
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L29-L47)

## Error Handling and Logging

The Users Module implements comprehensive error handling and logging to ensure system reliability and aid in troubleshooting. The controller includes try-catch blocks with detailed error logging, while the repository provides debug-level logging for all database operations.

```mermaid
sequenceDiagram
participant Client
participant Controller
participant Logger
Client->>Controller : Request
Controller->>Controller : Try operation
alt Success
Controller-->>Client : Success response
else Error
Controller->>Logger : Log error with stack trace
Logger-->>Controller : Confirmation
Controller->>Client : Error response
end
```

**Diagram sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L96-L122)
- [users.repository.ts](file://apps/server/src/shared/repository/users.repository.ts#L13-L14)

**Section sources**
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L96-L122)
- [users.repository.ts](file://apps/server/src/shared/repository/users.repository.ts#L13-L14)

## Performance Considerations

The Users Module incorporates several performance optimizations, including efficient database queries with proper indexing, selective field loading, and batch operations for bulk updates. The use of Prisma's include feature allows for efficient retrieval of related data in a single query, reducing database round trips.

```mermaid
graph TD
A[Performance Optimizations] --> B[Selective Field Loading]
A --> C[Efficient Database Queries]
A --> D[Batch Operations]
A --> E[Proper Indexing]
A --> F[Caching Strategy]
B --> G[Only load needed fields]
C --> H[Optimized Prisma queries]
D --> I[Promise.all for bulk updates]
E --> J[Indexes on frequently queried fields]
F --> K[Future enhancement]
```

**Diagram sources**
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L30-L40)
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L58-L60)

**Section sources**
- [users.service.ts](file://apps/server/src/shared/service/resources/users.service.ts#L30-L40)
- [users.controller.ts](file://apps/server/src/shared/controller/resources/users.controller.ts#L58-L60)