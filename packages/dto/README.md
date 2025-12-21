# @cocrepo/dto

NestJS 애플리케이션을 위한 Data Transfer Objects (DTO) 패키지입니다.

## 설치

```bash
pnpm add @cocrepo/dto
```

## 주요 기능

### DTO 구조

이 패키지는 CRUD 작업별로 DTO를 구성합니다:

- **기본 DTO**: 엔티티의 응답 형태
- **Create DTO**: 생성 요청
- **Update DTO**: 수정 요청
- **Query DTO**: 조회/필터링 요청

---

## 사용 예시

### 기본 DTO 사용

```typescript
import { UserDto, TenantDto, SpaceDto } from '@cocrepo/dto';

// 응답 타입으로 사용
function getUser(): UserDto {
  return {
    id: 'uuid',
    email: 'user@example.com',
    name: '홍길동',
    // ...
  };
}
```

### Create DTO 사용

```typescript
import { CreateUserDto, CreateTenantDto, CreateSpaceDto } from '@cocrepo/dto';

// 생성 요청 타입
@Post('users')
createUser(@Body() dto: CreateUserDto) {
  // dto.email, dto.password, dto.name 등
}
```

### Update DTO 사용

```typescript
import { UpdateUserDto, UpdateTenantDto, UpdateSpaceDto } from '@cocrepo/dto';

// 수정 요청 타입 (모든 필드가 선택적)
@Patch('users/:id')
updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  // dto.email?, dto.name? 등
}
```

### Query DTO 사용

```typescript
import { QueryUserDto, QueryTenantDto, QuerySpaceDto } from '@cocrepo/dto';

// 조회/필터링 요청 타입
@Get('users')
getUsers(@Query() query: QueryUserDto) {
  // query.page, query.limit, query.search 등
}
```

---

## 제공 DTO 목록

### 인증 (Auth)

| DTO | 설명 |
|-----|------|
| `LoginPayloadDto` | 로그인 요청 |
| `SignUpPayloadDto` | 회원가입 요청 |
| `TokenDto` | 토큰 응답 |

### 사용자/조직

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| User | `UserDto` | `CreateUserDto` | `UpdateUserDto` | `QueryUserDto` |
| Tenant | `TenantDto` | `CreateTenantDto` | `UpdateTenantDto` | `QueryTenantDto` |
| Space | `SpaceDto` | `CreateSpaceDto` | `UpdateSpaceDto` | `QuerySpaceDto` |
| Role | `RoleDto` | `CreateRoleDto` | `UpdateRoleDto` | `QueryRoleDto` |
| Group | `GroupDto` | `CreateGroupDto` | `UpdateGroupDto` | `QueryGroupDto` |

### 콘텐츠

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| Category | `CategoryDto` | `CreateCategoryDto` | `UpdateCategoryDto` | `QueryCategoryDto` |
| Exercise | `ExerciseDto` | `CreateExerciseDto` | `UpdateExerciseDto` | `QueryExerciseDto` |
| Program | `ProgramDto` | `CreateProgramDto` | `UpdateProgramDto` | `QueryProgramDto` |
| Routine | `RoutineDto` | `CreateRoutineDto` | `UpdateRoutineDto` | `QueryRoutineDto` |
| Subject | `SubjectDto` | `CreateSubjectDto` | `UpdateSubjectDto` | `QuerySubjectDto` |

### 일정

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| Timeline | `TimelineDto` | `CreateTimelineDto` | `UpdateTimelineDto` | `QueryTimelineDto` |
| Session | `SessionDto` | `CreateSessionDto` | `UpdateSessionDto` | `QuerySessionDto` |
| Ground | `GroundDto` | `CreateGroundDto` | `UpdateGroundDto` | `QueryGroundDto` |

### 파일

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| File | `FileDto` | `CreateFileDto` | `UpdateFileDto` | `QueryFileDto` |
| FileAssociation | `FileAssociationDto` | `CreateFileAssociationDto` | - | `QueryFileAssociationDto` |
| FileClassification | `FileClassificationDto` | `CreateFileClassificationDto` | `UpdateFileClassificationDto` | `QueryFileClassificationDto` |

### 연관/분류

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| UserAssociation | `UserAssociationDto` | `CreateUserAssociationDto` | - | `QueryUserAssociationDto` |
| SpaceAssociation | `SpaceAssociationDto` | `CreateSpaceAssociationDto` | - | `QuerySpaceAssociationDto` |
| RoleAssociation | `RoleAssociationDto` | `CreateRoleAssociationDto` | - | `QueryRoleAssociationDto` |

---

## 파일 구조

```
src/
├── auth/                    # 인증 관련 DTO
│   ├── login-payload.dto.ts
│   ├── sign-up-payload.dto.ts
│   ├── token.dto.ts
│   └── index.ts
├── create/                  # 생성 DTO
│   ├── create-user.dto.ts
│   ├── create-tenant.dto.ts
│   └── ...
├── update/                  # 수정 DTO
│   ├── update-user.dto.ts
│   ├── update-tenant.dto.ts
│   └── ...
├── query/                   # 조회 DTO
│   ├── query-user.dto.ts
│   ├── page-meta.dto.ts
│   ├── order-by.dto.ts
│   └── ...
├── abstract.dto.ts          # 추상 DTO
├── user.dto.ts              # 기본 DTO
├── tenant.dto.ts
└── index.ts
```

---

## 페이지네이션

쿼리 DTO는 공통 페이지네이션 옵션을 포함합니다:

```typescript
import { QueryUserDto } from '@cocrepo/dto';

// 쿼리 파라미터
const query: QueryUserDto = {
  page: 1,
  limit: 20,
  orderBy: 'createdAt',
  order: 'desc',
  search: '홍길동',
};
```

---

## 의존성

- `@cocrepo/constants` - 상수
- `@cocrepo/decorator` - 필드 데코레이터
- `@cocrepo/entity` - 엔티티 타입
- `@cocrepo/enums` - 열거형
- `@cocrepo/toolkit` - 유틸리티
- `@nestjs/common` (peer)
- `@nestjs/swagger` (peer)
- `class-validator` (peer)
- `class-transformer` (peer)
