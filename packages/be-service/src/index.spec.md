# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/be-service/src/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | `TokenService`도 폴더형 `token.service/index.ts`로 명시 export해 stale dist 경로로 인한 Nest DI 토큰 분리를 방지 | codex |
| 2026-03-16 | 폴더형 `token-storage.service/index.ts` export를 명시해 stale dist barrel type shadowing을 제거하고 `OidcStatePayload`를 함께 공개 | codex |
| 2026-03-15 | `AwsService` export를 제거하고 `ObjectStorageService`/`S3CompatibleStorageService` export를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-13 | frontend 런타임 미사용 translation CRUD service export를 제거 | codex |
| 2026-03-15 | admin assets 복구를 위해 AssetService/FolderService export를 추가 | codex |
