# sync-reference-data util 기획서

> 생성일: 2026-03-26
> 타입: util
> 위치: packages/be-prisma/src/reference-data/sync-reference-data.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| ReferenceDataSyncResult | 공개 계약 요소 |

## 동작 메모

- OIDC reference client sync는 seed에 없는 legacy clientId(`storybook`, `prj-core-mobile`, `prj-core-swagger`)를 먼저 비활성화하고 `removedAt`을 채웁니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | OIDC clientId 개편에 맞춰 legacy 식별자를 sync 단계에서 비활성화하는 규칙을 추가 | codex |
| 2026-04-06 | 역할 권한 seed 연결 대상을 `grant`에서 `roleGrant`로 분리한 구조에 맞춰 반영 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
