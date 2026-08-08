---
name: "be-dto-builder"
description: "이 skill은 `be-dto-builder` 역할로 일할 때 사용합니다. API 요청/응답 DTO를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-dto-builder

# DTO 빌더

Request/Response DTO 클래스를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| API 요청/응답 DTO 생성 | ✅ 사용 | Create, Update, Response DTO |
| 유효성 검사 데코레이터 적용 | ✅ 사용 | @cocrepo/decorator 사용 |
| **Query DTO 생성** | ❌ 미사용 | **query-dto-builder 사용** |
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

- DTO class는 class당 하나의 파일을 가집니다.
- DTO class 파일에는 top-level helper/mapper/type/interface를 함께 두지 않습니다.
- Response item, nested DTO, helper type이 필요하면 각각 별도 DTO/type 파일로 분리하고 barrel에서 조립합니다.
- Request DTO는 API 입출력 검증과 문서화만 소유합니다. Command, UseCase, Aggregate, Repository, Entity 변환 메서드를 갖지 않습니다.
- Request DTO 이름은 일반 body 기준 `CreateXDto`, `UpdateXDto`, response 기준 `XResponseDto`, `XListResponseDto`를 사용합니다.
- Controller가 DTO를 `new XxxCommand(dto)`로 전달할 수는 있지만, DTO class가 Command를 import하거나 `toCommand()`를 갖지는 않습니다.
- Request DTO field는 실제 API 계약과 일치해야 합니다. 현재 endpoint/usecase에서 소비하지 않는 field를 편의상 추가하지 않습니다.
- 필수/선택 여부는 downstream 기본값으로 감추지 말고 DTO validation과 Swagger metadata에 명확히 반영합니다.

### ✅ 권장

```typescript
// DTO는 반드시 packages/be-dto에 위치
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

// Response DTO는 ClassField로 중첩 표현
@ClassField(() => UserDto, {
  isArray: true,
  description: "회원 목록",
})
data: UserDto[];
```

### ❌ 금지

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

// Request DTO에 Command/Entity 변환 메서드 추가 금지
export class CreateUserDto {
  toCommand() { ... }
  toEntity() { ... }
}
```

### Query DTO → query-dto-builder 위임

**Query DTO(목록 조회용)는 `be-query-dto-builder` 에이전트가 전담합니다.**

- API edge query parameter shape, validation, Swagger metadata
- DeleteFilter enum, JSON:API sort wire shape
- Prisma 변환 없이 `@cocrepo/input`의 `*QueryInput`과 같은 wire shape 유지

### 스키마 상속 패턴 (공통 검증 규칙 재사용)

@cocrepo/schema의 스키마를 상속받아 DTO를 작성할 수 있습니다.

```typescript
import { LoginSchema } from "@cocrepo/schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

// LoginSchema의 검증 규칙(@Email, @Password)을 상속받음
export class OidcLoginPayloadDto extends LoginSchema {
  @ApiProperty({ description: "이메일" })
  email: string;  // @Email() 검증 자동 적용

  @ApiProperty({ description: "비밀번호" })
  password: string;  // @Password() 검증 자동 적용

  // 추가 필드만 정의
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  remember?: boolean;
}
```

**언제 사용하는가?**
- 로그인/회원가입 등 인증 관련 DTO
- 공통 검증 규칙이 이미 @cocrepo/schema에 정의된 경우
- 여러 DTO가 동일한 필드 검증 규칙을 공유할 때

**@cocrepo/schema 주요 스키마:**

| 스키마 | 필드 | 검증 규칙 |
|--------|------|----------|
| LoginSchema | email, password | @Email(), @Password() |
| SignUpSchema | email, password, name | @Email(), @Password(), @String() |

---

## 프로세스

### 1단계: DTO 종류 결정

| 종류 | 위치 | 용도 |
|------|------|------|
| Create | `packages/be-dto/src/create/` | 생성 요청 |
| Update | `packages/be-dto/src/update/` | 수정 요청 |
| Query | → **query-dto-builder 위임** | 조회 파라미터 |
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

  @NumberField({ description: "건너뛴 항목 수 (offset)" })
  skip: number;

  @NumberField({ description: "조회 항목 수" })
  take: number;

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
- [ ] Request DTO에 toCommand/toEntity/toPrisma 같은 변환 메서드가 없음
- [ ] DTO field가 실제 endpoint/usecase에서 소비되는 API 계약과 일치함
- [ ] Response DTO는 ClassField로 중첩 객체 표현
- [ ] Optional 필드는 `?` 표시 및 Optional 데코레이터 사용
- [ ] 배열 필드는 Transform 데코레이터 추가
- [ ] index.ts에 export 추가
- [ ] Query DTO가 필요하면 `be-query-dto-builder` 에이전트에 위임

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | entity-builder | Entity 클래스 생성 |
| | schema-builder | Prisma 스키마 생성 |
| **동료** | query-dto-builder | Query DTO 전담 (목록 조회) |
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
├── query/                     # 조회 DTO (→ query-dto-builder 전담)
│   └── query-{entity}.dto.ts
├── {domain}/                  # 도메인별 DTO
│   ├── {domain}-list-response.dto.ts
│   ├── {domain}-detail-response.dto.ts
│   └── query-{domain}s.dto.ts  # (→ query-dto-builder 전담)
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
- Entity: `packages/be-entity/src/`
- Query DTO 관련: `be-query-dto-builder` 에이전트 참조

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
