# space-scope.interceptor util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/context/space-scope.interceptor.ts

## 역할

현재 선택된 Tenant와 `x-space-id`를 기준으로 `EFFECTIVE_SPACE_IDS`를 계산해 CLS에 저장합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SpaceScopeInterceptor | 보호 라우트에서 `x-space-id`/tenant를 필수 검증하고, 현재 tenant role이 `FULL_ACCESS`면 전체 조회 scope를 열며, 그 외에는 `tenant.space.id ?? tenant.spaceId ?? x-space-id` 1개로 고정 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | 일반 tenant scope 계산 기준을 `tenant.space.id ?? tenant.spaceId ?? x-space-id`로 보정 | codex |
| 2026-04-25 | 보호 라우트에서 `x-space-id`는 있으나 tenant가 없으면 403으로 차단하는 방어 로직 추가 | codex |
| 2026-04-16 | 전체 조회 조건을 ROOT 여부와 무관한 현재 tenant role `FULL_ACCESS` 기준으로 정정 | codex |
| 2026-04-15 | 전체 조회 조건을 `ROOT(System) + FULL_ACCESS` 조합으로 명시 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | lint 에러 대응을 위한 `intercept` 반환 타입 명시(`Observable<unknown>`) | codex |
| 2026-04-14 | Space scope 계산 설명을 x-space-id header 기반 current tenant 규칙으로 갱신 | codex |
