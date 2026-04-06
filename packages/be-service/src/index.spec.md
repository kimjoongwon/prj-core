# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/be-service/src/index.ts

## 역할

이 파일은 service 패키지의 공개 export를 한곳에서 관리합니다.
메일 전송은 `EmailService`뿐 아니라 `EmailProvider` 추상 token, `SmtpEmailProvider`, `EmailModule`까지 외부에 노출해 구현 교체 지점을 명확히 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | service 패키지 공개 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | GrantService export를 제거하고 RoleGrantService export를 추가 | codex |
| 2026-03-23 | `EmailService`와 `TemplateService` export를 폴더형 `index` 경로로 명시해 stale dist 평면 경로를 다시 참조하지 않도록 정리 | codex |
| 2026-03-23 | `EmailProvider`/`SmtpEmailProvider`/`EmailModule` export를 추가해 메일 전송 구현 교체 지점을 배럴에서 직접 노출 | codex |
| 2026-03-16 | `TokenService`도 폴더형 `token.service/index.ts`로 명시 export해 stale dist 경로로 인한 Nest DI 토큰 분리를 방지 | codex |
| 2026-03-16 | 폴더형 `token-storage.service/index.ts` export를 명시해 stale dist barrel type shadowing을 제거하고 `OidcStatePayload`를 함께 공개 | codex |
| 2026-03-15 | `AwsService` export를 제거하고 `ObjectStorageService`/`S3CompatibleStorageService` export를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-13 | frontend 런타임 미사용 translation CRUD service export를 제거 | codex |
| 2026-03-15 | admin assets 복구를 위해 AssetService/FolderService export를 추가 | codex |
