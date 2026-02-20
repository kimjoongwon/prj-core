---
description: PrismaQueryDto 기반 목록 조회용 Query DTO를 생성하는 전문가
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---



# Query DTO Builder

PrismaQueryDto 기반 목록 조회용 Query DTO 클래스를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 목록 조회용 Query DTO 생성 | ✅ 사용 | PrismaQueryDto 상속 + 필터/정렬 |
| 기존 Query DTO 마이그레이션 | ✅ 사용 | QueryDto → PrismaQueryDto 전환 |
| Create/Update/Response DTO | ❌ 미사용 | dto-builder 사용 |
| Entity 클래스 생성 | ❌ 미사용 | entity-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Entity 정보 | Prisma 모델 필드 및 관계 |
| | API 요구사항 | 필요한 필터/정렬 조건 |
| **출력** | Query DTO 클래스 | `packages/be-dto/src/query/` 또는 `packages/be-dto/src/{domain}/` |
| | index.ts 업데이트 | export 추가 |

---

## 핵심 개념: DTO 계층 구조

```
QueryDto (packages/be-dto/src/query/query.dto.ts)
├── skip?: number        # Prisma 호환 오프셋
├── take?: number        # Prisma 호환 리밋
└── toPageMetaDto()      # 페이지네이션 메타 변환

    └── PrismaQueryDto<TWhere> (packages/be-dto/src/query/prisma-query.dto.ts)
        ├── toPrismaWhere()     # 컨벤션 기반 자동 매핑 + 커스텀
        ├── toPrismaOrderBy()   # sort[] → Prisma orderBy[] 변환
        ├── containsFilter()    # 부분 일치 조건 (contains + insensitive)
        ├── dateRangeFilter()   # 날짜 범위 조건 (gte/lte)
        ├── removedAtFilter()   # 소프트 삭제 필터
        └── excludeFromAutoMap() # 자동 매핑 제외 필드

            └── Query{Entity}sDto (실제 Query DTO)
                ├── 검색 필드 (name, email 등)
                ├── 필터 필드 (status, roles[] 등)
                ├── 날짜 범위 (createdFrom/To)
                ├── 정렬 (sort: string[])
                └── toPrismaWhere() override (커스텀 로직)
```

**모든 Query DTO는 PrismaQueryDto를 상속합니다.** QueryDto 직접 상속은 사용하지 않습니다.

---

## PrismaQueryDto 자동 매핑 규칙

`toPrismaWhere()`는 DTO 필드를 자동으로 Prisma where 조건으로 변환합니다.

| 필드 패턴 | 매핑 결과 | 예시 |
|-----------|-----------|------|
| `*Id` (string) | 정확 매칭 (직접 값) | `spaceId: "abc"` → `{ spaceId: "abc" }` |
| `*Ids` (array) | `{ in: values }` + 필드명 단수화 | `groupIds: ["a","b"]` → `{ groupId: { in: ["a","b"] } }` |
| `*From` / `*To` (Date) | `dateRangeFilter()` → `*At` | `createdFrom/To` → `{ createdAt: { gte, lte } }` |
| 일반 string | `containsFilter()` | `name: "kim"` → `{ name: { contains: "kim", mode: "insensitive" } }` |
| 배열 (non-Ids) | `{ in: values }` | `types: ["A","B"]` → `{ types: { in: ["A","B"] } }` |
| Enum/기타 | 직접 매핑 | `type: "ADMIN"` → `{ type: "ADMIN" }` |

### 자동 제외 필드

- `skip`, `take`: 페이지네이션 전용
- `sort`: 정렬 전용
- `*SortOrder`: 정렬 관련 필드
- `excludeFromAutoMap()` 반환값: 서브클래스에서 커스텀 처리할 필드

---

## 핵심 규칙

### Query DTO 설계 원칙 (Critical)

**Query DTO는 순수한 검색/필터 파라미터 컨테이너입니다.**

Query DTO의 역할은 **"어떤 조건으로 데이터를 찾을 것인가"**만 정의합니다.

#### Query DTO에 포함되어야 하는 것

| 종류 | 예시 | 설명 |
|------|------|------|
| 검색 필드 | `name`, `email`, `phone` | 텍스트 검색 조건 |
| 필터 필드 | `status`, `roles[]`, `categoryId` | 목록 필터 조건 |
| 날짜 범위 | `createdFrom`, `createdTo` | 기간 필터 |
| 정렬 | `sort: string[]` | JSON:API 컨벤션 |
| 페이지네이션 | 부모 `QueryDto`의 `skip`, `take` 상속 | Prisma 호환 |
| Prisma 변환 | `toPrismaWhere()`, `toPrismaOrderBy()` | 필터/정렬 변환 |

