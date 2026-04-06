# RoleGrant Facade 기획서

> 생성일: 2026-04-06
> 타입: application-service
> 위치: packages/be-facade/src/role-grant.facade.ts

## 역할

GrantsController가 역할 권한 배치 저장 요청을 직접 해석하지 않도록 `BatchAssignRoleGrantRequestDto`를 `RoleGrantService` 입력으로 얇게 전달합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| `RoleGrantService` | RoleGrant 배치 동기화 수행 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| `batchAssignToRole` | `roleGrants` 배열을 RoleGrantService의 배치 입력으로 전달 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 기존 GrantFacade를 RoleGrant 전용 facade로 교체 | codex |
