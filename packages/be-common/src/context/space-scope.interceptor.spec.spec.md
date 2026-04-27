# space-scope.interceptor.spec 테스트 기획서

> 생성일: 2026-04-25
> 타입: unit-test
> 위치: packages/be-common/src/context/space-scope.interceptor.spec.ts

## 역할

`SpaceScopeInterceptor`가 현재 `x-space-id`와 CLS tenant를 기준으로 전체/단일 Space scope를 계산하고, 보호 라우트에서 tenant 미매칭을 차단하는지 검증합니다.

## 주요 시나리오

| 시나리오 | 설명 |
|------|------|
| FULL_ACCESS | 현재 tenant role이 `FULL_ACCESS`면 `EFFECTIVE_SPACE_IDS`를 `undefined`로 설정 |
| Space scoped | 일반 tenant면 `tenant.space.id ?? tenant.spaceId ?? x-space-id` 1개만 scope로 설정 |
| Missing header | 보호 라우트에서 `x-space-id`가 없으면 400 |
| Missing tenant | 보호 라우트에서 tenant가 없으면 403 |
| SkipSpaceCheck | skip 라우트는 tenant가 없어도 기존 scope 계산 유지 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | 일반 tenant에서 `tenant.space.id`를 effective scope로 쓰는 회귀 검증 추가 | codex |
| 2026-04-25 | 보호 라우트 tenant 필수 검증 회귀 테스트 신규 생성 | codex |
