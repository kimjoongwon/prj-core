# Content Management Data Models

<cite>
**Referenced Files in This Document**   
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts)
- [program.dto.ts](file://packages/schema/src/dto/program.dto.ts)
- [routine.dto.ts](file://packages/schema/src/dto/routine.dto.ts)
- [exercise.dto.ts](file://packages/schema/src/dto/exercise.dto.ts)
- [session.dto.ts](file://packages/schema/src/dto/session.dto.ts)
- [category.dto.ts](file://packages/schema/src/dto/category.dto.ts)
- [abstract.entity.ts](file://packages/schema/src/entity/abstract.entity.ts)
- [repeat-cycle-types.enum.ts](file://packages/schema/src/enum/repeat-cycle-types.enum.ts)
- [recurring-day-of-week.enum.ts](file://packages/schema/src/enum/recurring-day-of-week.enum.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Entity Hierarchy](#core-entity-hierarchy)
3. [Program Entity](#program-entity)
4. [Routine Entity](#routine-entity)
5. [Exercise Entity](#exercise-entity)
6. [Session Entity](#session-entity)
7. [Categorization System](#categorization-system)
8. [Scheduling and Recurrence](#scheduling-and-recurrence)
9. [Data Integrity and Validation](#data-integrity-and-validation)
10. [Performance and Indexing](#performance-and-indexing)
11. [User and Tenant Contexts](#user-and-tenant-contexts)
12. [Conclusion](#conclusion)

## Introduction
The content management system in prj-core implements a hierarchical structure for organizing fitness and wellness content through four primary entities: Program, Routine, Exercise, and Session. These entities form a nested relationship where Programs contain Routines, Routines contain Exercises, and Sessions represent scheduled instances of content delivery. This documentation details the data model architecture, including entity relationships, categorization systems, scheduling logic, data integrity constraints, and performance considerations.

## Core Entity Hierarchy

```mermaid
graph TD
Program --> |contains| Routine
Routine --> |contains| Exercise
Program --> |generates| Session
Routine --> |generates| Session
Exercise --> |used in| Session
Category --> |classifies| Program
Category --> |classifies| Routine
Category --> |classifies| Exercise
Category --> |classifies| Session
Tenant --> |owns| Program
User --> |accesses| Program
User --> |completes| Session
```

**Diagram sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts)

**Section sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L1-L50)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L1-L45)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L1-L40)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L1-L60)

## Program Entity

The Program entity represents a comprehensive content plan that serves as the top-level container in the hierarchy. Programs are composed of multiple Routines and can be scheduled to generate Sessions according to defined recurrence patterns.

```mermaid
classDiagram
class Program {
+string id
+string name
+string description
+string thumbnailUrl
+number durationDays
+string difficultyLevel
+boolean isPublished
+Date createdAt
+Date updatedAt
+Date publishedAt
+string tenantId
+string createdByUserId
}
class Routine {
+string id
+string name
+number orderIndex
+string programId
}
class Category {
+string id
+string name
+string type
+string parentId
}
Program --> Routine : "1..* contains"
Program --> Category : "classified by"
Program --> User : "created by"
Program --> Tenant : "owned by"
```

**Diagram sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L15-L100)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L15-L30)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L15-L25)

**Section sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L1-L150)
- [program.dto.ts](file://packages/schema/src/dto/program.dto.ts#L1-L80)

## Routine Entity

Routines represent structured sequences within a Program, containing multiple Exercises organized in a specific order. Each Routine is associated with a parent Program and contributes to the overall content flow.

```mermaid
classDiagram
class Routine {
+string id
+string name
+string description
+string thumbnailUrl
+number durationMinutes
+number orderIndex
+string programId
+string tenantId
+Date createdAt
+Date updatedAt
}
class Exercise {
+string id
+string name
+string description
+string mediaUrl
+number durationSeconds
+number orderIndex
+string routineId
}
Routine --> Exercise : "1..* contains"
Routine --> Program : "belongs to"
Routine --> Category : "classified by"
```

**Diagram sources**
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L15-L90)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L15-L35)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L15-L25)

**Section sources**
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L1-L120)
- [routine.dto.ts](file://packages/schema/src/dto/routine.dto.ts#L1-L70)

## Exercise Entity

Exercises are the atomic units of content within the system, representing individual activities or movements. Each Exercise contains detailed metadata and media references, and is organized within Routines.

```mermaid
classDiagram
class Exercise {
+string id
+string name
+string description
+string instructions
+string mediaUrl
+string previewUrl
+number durationSeconds
+number caloriesBurned
+string difficultyLevel
+string equipmentRequired
+string muscleGroup
+number orderIndex
+string routineId
+string tenantId
+Date createdAt
+Date updatedAt
}
class Category {
+string id
+string name
+string type
+string parentId
}
Exercise --> Category : "classified by"
Exercise --> Routine : "belongs to"
```

**Diagram sources**
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L15-L110)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L15-L25)

**Section sources**
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L1-L150)
- [exercise.dto.ts](file://packages/schema/src/dto/exercise.dto.ts#L1-L90)

## Session Entity

Sessions represent scheduled instances of content delivery, generated from Programs and Routines according to defined recurrence patterns. Sessions track user engagement and completion status.

```mermaid
classDiagram
class Session {
+string id
+string name
+string description
+string programId
+string routineId
+string sessionId
+Date scheduledStartAt
+Date scheduledEndAt
+Date actualStartAt
+Date actualEndAt
+string repeatCycleType
+string recurringDayOfWeek[]
+Date recurrenceEndDate
+string status
+string tenantId
+Date createdAt
+Date updatedAt
}
class Program {
+string id
+string name
}
class Routine {
+string id
+string name
}
Session --> Program : "generated from"
Session --> Routine : "generated from"
Session --> User : "assigned to"
Session --> Category : "classified by"
```

**Diagram sources**
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L15-L130)
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L15-L25)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L15-L25)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L15-L25)

**Section sources**
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L1-L180)
- [session.dto.ts](file://packages/schema/src/dto/session.dto.ts#L1-L100)

## Categorization System

The categorization system provides a flexible taxonomy for classifying content entities across multiple dimensions. Categories form hierarchical trees and can be applied to Programs, Routines, Exercises, and Sessions.

```mermaid
classDiagram
class Category {
+string id
+string name
+string displayName
+string type
+string parentId
+string tenantId
+number displayOrder
+boolean isActive
+Date createdAt
+Date updatedAt
}
class CategoryType {
+PROGRAM = "program"
+ROUTINE = "routine"
+EXERCISE = "exercise"
+SESSION = "session"
+MUSCLE_GROUP = "muscle_group"
+EQUIPMENT = "equipment"
+DIFFICULTY = "difficulty"
+GOAL = "goal"
}
Category --> Category : "parent-child"
Category --> CategoryType : "has type"
Program --> Category : "has categories"
Routine --> Category : "has categories"
Exercise --> Category : "has categories"
Session --> Category : "has categories"
```

**Diagram sources**
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L15-L80)
- [category.dto.ts](file://packages/schema/src/dto/category.dto.ts#L15-L40)

**Section sources**
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L1-L120)
- [category.dto.ts](file://packages/schema/src/dto/category.dto.ts#L1-L60)
- [category-types.enum.ts](file://packages/schema/src/enum/category-types.enum.ts#L1-L20)

## Scheduling and Recurrence

The scheduling system supports flexible recurrence patterns for generating Sessions from Programs and Routines. The recurrence logic accommodates various cycle types and day-of-week specifications.

```mermaid
stateDiagram-v2
[*] --> RecurrenceConfiguration
RecurrenceConfiguration --> DailyCycle : "repeatCycleType = daily"
RecurrenceConfiguration --> WeeklyCycle : "repeatCycleType = weekly"
RecurrenceConfiguration --> MonthlyCycle : "repeatCycleType = monthly"
RecurrenceConfiguration --> CustomCycle : "repeatCycleType = custom"
DailyCycle --> GenerateDailySessions : "create session daily"
WeeklyCycle --> SelectDaysOfWeek : "select recurringDayOfWeek"
SelectDaysOfWeek --> GenerateWeeklySessions : "create sessions on selected days"
MonthlyCycle --> GenerateMonthlySessions : "create session monthly"
CustomCycle --> DefinePattern : "set custom recurrence rules"
DefinePattern --> GenerateCustomSessions : "create sessions by pattern"
GenerateDailySessions --> RecurrenceEndDateCheck
GenerateWeeklySessions --> RecurrenceEndDateCheck
GenerateMonthlySessions --> RecurrenceEndDateCheck
GenerateCustomSessions --> RecurrenceEndDateCheck
RecurrenceEndDateCheck --> [*] : "recurrenceEndDate reached"
RecurrenceEndDateCheck --> GenerateMoreSessions : "continue generating"
```

**Diagram sources**
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L45-L75)
- [repeat-cycle-types.enum.ts](file://packages/schema/src/enum/repeat-cycle-types.enum.ts#L1-L15)
- [recurring-day-of-week.enum.ts](file://packages/schema/src/enum/recurring-day-of-week.enum.ts#L1-L15)

**Section sources**
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L30-L100)
- [repeat-cycle-types.enum.ts](file://packages/schema/src/enum/repeat-cycle-types.enum.ts#L1-L20)
- [recurring-day-of-week.enum.ts](file://packages/schema/src/enum/recurring-day-of-week.enum.ts#L1-L20)

## Data Integrity and Validation

The data model enforces strict integrity constraints and validation rules to maintain data quality and consistency across the content hierarchy.

```mermaid
flowchart TD
Start([Entity Creation]) --> ValidateRequiredFields["Validate Required Fields"]
ValidateRequiredFields --> RequiredFieldsValid{"All Required Fields Present?"}
RequiredFieldsValid --> |No| ReturnError["Return Validation Error"]
RequiredFieldsValid --> |Yes| ValidateRelationships["Validate Parent-Child Relationships"]
ValidateRelationships --> RelationshipsValid{"Parent Exists and Valid?"}
RelationshipsValid --> |No| ReturnError
RelationshipsValid --> |Yes| ValidateOrdering["Validate Order Index Constraints"]
ValidateOrdering --> OrderingValid{"Order Index Unique in Parent?"}
OrderingValid --> |No| ReturnError
OrderingValid --> |Yes| ValidateRecurrence["Validate Recurrence Rules"]
ValidateRecurrence --> RecurrenceValid{"Recurrence Rules Consistent?"}
RecurrenceValid --> |No| ReturnError
RecurrenceValid --> |Yes| CheckTenantContext["Validate Tenant Context"]
CheckTenantContext --> TenantValid{"Entity Belongs to Tenant?"}
TenantValid --> |No| ReturnError
TenantValid --> |Yes| ApplyCascadingRules["Apply Cascading Behaviors"]
ApplyCascadingRules --> CascadeDelete["Cascade Delete to Children"]
ApplyCascadingRules --> CascadeUpdate["Cascade Update to Children"]
ApplyCascadingRules --> MaintainIntegrity["Maintain Referential Integrity"]
CascadeDelete --> Success([Entity Created/Updated])
CascadeUpdate --> Success
MaintainIntegrity --> Success
ReturnError --> Success
```

**Diagram sources**
- [abstract.entity.ts](file://packages/schema/src/entity/abstract.entity.ts#L15-L40)
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L60-L90)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L50-L80)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L50-L80)

**Section sources**
- [abstract.entity.ts](file://packages/schema/src/entity/abstract.entity.ts#L1-L60)
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L50-L120)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L40-L100)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L40-L100)