#### Query DTO에 포함되면 안 되는 것

```typescript
// ❌ 금지
export class QueryUsersDto extends PrismaQueryDto<...> {
  includeProfile?: boolean;     // → include/select는 Repository 책임
  fields?: string[];            // → 필드 선택은 Repository 책임
  @ClassField(() => ProfileDto)
  profile?: ProfileDto;         // → Response DTO의 역할
  groupByRole?: boolean;        // → Service 레이어의 책임
}
```

### ✅ Do

```typescript
// @cocrepo/enum에서 공용 enum 사용
import { DeleteFilter } from "@cocrepo/enum";

// PrismaQueryDto 상속
export class QueryUsersDto extends PrismaQueryDto<Prisma.UserWhereInput> {
  // 자동 매핑되는 필드 (별도 toPrismaWhere 로직 불필요)
  @StringFieldOptional({ description: "이름 검색" })
  name?: string;

  // 공용 enum 사용
  @EnumFieldOptional(() => DeleteFilter, { description: "상태 필터" })
  status?: DeleteFilter;

  // excludeFromAutoMap()으로 커스텀 처리 필드 지정
  protected excludeFromAutoMap(): string[] {
    return ["status", "nickname"];
  }
}
```

### ❌ Don't

```typescript
// DTO 내부에 커스텀 enum 정의 금지
export enum UserStatus {        // ❌ → DeleteFilter 사용
  ACTIVE = "active",
  REMOVED = "removed",
}

// DTO 내부에 미사용 enum 정의 금지
export enum UserSortField {     // ❌ → sort: string[]로 충분
  CREATED_AT = "createdAt",
  NAME = "name",
}

// QueryDto 직접 상속 금지
export class QueryRoleDto extends QueryDto { }  // ❌ → PrismaQueryDto 사용

// sortBy/sortOrder 단일 정렬 금지
@EnumFieldOptional(() => SortField)
sortBy?: SortField;             // ❌ → sort: string[] 사용
```

---

## Enum 사용 규칙 (Critical)

### 소프트 삭제 필터: DeleteFilter

**`@cocrepo/enum`의 `DeleteFilter`를 사용합니다. 커스텀 Status enum을 만들지 않습니다.**

```typescript
import { DeleteFilter } from "@cocrepo/enum";

// DeleteFilter.ACTIVE  = "active"   → removedAt is null
// DeleteFilter.DELETED = "deleted"  → removedAt is not null

@EnumFieldOptional(() => DeleteFilter, {
  description: "상태 필터 (active: 활성, deleted: 삭제됨)",
})
status?: DeleteFilter;
```

**toPrismaWhere에서 사용:**
```typescript
where.removedAt = this.removedAtFilter(this.status === DeleteFilter.DELETED);
```

### Prisma 기반 Enum

Prisma 스키마에 정의된 enum은 `@cocrepo/prisma`에서 import합니다.

```typescript
import { CategoryTypes } from "@cocrepo/prisma";

@EnumFieldOptional(() => CategoryTypes)
type?: CategoryTypes;
```

### 공용 Enum

여러 도메인에서 공용으로 사용하는 enum은 `@cocrepo/enum`에서 import합니다.

```typescript
import { DeleteFilter, SortOrder } from "@cocrepo/enum";
```

---

## 정렬 패턴: JSON:API 컨벤션 (Critical)

**Query DTO는 반드시 `sort: string[]` 배열로 복합 정렬을 지원합니다.**

```typescript
@StringFieldOptional({
  each: true,
  description:
    "복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name. 예: ?sort=name&sort=-createdAt",
})
@Transform(({ value }) =>
  Array.isArray(value) ? value : value ? [value] : [],
)
sort?: string[];
```

**규칙:**
- 부호 없음 = ASC: `name` → `{ name: "asc" }`
- `-` prefix = DESC: `-createdAt` → `{ createdAt: "desc" }`
- 배열 순서 = 정렬 우선순위
- 미지정 시 기본값: `[{ createdAt: "desc" }]`
- `PrismaQueryDto.toPrismaOrderBy()`가 자동 변환

