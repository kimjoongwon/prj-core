---
name: 엔티티-빌더
description: 도메인 Entity 클래스를 생성하는 전문가
tools: Read, Write, Grep
---

# Entity Builder

도메인 Entity 클래스를 생성하는 전문가입니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| Prisma 스키마 생성 후 Entity 클래스 필요 | ✅ 사용 | Entity 클래스 생성 |
| 도메인 메서드 추가 | ✅ 사용 | 비즈니스 로직 캡슐화 |
| Prisma 스키마 생성 | ❌ 미사용 | schema-builder 사용 |
| DTO 생성 | ❌ 미사용 | dto-builder 사용 |
| Repository 생성 | ❌ 미사용 | repository-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Prisma 모델 | `@cocrepo/prisma`에서 생성된 타입 |
| | 도메인 로직 요구사항 | 필요한 비즈니스 메서드 |
| **출력** | Entity 클래스 | `packages/entity/src/{entity}.entity.ts` |
| | index.ts 업데이트 | export 추가 |

---

## 핵심 규칙

### ✅ Do

```typescript
// AbstractEntity 상속
export class User extends AbstractEntity implements UserEntity {
  // 추가 필드만 정의
}

// Prisma 모델 타입 구현
import type { User as UserEntity } from "@cocrepo/prisma";
export class User extends AbstractEntity implements UserEntity {
  // Prisma 모델의 모든 필드를 구현
}

// 필수 필드: ! 사용
name!: string;

// nullable 필드: | null 타입 추가
parentId!: string | null;

// 관계 필드: ? 사용
parent?: Category;
children?: Category[];

// 도메인 메서드 포함
isActive(): boolean {
  return this.removedAt === null;
}
```

### ❌ Don't

```typescript
// AbstractEntity 상속 없음
export class User {
  id!: string;
  createdAt!: Date;
  // 기본 필드 중복 선언
}

// Prisma 타입 미구현
export class User {
  // implements 없음
}

// 비동기 메서드 (Service에서 처리)
async fetchRelated(): Promise<Related[]> {
  // 외부 의존성 호출
}
```

---

## 프로세스

### 1단계: Prisma 타입 확인

```typescript
import type { User as UserEntity } from "@cocrepo/prisma";
```

### 2단계: Entity 클래스 작성

```typescript
export class User extends AbstractEntity implements UserEntity {
  // 필수 필드
  // nullable 필드
  // 관계 필드
  // 도메인 메서드
}
```

### 3단계: index.ts 등록

```typescript
// packages/entity/src/index.ts
export * from "./{entity}.entity";
```

---

## 템플릿

### 기본 템플릿

```typescript
import type {
  {Entity} as {Entity}Entity,
  // 필요한 enum 타입들
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
// 관계 Entity import (type only)
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class {Entity} extends AbstractEntity implements {Entity}Entity {
  // ============================================================================
  // 필수 필드
  // ============================================================================
  name!: string;
  spaceId!: string;

  // ============================================================================
  // Nullable 필드
  // ============================================================================
  description!: string | null;
  parentId!: string | null;

  // ============================================================================
  // 관계 필드 (선택적)
  // ============================================================================
  space?: Space;
  creator?: User;
  parent?: {Entity};
  children?: {Entity}[];

  // ============================================================================
  // 도메인 메서드
  // ============================================================================

  /**
   * [메서드 설명]
   */
  someBusinessMethod(): SomeType {
    // 비즈니스 로직 구현
  }
}
```

### 기본 Entity (관계 없음)

```typescript
import type { File as FileEntity, FileTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class File extends AbstractEntity implements FileEntity {
  name!: string;
  path!: string;
  type!: FileTypes;
  size!: number;
  mimeType!: string;
  spaceId!: string;

  /**
   * 파일 확장자를 반환합니다
   */
  getExtension(): string {
    return this.name.split(".").pop() || "";
  }

  /**
   * 이미지 파일인지 확인합니다
   */
  isImage(): boolean {
    return this.mimeType.startsWith("image/");
  }
}
```