## Performance and Indexing

The data model includes optimized indexing strategies to support efficient querying of nested content structures, filtering, and sorting operations.

```mermaid
erDiagram
PROGRAM {
string id PK
string name
string tenantId FK
string createdByUserId FK
boolean isPublished
number durationDays
string difficultyLevel
datetime createdAt
datetime updatedAt
datetime publishedAt
}
ROUTINE {
string id PK
string name
string programId FK
string tenantId FK
number orderIndex
number durationMinutes
datetime createdAt
datetime updatedAt
}
EXERCISE {
string id PK
string name
string routineId FK
string tenantId FK
number orderIndex
number durationSeconds
string difficultyLevel
datetime createdAt
datetime updatedAt
}
SESSION {
string id PK
string programId FK
string routineId FK
datetime scheduledStartAt
datetime scheduledEndAt
string repeatCycleType
datetime recurrenceEndDate
string status
string tenantId FK
datetime createdAt
datetime updatedAt
}
CATEGORY {
string id PK
string name
string type
string parentId FK
string tenantId FK
number displayOrder
boolean isActive
datetime createdAt
datetime updatedAt
}
PROGRAM ||--o{ ROUTINE : "contains"
ROUTINE ||--o{ EXERCISE : "contains"
PROGRAM ||--o{ SESSION : "generates"
ROUTINE ||--o{ SESSION : "generates"
CATEGORY ||--o{ CATEGORY : "parent-child"
PROGRAM ||--o{ CATEGORY : "classified by"
ROUTINE ||--o{ CATEGORY : "classified by"
EXERCISE ||--o{ CATEGORY : "classified by"
SESSION ||--o{ CATEGORY : "classified by"
index PROGRAM(tenantId, isPublished, createdAt)
index ROUTINE(programId, orderIndex)
index EXERCISE(routineId, orderIndex)
index SESSION(scheduledStartAt, tenantId, status)
index CATEGORY(tenantId, type, parentId)
```

