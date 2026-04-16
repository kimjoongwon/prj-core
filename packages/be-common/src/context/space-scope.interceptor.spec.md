# space-scope.interceptor util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/context/space-scope.interceptor.ts

## 역할

현재 선택된 Tenant와 `x-space-id`를 기준으로 `EFFECTIVE_SPACE_IDS`를 계산해 CLS에 저장합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SpaceScopeInterceptor | 현재 tenant role이 `FULL_ACCESS`면 전체 조회 scope를 열고, 그 외에는 현재 `x-space-id` 1개로 고정 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | 전체 조회 조건을 ROOT 여부와 무관한 현재 tenant role `FULL_ACCESS` 기준으로 정정 | codex |
| 2026-04-15 | 전체 조회 조건을 `ROOT(System) + FULL_ACCESS` 조합으로 명시 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | lint 에러 대응을 위한 `intercept` 반환 타입 명시(`Observable<unknown>`) | codex |
| 2026-04-14 | Space scope 계산 설명을 x-space-id header 기반 current tenant 규칙으로 갱신 | codex |