### 자기 참조 관계 Entity

```typescript
import type { Category as CategoryEntity, CategoryTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Category extends AbstractEntity implements CategoryEntity {
  name!: string;
  type!: CategoryTypes;
  parentId!: string | null;
  spaceId!: string;
  creatorId!: string | null;

  parent?: Category;
  children?: Category[];
  space?: Space;
  creator?: User;

  /**
   * 현재 카테고리부터 루트까지 모든 상위 카테고리 이름을 추출합니다
   */
  getAllParentNames(): string[] {
    const names: string[] = [];
    let current: Category | undefined = this;

    while (current) {
      if (current.name) {
        names.push(current.name);
      }
      current = current.parent;
    }

    return names;
  }

  /**
   * 옵션 형태로 변환합니다 (Select 컴포넌트용)
   */
  toOption() {
    return {
      key: this.id,
      value: this.id,
      text: this.name,
    };
  }
}
```

### 다중 관계 Entity

```typescript
import type {
  User as UserEntity,
  Profile,
  Space,
  Tenant,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class User extends AbstractEntity implements UserEntity {
  name!: string;
  email!: string;
  phone!: string;
  password!: string;
  selectedSpaceId: string | null = null;

  // 다중 관계
  selectedSpace?: Space | null;
  profiles?: Profile[];
  tenants?: Tenant[];

  /**
   * 사용자의 현재 선택된 Space에 해당하는 테넌트를 반환합니다
   */
  getCurrentTenant(): Tenant | undefined {
    if (!this.selectedSpaceId || !this.tenants) return undefined;
    return this.tenants.find(
      (tenant) => tenant.spaceId === this.selectedSpaceId,
    );
  }

  /**
   * 사용자가 특정 테넌트에 속해 있는지 확인합니다
   */
  hasTenantAccess(tenantId: string): boolean {
    if (!this.tenants) return false;
    return this.tenants.some((tenant) => tenant.id === tenantId);
  }

  /**
   * 사용자가 활성 상태인지 확인합니다
   */
  isActive(): boolean {
    return this.removedAt === null;
  }
}
```

---

## 체크리스트

- [ ] AbstractEntity 상속
- [ ] Prisma 모델 타입 implements
- [ ] 필수 필드에 `!` 사용
- [ ] 관계 필드에 `?` 사용
- [ ] nullable 필드에 `| null` 타입 추가
- [ ] 도메인 메서드에 JSDoc 주석 추가
- [ ] index.ts에 export 추가

---

## 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|---------|------|
| **선행** | schema-builder | Prisma 스키마 생성 |
| **후행** | dto-builder | DTO 클래스 생성 |
| | repository-builder | Repository 레이어 생성 |
| **관련** | - | - |

---

## 프로젝트별 참고사항

### 파일 위치

```
packages/entity/src/{entity}.entity.ts
```

### 도메인 메서드 가이드

#### 권장 메서드 패턴

| 패턴 | 설명 | 예시 |
|------|------|------|
| `is{Condition}()` | 상태 확인 | `isActive()`, `isExpired()` |
| `has{Something}()` | 존재 확인 | `hasTenantAccess()`, `hasChildren()` |
| `get{Property}()` | 계산된 값 반환 | `getCurrentTenant()`, `getFullName()` |
| `to{Format}()` | 형식 변환 | `toOption()`, `toSummary()` |
| `getAll{Items}()` | 재귀적 조회 | `getAllParentNames()`, `getAllChildren()` |

#### 주의사항

- 외부 의존성 없이 순수하게 구현
- 비동기 메서드는 지양 (필요시 Service에서 처리)
- 복잡한 비즈니스 로직은 Service로 분리

### 관련 파일

- Prisma 스키마: `packages/prisma/schema/*.prisma`
- 추상 Entity: `packages/entity/src/abstract.entity.ts`
- Entity export: `packages/entity/src/index.ts`