**Diagram sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L30-L50)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L30-L50)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L30-L50)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L30-L50)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L30-L50)

**Section sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L50-L100)
- [routine.entity.ts](file://packages/schema/src/entity/routine.entity.ts#L50-L100)
- [exercise.entity.ts](file://packages/schema/src/entity/exercise.entity.ts#L50-L100)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L50-L100)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L50-L100)

## User and Tenant Contexts

The content management system operates within multi-tenant and multi-user contexts, with strict access controls and ownership relationships.

```mermaid
graph TD
Tenant --> |owns| Program
Tenant --> |owns| Routine
Tenant --> |owns| Exercise
Tenant --> |owns| Session
Tenant --> |owns| Category
User --> |creates| Program
User --> |edits| Program
User --> |views| Program
User --> |completes| Session
Role --> |defines| Permissions
Permissions --> |grants| ProgramAccess
Permissions --> |grants| RoutineAccess
Permissions --> |grants| ExerciseAccess
Permissions --> |grants| SessionAccess
Program --> |accessible to| UserGroup
Routine --> |accessible to| UserGroup
Exercise --> |accessible to| UserGroup
Session --> |assigned to| User
Tenant --> |has| User
Tenant --> |has| UserGroup
Tenant --> |has| Role
```

**Diagram sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L25-L35)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L25-L35)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L25-L35)
- [abstract.entity.ts](file://packages/schema/src/entity/abstract.entity.ts#L15-L25)

**Section sources**
- [program.entity.ts](file://packages/schema/src/entity/program.entity.ts#L20-L60)
- [session.entity.ts](file://packages/schema/src/entity/session.entity.ts#L20-L60)
- [category.entity.ts](file://packages/schema/src/entity/category.entity.ts#L20-L60)
- [abstract.entity.ts](file://packages/schema/src/entity/abstract.entity.ts#L10-L50)

## Conclusion
The content management data model in prj-core establishes a robust hierarchical structure for organizing fitness and wellness content through the Program, Routine, Exercise, and Session entities. The model supports complex scheduling and recurrence patterns, flexible categorization across multiple dimensions, and strict data integrity constraints. With optimized indexing for performance and comprehensive tenant and user context management, the system provides a scalable foundation for content delivery and user engagement tracking. The cascading behaviors and validation rules ensure data consistency throughout the content hierarchy, while the multi-tenant architecture supports isolated content management for different organizations or user groups.