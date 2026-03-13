# Roles Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/roles/roles.controller.ts`

## 역할

Role CRUD API를 노출하며, 컨트롤러 경계의 요청 해석과 응답 조립은 `RoleFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| roleFacade | RoleFacade | Role 목록/상세/생성/수정/삭제 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getRoles` | 역할 목록 조회 |
| GET | `/:id` | `getRoleById` | 역할 상세 조회 |
| POST | `/` | `createRole` | 역할 생성 |
| PATCH | `/:id` | `updateRole` | 역할 수정 |
| DELETE | `/:id` | `deleteRole` | 역할 삭제 |

## 비즈니스 메모

- 시스템 Role 보호와 연결 사용자 검증은 Facade 내부 `RoleService`가 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 RoleService로 전환 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `RoleFacade` 기준으로 갱신 | codex |