**변환 결과:**
```typescript
// ?sort=name&sort=-createdAt
query.toPrismaOrderBy()
// → [{ name: "asc" }, { createdAt: "desc" }]

// sort 미지정 → 기본값
query.toPrismaOrderBy()
// → [{ createdAt: "desc" }]
```

---

## 프로세스

### 1단계: 대상 Prisma 모델 분석

```bash
# Prisma 모델 확인
Grep "model {Entity}" packages/be-prisma/schema/
```

- 필드 목록 및 타입 파악
- 릴레이션 확인 (1:1, 1:N, M:N)
- removedAt 필드 존재 여부 확인

### 2단계: 필드 분류

| 분류 | 판단 기준 | 매핑 방식 |
|------|----------|----------|
| 자동 매핑 | 모델에 직접 존재하는 스칼라 필드 | PrismaQueryDto 자동 처리 |
| 커스텀 처리 | 릴레이션 필터, 특수 로직 | `excludeFromAutoMap()` + `toPrismaWhere()` override |
| 제외 | 정렬/페이지네이션 | 부모 클래스에서 처리 |

### 3단계: Query DTO 작성

1. `PrismaQueryDto<Prisma.{Entity}WhereInput>` 상속
2. 검색/필터 필드 선언 (데코레이터 적용)
3. `excludeFromAutoMap()` - 커스텀 처리 필드 지정
4. `toPrismaWhere()` override - 커스텀 로직 추가
5. `sort: string[]` 정렬 필드 추가

### 4단계: index.ts 등록

---

## 템플릿

### 단순 Query DTO (자동 매핑만으로 충분)

```typescript
import {
  EnumFieldOptional,
  StringFieldOptional,
} from "@cocrepo/decorator";
import { DeleteFilter } from "@cocrepo/enum";
import type { Prisma } from "@cocrepo/prisma";
import { CategoryTypes } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * {Entity} 목록 조회용 Query DTO
 *
 * 자동 매핑: name(string→contains), type(enum→직접), parentId(*Id→정확), spaceId(*Id→정확)
 */
export class Query{Entity}Dto extends PrismaQueryDto<Prisma.{Entity}WhereInput> {
  @StringFieldOptional({ description: "이름 검색" })
  name?: string;

  @EnumFieldOptional(() => CategoryTypes, { description: "유형 필터" })
  type?: CategoryTypes;

  @StringFieldOptional({ description: "상위 카테고리 ID" })
  parentId?: string;

  @StringFieldOptional({ description: "스페이스 ID" })
  spaceId?: string;

  @EnumFieldOptional(() => DeleteFilter, {
    description: "상태 필터 (active: 활성, deleted: 삭제됨)",
  })
  status?: DeleteFilter;

  @StringFieldOptional({
    each: true,
    description: "복합 정렬. 예: ?sort=name&sort=-createdAt",
  })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  sort?: string[];

  protected excludeFromAutoMap(): string[] {
    return ["status"];
  }

  toPrismaWhere(
    baseWhere?: Partial<Prisma.{Entity}WhereInput>,
  ): Prisma.{Entity}WhereInput {
    const where = super.toPrismaWhere(baseWhere);

    // 소프트 삭제 필터
    where.removedAt = this.removedAtFilter(this.status === DeleteFilter.DELETED);

    return where;
  }
}
```

### 복합 Query DTO (릴레이션 필터 포함)

