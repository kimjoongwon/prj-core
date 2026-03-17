# Prisma Schema File Conventions

## 목적

`packages/be-prisma/schema`를 도메인 폴더 기준으로 분할하고, 각 파일의 대표 모델과 실제 aggregate root를 구분하여 자동 검증합니다.

## 절대 기준

1. `_base.prisma`는 루트에 두고 `generator`/`datasource` 및 공통 메타데이터 규칙만 정의합니다.
2. 나머지 `.prisma` 파일은 도메인 폴더(`access-control/`, `identity/`, `asset/` 등) 아래에 둡니다.
3. 모델/enum은 단일 파일에만 선언합니다.
4. 각 파일은 `_base.prisma`를 제외하고 `@schema-owner: true` 모델을 정확히 1개만 가집니다.
5. `@schema-owner: true`는 해당 파일의 대표 소유 모델(anchor model)입니다.
6. `@aggregate-root: true`는 `@schema-owner: true` 모델 중 독립적으로 관리되는 실제 aggregate root에만 선택적으로 부여합니다.
7. 선언 소유권은 아래 매트릭스를 따릅니다.
8. enum은 실제 사용처가 있어야 합니다(미사용 enum 금지).
9. 주석 표준은 `@displayName`만 허용합니다(`@DisplayName`, `@displayname` 금지).

## 도메인 폴더 구조

| 도메인 폴더 | 설명 |
|-------------|------|
| `access-control/` | Subject/Action/Ability/Grant/Role |
| `asset/` | Asset/Folder/Album |
| `auth/` | 감사 로그, 비밀번호 이력, 정책, 화이트리스트 |
| `content/` | Content/Template/Translation |
| `identity/` | User/Space/Tenant |
| `inquiry/` | Inquiry/Thread/AI 로그 |
| `oidc/` | OIDC client/model |
| `platform/` | 운영 메타데이터 및 배포 이력 |
| `scheduling/` | Timeline/Routine/Task |
| `taxonomy/` | Category/Group |
| `wallet/` | SafeWallet |

## 파일별 Schema Owner Marker

| 파일 | `@schema-owner: true` 모델 |
|------|----------------------------|
| `access-control/ability.prisma` | `Ability` |
| `access-control/action.prisma` | `Action` |
| `access-control/grant.prisma` | `Grant` |
| `access-control/role.prisma` | `Role` |
| `access-control/subject.prisma` | `Subject` |
| `asset/album.prisma` | `Album` |
| `asset/asset.prisma` | `Asset` |
| `asset/folder.prisma` | `Folder` |
| `auth/auth-audit.prisma` | `AuthAuditLog` |
| `auth/password-history.prisma` | `PasswordHistory` |
| `auth/security-policy.prisma` | `SecurityPolicy` |
| `auth/whitelist-entry.prisma` | `WhitelistEntry` |
| `content/content.prisma` | `Content` |
| `content/template.prisma` | `Template` |
| `content/translation.prisma` | `Translation` |
| `identity/space.prisma` | `Space` |
| `identity/tenant.prisma` | `Tenant` |
| `identity/user.prisma` | `User` |
| `inquiry/inquiry-ai.prisma` | `AIAgentLog` |
| `inquiry/inquiry-thread.prisma` | `InquiryThread` |
| `inquiry/inquiry.prisma` | `Inquiry` |
| `oidc/oidc-client.prisma` | `OidcClient` |
| `oidc/oidc-model.prisma` | `OidcModel` |
| `platform/reference-data-migration.prisma` | `ReferenceDataMigrationHistory` |
| `scheduling/routine.prisma` | `Routine` |
| `scheduling/task.prisma` | `Task` |
| `scheduling/timeline.prisma` | `Timeline` |
| `taxonomy/category.prisma` | `Category` |
| `taxonomy/group.prisma` | `Group` |
| `wallet/safe.prisma` | `SafeWallet` |

## 파일별 Aggregate Root Marker

