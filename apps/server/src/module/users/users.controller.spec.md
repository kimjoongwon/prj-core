# Users Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: apps/server/src/module/users/users.controller.ts

## 역할

사용자(User) 리소스에 대한 CRUD REST API를 제공합니다. 현재 Space 기반으로 데이터를 필터링하며, CLS(Continuation-Local Storage)를 통해 요청 컨텍스트(Space ID, 인증 사용자)를 관리합니다.

## 베이스 경로

`/api/v1/users` (Controller 데코레이터에 명시적 경로 없음, 모듈 라우팅으로 결정)

## 의존성

| 서비스 | 역할 |
|--------|------|
| `UsersService` | 사용자 비즈니스 로직 (CRUD) |
| `ClsService` | 요청 컨텍스트 (SPACE_ID, AUTH_USER) 접근 |

## 엔드포인트

| Method | 경로 | Operation ID | Query/Body DTO | 반환값 | Status | 설명 |
|--------|------|-------------|----------------|--------|--------|------|
| GET | `/` | `getUsers` | `QueryUsersDto` | `UserDto[]` + meta + stats | 200 | 사용자 목록 조회 |
| GET | `/:id` | `getUserById` | - (Path: id UUID) | `UserDetailResponseDto` | 200 | 사용자 상세 조회 |
| POST | `/` | `createUser` | `CreateUserMemberDto` | `UserDto` | 201 | 사용자 등록 |
| PATCH | `/:id` | `updateUser` | `UpdateUserMemberDto` (Path: id UUID) | `UserDto` | 200 | 사용자 수정 |
| DELETE | `/:id` | `deleteUser` | - (Path: id UUID) | void | 204 | 사용자 삭제 (Soft Delete) |

## 엔드포인트 상세

### GET / - 사용자 목록 조회

- **Query DTO**: `QueryUsersDto` (skip, take, name 등)
- **응답 구조**: `wrapResponse(users, { meta, stats })`
  - `meta`: `{ total, skip, take, totalPages }` (`UserPaginationMetaDto`)
  - `stats`: `{ total, active, inactive }` (`UserStatsDto`)
- **메시지 키**: `common.user.list.success`

### GET /:id - 사용자 상세 조회

- **Path Param**: `id` (UUID, ParseUUIDPipe 적용)
- **응답**: `UserDetailResponseDto` (Profile, Tenant, Role, Space 포함)
- **Space 필터**: `getSpaceId()`로 현재 Space 내 사용자만 조회
- **메시지 키**: `common.user.read.success`

### POST / - 사용자 등록

- **Body DTO**: `CreateUserMemberDto`
  - 필수: `name`, `email`, `phone`, `password`, `roleId`
  - 선택: `categoryId`, `groupIds`
- **Space 주입**: `getSpaceId()`로 현재 Space에 사용자 등록
- **메시지 키**: `common.user.create.success`

### PATCH /:id - 사용자 수정

- **Body DTO**: `UpdateUserMemberDto`
  - 선택: `name`, `email`, `phone`, `categoryId`, `groupIds`
- **Partial Update**: 전달된 필드만 수정
- **메시지 키**: `common.user.update.success`

### DELETE /:id - 사용자 삭제

- **Soft Delete**: `removedAt` 필드 설정
- **제약**: 자기 자신 삭제 불가 (`getCurrentUser().id`와 비교)
- **응답**: 204 No Content (body 없음)
- **메시지 키**: `common.user.delete.success`

## 인증/인가

| 엔드포인트 | 인증 필요 | X-Space-ID 필요 | 특별 조건 |
|------------|----------|-----------------|-----------|
| GET / | O (`@ApiAuth`) | O | - |
| GET /:id | O (`@ApiAuth`) | O | - |
| POST / | O (`@ApiAuth`) | O | - |
| PATCH /:id | O (`@ApiAuth`) | O | - |
| DELETE /:id | O (`@ApiAuth`) | O | 자기 계정 삭제 불가 |

## 에러 처리

| 상황 | 상태 코드 | 에러 메시지 상수 |
|------|-----------|-----------------|
| 인증 실패 (사용자 없음) | 401 | `USER_ERRORS.USER_NOT_FOUND` |
| Space 미선택 | 401 | `USER_ERRORS.SPACE_NOT_SELECTED` |
| 이메일 중복 | 400 | `USER_ERRORS.EMAIL_ALREADY_EXISTS` |
| 전화번호 중복 | 400 | `USER_ERRORS.PHONE_ALREADY_EXISTS` |
| 이름 중복 | 400 | `USER_ERRORS.NAME_ALREADY_EXISTS` |
| 사용자 미발견 | 404 | `USER_ERRORS.USER_NOT_FOUND` |
| 자기 계정 삭제 | 400 | `USER_ERRORS.CANNOT_DELETE_SELF` |
| 서버 오류 | 500 | - |

## 내부 헬퍼 메서드

| 메서드 | 반환값 | 설명 |
|--------|--------|------|
| `getSpaceId()` | `string` | CLS에서 `CONTEXT_KEYS.SPACE_ID` 추출. 없으면 401 에러 |
| `getCurrentUser()` | `User` | CLS에서 `CONTEXT_KEYS.AUTH_USER` 추출. 없으면 401 에러 |

## Swagger 데코레이터

- `@ApiTags("USERS")`: API 태그
- `@ApiOperation()`: 각 엔드포인트별 operationId, summary, description
- `@ApiAuth()`: 인증 필요 표시
- `@ApiParam()`: Path 파라미터 문서화
- `@ApiBody()`: Request Body 문서화
- `@ApiErrors()`: 에러 응답 문서화
- `@ApiResponseEntity()`: 성공 응답 문서화 (isArray, metaDto, statsDto 옵션)
- `@ResponseMessage()`: 응답 메시지 키

## 구현 체크리스트

- [x] users.controller.ts
- [x] DTO 검증 (CreateUserMemberDto, UpdateUserMemberDto, QueryUsersDto)
- [x] Swagger 데코레이터 (`@ApiOperation`, `@ApiAuth`, `@ApiErrors`, `@ApiResponseEntity`)
- [ ] E2E 테스트

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
