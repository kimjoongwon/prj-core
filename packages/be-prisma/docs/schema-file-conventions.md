# Prisma Schema File Conventions (Strict)

## 목적

`packages/be-prisma/schema` 분할 규칙을 Aggregate Root 기준으로 고정하고, 자동 검증으로 예외 없는 운영을 보장합니다.

## 절대 기준

1. `_base.prisma`는 `generator`/`datasource`만 포함합니다.
2. 모델/enum은 단일 파일에만 선언합니다.
3. 각 파일은 Aggregate Root를 정확히 1개만 가집니다.
4. 선언 소유권은 아래 매트릭스를 따릅니다.
5. enum은 실제 사용처가 있어야 합니다(미사용 enum 금지).
6. 주석 표준은 `@displayName`만 허용합니다(`@DisplayName`, `@displayname` 금지).

## 파일별 Aggregate Root

| 파일 | Aggregate Root |
|------|----------------|
| `category.prisma` | `Category` |
| `group.prisma` | `Group` |
| `tenancy.prisma` | `Tenant` |
| `content.prisma` | `Content` |
| `security-policy.prisma` | `SecurityPolicy` |
| `whitelist-entry.prisma` | `WhitelistEntry` |
| `auth-audit.prisma` | `AuthAuditLog` |
| `password-history.prisma` | `PasswordHistory` |
| `subject.prisma` | `Subject` |
| `action.prisma` | `Action` |
| `ability.prisma` | `Ability` |
| `grant.prisma` | `Grant` |
| `inquiry.prisma` | `Inquiry` |
| `inquiry-thread.prisma` | `InquiryThread` |
| `inquiry-ai.prisma` | `AIAgentLog` |
| `oidc-client.prisma` | `OidcClient` |
| `oidc-model.prisma` | `OidcModel` |
| `role.prisma` | `Role` |
| `safe.prisma` | `SafeWallet` |
| `space.prisma` | `Space` |
| `timeline.prisma` | `Timeline` |
| `routine.prisma` | `Routine` |
| `task.prisma` | `Task` |
| `template.prisma` | `Template` |
| `translation.prisma` | `Translation` |
| `user.prisma` | `User` |
| `asset.prisma` | `Asset` |
| `folder.prisma` | `Folder` |
| `album.prisma` | `Album` |

## 선언 소유권 매트릭스

| 파일 | 소유 모델/enum |
|------|----------------|
| `category.prisma` | `Category`, `CategoryTypes` |
| `group.prisma` | `Group`, `GroupTypes` |
| `tenancy.prisma` | `Tenant`, `Assignment` |
| `content.prisma` | `Post`, `Content`, `TextTypes` |
| `security-policy.prisma` | `SecurityPolicy` |
| `whitelist-entry.prisma` | `WhitelistType`, `WhitelistEntry` |
| `auth-audit.prisma` | `AuthAuditLog`, `AuthAuditResult` |
| `password-history.prisma` | `PasswordHistory` |
| `subject.prisma` | `Subject` |
| `action.prisma` | `Action` |
| `ability.prisma` | `Ability` |
| `grant.prisma` | `Grant` |
| `inquiry.prisma` | `Inquiry`, `InquiryTag`, `SentimentAnalysis`, `InquiryCategory`, `InquiryChannel`, `InquiryStatus`, `InquiryPriority`, `InquirySource`, `SentimentType` |
| `inquiry-thread.prisma` | `InquiryThread`, `InquiryMessage`, `InquiryParticipant`, `InquiryAttachment`, `InquiryParticipantRole`, `SenderType`, `ThreadStatus`, `MessageContentType`, `AttachmentFileType` |
| `inquiry-ai.prisma` | `AIAgentLog`, `AIAgentAction` |
| `oidc-client.prisma` | `OidcClient` |
| `oidc-model.prisma` | `OidcModel` |
| `role.prisma` | `Role`, `RoleAssociation`, `RoleClassification` |
| `safe.prisma` | `SafeWallet`, `SafeTransaction`, `SafeConfirmation` |
| `space.prisma` | `Space`, `SpaceClassification`, `SpaceAssociation`, `Ground` |
| `timeline.prisma` | `Timeline`, `Session`, `Program`, `SessionTypes`, `RepeatCycleTypes`, `RecurringDayOfWeek` |
| `routine.prisma` | `Routine`, `Activity` |
| `task.prisma` | `Task`, `Exercise` |
| `template.prisma` | `Template`, `TemplateVariable`, `TemplateType` |
| `translation.prisma` | `Translation`, `LanguageCode` |
| `user.prisma` | `User`, `UserClassification`, `UserAssociation`, `Profile` |
| `asset.prisma` | `Asset`, `Image`, `Video`, `Document`, `Derivative`, `AssetKind`, `AssetStatus`, `DerivativeKind` |
| `folder.prisma` | `Folder` |
| `album.prisma` | `Album`, `AlbumEntry` |

## 검증 명령

```bash
pnpm --filter=@cocrepo/prisma schema:check
pnpm --filter=@cocrepo/prisma exec prisma validate
```
