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
- `AssetAggregate`
- `AuthAuditLogAggregate`
- `ContentAggregate`
- `EmailVerificationAggregate`
- `FolderAggregate`
- `OidcClientAggregate`
- `PolicyAggregate`
- `RoleAssignmentAggregate`
- `ReservationAggregate`
- `RoleAggregate`
- `SecurityPolicyAggregate`
- `SpaceAggregate`
- `TranslationCatalogAggregate`

`UserService`, `TemplateService`, `EmailService`, token, Redis, Prisma, object
storage, masking, and i18n providers stay in `@cocrepo/service` as support
services.
