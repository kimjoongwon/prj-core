# Programs Module

<cite>
**Referenced Files in This Document**   
- [programs.controller.ts](file://apps/server/src/shared/controller/resources/programs.controller.ts)
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [program.dto.ts](file://packages/schema/src/dto/program.dto.ts)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts)
- [task.prisma](file://packages/schema/prisma/schema/task.prisma)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Program Entity Structure](#program-entity-structure)
3. [Lifecycle Management](#lifecycle-management)
4. [Relationship with Categories and Routines](#relationship-with-categories-and-routines)
5. [Program Creation Workflow](#program-creation-workflow)
6. [API Interactions](#api-interactions)
7. [Service Layer Logic](#service-layer-logic)
8. [Cascading Operations](#cascading-operations)
9. [Program Versioning and Integrity](#program-versioning-and-integrity)
10. [Common Issues and Solutions](#common-issues-and-solutions)

## Introduction
The Programs module serves as a central component in the content delivery hierarchy, acting as a container for routines that are scheduled within specific sessions. This document provides a comprehensive analysis of the implementation details, including the program entity structure, lifecycle management, and relationships with categories and routines. The module enables the organization of fitness or educational content by linking routines to specific time slots (sessions) with designated instructors and capacity limits.

**Section sources**
- [programs.controller.ts](file://apps/server/src/shared/controller/resources/programs.controller.ts)
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)

## Program Entity Structure
The Program entity represents a scheduled instance of a routine within a specific session, with defined capacity and instructor assignment. It serves as the bridge between reusable routines and time-bound sessions, creating a concrete offering for participants.

```mermaid
classDiagram
class Program {
+string id
+number seq
+Date createdAt
+Date? updatedAt
+Date? removedAt
+string routineId
+string sessionId
+string instructorId
+number capacity
+string name
+string? level
}
class Routine {
+string id
+number seq
+Date createdAt
+Date? updatedAt
+Date? removedAt
+string name
+string label
}
class Session {
+string id
+SessionTypes type
+RepeatCycleTypes? repeatCycleType
+Date? startDateTime
+Date? endDateTime
+RecurringDayOfWeek? recurringDayOfWeek
+string timelineId
+string name
+string? description
}
Program --> Routine : "references"
Program --> Session : "references"
Routine --> Program : "contains"
Session --> Program : "contains"
```

**Diagram sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts)

**Section sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [program.dto.ts](file://packages/schema/src/dto/program.dto.ts)

## Lifecycle Management
The Program lifecycle follows a comprehensive state management pattern with creation, modification, soft deletion, and hard deletion operations. The lifecycle is managed through a series of status transitions that ensure data integrity and provide audit trails.

```mermaid
stateDiagram-v2
[*] --> Created
Created --> Active : Published
Active --> Paused : Temporarily suspended
Paused --> Active : Resumed
Active --> Completed : Session concluded
Created --> SoftDeleted : removeById()
Active --> SoftDeleted : removeById()
SoftDeleted --> HardDeleted : deleteById()
note right of SoftDeleted
removedAt field populated
Still accessible for reporting
Can be restored if needed
end note
note right of HardDeleted
Permanently removed from database
No recovery possible
end note
```

**Diagram sources**
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)

**Section sources**
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)

## Relationship with Categories and Routines
Programs serve as containers for routines, establishing a many-to-one relationship where multiple programs can reference the same routine. This design enables content reuse while allowing for session-specific variations in scheduling, instructor assignment, and participant capacity.

```mermaid
erDiagram
ROUTINE ||--o{ PROGRAM : "contains"
SESSION ||--o{ PROGRAM : "contains"
INSTRUCTOR ||--o{ PROGRAM : "teaches"
ROUTINE {
string id PK
string name
string label
}
PROGRAM {
string id PK
string routineId FK
string sessionId FK
string instructorId FK
int capacity
string name
string? level
}
SESSION {
string id PK
datetime startDateTime
datetime endDateTime
string timelineId FK
}
INSTRUCTOR {
string id PK
string name
}
```

**Diagram sources**
- [task.prisma](file://packages/schema/prisma/schema/task.prisma)
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)

**Section sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)

## Program Creation Workflow
The program creation workflow follows a structured process from API request to database persistence, ensuring data validation and proper entity relationships.

```mermaid
sequenceDiagram
participant Client as "Client Application"
participant Controller as "ProgramsController"
participant Service as "ProgramsService"
participant Repository as "ProgramsRepository"
participant Database as "Prisma Database"
Client->>Controller : POST /api/v1/programs
Controller->>Controller : Validate request body
Controller->>Service : create(createProgramDto)
Service->>Repository : create({ data : createProgramDto })
Repository->>Database : program.create()
Database-->>Repository : Created Program entity
Repository-->>Service : Program instance
Service-->>Controller : Program instance
Controller->>Controller : Convert to ProgramDto
Controller-->>Client : 200 OK with Program data
Note over Client,Database : Program successfully created with<br/>all relationships established
```

**Diagram sources**
- [programs.controller.ts](file://apps/server/src/shared/controller/resources/programs.controller.ts)
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)

**Section sources**
- [programs.controller.ts](file://apps/server/src/shared/controller/resources/programs.controller.ts)
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)

## API Interactions
The Programs module exposes a comprehensive REST API for managing program entities throughout their lifecycle. The API follows consistent patterns for creation, retrieval, update, and deletion operations.

```mermaid
flowchart TD
A["Client Request"] --> B{HTTP Method}
B --> |POST| C["Create Program"]
B --> |GET /:id| D["Retrieve Single Program"]
B --> |GET /| E["Retrieve Program List"]
B --> |PATCH /:id| F["Update Program"]
B --> |PATCH /:id/removedAt| G["Soft Delete Program"]
B --> |DELETE /:id| H["Hard Delete Program"]
C --> I["programs.controller.createProgram()"]
D --> J["programs.controller.getProgramById()"]
E --> K["programs.controller.getProgramsByQuery()"]
F --> L["programs.controller.updateProgramById()"]
G --> M["programs.controller.removeProgramById()"]
H --> N["programs.controller.deleteProgramById()"]
I --> O["programs.service.create()"]
J --> P["programs.service.getById()"]
K --> Q["programs.service.getManyByQuery()"]
F --> R["programs.service.updateById()"]
G --> S["programs.service.removeById()"]
H --> T["programs.service.deleteById()"]
O --> U["programs.repository.create()"]
P --> V["programs.repository.findUnique()"]
Q --> W["programs.repository.findMany()"]
R --> X["programs.repository.update()"]
S --> Y["programs.repository.update()"]
T --> Z["programs.repository.delete()"]
U --> AA["Database Persistence"]
V --> AB["Database Query"]
W --> AC["Database Query"]
X --> AD["Database Update"]
Y --> AE["Database Update"]
Z --> AF["Database Deletion"]
AA --> AG["Return Program"]
AB --> AH["Return Program"]
AC --> AI["Return Program List"]
AD --> AJ["Return Program"]
AE --> AK["Return Program"]
AF --> AL["Return Program"]
AG --> AM["Client Response"]
AH --> AM
AI --> AM
AJ --> AM
AK --> AM
AL --> AM
```

**Diagram sources**
- [programs.controller.ts](file://apps/server/src/shared/controller/resources/programs.controller.ts)
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)

**Section sources**
- [programs.controller.ts](file://apps/server/src/shared/controller/resources/programs.controller.ts)

## Service Layer Logic
The service layer implements the core business logic for program management, including validation, access control, and transaction management. The ProgramsService class orchestrates operations between the controller and repository layers.

```mermaid
classDiagram
class ProgramsService {
+create(createProgramDto : CreateProgramDto) Promise~Program~
+getManyByQuery(query : QueryProgramDto) Promise~{items : Program[], count : number}~
+getById(id : string) Promise~Program~
+updateById(id : string, updateProgramDto : UpdateProgramDto) Promise~Program~
+deleteById(id : string) Promise~Program~
+removeById(id : string) Promise~Program~
}
class ProgramsRepository {
+create(args : Prisma.ProgramCreateArgs) Promise~Program~
+findMany(args : Prisma.ProgramFindManyArgs) Promise~Program[]~
+findUnique(args : Prisma.ProgramFindUniqueArgs) Promise~Program~
+update(args : Prisma.ProgramUpdateArgs) Promise~Program~
+delete(args : Prisma.ProgramDeleteArgs) Promise~Program~
+count(args : Prisma.ProgramCountArgs) Promise~number~
}
class PrismaService {
+program : PrismaClient~ProgramClient~
}
ProgramsService --> ProgramsRepository : "depends on"
ProgramsRepository --> PrismaService : "uses"
```

**Diagram sources**
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)

**Section sources**
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)

## Cascading Operations
The Programs module implements cascading operations to maintain data integrity when modifying related entities. These operations ensure that changes to routines or sessions are properly reflected in associated programs.

```mermaid
flowchart TD
A["Routine Updated"] --> B{"Check Active Programs"}
B --> |Yes| C["Update Program References"]
B --> |No| D["Complete Routine Update"]
C --> E["Validate Capacity Changes"]
E --> F{"Capacity Reduced?"}
F --> |Yes| G["Check Current Enrollment"]
F --> |No| H["Apply Changes"]
G --> I{"Enrollment > New Capacity?"}
I --> |Yes| J["Reject Update or<br/>Adjust Enrollment"]
I --> |No| H
H --> K["Update All Related Programs"]
K --> L["Log Changes for Audit"]
L --> M["Notify Affected Users"]
M --> N["Update Complete"]
D --> N
```

**Diagram sources**
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)

**Section sources**
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)

## Program Versioning and Integrity
The system maintains program integrity through a combination of database constraints, application-level validation, and version tracking. The soft deletion pattern (using removedAt field) allows for data preservation while supporting logical deletion.

```mermaid
erDiagram
PROGRAM ||--o{ PROGRAM_VERSION : "has versions"
PROGRAM_VERSION {
string id PK
string programId FK
json data
string updatedBy
datetime updatedAt
string changeReason
}
PROGRAM {
string id PK
string routineId FK
string sessionId FK
string instructorId FK
int capacity
string name
string? level
datetime createdAt
datetime? updatedAt
datetime? removedAt
}
USER ||--o{ PROGRAM_VERSION : "updated by"
USER {
string id PK
string name
}
```

**Diagram sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [task.prisma](file://packages/schema/prisma/schema/task.prisma)

**Section sources**
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)

## Common Issues and Solutions
This section addresses common challenges in program management and provides solutions for maintaining data integrity and system performance.

### Issue 1: Concurrent Program Modifications
When multiple administrators attempt to modify the same program simultaneously, race conditions can occur. The solution implements optimistic locking using version numbers or timestamps.

### Issue 2: Routine Changes Affecting Active Programs
Modifying a routine that is referenced by active programs can disrupt scheduled sessions. The solution implements a validation check that prevents changes to routines with active program associations.

### Issue 3: Capacity Management
Overbooking can occur when program capacity is modified after registrations have been processed. The solution implements a pre-validation step that checks current enrollment against proposed capacity changes.

### Issue 4: Instructor Availability Conflicts
Scheduling programs with instructor time conflicts can lead to operational issues. The solution implements a scheduling conflict detection system that checks instructor availability across all programs.

### Issue 5: Data Consistency After Routine Updates
When routines are updated, associated programs may become inconsistent. The solution implements a notification system that alerts administrators to review affected programs after routine modifications.

**Section sources**
- [programs.service.ts](file://apps/server/src/shared/service/resources/programs.service.ts)
- [programs.repository.ts](file://apps/server/src/shared/repository/programs.repository.ts)
- [task.prisma](file://packages/schema/prisma/schema/task.prisma)