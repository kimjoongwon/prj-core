---
description: Request/Response DTO 클래스를 생성하는 전문가
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---



# DTO Builder

Request/Response DTO 클래스를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| API 요청/응답 DTO 생성 | ✅ 사용 | Create, Update, Query, Response DTO |
| 유효성 검사 데코레이터 적용 | ✅ 사용 | @cocrepo/decorator 사용 |
| Entity 클래스 생성 | ❌ 미사용 | entity-builder 사용 |
| Controller 생성 | ❌ 미사용 | controller-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Entity 정보 | 필드 및 타입 |
| | API 요구사항 | 필요한 DTO 종류 |
| **출력** | DTO 클래스 | `packages/be-dto/src/` 하위 |
| | index.ts 업데이트 | export 추가 |

---

## 핵심 규칙

### ✅ Do

```typescript
// DTO는 반드시 packages/dto에 위치
import { CreateAbilityDto, AbilityResponseDto } from "@cocrepo/dto";

// @cocrepo/decorator 필드 데코레이터 사용
import { StringField, EmailField, NumberField } from "@cocrepo/decorator";

export class CreateUserDto {
  @StringField({
    minLength: 2,
    maxLength: 50,
    description: "사용자 이름",
  })
  name: string;

  @EmailField({
    description: "이메일 주소",
  })
  email: string;
}

// Request DTO에 toEntity() 메서드 포함
toEntity(): User {
  const user = new User();
  user.email = this.email;
  user.name = this.name;
  return user;
}

// Response DTO는 ClassField로 중첩 표현
@ClassField(() => UserDto, {
  isArray: true,
  description: "회원 목록",
})
data: UserDto[];
```

### ❌ Don't

```typescript
// 서버 모듈 내 DTO 생성 금지
import { CreateAbilityDto } from "./dto";
import { AbilityResponseDto } from "../abilities/dto";

// class-validator 직접 사용 금지
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;
}

// Response DTO에 toEntity() 추가 금지
export class UserListResponseDto {
  toEntity() { ... }  // Response는 읽기 전용
}
```

---

## 프로세스

### 1단계: DTO 종류 결정

| 종류 | 위치 | 용도 |
|------|------|------|
| Create | `packages/be-dto/src/create/` | 생성 요청 |
| Update | `packages/be-dto/src/update/` | 수정 요청 |
| Query | `packages/be-dto/src/query/` | 조회 파라미터 |
| Response | `packages/be-dto/src/{domain}/` | 응답 데이터 |
| 도메인별 | `packages/be-dto/src/{domain}/` | 특정 도메인 전용 |

### 2단계: 필드 데코레이터 선택

### 3단계: DTO 클래스 작성

### 4단계: index.ts 등록

---

## 템플릿

### Create DTO

```typescript
import {
  StringField,
  EmailField,
  PhoneField,
  UUIDField,
  UUIDFieldOptional,
} from "@cocrepo/decorator";
import { {Entity} } from "@cocrepo/entity";

/**
 * {Entity} 생성 DTO
 */
export class Create{Entity}Dto {
  @StringField({
    minLength: 2,
    maxLength: 50,
    description: "이름",
  })
  name: string;

  @EmailField({
    description: "이메일 주소",
  })
  email: string;

  @UUIDField({
    description: "역할 ID",
  })
  roleId: string;

  @UUIDFieldOptional({
    description: "카테고리 ID",
  })
  categoryId?: string;

  /**
   * DTO → Entity 변환
   */
  toEntity(): {Entity} {
    const entity = new {Entity}();
    entity.name = this.name;
    entity.email = this.email;
    return entity;
  }
}
```

### Update DTO

