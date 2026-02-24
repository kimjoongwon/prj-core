# Categories Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/category/categories.controller.ts`

## 역할

카테고리(Category) 리소스의 CRUD 작업을 처리하는 REST 컨트롤러.
역할 카테고리, Space 카테고리 등 다양한 타입의 카테고리를 계층 구조로 관리하며, type 쿼리 파라미터로 유형별 필터링이 가능하다.

## 베이스 경로

`/api/v1/categories`

## 의존성

| 서비스 | 역할 |
|--------|------|
| CategoriesService | 카테고리 비즈니스 로직 처리 |
| SpaceContext | 현재 Space 컨텍스트 (생성 시 spaceId 전달) |

## 엔드포인트

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|-----|--------|-------------|------|
| GET | `/` | getCategories | QueryCategoryDto (query) | CategoryDto[] | 200 | 카테고리 목록 조회 (type 필터링, 상위/하위 포함) |
| GET | `/:id` | getCategoryById | - (UUID path param) | CategoryDto | 200 | 카테고리 상세 조회 (상위/하위/역할분류 포함) |
| POST | `/` | createCategory | CreateCategoryDto | CategoryDto | 201 | 카테고리 생성 (parentId로 상위 지정 가능) |
| PATCH | `/:id` | updateCategory | UpdateCategoryDto (UUID path param) | CategoryDto | 200 | 카테고리 수정 (parentId 변경 시 순환 참조 검증) |
| DELETE | `/:id` | deleteCategory | - (UUID path param) | CategoryDto | 200 | 카테고리 삭제 (하위 카테고리 있으면 불가) |

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

### QueryCategoryDto

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| type | string | X | 카테고리 유형 필터 (예: "Role", "Space") |

## 데코레이터 사용

| 데코레이터 | 용도 |
|------------|------|
| @ApiTags("CATEGORIES") | Swagger 태그 |
| @ApiAuth() | 인증 필요 API 문서화 |
| @ApiErrors(...) | 에러 응답 문서화 |
| @ApiResponseEntity(...) | 응답 타입 문서화 |
| @ResponseMessage(...) | 응답 메시지 설정 |
| @Roles([...]) | 역할 기반 접근 제어 |
| @UseGuards(RolesGuard) | 역할 Guard 적용 |

## 비즈니스 규칙

- 카테고리는 계층 구조 (parent-children)를 지원
- 카테고리 생성 시 SpaceContext에서 현재 spaceId를 주입
- parentId로 상위 카테고리를 지정하여 계층 생성
- 목록/상세 조회 시 상위(parent)/하위(children) 카테고리 정보를 포함하여 반환
- 상세 조회 시 연결된 역할(RoleClassification) 정보도 포함
- parentId 변경 시 순환 참조를 검증 (Service 레이어)
- 하위 카테고리가 있는 카테고리는 삭제 불가
- Path parameter `id`는 ParseUUIDPipe로 UUID 검증

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
