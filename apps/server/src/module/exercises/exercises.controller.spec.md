# Exercises Controller 기획서

> 생성일: 2026-02-19
> 타입: controller
> 위치: apps/server/src/module/exercises/exercises.controller.ts

## 역할

운동 종목(Exercise) 도메인의 REST API 엔드포인트를 제공합니다. JWT 인증 + Space Access Guard + Role Guard를 통해 보호되며, ExercisesService에 비즈니스 로직을 위임합니다.

## 공통 설정

- **Prefix**: `/exercises`
- **Guard**: `JwtAuthGuard`, `SpaceAccessGuard`
- **Role**: 기본 인증된 사용자 (목록/상세), `MANAGE` 이상 (생성/수정/삭제)
- **Headers**: `X-Space-ID` 필수 (SpaceContext에서 추출)

## 엔드포인트

### GET /exercises

- **설명**: 운동 종목 목록 조회 (페이지네이션, 검색, Space 범위 필터)
- **Guards**: JwtAuthGuard, SpaceAccessGuard
- **Query Params**: `{ take, skip, search?, spaceScope: "CURRENT" | "INCLUDE_ANCESTORS" }`
- **응답**: `ResponseEntity<ExerciseDto[]>` + meta (total)
- **서비스 호출**: `exercisesService.findExercises(params)`

```typescript
@Get()
@ApiResponseEntity(ExerciseDto, HttpStatus.OK, { isArray: true })
@ResponseMessage("운동 종목 목록 조회 성공")
async getExercises(
  @Query() query: GetExercisesQueryDto,
  @CurrentUser() user: UserDto,
): Promise<Exercise[]>
```

### GET /exercises/:exerciseId

- **설명**: 운동 종목 상세 조회
- **Guards**: JwtAuthGuard, SpaceAccessGuard
- **Path Params**: `exerciseId: string`
- **응답**: `ResponseEntity<ExerciseDetailDto>`
- **서비스 호출**: `exercisesService.findExerciseById(exerciseId, spaceId, "INCLUDE_ANCESTORS")`

```typescript
@Get(":exerciseId")
@ApiResponseEntity(ExerciseDetailDto, HttpStatus.OK)
@ResponseMessage("운동 종목 상세 조회 성공")
async getExercise(@Param("exerciseId") exerciseId: string): Promise<Exercise>
```

### GET /exercises/:exerciseId/routines

- **설명**: 특정 운동 종목을 Activity로 포함하는 루틴 목록 조회
- **Guards**: JwtAuthGuard, SpaceAccessGuard
- **Path Params**: `exerciseId: string`
- **응답**: `ResponseEntity<RoutineDto[]>`
- **서비스 호출**: `exercisesService.findExerciseRoutines(exerciseId, spaceId)`
- **용도**: 상세 페이지에서 "이 운동을 사용하는 루틴" 목록 표시

```typescript
@Get(":exerciseId/routines")
@ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
@ResponseMessage("운동 종목 관련 루틴 목록 조회 성공")
async getExerciseRoutines(@Param("exerciseId") exerciseId: string): Promise<Routine[]>
```

### POST /exercises

- **설명**: 운동 종목 등록 (Task 동시 생성)
- **Guards**: JwtAuthGuard, SpaceAccessGuard
- **Role**: `@Roles(SYSTEM_ROLES.MANAGE)` 이상
- **Body**: `CreateExerciseDto`
- **응답**: `ResponseEntity<ExerciseDto>` (201)
- **서비스 호출**: `exercisesService.createExercise(dto, spaceId, userId)`

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
@Roles(SYSTEM_ROLES.MANAGE)
@ApiResponseEntity(ExerciseDto, HttpStatus.CREATED)
@ResponseMessage("운동 종목 등록 성공")
async createExercise(
  @Body() dto: CreateExerciseDto,
  @CurrentUser() user: UserDto,
): Promise<Exercise>
```

**CreateExerciseDto 필드:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | O | 운동명 (최대 100자) |
| duration | number | O | 지속시간(초) |
| count | number | O | 반복 횟수 |
| description | string | X | 운동 설명 |
| imageFileId | string | X | 대표 이미지 파일 ID |
| videoFileId | string | X | 시범 영상 파일 ID |

### PATCH /exercises/:exerciseId

- **설명**: 운동 종목 수정 (현재 Space 소유 운동만)
- **Guards**: JwtAuthGuard, SpaceAccessGuard
- **Role**: `@Roles(SYSTEM_ROLES.MANAGE)` 이상
- **Path Params**: `exerciseId: string`
- **Body**: `UpdateExerciseDto` (모든 필드 선택)
- **응답**: `ResponseEntity<ExerciseDto>`
- **서비스 호출**: `exercisesService.updateExercise(exerciseId, dto, spaceId)`
- **에러**: 403 (타 Space 소유), 404 (미발견)

```typescript
@Patch(":exerciseId")
@Roles(SYSTEM_ROLES.MANAGE)
@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
@ResponseMessage("운동 종목 수정 성공")
async updateExercise(
  @Param("exerciseId") exerciseId: string,
  @Body() dto: UpdateExerciseDto,
  @CurrentUser() user: UserDto,
): Promise<Exercise>
```

### DELETE /exercises/:exerciseId

- **설명**: 운동 종목 삭제 (소프트 삭제, Task 함께 삭제)
- **Guards**: JwtAuthGuard, SpaceAccessGuard
- **Role**: `@Roles(SYSTEM_ROLES.MANAGE)` 이상
- **Path Params**: `exerciseId: string`
- **응답**: 204 No Content
- **서비스 호출**: `exercisesService.deleteExercise(exerciseId, spaceId)`
- **에러**: 403 (타 Space 소유), 404 (미발견), 409 (Activity에서 사용 중)

```typescript
@Delete(":exerciseId")
@HttpCode(HttpStatus.NO_CONTENT)
@Roles(SYSTEM_ROLES.MANAGE)
@ResponseMessage("운동 종목 삭제 성공")
async deleteExercise(
  @Param("exerciseId") exerciseId: string,
  @CurrentUser() user: UserDto,
): Promise<void>
```

## 인증/인가 매트릭스

| 엔드포인트 | 인증 | 최소 Role |
|------------|:----:|:---------:|
| GET /exercises | O | VIEW |
| GET /exercises/:id | O | VIEW |
| GET /exercises/:id/routines | O | VIEW |
| POST /exercises | O | MANAGE |
| PATCH /exercises/:id | O | MANAGE |
| DELETE /exercises/:id | O | MANAGE |

## 에러 응답

| 상황 | HTTP | 에러 코드 |
|------|:----:|-----------|
| 운동 미발견 | 404 | EXERCISE_NOT_FOUND |
| 타 Space 소유 운동 수정/삭제 | 403 | EXERCISE_NOT_OWNED |
| Activity에서 사용 중인 운동 삭제 | 409 | EXERCISE_IN_USE |

## 구현 체크리스트

- [ ] exercises.controller.ts
- [ ] exercises.module.ts (Controller, Service, Repository 등록)
- [ ] GetExercisesQueryDto (`packages/be-dto`)
- [ ] CreateExerciseDto (`packages/be-dto`)
- [ ] UpdateExerciseDto (`packages/be-dto`)
- [ ] ExerciseDto, ExerciseDetailDto (`packages/be-dto`)
- [ ] exercises.controller.spec.ts (단위 테스트)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | be-spec-planner |