```typescript
import {
  StringFieldOptional,
  EmailFieldOptional,
  UUIDFieldOptional,
} from "@cocrepo/decorator";

/**
 * {Entity} 수정 DTO
 */
export class Update{Entity}Dto {
  @StringFieldOptional({
    minLength: 2,
    maxLength: 50,
    description: "이름",
  })
  name?: string;

  @EmailFieldOptional({
    description: "이메일 주소",
  })
  email?: string;

  @UUIDFieldOptional({
    description: "카테고리 ID",
  })
  categoryId?: string;
}
```

### Query DTO (목록 조회)

```typescript
import {
  StringFieldOptional,
  NumberFieldOptional,
  DateFieldOptional,
  EnumFieldOptional,
} from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { Transform } from "class-transformer";
import { QueryDto } from "./query.dto";

/**
 * 정렬 가능 필드
 */
export enum {Entity}SortField {
  CREATED_AT = "createdAt",
  NAME = "name",
  SEQ = "seq",
}

/**
 * {Entity} 목록 조회용 Query DTO
 */
export class Query{Entity}sDto extends QueryDto {
  @StringFieldOptional({
    description: "검색어 (이름, 이메일 등)",
  })
  search?: string;

  @StringFieldOptional({
    each: true,
    description: "역할 필터 (복수 선택 가능)",
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  roles?: string[];

  @DateFieldOptional({
    description: "시작일 (ISO8601)",
  })
  createdFrom?: Date;

  @DateFieldOptional({
    description: "종료일 (ISO8601)",
  })
  createdTo?: Date;

  @EnumFieldOptional(() => {Entity}SortField, {
    description: "정렬 기준 필드",
  })
  sortBy?: {Entity}SortField;

  @EnumFieldOptional(() => SortOrder, {
    description: "정렬 순서 (asc, desc)",
  })
  sortOrder?: SortOrder;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
    description: "페이지 번호",
  })
  page?: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 100,
    default: 20,
    int: true,
    description: "페이지 크기",
  })
  limit?: number = 20;

  /**
   * skip 값을 계산합니다 (페이지네이션용)
   */
  getSkip(): number {
    const page = this.page ?? 1;
    const limit = this.limit ?? 20;
    return (page - 1) * limit;
  }

  /**
   * take 값을 반환합니다 (페이지네이션용)
   */
  getTake(): number {
    return this.limit ?? 20;
  }
}
```

### Response DTO (목록)

```typescript
import { ClassField, NumberField } from "@cocrepo/decorator";
import { {Entity}Dto } from "../{entity}.dto";

/**
 * 페이지네이션 메타 정보
 */
export class {Entity}PaginationMetaDto {
  @NumberField({ description: "전체 개수" })
  total: number;

  @NumberField({ description: "현재 페이지 번호" })
  page: number;

  @NumberField({ description: "페이지 크기" })
  limit: number;

  @NumberField({ description: "전체 페이지 수" })
  totalPages: number;
}

/**
 * 통계 정보 (필요시)
 */
export class {Entity}StatsDto {
  @NumberField({ description: "전체 수" })
  total: number;

  @NumberField({ description: "활성 수" })
  active: number;

  @NumberField({ description: "비활성 수" })
  inactive: number;
}

/**
 * {Entity} 목록 응답 DTO
 */
export class {Entity}ListResponseDto {
  @ClassField(() => {Entity}Dto, {
    isArray: true,
    description: "{Entity} 목록",
  })
  data: {Entity}Dto[];

  @ClassField(() => {Entity}PaginationMetaDto, {
    description: "페이지네이션 메타 정보",
  })
  meta: {Entity}PaginationMetaDto;

  @ClassField(() => {Entity}StatsDto, {
    description: "통계 정보",
  })
  stats: {Entity}StatsDto;
}
```

### Response DTO (상세)

