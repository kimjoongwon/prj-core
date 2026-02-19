# Groups Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/group/groups.controller.ts`

## 역할

그룹(Group) 리소스의 CRUD 작업을 처리하는 REST 컨트롤러.
역할 그룹, Space 그룹 등 다양한 타입의 그룹을 관리하며, type 쿼리 파라미터로 유형별 필터링이 가능하다.

## 베이스 경로

`/api/v1/groups`

## 의존성

| 서비스 | 역할 |
|--------|------|
| GroupsService | 그룹 비즈니스 로직 처리 |
| SpaceContext | 현재 Space 컨텍스트 (생성 시 spaceId 전달) |

## 엔드포인트

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|-----|--------|-------------|------|
| GET | `/` | getGroups | QueryGroupDto (query) | GroupDto[] | 200 | 그룹 목록 조회 (type 필터링) |
| GET | `/:id` | getGroupById | - (UUID path param) | GroupDto | 200 | 그룹 상세 조회 (역할 연관 포함) |
| POST | `/` | createGroup | CreateGroupDto | GroupDto | 201 | 그룹 생성 |
| PATCH | `/:id` | updateGroup | UpdateGroupDto (UUID path param) | GroupDto | 200 | 그룹 수정 |
| DELETE | `/:id` | deleteGroup | - (UUID path param) | GroupDto | 200 | 그룹 삭제 |

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

## Query DTO

### QueryGroupDto

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| type | string | X | 그룹 유형 필터 (예: "Role", "Space") |

## 데코레이터 사용

| 데코레이터 | 용도 |
|------------|------|
| @ApiTags("GROUPS") | Swagger 태그 |
| @ApiAuth() | 인증 필요 API 문서화 |
| @ApiErrors(...) | 에러 응답 문서화 |
| @ApiResponseEntity(...) | 응답 타입 문서화 |
| @ResponseMessage(...) | 응답 메시지 설정 |
| @Roles([...]) | 역할 기반 접근 제어 |
| @UseGuards(RolesGuard) | 역할 Guard 적용 |

## 비즈니스 규칙

- 그룹 생성 시 SpaceContext에서 현재 spaceId를 주입
- 상세 조회 시 연결된 역할(RoleAssociation) 정보를 포함하여 반환
- 그룹 삭제 시 연결된 역할이 있어도 삭제 가능 (연관 함께 삭제)
- Path parameter `id`는 ParseUUIDPipe로 UUID 검증

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