| 파일 | `@aggregate-root: true` 모델 |
|------|------------------------------|
| `access-control/ability.prisma` | `Ability` |
| `access-control/action.prisma` | `Action` |
| `access-control/grant.prisma` | `Grant` |
| `access-control/role.prisma` | `Role` |
| `access-control/subject.prisma` | `Subject` |
| `asset/album.prisma` | `Album` |
| `asset/asset.prisma` | `Asset` |
| `asset/folder.prisma` | `Folder` |
| `auth/security-policy.prisma` | `SecurityPolicy` |
| `auth/whitelist-entry.prisma` | `WhitelistEntry` |
| `content/content.prisma` | `Content` |
| `content/template.prisma` | `Template` |
| `content/translation.prisma` | `Translation` |
| `identity/space.prisma` | `Space` |
| `identity/tenant.prisma` | `Tenant` |
| `identity/user.prisma` | `User` |
| `inquiry/inquiry.prisma` | `Inquiry` |
| `oidc/oidc-client.prisma` | `OidcClient` |
| `oidc/oidc-model.prisma` | `OidcModel` |
| `platform/reference-data-migration.prisma` | `ReferenceDataMigrationHistory` |
| `scheduling/routine.prisma` | `Routine` |
| `scheduling/task.prisma` | `Task` |
| `scheduling/timeline.prisma` | `Timeline` |
| `taxonomy/category.prisma` | `Category` |
| `taxonomy/group.prisma` | `Group` |
| `wallet/safe.prisma` | `SafeWallet` |

다음 파일들은 대표 모델은 있으나 aggregate root는 아닙니다.

- `auth/auth-audit.prisma`
- `auth/password-history.prisma`
- `inquiry/inquiry-ai.prisma`
- `inquiry/inquiry-thread.prisma`

## 선언 소유권 매트릭스

| 파일 | 소유 모델/enum |
|------|----------------|
| `access-control/ability.prisma` | `Ability` |
| `access-control/action.prisma` | `Action` |
| `access-control/grant.prisma` | `Grant` |
| `access-control/role.prisma` | `Role`, `RoleAssociation`, `RoleClassification` |
| `access-control/subject.prisma` | `Subject` |
| `asset/album.prisma` | `Album`, `AlbumEntry` |
| `asset/asset.prisma` | `Asset`, `Image`, `Video`, `Document`, `Derivative`, `AssetKind`, `AssetStatus`, `DerivativeKind` |
| `asset/folder.prisma` | `Folder` |
| `auth/auth-audit.prisma` | `AuthAuditLog`, `AuthAuditResult` |
| `auth/password-history.prisma` | `PasswordHistory` |
| `auth/security-policy.prisma` | `SecurityPolicy` |
| `auth/whitelist-entry.prisma` | `WhitelistType`, `WhitelistEntry` |
| `content/content.prisma` | `Post`, `Content`, `TextTypes` |
| `content/template.prisma` | `Template`, `TemplateVariable`, `TemplateType` |
| `content/translation.prisma` | `Translation`, `LanguageCode` |
| `identity/space.prisma` | `Space`, `SpaceClassification`, `SpaceAssociation`, `Ground` |
| `identity/tenant.prisma` | `Tenant`, `Assignment` |
| `identity/user.prisma` | `User`, `UserClassification`, `UserAssociation`, `Profile` |
| `inquiry/inquiry-ai.prisma` | `AIAgentLog`, `AIAgentAction` |
| `inquiry/inquiry-thread.prisma` | `InquiryThread`, `InquiryMessage`, `InquiryParticipant`, `InquiryAttachment`, `InquiryParticipantRole`, `SenderType`, `ThreadStatus`, `MessageContentType`, `AttachmentFileType` |
| `inquiry/inquiry.prisma` | `Inquiry`, `InquiryTag`, `SentimentAnalysis`, `InquiryCategory`, `InquiryChannel`, `InquiryStatus`, `InquiryPriority`, `InquirySource`, `SentimentType` |
| `oidc/oidc-client.prisma` | `OidcClient` |
| `oidc/oidc-model.prisma` | `OidcModel` |
| `platform/reference-data-migration.prisma` | `ReferenceDataMigrationHistory` |
| `scheduling/routine.prisma` | `Routine`, `Activity` |
| `scheduling/task.prisma` | `Task`, `Exercise` |
| `scheduling/timeline.prisma` | `Timeline`, `Session`, `Program`, `SessionTypes`, `RepeatCycleTypes`, `RecurringDayOfWeek` |
| `taxonomy/category.prisma` | `Category`, `CategoryTypes` |
| `taxonomy/group.prisma` | `Group`, `GroupTypes` |
| `wallet/safe.prisma` | `SafeWallet`, `SafeTransaction`, `SafeConfirmation` |

## 검증 명령

```bash
pnpm --filter=@cocrepo/prisma schema:check
pnpm --filter=@cocrepo/prisma exec prisma validate
```