```typescript
import {
  DateFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from "@cocrepo/decorator";
import { DeleteFilter } from "@cocrepo/enum";
import type { Prisma } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "../query/prisma-query.dto";

/**
 * {Entity} 목록 조회용 Query DTO
 *
 * 자동 매핑: name, email, phone, createdFrom/createdTo
 * 커스텀 처리: nickname(릴레이션), roles(릴레이션), status(특수), categoryId(릴레이션)
 */
export class Query{Entity}sDto extends PrismaQueryDto<Prisma.{Entity}WhereInput> {
  @StringFieldOptional({ description: "이름 검색" })
  name?: string;

  @StringFieldOptional({ description: "이메일 검색" })
  email?: string;

  @StringFieldOptional({ description: "전화번호 검색" })
  phone?: string;

  @StringFieldOptional({ description: "닉네임 검색" })
  nickname?: string;

  @StringFieldOptional({
    each: true,
    description: "역할 필터 (복수 선택 가능)",
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  roles?: string[];

  @EnumFieldOptional(() => DeleteFilter, {
    description: "상태 필터 (active: 활성, deleted: 삭제됨)",
  })
  status?: DeleteFilter;

  @UUIDFieldOptional({ description: "분류 카테고리 ID" })
  categoryId?: string;

  @StringFieldOptional({
    each: true,
    description: "그룹 ID 목록 (복수 선택 가능)",
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  groupIds?: string[];

  @DateFieldOptional({ description: "가입일 시작 (ISO8601)" })
  createdFrom?: Date;

  @DateFieldOptional({ description: "가입일 종료 (ISO8601)" })
  createdTo?: Date;

  @StringFieldOptional({
    each: true,
    description:
      "복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, email. 예: ?sort=name&sort=-createdAt",
  })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  sort?: string[];

  /**
   * 릴레이션 기반 필터 및 특수 로직이 필요한 필드를 자동 매핑에서 제외
   */
  protected excludeFromAutoMap(): string[] {
    return ["nickname", "roles", "status", "categoryId", "groupIds"];
  }

  /**
   * DTO 필드를 Prisma where 조건으로 변환합니다.
   * 자동 매핑: name, email, phone, createdFrom/createdTo
   * 커스텀: nickname, roles, status, categoryId, groupIds
   */
  toPrismaWhere(
    baseWhere?: Partial<Prisma.{Entity}WhereInput>,
  ): Prisma.{Entity}WhereInput {
    // 자동 매핑으로 name, email, phone, createdAt 처리
    const where = super.toPrismaWhere(baseWhere);

    // 상태 필터 (DeleteFilter → removedAt)
    where.removedAt = this.removedAtFilter(this.status === DeleteFilter.DELETED);

    // 닉네임 (릴레이션: profiles.some)
    if (this.nickname) {
      where.profiles = {
        some: { nickname: this.containsFilter(this.nickname) },
      };
    }

    // 역할 필터 (릴레이션: tenants.some.role.name, baseWhere 병합)
    if (this.roles?.length) {
      const existing =
        (baseWhere?.tenants as Record<string, unknown> | undefined)?.some ?? {};
      where.tenants = {
        some: {
          ...(existing as Record<string, unknown>),
          role: { name: { in: this.roles } },
        },
      };
    }

    // 카테고리 필터 (릴레이션: classification.categoryId)
    if (this.categoryId) {
      where.classification = { categoryId: this.categoryId };
    }

    // 그룹 필터 (릴레이션: associations.some)
    if (this.groupIds?.length) {
      where.associations = {
        some: { groupId: { in: this.groupIds }, removedAt: null },
      };
    }

    return where;
  }
}
```

### 커스텀 매핑 패턴 모음

#### 릴레이션 필터 (1:N some)

```typescript
// 릴레이션 테이블의 특정 필드로 필터
if (this.roles?.length) {
  where.tenants = {
    some: { role: { name: { in: this.roles } } },
  };
}
```

#### 릴레이션 필터 (1:1)

```typescript
// 1:1 릴레이션의 특정 필드로 필터
if (this.categoryId) {
  where.classification = { categoryId: this.categoryId };
}
```

#### 릴레이션 + baseWhere 병합

```typescript
// baseWhere에 이미 tenants 조건이 있을 때 병합
if (this.roles?.length) {
  const existing =
    (baseWhere?.tenants as Record<string, unknown> | undefined)?.some ?? {};
  where.tenants = {
    some: {
      ...(existing as Record<string, unknown>),
      role: { name: { in: this.roles } },
    },
  };
}
```

#### 소프트 삭제 + 릴레이션 결합

```typescript
// removedAt 조건이 필요한 릴레이션
if (this.groupIds?.length) {
  where.associations = {
    some: { groupId: { in: this.groupIds }, removedAt: null },
  };
}
```

---

## 마이그레이션: QueryDto → PrismaQueryDto

기존 QueryDto 상속 DTO를 PrismaQueryDto로 전환하는 절차입니다.

### Before (구버전)

```typescript
import { EnumFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryRoleDto extends QueryDto {
  @EnumFieldOptional(() => SortOrder)
  nameSortOrder?: SortOrder;

  @EnumFieldOptional(() => SortOrder)
  createdAtSortOrder?: SortOrder;
}
```

### After (신버전)

