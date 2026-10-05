# @cocrepo/aggregate

Aggregate service provider package.

This package owns domain services that sit at the center of an aggregate.
Classes are named `{Domain}Aggregate` and are Nest providers.

```txt
packages/be-aggregate/src/{domain}/{domain}.aggregate.ts
```

Aggregate root entity classes remain in `@cocrepo/entity`.

## Current Aggregates

- `AbilityAggregate`
- `ActionAggregate`
- `AssetAggregate`
- `AuthAuditLogAggregate`
- `ContentAggregate`
- `EmailVerificationAggregate`
- `FolderAggregate`
- `IdpAccountAggregate`
- `IdpDashboardAggregate`
- `OidcClientAggregate`
- `OidcSessionAggregate`
- `InquiryAggregate`
- `PolicyAggregate`
- `RoleAssignmentAggregate`
- `ReservationAggregate`
- `RoleAggregate`
- `RoutineAggregate`
- `SecurityPolicyAggregate`
- `ServiceDocumentAggregate`
- `SpaceAggregate`
- `SubjectAggregate`
- `TaskAggregate`
- `TenantAccessRequestAggregate`
- `TimelineAggregate`
- `TranslationCatalogAggregate`

`UserService`, `TemplateService`, `EmailService`, token, Redis, Prisma, object
storage, masking, and i18n providers stay in `@cocrepo/service` as support
services.