```typescript
import {
  StringField,
  EmailField,
  DateField,
  ClassField,
  UUIDField,
} from "@cocrepo/decorator";

/**
 * {Entity} 상세 응답 DTO
 */
export class {Entity}DetailResponseDto {
  @UUIDField({ description: "ID" })
  id: string;

  @StringField({ description: "이름" })
  name: string;

  @EmailField({ description: "이메일" })
  email: string;

  @DateField({ description: "생성일" })
  createdAt: Date;

  @ClassField(() => RoleDto, {
    description: "역할 정보",
  })
  role: RoleDto;

  @ClassField(() => GroupDto, {
    isArray: true,
    description: "그룹 목록",
  })
  groups: GroupDto[];
}
```

---

## 체크리스트

- [ ] 적절한 @cocrepo/decorator 필드 데코레이터 사용
- [ ] 모든 필드에 description 옵션 추가
- [ ] Request DTO에 toEntity() 메서드 구현 (필요시)
- [ ] Query DTO는 QueryDto 상속
- [ ] Response DTO는 ClassField로 중첩 객체 표현
- [ ] Optional 필드는 `?` 표시 및 Optional 데코레이터 사용
- [ ] 배열 필드는 Transform 데코레이터 추가
- [ ] index.ts에 export 추가

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | entity-builder | Entity 클래스 생성 |
| | schema-builder | Prisma 스키마 생성 |
| **후행** | controller-builder | Controller 레이어 생성 |
| **관련** | service-builder | Service 레이어 (DTO 사용 안 함) |

---

## 프로젝트별 참고사항

### 필드 데코레이터 종류

#### Primitives (기본 타입)

| 데코레이터 | 타입 | 옵션 |
|------------|------|------|
| `StringField` | string | minLength, maxLength, pattern |
| `NumberField` | number | minimum, maximum, int |
| `BooleanField` | boolean | - |
| `DateField` | Date | nullable |

#### Specialized (특수 타입)

| 데코레이터 | 타입 | 설명 |
|------------|------|------|
| `EmailField` | string | 이메일 형식 검증 |
| `PasswordField` | string | 비밀번호 규칙 검증 |
| `PhoneField` | string | 한국 휴대폰 형식 |
| `UUIDField` | string | UUID 형식 |
| `UrlField` | string | URL 형식 |

#### Complex (복합 타입)

| 데코레이터 | 타입 | 설명 |
|------------|------|------|
| `ClassField` | class | 중첩 객체, 배열 |
| `EnumField` | enum | 열거형 값 |

#### Optional 버전

모든 데코레이터는 `{Decorator}Optional` 버전 제공:

```typescript
@StringFieldOptional({ description: "닉네임 (선택)" })
nickname?: string;

@UUIDFieldOptional({ description: "카테고리 ID" })
categoryId?: string;
```

### 파일 위치

```
packages/be-dto/src/
├── create/                    # 생성 DTO
│   └── create-{entity}.dto.ts
├── update/                    # 수정 DTO
│   └── update-{entity}.dto.ts
├── query/                     # 조회 DTO
│   └── query-{entity}.dto.ts
├── {domain}/                  # 도메인별 DTO
│   ├── {domain}-list-response.dto.ts
│   ├── {domain}-detail-response.dto.ts
│   └── query-{domain}s.dto.ts
└── index.ts
```

### 배열 필드 처리

```typescript
// 배열 필드는 Transform 데코레이터로 변환 처리
@StringFieldOptional({
  each: true,
  description: "그룹 ID 목록",
})
@Transform(({ value }) =>
  Array.isArray(value) ? value : value ? [value] : [],
)
groupIds?: string[];
```

### index.ts 등록

```typescript
// packages/be-dto/src/index.ts (최상위)
export * from "./{domain}";

// packages/be-dto/src/{domain}/index.ts (도메인별)
export * from "./{domain}-list-response.dto";
export * from "./{domain}-detail-response.dto";
export * from "./query-{domain}s.dto";
```

### 관련 파일

- 필드 데코레이터: `packages/be-decorator/src/field/`
- 기본 DTO: `packages/be-dto/src/abstract.dto.ts`
- Query 기본: `packages/be-dto/src/query/query.dto.ts`
- Entity: `packages/be-entity/src/`
