# Grants Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/grants/grants.controller.ts`

## 역할

Grant 배치 할당과 Role별 조회 API를 노출하며, 요청 해석과 응답 조립은 `GrantFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| grantFacade | GrantFacade | Grant 배치 할당 및 Role별 조회 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| PUT | `/roles/:roleId` | `batchAssignGrantsToRole` | Role별 Grant 전체 동기화 |
| GET | `/roles/:roleId` | `getGrantsByRoleId` | Role별 Grant 목록 조회 |

## 비즈니스 메모

- `BatchGrantRequestDto.grants` 해석과 Role별 전체 동기화 진입점은 Facade가 담당합니다.
- Grant 정합성 검증과 저장 로직은 Facade 내부 `GrantService`가 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 GrantService로 전환 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `GrantFacade` 기준으로 갱신 | codex |
