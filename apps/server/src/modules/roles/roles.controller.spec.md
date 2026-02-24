# Roles Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/role/roles.controller.ts`

## 역할

시스템 역할(Role) 리소스의 CRUD 작업을 처리하는 REST 컨트롤러.
역할 목록 조회, 상세 조회, 생성, 수정, 삭제 엔드포인트를 제공한다.

## 베이스 경로

`/api/v1/roles`

## 의존성

| 서비스 | 역할 |
|--------|------|
| RolesService | 역할 비즈니스 로직 처리 |

## 엔드포인트

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|-----|--------|-------------|------|
| GET | `/` | getRoles | - | RoleDto[] | 200 | 역할 목록 조회 |
| GET | `/:id` | getRoleById | - (UUID path param) | RoleDto | 200 | 역할 상세 조회 |
| POST | `/` | createRole | CreateRoleDto | RoleDto | 201 | 역할 생성 |
| PATCH | `/:id` | updateRole | UpdateRoleDto (UUID path param) | RoleDto | 200 | 역할 수정 (displayName, description만) |
| DELETE | `/:id` | deleteRole | - (UUID path param) | RoleDto | 200 | 역할 삭제 |

## 인증/인가

| 엔드포인트 | 인증 필요 | Guard | 권한 |
|------------|:---------:|-------|------|
| GET `/` | O | RolesGuard | MANAGE, FULL_ACCESS |
| GET `/:id` | O | RolesGuard | MANAGE, FULL_ACCESS |
| POST `/` | O | RolesGuard | FULL_ACCESS |
| PATCH `/:id` | O | RolesGuard | FULL_ACCESS |
| DELETE `/:id` | O | RolesGuard | FULL_ACCESS |

## 에러 코드

| 엔드포인트 | 에러 코드 |
|------------|-----------|
| GET `/` | 401, 403, 500 |
| GET `/:id` | 401, 403, 404, 500 |
| POST `/` | 400, 401, 403, 409, 500 |
| PATCH `/:id` | 400, 401, 403, 404, 500 |
| DELETE `/:id` | 400, 401, 403, 404, 500 |

## 데코레이터 사용

| 데코레이터 | 용도 |
|------------|------|
| @ApiTags("ROLES") | Swagger 태그 |
| @ApiAuth() | 인증 필요 API 문서화 |
| @ApiErrors(...) | 에러 응답 문서화 |
| @ApiResponseEntity(...) | 응답 타입 문서화 |
| @ResponseMessage(...) | 응답 메시지 설정 |
| @Roles([...]) | 역할 기반 접근 제어 |
| @UseGuards(RolesGuard) | 역할 Guard 적용 |

## 비즈니스 규칙

- 시스템 역할(FULL_ACCESS, MANAGE, VIEW)은 수정/삭제 불가 (Service 레이어에서 검증)
- 연결된 사용자가 있는 역할은 삭제 불가 (Service 레이어에서 검증)
- 역할 식별자(name)는 영문 대문자와 언더스코어만 사용 가능
- Path parameter `id`는 ParseUUIDPipe로 UUID 검증

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
