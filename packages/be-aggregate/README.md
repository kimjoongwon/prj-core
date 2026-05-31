# @cocrepo/aggregate

Aggregate root service provider package.

This package owns domain services that sit at the center of an aggregate root.
Classes are named `{Domain}AggregateRoot` and are Nest providers.

```txt
packages/be-aggregate/src/{domain}/{domain}.aggregate-root.ts
```

Aggregate root entity classes remain in `@cocrepo/entity`.

## Current Promoted Roots

- `AbilityAggregateRoot`
- `ActionAggregateRoot`
- `AssetAggregateRoot`
- `AuthAuditLogAggregateRoot`
- `ContentAggregateRoot`
- `CourseAggregateRoot`
- `EmailVerificationAggregateRoot`
- `FolderAggregateRoot`
- `IdpAccountAggregateRoot`
- `IdpDashboardAggregateRoot`
- `OidcClientAggregateRoot`
- `OidcSessionAggregateRoot`
- `InquiryAggregateRoot`
- `PaymentAggregateRoot`
- `PolicyAggregateRoot`
- `PolicyAssignmentAggregateRoot`
- `ReservationAggregateRoot`
- `RoleAggregateRoot`
- `RoutineAggregateRoot`
- `SecurityPolicyAggregateRoot`
- `ServiceDocumentAggregateRoot`
- `SpaceAggregateRoot`
- `SubjectAggregateRoot`
- `TaskAggregateRoot`
- `TenantAccessRequestAggregateRoot`
- `TimelineAggregateRoot`
- `TranslationCatalogAggregateRoot`

`UserService`, `TemplateService`, `EmailService`, token, Redis, Prisma, object
storage, masking, and i18n providers stay in `@cocrepo/service` as support
services.
