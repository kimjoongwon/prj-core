# Prisma Schema File Conventions (Strict)

## 목적

`packages/be-prisma/schema`의 파일 분할 기준을 Aggregate Root 중심으로 고정하고, 재발 방지를 위해 자동 검증 가능한 형태로 관리합니다.

## 절대 기준

1. `_base.prisma`는 `generator`/`datasource`만 포함합니다.
2. 모델/enum은 단일 파일에만 선언합니다.
3. 선언 소유권은 아래 매트릭스를 따릅니다.
4. enum은 실제 사용처가 있어야 합니다(미사용 enum 금지).
5. 주석 표준은 `@displayName`을 사용합니다(`@DisplayName` 금지).

## 소유권 매트릭스

| 파일 | 소유 모델/enum |
|------|----------------|
| `taxonomy.prisma` | `Category`, `Group`, `CategoryTypes`, `GroupTypes` |
| `tenancy.prisma` | `Tenant`, `Assignment` |
| `content.prisma` | `Post`, `Content`, `TextTypes` |
| `security-policy.prisma` | `SecurityPolicy`, `WhitelistType`, `WhitelistEntry` |
| `auth-audit.prisma` | `AuthAuditLog`, `AuthAuditResult` |
| `password-history.prisma` | `PasswordHistory` |
| `subject.prisma` | `Subject` |
| `action.prisma` | `Action` |
| `ability.prisma` | `Ability` |
| `grant.prisma` | `Grant` |
| `inquiry.prisma` | `Inquiry`, `InquiryTag`, `InquiryCategory`, `InquiryChannel`, `InquiryStatus`, `InquiryPriority`, `InquirySource` |
| `inquiry-thread.prisma` | `InquiryThread`, `InquiryMessage`, `InquiryParticipant`, `InquiryAttachment`, `InquiryParticipantRole`, `SenderType`, `ThreadStatus`, `MessageContentType`, `AttachmentFileType` |
| `inquiry-ai.prisma` | `SentimentAnalysis`, `AIAgentLog`, `SentimentType`, `AIAgentAction` |
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