```typescript
import { StringFieldOptional, EnumFieldOptional } from "@cocrepo/decorator";
import { DeleteFilter } from "@cocrepo/enum";
import type { Prisma } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryRoleDto extends PrismaQueryDto<Prisma.RoleWhereInput> {
  @StringFieldOptional({ description: "이름 검색" })
  name?: string;

  @EnumFieldOptional(() => DeleteFilter, {
    description: "상태 필터",
  })
  status?: DeleteFilter;

  @StringFieldOptional({
    each: true,
    description: "복합 정렬. 예: ?sort=name&sort=-createdAt",
  })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  sort?: string[];

  protected excludeFromAutoMap(): string[] {
    return ["status"];
  }

  toPrismaWhere(
    baseWhere?: Partial<Prisma.RoleWhereInput>,
  ): Prisma.RoleWhereInput {
    const where = super.toPrismaWhere(baseWhere);
    where.removedAt = this.removedAtFilter(this.status === DeleteFilter.DELETED);
    return where;
  }
}
```

### 마이그레이션 체크리스트

- [ ] `extends QueryDto` → `extends PrismaQueryDto<Prisma.{Entity}WhereInput>`
- [ ] `*SortOrder` 필드 제거 → `sort: string[]` 추가
- [ ] 커스텀 Status enum 제거 → `DeleteFilter` 사용
- [ ] `toPrismaWhere()` 구현 (최소한 removedAt 필터)
- [ ] `excludeFromAutoMap()` 커스텀 필드 지정
- [ ] import 경로 업데이트
- [ ] Repository에서 `query.toPrismaOrderBy()` 사용 확인

---

## 파일 위치 규칙

### 신규 Query DTO

```
packages/be-dto/src/
├── query/                          # 범용 Query DTO
│   ├── query.dto.ts                # 베이스 (skip/take)
│   ├── prisma-query.dto.ts         # Prisma 자동 매핑 베이스
│   ├── query-{entity}.dto.ts       # 단순 엔티티 Query
│   └── index.ts
│
├── {domain}/                       # 도메인별 복합 Query DTO
│   ├── query-{domain}s.dto.ts      # 복합 필터/릴레이션이 있는 Query
│   └── index.ts
```

### 위치 결정 기준

| 조건 | 위치 | 예시 |
|------|------|------|
| 자동 매핑만으로 충분 | `query/query-{entity}.dto.ts` | QueryCategoryDto |
| 릴레이션 필터, 커스텀 로직 필요 | `{domain}/query-{domain}s.dto.ts` | QueryUsersDto |
| 도메인 전용 Response DTO와 함께 | `{domain}/` 디렉토리 | users/, roles/ |

---

## 체크리스트

- [ ] `PrismaQueryDto<Prisma.{Entity}WhereInput>` 상속
- [ ] 커스텀 enum 정의하지 않음 (`@cocrepo/enum` 또는 `@cocrepo/prisma` 사용)
- [ ] 소프트 삭제 필터는 `DeleteFilter` enum 사용
- [ ] 모든 필드에 `description` 옵션 추가
- [ ] 자동 매핑 가능한 필드는 `excludeFromAutoMap()`에 넣지 않음
- [ ] 릴레이션/특수 필드만 `excludeFromAutoMap()`에 지정
- [ ] `toPrismaWhere()` override 시 `super.toPrismaWhere(baseWhere)` 호출
- [ ] 정렬은 `sort: string[]` + `@Transform` 사용 (sortBy/sortOrder 금지)
- [ ] 배열 필드에 `@Transform` 데코레이터 추가
- [ ] Optional 필드는 `?` 표시 및 Optional 데코레이터 사용
- [ ] index.ts에 export 추가

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | entity-builder | Entity 클래스 생성 |
| | schema-builder | Prisma 스키마 생성 |
| **동료** | dto-builder | Create/Update/Response DTO 생성 |
| **후행** | repository-builder | Repository에서 toPrismaWhere/toPrismaOrderBy 사용 |
| | controller-builder | Controller에서 Query DTO를 파라미터로 사용 |

---

## 관련 파일

- 베이스 QueryDto: `packages/be-dto/src/query/query.dto.ts`
- PrismaQueryDto: `packages/be-dto/src/query/prisma-query.dto.ts`
- DeleteFilter enum: `packages/common-enum/src/delete-filter.enum.ts`
- SortOrder: `packages/common-enum/src/sort-order.enum.ts`
- 필드 데코레이터: `packages/be-decorator/src/field/`
- Prisma 모델: `packages/be-prisma/schema/`
