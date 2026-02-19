# L9-L10: 비즈니스 로직 및 테스트 (RoleGroupsAndCategories)

## 이전 레이어 요약

- **L0 Context**: RBAC 권한 체계에서 Role의 그룹핑(Group)과 분류(Category) 기준 데이터를 독립적으로 관리하는 UI
- **L1 Actor**: 최고 관리자(FULL_ACCESS) - 전체 CRUD, 일반 관리자(MANAGE) - 조회 전용
- **L3 Feature 12개**: Group(6), Category(6)
- **L4 Screen 8개**: Group(4: 목록/상세/등록/수정), Category(4: 목록/상세/등록/수정)
- **L5 Action 37개**: 사용자 인터랙션 정의 (검색, 클릭, 삭제 등)
- **L6 API 10개**: Group CRUD(5), Category CRUD(5)
- **L7 Entity 5개**: Group, Category, RoleAssociation, RoleClassification, Role (모두 기존)
- **L8 Component 27개**: 기존 19개 재사용, 신규 8개 (Cell 1, Widget 7)

---

## L9: 비즈니스 로직

### L9.1: 유효성 검사 규칙

#### 유효성 검사 매트릭스

| ID | 필드/기능 | 규칙 | 에러 메시지 | 검사 위치 | API 연결 |
|----|----------|------|------------|----------|----------|
| V001 | Group.name | 필수, `^[A-Z][A-Z0-9_]*$`, 2-50자 | "그룹 이름은 필수입니다" / "그룹 이름은 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" | 프론트엔드 + 백엔드 | RGC-L6-API-003 |
| V002 | Group.name 중복 | 동일 type 내 name 유일 | "이미 존재하는 그룹 이름입니다: {name}" | 백엔드 (Service) | RGC-L6-API-003 |
| V003 | Group.label | 선택, 최대 50자 | "라벨은 50자 이내로 입력해주세요" | 프론트엔드 + 백엔드 | RGC-L6-API-003, RGC-L6-API-004 |
| V004 | Group.type | 필수, GroupTypes enum 값 | "유효하지 않은 그룹 유형입니다" | 백엔드 (DTO) | RGC-L6-API-003 |
| V005 | Group.spaceId | 필수, UUID 형식 | "Space ID는 필수입니다" | 백엔드 (DTO) | RGC-L6-API-003 |
| V006 | Group.id (경로) | UUID 형식, 존재 확인 | "역할 그룹을 찾을 수 없습니다" | 백엔드 (Service) | RGC-L6-API-002, 004, 005 |
| V007 | Category.name | 필수, `^[A-Z][A-Z0-9_]*$`, 2-50자 | "카테고리 이름은 필수입니다" / "카테고리 이름은 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" | 프론트엔드 + 백엔드 | RGC-L6-API-008 |
| V008 | Category.name 중복 | 전역 unique (DB 제약) | "이미 존재하는 카테고리 이름입니다: {name}" | 백엔드 (Service + DB) | RGC-L6-API-008 |
| V009 | Category.type | 필수, CategoryTypes enum 값 | "유효하지 않은 카테고리 유형입니다" | 백엔드 (DTO) | RGC-L6-API-008 |
| V010 | Category.parentId | 선택, UUID 형식, 존재 확인 | "상위 카테고리를 찾을 수 없습니다" | 백엔드 (Service) | RGC-L6-API-008, 009 |
| V011 | Category.parentId 순환 | parentId가 자기 자신이나 하위 카테고리가 아닌지 검증 | "상위 카테고리로 자기 자신이나 하위 카테고리를 선택할 수 없습니다" | 백엔드 (Service) | RGC-L6-API-009 |
| V012 | Category.spaceId | 필수, UUID 형식 | "Space ID는 필수입니다" | 백엔드 (DTO) | RGC-L6-API-008 |
| V013 | Category.id (경로) | UUID 형식, 존재 확인 | "역할 카테고리를 찾을 수 없습니다" | 백엔드 (Service) | RGC-L6-API-007, 009, 010 |

#### 프론트엔드 유효성 검사 상세

**Group 등록 폼 (SCR-003)**:

```typescript
// 유효성 검사 규칙
const groupFormValidation = {
  name: {
    required: "그룹 이름은 필수입니다",
    pattern: {
      value: /^[A-Z][A-Z0-9_]*$/,
      message: "영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
    },
    minLength: { value: 2, message: "2자 이상 입력해주세요" },
    maxLength: { value: 50, message: "50자 이내로 입력해주세요" },
  },
  label: {
    maxLength: { value: 50, message: "50자 이내로 입력해주세요" },
  },
};
```

**Category 등록 폼 (SCR-007)**:

```typescript
// 유효성 검사 규칙
const categoryFormValidation = {
  name: {
    required: "카테고리 이름은 필수입니다",
    pattern: {
      value: /^[A-Z][A-Z0-9_]*$/,
      message: "영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
    },
    minLength: { value: 2, message: "2자 이상 입력해주세요" },
    maxLength: { value: 50, message: "50자 이내로 입력해주세요" },
  },
  parentId: {
    // 선택사항, 추가 검증은 서버에서 처리
  },
};
```

---

### L9.2: 권한 검사 규칙

#### 권한 매트릭스

| ID | 기능 | 필요 권한 | Guard/Decorator | 조건 | API 연결 |
|----|------|----------|----------------|------|----------|
| P001 | 그룹 목록 조회 | MANAGE, FULL_ACCESS | `@Roles([MANAGE, FULL_ACCESS])` | 인증된 사용자, System Space 접속 | RGC-L6-API-001 |
| P002 | 그룹 상세 조회 | MANAGE, FULL_ACCESS | `@Roles([MANAGE, FULL_ACCESS])` | 인증된 사용자, System Space 접속 | RGC-L6-API-002 |
| P003 | 그룹 생성 | FULL_ACCESS | `@Roles([FULL_ACCESS])` | 최고 관리자만 | RGC-L6-API-003 |
| P004 | 그룹 수정 | FULL_ACCESS | `@Roles([FULL_ACCESS])` | 최고 관리자만 | RGC-L6-API-004 |
| P005 | 그룹 삭제 | FULL_ACCESS | `@Roles([FULL_ACCESS])` | 최고 관리자만 | RGC-L6-API-005 |
| P006 | 카테고리 목록 조회 | MANAGE, FULL_ACCESS | `@Roles([MANAGE, FULL_ACCESS])` | 인증된 사용자, System Space 접속 | RGC-L6-API-006 |
| P007 | 카테고리 상세 조회 | MANAGE, FULL_ACCESS | `@Roles([MANAGE, FULL_ACCESS])` | 인증된 사용자, System Space 접속 | RGC-L6-API-007 |
| P008 | 카테고리 생성 | FULL_ACCESS | `@Roles([FULL_ACCESS])` | 최고 관리자만 | RGC-L6-API-008 |
| P009 | 카테고리 수정 | FULL_ACCESS | `@Roles([FULL_ACCESS])` | 최고 관리자만 | RGC-L6-API-009 |
| P010 | 카테고리 삭제 | FULL_ACCESS | `@Roles([FULL_ACCESS])` | 최고 관리자만 | RGC-L6-API-010 |

#### Guard 실행 순서

```
요청 도착
  |
  v
JwtAuthGuard (인증 확인)
  |
  v
SpaceAccessGuard (X-Space-ID 헤더 확인, Tenant 매칭)
  |
  v
RolesGuard (@Roles 데코레이터 기반 역할 확인)
  |
  v
Controller 메서드 실행
```

#### 프론트엔드 권한 체크

```typescript
// CASL Subject 매핑
// Group: 'group' Subject, Category: 'category' Subject

// 목록 화면 - 등록 버튼 조건부 표시
<Can I="create" a="group">
  <Button onPress={onClickCreateButton}>그룹 등록</Button>
</Can>

// 상세 화면 - 수정/삭제 버튼 조건부 표시
<Can I="update" a="group">
  <Button onPress={onClickEditButton}>수정</Button>
</Can>
<Can I="delete" a="group">
  <Button color="danger" onPress={onClickDeleteButton}>삭제</Button>
</Can>
```

---

### L9.3: 비즈니스 계산 로직

#### GroupsService 로직

| ID | 메서드 | 로직 | 입력 | 출력 | 비고 |
|----|--------|------|------|------|------|
| BL001 | `getAll(query)` | type 필터 적용 + _count.roleAssociations include | `QueryGroupDto` | `Group[]` | removedAt IS NULL 자동 필터 |
| BL002 | `getById(id)` | roleAssociations.role include (name, displayName, isSystem) | `id: string` | `Group \| null` | 없으면 404 |
| BL003 | `create(dto)` | 1. name 중복 검사 (같은 type 내) 2. 그룹 생성 | `CreateGroupDto` | `Group` | 409 중복 |
| BL004 | `update(id, dto)` | 1. 존재 확인 2. 부분 수정 | `id, UpdateGroupDto` | `Group` | 404 미존재 |
| BL005 | `delete(id)` | 1. 존재 확인 2. 소프트 삭제 (removedAt 설정) | `id: string` | `Group` | RoleAssociation cascade 소프트 삭제 |

##### BL003 상세: 그룹 생성 시 name 중복 검사

```typescript
async create(dto: CreateGroupDto): Promise<Group> {
  // 같은 type 내에서 name 중복 확인 (삭제되지 않은 것만)
  const existing = await this.repository.findByNameAndType(dto.name, dto.type);
  if (existing) {
    throw new ConflictException(`이미 존재하는 그룹 이름입니다: ${dto.name}`);
  }
  return this.repository.create(dto);
}
```

##### BL005 상세: 그룹 삭제 시 연결 해제

```typescript
async delete(id: string): Promise<Group> {
  const group = await this.repository.findById(id);
  if (!group) {
    throw new NotFoundException("역할 그룹을 찾을 수 없습니다");
  }

  // 소프트 삭제: group + 연결된 roleAssociations 모두 removedAt 설정
  // 프론트엔드에서 경고 모달로 사전 확인 완료된 상태
  return this.repository.softDeleteWithAssociations(id);
}
```

#### CategoriesService 로직

| ID | 메서드 | 로직 | 입력 | 출력 | 비고 |
|----|--------|------|------|------|------|
| BL006 | `getAll(query)` | type 필터 + parent include + _count(roleClassifications, children) include | `QueryCategoryDto` | `Category[]` | removedAt IS NULL 자동 필터 |
| BL007 | `getById(id)` | parent, children, roleClassifications.role include | `id: string` | `Category \| null` | 없으면 404 |
| BL008 | `create(dto)` | 1. name 중복 검사 (unique 제약) 2. parentId 존재 확인 3. 카테고리 생성 | `CreateCategoryDto` | `Category` | 409 중복 |
| BL009 | `update(id, dto)` | 1. 존재 확인 2. parentId 변경 시 순환 참조 검증 3. 부분 수정 | `id, UpdateCategoryDto` | `Category` | 400 순환 참조 |
| BL010 | `delete(id)` | 1. 존재 확인 2. 하위 카테고리 존재 시 삭제 거부 3. 소프트 삭제 | `id: string` | `Category` | 400 하위 존재 |

##### BL008 상세: 카테고리 생성

```typescript
async create(dto: CreateCategoryDto): Promise<Category> {
  // name 중복 확인 (Category는 전역 unique)
  const existing = await this.repository.findByName(dto.name);
  if (existing) {
    throw new ConflictException(`이미 존재하는 카테고리 이름입니다: ${dto.name}`);
  }

  // parentId가 제공된 경우 존재 확인
  if (dto.parentId) {
    const parent = await this.repository.findById(dto.parentId);
    if (!parent) {
      throw new NotFoundException("상위 카테고리를 찾을 수 없습니다");
    }
  }

  return this.repository.create(dto);
}
```

##### BL009 상세: 카테고리 수정 시 순환 참조 검증

```typescript
async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
  const category = await this.repository.findById(id);
  if (!category) {
    throw new NotFoundException("역할 카테고리를 찾을 수 없습니다");
  }

  // parentId 변경 시 순환 참조 검증
  if (dto.parentId !== undefined) {
    await this.validateNoCircularReference(id, dto.parentId);
  }

  return this.repository.updateById(id, dto);
}

/**
 * 순환 참조 검증
 * - parentId가 자기 자신인지 확인
 * - parentId가 자신의 하위 카테고리인지 재귀 확인
 */
private async validateNoCircularReference(
  categoryId: string,
  newParentId: string | null,
): Promise<void> {
  if (newParentId === null) return; // 최상위로 이동은 허용

  // 자기 자신 선택 불가
  if (categoryId === newParentId) {
    throw new BadRequestException(
      "상위 카테고리로 자기 자신을 선택할 수 없습니다",
    );
  }

  // 하위 카테고리 재귀 탐색
  const descendantIds = await this.getAllDescendantIds(categoryId);
  if (descendantIds.includes(newParentId)) {
    throw new BadRequestException(
      "상위 카테고리로 하위 카테고리를 선택할 수 없습니다",
    );
  }
}

/**
 * 특정 카테고리의 모든 하위 카테고리 ID 조회 (재귀)
 */
private async getAllDescendantIds(categoryId: string): Promise<string[]> {
  const children = await this.repository.findChildrenByParentId(categoryId);
  const descendantIds: string[] = [];

  for (const child of children) {
    descendantIds.push(child.id);
    const childDescendants = await this.getAllDescendantIds(child.id);
    descendantIds.push(...childDescendants);
  }

  return descendantIds;
}
```

##### BL010 상세: 카테고리 삭제

```typescript
async delete(id: string): Promise<Category> {
  const category = await this.repository.findById(id);
  if (!category) {
    throw new NotFoundException("역할 카테고리를 찾을 수 없습니다");
  }

  // 하위 카테고리 존재 시 삭제 거부
  const childrenCount = await this.repository.countChildrenByParentId(id);
  if (childrenCount > 0) {
    throw new BadRequestException(
      "하위 카테고리를 먼저 삭제하거나 이동해주세요.",
    );
  }

  // 소프트 삭제: category + 연결된 roleClassifications 모두 removedAt 설정
  return this.repository.softDeleteWithClassifications(id);
}
```

---

### L9.4: 엣지케이스

#### 엣지케이스 매트릭스

| ID | 유형 | 시나리오 | 처리 방식 | 관련 로직 |
|----|------|---------|----------|----------|
| EC001 | 동시성 | 두 관리자가 동시에 같은 name으로 그룹 생성 | DB unique 제약 위반 -> ConflictException (409) | BL003 |
| EC002 | 동시성 | 두 관리자가 동시에 같은 name으로 카테고리 생성 | DB unique 제약 위반 -> ConflictException (409) | BL008 |
| EC003 | 상태 전이 | 삭제된 그룹과 동일한 name으로 새 그룹 생성 | removedAt IS NULL 조건으로 삭제된 것은 중복 검사에서 제외 | BL003 |
| EC004 | 상태 전이 | 삭제된 카테고리와 동일한 name으로 새 카테고리 생성 | Category.name은 DB 레벨 unique이므로, 소프트 삭제된 경우에도 중복 불가. 하드 삭제 필요하거나 다른 name 사용 | BL008 |
| EC005 | 참조 무결성 | 그룹 삭제 시 연결된 RoleAssociation 처리 | cascade 소프트 삭제 (roleAssociations의 removedAt 설정) | BL005 |
| EC006 | 참조 무결성 | 카테고리 삭제 시 하위 카테고리 존재 | 삭제 거부 (400 Bad Request) | BL010 |
| EC007 | 참조 무결성 | 카테고리 삭제 시 분류된 Role 존재 | 경고 후 삭제 허용 (cascade 소프트 삭제) | BL010 |
| EC008 | 순환 참조 | parentId를 자기 자신으로 설정 | BadRequestException 발생 (400) | BL009 |
| EC009 | 순환 참조 | parentId를 자신의 하위 카테고리로 설정 (A->B->C, C의 parentId를 A로 변경 후 A의 parentId를 C로) | 재귀 하위 카테고리 탐색으로 검출, BadRequestException (400) | BL009 |
| EC010 | 경계값 | name이 빈 문자열이거나 공백만 있는 경우 | DTO 검증에서 필수 값 체크 실패 (400) | V001, V007 |
| EC011 | 경계값 | name이 50자를 초과하는 경우 | DTO 검증에서 최대 길이 체크 실패 (400) | V001, V007 |
| EC012 | 경계값 | name이 소문자나 숫자로 시작하는 경우 | 정규식 패턴 매칭 실패 (400) | V001, V007 |
| EC013 | 경계값 | parentId에 존재하지 않는 UUID 전달 | NotFoundException (404) | BL008, BL009 |
| EC014 | 경계값 | 경로 파라미터 id가 UUID 형식이 아닌 경우 | Pipe 검증 실패 (400) | 전체 상세/수정/삭제 API |
| EC015 | 데이터 | 이미 소프트 삭제된 그룹/카테고리에 대한 조회 | removedAt IS NULL 필터에 의해 조회 안 됨, 404 반환 | BL002, BL007 |
| EC016 | 데이터 | type이 Role이 아닌 Group/Category 존재 시 | type 쿼리 파라미터 필터로 Role만 조회, 다른 타입 데이터에 영향 없음 | BL001, BL006 |
| EC017 | 프론트엔드 | 카테고리 수정 시 parentId Select에서 자기 자신 및 하위 카테고리 제외 | 클라이언트에서 전체 카테고리 목록 조회 후 재귀 필터링 | SCR-008 |

---

### L9.5: 비즈니스 규칙 문서

#### 그룹 이름 규칙

| 규칙 | 설명 |
|------|------|
| 형식 | 영문 대문자로 시작, 영문 대문자/숫자/언더스코어만 허용 (`^[A-Z][A-Z0-9_]*$`) |
| 길이 | 2자 이상 50자 이하 |
| 유일성 | 같은 type 내에서 유일 (Group.name은 DB 레벨 unique 아님, Service에서 검증) |
| 불변성 | 생성 후 name 변경 불가 (프론트엔드에서 readonly 처리, 백엔드에서도 무시) |

#### 카테고리 이름 규칙

| 규칙 | 설명 |
|------|------|
| 형식 | 영문 대문자로 시작, 영문 대문자/숫자/언더스코어만 허용 (`^[A-Z][A-Z0-9_]*$`) |
| 길이 | 2자 이상 50자 이하 |
| 유일성 | 전역 unique (DB `@unique` 제약) |
| 불변성 | 생성 후 name 변경 불가 (프론트엔드에서 readonly 처리, 백엔드에서도 무시) |

#### 카테고리 트리 구조 규칙

| 규칙 | 설명 |
|------|------|
| 자기 참조 | parentId로 자기 자신을 선택할 수 없음 |
| 순환 방지 | parentId로 자신의 하위 카테고리(재귀)를 선택할 수 없음 |
| 삭제 보호 | 하위 카테고리가 있으면 삭제 불가 (리프 노드만 삭제 가능) |
| 깊이 제한 | 명시적 제한 없음 (현재 시드 데이터 기준 최대 2단계) |

#### 삭제 정책

| 대상 | 연결 데이터 있을 때 | 하위 카테고리 있을 때 | 삭제 방식 |
|------|-------------------|---------------------|----------|
| Group | 경고 후 삭제 허용 (RoleAssociation cascade 소프트 삭제) | - | 소프트 삭제 (removedAt) |
| Category | 경고 후 삭제 허용 (RoleClassification cascade 소프트 삭제) | 삭제 거부 (400) | 소프트 삭제 (removedAt) |

#### QueryGroupDto 수정 필요 사항

현재 `QueryGroupDto`에 `type` 필터와 `label` 검색이 없으므로 추가 필요:

```typescript
// packages/be-dto/src/query/query-group.dto.ts
export class QueryGroupDto extends PrismaQueryDto<Prisma.GroupWhereInput> {
  @StringFieldOptional()
  name?: string;

  @EnumFieldOptional(() => GroupTypes)
  type?: GroupTypes;  // 추가 필요

  @StringFieldOptional()
  label?: string;  // 추가 필요 (label 검색용)

  @StringFieldOptional()
  serviceId?: string;
}
```

---

## L10: 테스트 케이스

### 테스트 전략

| 테스트 유형 | 프레임워크 | 대상 | 범위 |
|------------|----------|------|------|
| 백엔드 단위 테스트 | Jest | GroupsService, CategoriesService | 비즈니스 로직 검증 |
| 백엔드 E2E 테스트 | Jest + Supertest | /api/v1/groups, /api/v1/categories | API 전체 흐름 검증 |
| 프론트엔드 단위 테스트 | Vitest | GroupFormSection, CategoryFormSection | 유효성 검사 로직 검증 |

---

### L10.1: Happy Path 테스트

#### 백엔드 단위 테스트: GroupsService

```typescript
describe('GroupsService', () => {
  describe('getAll', () => {
    it('type=Role 필터로 그룹 목록을 조회한다', async () => {
      // Given: type=Role인 그룹 3개가 존재
      // When: getAll({ type: 'Role' }) 호출
      // Then: Role 타입 그룹 3개 반환, _count.roleAssociations 포함
    });
  });

  describe('getById', () => {
    it('ID로 그룹 상세를 조회한다 (roleAssociations.role 포함)', async () => {
      // Given: TRUSTED 그룹이 존재하고 2개의 Role이 연결됨
      // When: getById(groupId) 호출
      // Then: 그룹 정보 + roleAssociations[].role 정보 반환
    });
  });

  describe('create', () => {
    it('유효한 데이터로 그룹을 생성한다', async () => {
      // Given: { name: "VIP", type: "Role", label: "VIP 전용", spaceId, tenantId }
      // When: create(dto) 호출
      // Then: 생성된 그룹 반환, id 포함
    });

    it('label 없이 그룹을 생성한다', async () => {
      // Given: { name: "CUSTOM", type: "Role", spaceId, tenantId } (label 미제공)
      // When: create(dto) 호출
      // Then: 생성 성공, label은 null
    });
  });

  describe('update', () => {
    it('그룹의 label을 수정한다', async () => {
      // Given: TRUSTED 그룹이 존재
      // When: update(id, { label: "수정된 라벨" }) 호출
      // Then: label이 "수정된 라벨"로 변경된 그룹 반환
    });
  });

  describe('delete', () => {
    it('소속 역할이 없는 그룹을 삭제한다', async () => {
      // Given: 소속 역할이 0개인 그룹
      // When: delete(id) 호출
      // Then: removedAt이 설정된 그룹 반환
    });

    it('소속 역할이 있는 그룹을 삭제하면 연결도 함께 소프트 삭제된다', async () => {
      // Given: 2개의 RoleAssociation이 연결된 그룹
      // When: delete(id) 호출
      // Then: 그룹 removedAt 설정 + 연결된 RoleAssociation removedAt 설정
    });
  });
});
```

#### 백엔드 단위 테스트: CategoriesService

```typescript
describe('CategoriesService', () => {
  describe('getAll', () => {
    it('type=Role 필터로 카테고리 목록을 조회한다', async () => {
      // Given: type=Role인 카테고리 7개가 존재
      // When: getAll({ type: 'Role' }) 호출
      // Then: Role 타입 카테고리 7개 반환, parent, _count 포함
    });
  });

  describe('getById', () => {
    it('ID로 카테고리 상세를 조회한다 (children, roleClassifications.role 포함)', async () => {
      // Given: WORKSPACE 카테고리가 존재하고 하위 카테고리 2개, 분류된 Role 1개
      // When: getById(categoryId) 호출
      // Then: 카테고리 정보 + children + roleClassifications[].role 반환
    });
  });

  describe('create', () => {
    it('최상위 카테고리를 생성한다 (parentId 없음)', async () => {
      // Given: { name: "ANALYTICS", type: "Role", spaceId, tenantId }
      // When: create(dto) 호출
      // Then: parentId가 null인 카테고리 생성
    });

    it('하위 카테고리를 생성한다 (parentId 지정)', async () => {
      // Given: { name: "SUB_CATEGORY", type: "Role", parentId: workspaceId, spaceId, tenantId }
      // When: create(dto) 호출
      // Then: parentId가 설정된 카테고리 생성
    });
  });

  describe('update', () => {
    it('카테고리의 parentId를 변경한다', async () => {
      // Given: PUBLIC 카테고리 (parent: WORKSPACE)
      // When: update(id, { parentId: null }) 호출
      // Then: 최상위 카테고리로 변경
    });

    it('카테고리의 parentId를 다른 카테고리로 변경한다', async () => {
      // Given: PUBLIC 카테고리 (parent: WORKSPACE), PLATFORM 카테고리 존재
      // When: update(id, { parentId: platformId }) 호출
      // Then: PLATFORM의 하위 카테고리로 변경
    });
  });

  describe('delete', () => {
    it('하위 카테고리와 분류된 역할이 없는 카테고리를 삭제한다', async () => {
      // Given: 하위 카테고리 0개, 분류된 Role 0개인 카테고리
      // When: delete(id) 호출
      // Then: removedAt이 설정된 카테고리 반환
    });

    it('분류된 역할이 있는 카테고리를 삭제하면 분류도 함께 소프트 삭제된다', async () => {
      // Given: 1개의 RoleClassification이 연결된 카테고리 (하위 없음)
      // When: delete(id) 호출
      // Then: 카테고리 removedAt 설정 + 연결된 RoleClassification removedAt 설정
    });
  });
});
```

#### 백엔드 E2E 테스트

```typescript
describe('역할 그룹 API (E2E)', () => {
  describe('GET /api/v1/groups', () => {
    it('type=Role 필터로 그룹 목록을 조회한다', async () => {
      // Given: FULL_ACCESS 토큰, System Space 헤더
      // When: GET /api/v1/groups?type=Role
      // Then: 200 OK, data 배열 반환, 각 항목에 _count.roleAssociations 포함
    });
  });

  describe('GET /api/v1/groups/:id', () => {
    it('그룹 상세를 조회한다', async () => {
      // Given: FULL_ACCESS 토큰, 유효한 groupId
      // When: GET /api/v1/groups/:id
      // Then: 200 OK, data에 roleAssociations[].role 정보 포함
    });
  });

  describe('POST /api/v1/groups', () => {
    it('새 그룹을 생성한다', async () => {
      // Given: FULL_ACCESS 토큰, { name: "ENTERPRISE", type: "Role", label: "엔터프라이즈", spaceId, tenantId }
      // When: POST /api/v1/groups
      // Then: 201 Created, data.name === "ENTERPRISE"
    });
  });

  describe('PATCH /api/v1/groups/:id', () => {
    it('그룹 label을 수정한다', async () => {
      // Given: FULL_ACCESS 토큰, 기존 그룹 ID, { label: "변경된 라벨" }
      // When: PATCH /api/v1/groups/:id
      // Then: 200 OK, data.label === "변경된 라벨"
    });
  });

  describe('DELETE /api/v1/groups/:id', () => {
    it('그룹을 삭제한다', async () => {
      // Given: FULL_ACCESS 토큰, 삭제할 그룹 ID
      // When: DELETE /api/v1/groups/:id
      // Then: 200 OK, 삭제 후 GET 시 404
    });
  });
});

describe('역할 카테고리 API (E2E)', () => {
  describe('GET /api/v1/categories', () => {
    it('type=Role 필터로 카테고리 목록을 조회한다', async () => {
      // Given: FULL_ACCESS 토큰, System Space 헤더
      // When: GET /api/v1/categories?type=Role
      // Then: 200 OK, data 배열 반환, parent, _count 포함
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    it('카테고리 상세를 조회한다', async () => {
      // Given: FULL_ACCESS 토큰, 유효한 categoryId
      // When: GET /api/v1/categories/:id
      // Then: 200 OK, data에 children, roleClassifications[].role 포함
    });
  });

  describe('POST /api/v1/categories', () => {
    it('최상위 카테고리를 생성한다', async () => {
      // Given: FULL_ACCESS 토큰, { name: "ANALYTICS", type: "Role", spaceId, tenantId }
      // When: POST /api/v1/categories
      // Then: 201 Created, data.parentId === null
    });

    it('하위 카테고리를 생성한다', async () => {
      // Given: FULL_ACCESS 토큰, { name: "SUB", type: "Role", parentId, spaceId, tenantId }
      // When: POST /api/v1/categories
      // Then: 201 Created, data.parentId === parentId
    });
  });

  describe('PATCH /api/v1/categories/:id', () => {
    it('카테고리의 parentId를 변경한다', async () => {
      // Given: FULL_ACCESS 토큰, 기존 카테고리 ID, { parentId: newParentId }
      // When: PATCH /api/v1/categories/:id
      // Then: 200 OK, data.parentId === newParentId
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('리프 카테고리를 삭제한다', async () => {
      // Given: FULL_ACCESS 토큰, 하위 카테고리 없는 카테고리 ID
      // When: DELETE /api/v1/categories/:id
      // Then: 200 OK, 삭제 후 GET 시 404
    });
  });
});
```

---

### L10.2: Error Path 테스트

#### 백엔드 단위 테스트: GroupsService 에러

```typescript
describe('GroupsService - Error Path', () => {
  describe('getById', () => {
    it('존재하지 않는 ID로 조회하면 NotFoundException을 던진다', async () => {
      // Given: 존재하지 않는 UUID
      // When: getById(invalidId) 호출
      // Then: NotFoundException("역할 그룹을 찾을 수 없습니다")
    });
  });

  describe('create', () => {
    it('중복된 name으로 생성하면 ConflictException을 던진다', async () => {
      // Given: 이미 TRUSTED라는 name의 Role 타입 그룹이 존재
      // When: create({ name: "TRUSTED", type: "Role", ... }) 호출
      // Then: ConflictException("이미 존재하는 그룹 이름입니다: TRUSTED")
    });
  });

  describe('update', () => {
    it('존재하지 않는 그룹을 수정하면 NotFoundException을 던진다', async () => {
      // Given: 존재하지 않는 UUID
      // When: update(invalidId, { label: "test" }) 호출
      // Then: NotFoundException("역할 그룹을 찾을 수 없습니다")
    });
  });

  describe('delete', () => {
    it('존재하지 않는 그룹을 삭제하면 NotFoundException을 던진다', async () => {
      // Given: 존재하지 않는 UUID
      // When: delete(invalidId) 호출
      // Then: NotFoundException("역할 그룹을 찾을 수 없습니다")
    });
  });
});
```

#### 백엔드 단위 테스트: CategoriesService 에러

```typescript
describe('CategoriesService - Error Path', () => {
  describe('getById', () => {
    it('존재하지 않는 ID로 조회하면 NotFoundException을 던진다', async () => {
      // Given: 존재하지 않는 UUID
      // When: getById(invalidId) 호출
      // Then: NotFoundException("역할 카테고리를 찾을 수 없습니다")
    });
  });

  describe('create', () => {
    it('중복된 name으로 생성하면 ConflictException을 던진다', async () => {
      // Given: 이미 PLATFORM이라는 카테고리가 존재
      // When: create({ name: "PLATFORM", type: "Role", ... }) 호출
      // Then: ConflictException("이미 존재하는 카테고리 이름입니다: PLATFORM")
    });

    it('존재하지 않는 parentId로 생성하면 NotFoundException을 던진다', async () => {
      // Given: 존재하지 않는 parentId UUID
      // When: create({ name: "SUB", parentId: invalidId, ... }) 호출
      // Then: NotFoundException("상위 카테고리를 찾을 수 없습니다")
    });
  });

  describe('update', () => {
    it('존재하지 않는 카테고리를 수정하면 NotFoundException을 던진다', async () => {
      // Given: 존재하지 않는 UUID
      // When: update(invalidId, { parentId: null }) 호출
      // Then: NotFoundException("역할 카테고리를 찾을 수 없습니다")
    });

    it('parentId를 자기 자신으로 설정하면 BadRequestException을 던진다', async () => {
      // Given: PLATFORM 카테고리 (id: platformId)
      // When: update(platformId, { parentId: platformId }) 호출
      // Then: BadRequestException("상위 카테고리로 자기 자신을 선택할 수 없습니다")
    });

    it('parentId를 하위 카테고리로 설정하면 BadRequestException을 던진다', async () => {
      // Given: WORKSPACE(parent) -> PUBLIC(child) 관계
      // When: update(workspaceId, { parentId: publicId }) 호출
      // Then: BadRequestException("상위 카테고리로 하위 카테고리를 선택할 수 없습니다")
    });
  });

  describe('delete', () => {
    it('존재하지 않는 카테고리를 삭제하면 NotFoundException을 던진다', async () => {
      // Given: 존재하지 않는 UUID
      // When: delete(invalidId) 호출
      // Then: NotFoundException("역할 카테고리를 찾을 수 없습니다")
    });

    it('하위 카테고리가 있는 카테고리를 삭제하면 BadRequestException을 던진다', async () => {
      // Given: WORKSPACE 카테고리에 PUBLIC, PROJECT 하위 카테고리 존재
      // When: delete(workspaceId) 호출
      // Then: BadRequestException("하위 카테고리를 먼저 삭제하거나 이동해주세요.")
    });
  });
});
```

#### 백엔드 E2E 테스트: 권한 에러

```typescript
describe('역할 그룹 API - 권한 에러 (E2E)', () => {
  it('인증 없이 그룹 목록 조회 시 401 Unauthorized', async () => {
    // Given: 토큰 없음
    // When: GET /api/v1/groups
    // Then: 401 Unauthorized
  });

  it('MANAGE 권한으로 그룹 생성 시 403 Forbidden', async () => {
    // Given: MANAGE 역할 토큰
    // When: POST /api/v1/groups { name: "TEST", type: "Role", ... }
    // Then: 403 Forbidden
  });

  it('MANAGE 권한으로 그룹 수정 시 403 Forbidden', async () => {
    // Given: MANAGE 역할 토큰
    // When: PATCH /api/v1/groups/:id { label: "test" }
    // Then: 403 Forbidden
  });

  it('MANAGE 권한으로 그룹 삭제 시 403 Forbidden', async () => {
    // Given: MANAGE 역할 토큰
    // When: DELETE /api/v1/groups/:id
    // Then: 403 Forbidden
  });

  it('X-Space-ID 헤더 없이 그룹 목록 조회 시 실패', async () => {
    // Given: FULL_ACCESS 토큰, X-Space-ID 헤더 미포함
    // When: GET /api/v1/groups
    // Then: 400 또는 403 (SpaceAccessGuard)
  });
});

describe('역할 카테고리 API - 권한 에러 (E2E)', () => {
  it('인증 없이 카테고리 목록 조회 시 401 Unauthorized', async () => {
    // Given: 토큰 없음
    // When: GET /api/v1/categories
    // Then: 401 Unauthorized
  });

  it('MANAGE 권한으로 카테고리 생성 시 403 Forbidden', async () => {
    // Given: MANAGE 역할 토큰
    // When: POST /api/v1/categories { name: "TEST", type: "Role", ... }
    // Then: 403 Forbidden
  });

  it('MANAGE 권한으로 카테고리 삭제 시 403 Forbidden', async () => {
    // Given: MANAGE 역할 토큰
    // When: DELETE /api/v1/categories/:id
    // Then: 403 Forbidden
  });
});

describe('역할 그룹 API - 유효성 에러 (E2E)', () => {
  it('name 없이 그룹 생성 시 400 Bad Request', async () => {
    // Given: FULL_ACCESS 토큰, { type: "Role", spaceId, tenantId } (name 누락)
    // When: POST /api/v1/groups
    // Then: 400 Bad Request
  });

  it('중복된 name으로 그룹 생성 시 409 Conflict', async () => {
    // Given: FULL_ACCESS 토큰, 이미 존재하는 name "TRUSTED"
    // When: POST /api/v1/groups { name: "TRUSTED", type: "Role", ... }
    // Then: 409 Conflict
  });

  it('존재하지 않는 ID로 그룹 조회 시 404 Not Found', async () => {
    // Given: FULL_ACCESS 토큰, 존재하지 않는 UUID
    // When: GET /api/v1/groups/:invalidId
    // Then: 404 Not Found
  });
});

describe('역할 카테고리 API - 유효성 에러 (E2E)', () => {
  it('중복된 name으로 카테고리 생성 시 409 Conflict', async () => {
    // Given: FULL_ACCESS 토큰, 이미 존재하는 name "PLATFORM"
    // When: POST /api/v1/categories { name: "PLATFORM", type: "Role", ... }
    // Then: 409 Conflict
  });

  it('순환 참조 parentId로 카테고리 수정 시 400 Bad Request', async () => {
    // Given: FULL_ACCESS 토큰, WORKSPACE->PUBLIC 관계
    // When: PATCH /api/v1/categories/workspaceId { parentId: publicId }
    // Then: 400 Bad Request
  });

  it('하위 카테고리 존재 시 삭제하면 400 Bad Request', async () => {
    // Given: FULL_ACCESS 토큰, 하위 카테고리가 있는 WORKSPACE
    // When: DELETE /api/v1/categories/workspaceId
    // Then: 400 Bad Request ("하위 카테고리를 먼저 삭제하거나 이동해주세요.")
  });
});
```

---

### L10.3: Edge Case 테스트

#### 백엔드 단위 테스트: 엣지케이스

```typescript
describe('GroupsService - Edge Case', () => {
  it('삭제된 그룹과 같은 name으로 새 그룹을 생성할 수 있다', async () => {
    // Given: "VIP" 그룹이 소프트 삭제됨 (removedAt 설정)
    // When: create({ name: "VIP", type: "Role", ... }) 호출
    // Then: 새 "VIP" 그룹 생성 성공 (removedAt IS NULL 조건으로 중복 체크 통과)
  });

  it('type이 다른 그룹과 같은 name으로 Role 타입 그룹을 생성할 수 있다', async () => {
    // Given: type=User인 "CUSTOM" 그룹이 존재
    // When: create({ name: "CUSTOM", type: "Role", ... }) 호출
    // Then: 새 Role 타입 "CUSTOM" 그룹 생성 성공 (type별 name 유일성)
  });

  it('빈 문자열 label로 그룹을 수정할 수 있다', async () => {
    // Given: label이 "신뢰"인 그룹
    // When: update(id, { label: "" }) 호출
    // Then: label이 빈 문자열로 변경
  });

  it('label을 null로 그룹을 수정할 수 있다', async () => {
    // Given: label이 "신뢰"인 그룹
    // When: update(id, { label: null }) 호출
    // Then: label이 null로 변경
  });
});

describe('CategoriesService - Edge Case', () => {
  it('순환 참조 검증: 3단계 깊이에서도 올바르게 감지한다', async () => {
    // Given: A -> B -> C 계층 구조
    // When: update(A.id, { parentId: C.id }) 호출
    // Then: BadRequestException (C는 A의 하위)
  });

  it('parentId를 null로 변경하여 최상위 카테고리로 승격한다', async () => {
    // Given: PUBLIC 카테고리 (parent: WORKSPACE)
    // When: update(publicId, { parentId: null }) 호출
    // Then: PUBLIC이 최상위 카테고리가 됨
  });

  it('하위 카테고리가 모두 삭제된 후 부모 카테고리를 삭제할 수 있다', async () => {
    // Given: WORKSPACE -> PUBLIC, PROJECT (하위 2개)
    // When: PUBLIC 삭제, PROJECT 삭제, 그 후 WORKSPACE 삭제 호출
    // Then: WORKSPACE 삭제 성공
  });

  it('Category.name은 DB 레벨 unique이므로 소프트 삭제된 것과 중복 시 실패한다', async () => {
    // Given: "ANALYTICS" 카테고리가 소프트 삭제됨
    // When: create({ name: "ANALYTICS", type: "Role", ... }) 호출
    // Then: ConflictException 또는 DB unique 위반 (Category name은 전역 unique)
  });

  it('type 필터 없이 조회하면 모든 타입의 카테고리가 반환된다', async () => {
    // Given: type=Role 7개, type=Space 2개 카테고리 존재
    // When: getAll({}) 호출 (type 미지정)
    // Then: 전체 9개 반환
  });
});
```

#### 백엔드 E2E 테스트: 엣지케이스

```typescript
describe('역할 그룹 API - Edge Case (E2E)', () => {
  it('그룹 삭제 후 동일 name으로 재생성', async () => {
    // Given: "TEST_GROUP" 생성 -> 삭제
    // When: POST /api/v1/groups { name: "TEST_GROUP", type: "Role", ... }
    // Then: 201 Created (소프트 삭제는 중복 체크에서 제외)
  });

  it('빈 body로 그룹 수정 요청', async () => {
    // Given: FULL_ACCESS 토큰, 기존 그룹 ID
    // When: PATCH /api/v1/groups/:id {} (빈 body)
    // Then: 200 OK (변경사항 없음, 기존 데이터 반환)
  });

  it('MANAGE 권한으로 그룹 목록 조회는 성공', async () => {
    // Given: MANAGE 역할 토큰
    // When: GET /api/v1/groups?type=Role
    // Then: 200 OK (조회는 MANAGE 이상 허용)
  });
});

describe('역할 카테고리 API - Edge Case (E2E)', () => {
  it('자기 자신을 parentId로 설정 시 400', async () => {
    // Given: FULL_ACCESS 토큰, PLATFORM 카테고리
    // When: PATCH /api/v1/categories/platformId { parentId: platformId }
    // Then: 400 Bad Request
  });

  it('2단계 순환 참조 감지', async () => {
    // Given: WORKSPACE(id: W) -> PUBLIC(id: P) 관계
    // When: PATCH /api/v1/categories/W { parentId: P }
    // Then: 400 Bad Request ("상위 카테고리로 하위 카테고리를 선택할 수 없습니다")
  });

  it('하위 카테고리 삭제 후 부모 삭제 성공', async () => {
    // Given: PARENT -> CHILD 관계, CHILD를 먼저 삭제
    // When: DELETE /api/v1/categories/parentId
    // Then: 200 OK (하위 카테고리 없음)
  });

  it('parentId를 null로 수정하여 최상위로 이동', async () => {
    // Given: PUBLIC 카테고리 (parentId: workspaceId)
    // When: PATCH /api/v1/categories/publicId { parentId: null }
    // Then: 200 OK, parentId === null
  });
});
```

---

### 테스트 커버리지 매트릭스

#### GroupsService

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 목록 조회 (getAll) | 1 | 0 | 0 | 1 |
| 상세 조회 (getById) | 1 | 1 | 0 | 2 |
| 생성 (create) | 2 | 1 | 2 | 5 |
| 수정 (update) | 1 | 1 | 2 | 4 |
| 삭제 (delete) | 2 | 1 | 0 | 3 |
| **합계** | **7** | **4** | **4** | **15** |

#### CategoriesService

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 목록 조회 (getAll) | 1 | 0 | 1 | 2 |
| 상세 조회 (getById) | 1 | 1 | 0 | 2 |
| 생성 (create) | 2 | 2 | 1 | 5 |
| 수정 (update) | 2 | 3 | 2 | 7 |
| 삭제 (delete) | 2 | 2 | 1 | 5 |
| **합계** | **8** | **8** | **5** | **21** |

#### E2E 테스트

| 도메인 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| 역할 그룹 API | 5 | 8 | 3 | 16 |
| 역할 카테고리 API | 5 | 6 | 4 | 15 |
| **합계** | **10** | **14** | **7** | **31** |

#### 전체 테스트 요약

| 테스트 유형 | 테스트 수 |
|------------|:--------:|
| 백엔드 단위 테스트 (GroupsService) | 15 |
| 백엔드 단위 테스트 (CategoriesService) | 21 |
| 백엔드 E2E 테스트 | 31 |
| **총 테스트 수** | **67** |

---

## Requirement Graph (L9-L10)

```json
{
  "level_range": "L9-L10",
  "nodes": [
    { "id": "RGC-L9-LOG-001", "level": 9, "subLevel": "1", "type": "logic", "name": "Group.name 유효성 검사", "description": "그룹 이름 필수, 정규식 ^[A-Z][A-Z0-9_]*$, 2-50자", "metadata": { "validationType": "field", "rules": ["required", "pattern", "minLength", "maxLength"] } },
    { "id": "RGC-L9-LOG-002", "level": 9, "subLevel": "1", "type": "logic", "name": "Group.name 중복 검사", "description": "같은 type 내 name 유일성 검사 (removedAt IS NULL)", "metadata": { "validationType": "uniqueness", "rules": ["unique_per_type"] } },
    { "id": "RGC-L9-LOG-003", "level": 9, "subLevel": "1", "type": "logic", "name": "Group.label 유효성 검사", "description": "선택 필드, 최대 50자", "metadata": { "validationType": "field", "rules": ["maxLength"] } },
    { "id": "RGC-L9-LOG-004", "level": 9, "subLevel": "1", "type": "logic", "name": "Group 존재 확인", "description": "ID로 그룹 존재 여부 확인 (404)", "metadata": { "validationType": "existence", "rules": ["exists"] } },
    { "id": "RGC-L9-LOG-005", "level": 9, "subLevel": "1", "type": "logic", "name": "Category.name 유효성 검사", "description": "카테고리 이름 필수, 정규식 ^[A-Z][A-Z0-9_]*$, 2-50자", "metadata": { "validationType": "field", "rules": ["required", "pattern", "minLength", "maxLength"] } },
    { "id": "RGC-L9-LOG-006", "level": 9, "subLevel": "1", "type": "logic", "name": "Category.name 전역 unique 검사", "description": "전역 unique 제약 (DB @unique + Service 검증)", "metadata": { "validationType": "uniqueness", "rules": ["global_unique"] } },
    { "id": "RGC-L9-LOG-007", "level": 9, "subLevel": "1", "type": "logic", "name": "Category.parentId 존재 확인", "description": "parentId가 제공된 경우 해당 카테고리 존재 확인", "metadata": { "validationType": "reference_integrity", "rules": ["fk_exists"] } },
    { "id": "RGC-L9-LOG-008", "level": 9, "subLevel": "1", "type": "logic", "name": "Category 존재 확인", "description": "ID로 카테고리 존재 여부 확인 (404)", "metadata": { "validationType": "existence", "rules": ["exists"] } },

    { "id": "RGC-L9-LOG-010", "level": 9, "subLevel": "2", "type": "logic", "name": "그룹 CRUD 권한 검사", "description": "조회: MANAGE/FULL_ACCESS, CUD: FULL_ACCESS", "metadata": { "permissionLevel": "role_based", "readRoles": ["MANAGE", "FULL_ACCESS"], "writeRoles": ["FULL_ACCESS"] } },
    { "id": "RGC-L9-LOG-011", "level": 9, "subLevel": "2", "type": "logic", "name": "카테고리 CRUD 권한 검사", "description": "조회: MANAGE/FULL_ACCESS, CUD: FULL_ACCESS", "metadata": { "permissionLevel": "role_based", "readRoles": ["MANAGE", "FULL_ACCESS"], "writeRoles": ["FULL_ACCESS"] } },
    { "id": "RGC-L9-LOG-012", "level": 9, "subLevel": "2", "type": "logic", "name": "Space 접근 검사", "description": "X-Space-ID 헤더 필수, System Space 접속 필요", "metadata": { "permissionLevel": "space_access", "guard": "SpaceAccessGuard" } },

    { "id": "RGC-L9-LOG-020", "level": 9, "subLevel": "3", "type": "logic", "name": "그룹 삭제 시 연결 해제", "description": "그룹 소프트 삭제 시 연결된 RoleAssociation도 cascade 소프트 삭제", "metadata": { "calculationType": "cascade_operation", "targets": ["RoleAssociation"] } },
    { "id": "RGC-L9-LOG-021", "level": 9, "subLevel": "3", "type": "logic", "name": "카테고리 삭제 시 분류 해제", "description": "카테고리 소프트 삭제 시 연결된 RoleClassification도 cascade 소프트 삭제", "metadata": { "calculationType": "cascade_operation", "targets": ["RoleClassification"] } },
    { "id": "RGC-L9-LOG-022", "level": 9, "subLevel": "3", "type": "logic", "name": "소속 역할 수 계산", "description": "그룹 목록에서 _count.roleAssociations 집계", "metadata": { "calculationType": "aggregation", "field": "_count.roleAssociations" } },
    { "id": "RGC-L9-LOG-023", "level": 9, "subLevel": "3", "type": "logic", "name": "분류된 역할 수/하위 카테고리 수 계산", "description": "카테고리 목록에서 _count.roleClassifications, _count.children 집계", "metadata": { "calculationType": "aggregation", "fields": ["_count.roleClassifications", "_count.children"] } },

    { "id": "RGC-L9-LOG-030", "level": 9, "subLevel": "4", "type": "logic", "name": "카테고리 순환 참조 방지", "description": "parentId가 자기 자신이나 하위 카테고리가 아닌지 재귀 검증", "metadata": { "edgeCaseType": "circular_reference", "handling": "reject_with_400" } },
    { "id": "RGC-L9-LOG-031", "level": 9, "subLevel": "4", "type": "logic", "name": "하위 카테고리 보호", "description": "하위 카테고리가 있는 카테고리 삭제 거부 (400)", "metadata": { "edgeCaseType": "delete_protection", "handling": "reject_with_400" } },
    { "id": "RGC-L9-LOG-032", "level": 9, "subLevel": "4", "type": "logic", "name": "소프트 삭제 데이터 필터링", "description": "removedAt IS NULL 조건으로 소프트 삭제된 데이터 자동 제외", "metadata": { "edgeCaseType": "data_filtering", "handling": "auto_filter" } },
    { "id": "RGC-L9-LOG-033", "level": 9, "subLevel": "4", "type": "logic", "name": "동시 생성 중복 방지", "description": "DB 레벨 unique 제약으로 동시 생성 시 중복 방지", "metadata": { "edgeCaseType": "concurrency", "handling": "db_constraint" } },

    { "id": "RGC-L10-TST-001", "level": 10, "subLevel": "1", "type": "test", "name": "그룹 목록 조회 성공", "description": "type=Role 필터로 그룹 목록 조회", "metadata": { "testType": "happy_path", "given": "type=Role인 그룹 3개 존재", "when": "getAll({ type: 'Role' }) 호출", "then": "Role 타입 그룹 3개 반환" } },
    { "id": "RGC-L10-TST-002", "level": 10, "subLevel": "1", "type": "test", "name": "그룹 상세 조회 성공", "description": "ID로 그룹 상세 조회 (roleAssociations 포함)", "metadata": { "testType": "happy_path", "given": "TRUSTED 그룹 존재, 2개 Role 연결", "when": "getById(groupId) 호출", "then": "그룹 정보 + roleAssociations 반환" } },
    { "id": "RGC-L10-TST-003", "level": 10, "subLevel": "1", "type": "test", "name": "그룹 생성 성공", "description": "유효한 데이터로 그룹 생성", "metadata": { "testType": "happy_path", "given": "유효한 CreateGroupDto", "when": "create(dto) 호출", "then": "생성된 그룹 반환" } },
    { "id": "RGC-L10-TST-004", "level": 10, "subLevel": "1", "type": "test", "name": "그룹 수정 성공", "description": "그룹 label 수정", "metadata": { "testType": "happy_path", "given": "기존 그룹 존재", "when": "update(id, { label }) 호출", "then": "수정된 그룹 반환" } },
    { "id": "RGC-L10-TST-005", "level": 10, "subLevel": "1", "type": "test", "name": "그룹 삭제 성공", "description": "소속 역할 없는 그룹 삭제", "metadata": { "testType": "happy_path", "given": "소속 역할 0개인 그룹", "when": "delete(id) 호출", "then": "removedAt 설정" } },
    { "id": "RGC-L10-TST-006", "level": 10, "subLevel": "1", "type": "test", "name": "카테고리 목록 조회 성공", "description": "type=Role 필터로 카테고리 목록 조회", "metadata": { "testType": "happy_path", "given": "type=Role인 카테고리 7개 존재", "when": "getAll({ type: 'Role' }) 호출", "then": "Role 타입 카테고리 7개 반환" } },
    { "id": "RGC-L10-TST-007", "level": 10, "subLevel": "1", "type": "test", "name": "카테고리 상세 조회 성공", "description": "ID로 카테고리 상세 조회 (children, roleClassifications 포함)", "metadata": { "testType": "happy_path", "given": "WORKSPACE 카테고리 존재", "when": "getById(categoryId) 호출", "then": "카테고리 정보 + children + roleClassifications 반환" } },
    { "id": "RGC-L10-TST-008", "level": 10, "subLevel": "1", "type": "test", "name": "최상위 카테고리 생성 성공", "description": "parentId 없이 최상위 카테고리 생성", "metadata": { "testType": "happy_path", "given": "유효한 CreateCategoryDto (parentId 없음)", "when": "create(dto) 호출", "then": "parentId null인 카테고리 생성" } },
    { "id": "RGC-L10-TST-009", "level": 10, "subLevel": "1", "type": "test", "name": "하위 카테고리 생성 성공", "description": "parentId 지정하여 하위 카테고리 생성", "metadata": { "testType": "happy_path", "given": "유효한 CreateCategoryDto (parentId 지정)", "when": "create(dto) 호출", "then": "parentId 설정된 카테고리 생성" } },
    { "id": "RGC-L10-TST-010", "level": 10, "subLevel": "1", "type": "test", "name": "카테고리 parentId 변경 성공", "description": "카테고리의 부모를 변경", "metadata": { "testType": "happy_path", "given": "PUBLIC (parent: WORKSPACE)", "when": "update(id, { parentId: null }) 호출", "then": "최상위 카테고리로 변경" } },

    { "id": "RGC-L10-TST-020", "level": 10, "subLevel": "2", "type": "test", "name": "중복 name 그룹 생성 실패", "description": "같은 type 내 중복 name으로 생성 시 409", "metadata": { "testType": "error_path", "given": "TRUSTED 그룹 존재", "when": "create({ name: 'TRUSTED', type: 'Role' }) 호출", "then": "ConflictException (409)" } },
    { "id": "RGC-L10-TST-021", "level": 10, "subLevel": "2", "type": "test", "name": "존재하지 않는 그룹 조회 실패", "description": "없는 ID로 조회 시 404", "metadata": { "testType": "error_path", "given": "존재하지 않는 UUID", "when": "getById(invalidId) 호출", "then": "NotFoundException (404)" } },
    { "id": "RGC-L10-TST-022", "level": 10, "subLevel": "2", "type": "test", "name": "중복 name 카테고리 생성 실패", "description": "전역 unique 위반 시 409", "metadata": { "testType": "error_path", "given": "PLATFORM 카테고리 존재", "when": "create({ name: 'PLATFORM', type: 'Role' }) 호출", "then": "ConflictException (409)" } },
    { "id": "RGC-L10-TST-023", "level": 10, "subLevel": "2", "type": "test", "name": "존재하지 않는 parentId로 카테고리 생성 실패", "description": "없는 parentId 지정 시 404", "metadata": { "testType": "error_path", "given": "존재하지 않는 parentId UUID", "when": "create({ parentId: invalidId }) 호출", "then": "NotFoundException (404)" } },
    { "id": "RGC-L10-TST-024", "level": 10, "subLevel": "2", "type": "test", "name": "순환 참조 parentId 수정 실패 (자기 자신)", "description": "자기 자신을 parentId로 설정 시 400", "metadata": { "testType": "error_path", "given": "PLATFORM 카테고리", "when": "update(platformId, { parentId: platformId }) 호출", "then": "BadRequestException (400)" } },
    { "id": "RGC-L10-TST-025", "level": 10, "subLevel": "2", "type": "test", "name": "순환 참조 parentId 수정 실패 (하위 카테고리)", "description": "하위 카테고리를 parentId로 설정 시 400", "metadata": { "testType": "error_path", "given": "WORKSPACE -> PUBLIC 관계", "when": "update(workspaceId, { parentId: publicId }) 호출", "then": "BadRequestException (400)" } },
    { "id": "RGC-L10-TST-026", "level": 10, "subLevel": "2", "type": "test", "name": "하위 카테고리 존재 시 삭제 실패", "description": "하위 카테고리가 있는 카테고리 삭제 시 400", "metadata": { "testType": "error_path", "given": "WORKSPACE에 PUBLIC, PROJECT 하위 존재", "when": "delete(workspaceId) 호출", "then": "BadRequestException (400)" } },
    { "id": "RGC-L10-TST-027", "level": 10, "subLevel": "2", "type": "test", "name": "MANAGE 권한으로 그룹 생성 실패", "description": "MANAGE 역할로 CUD 시 403", "metadata": { "testType": "error_path", "given": "MANAGE 역할 토큰", "when": "POST /api/v1/groups 호출", "then": "403 Forbidden" } },
    { "id": "RGC-L10-TST-028", "level": 10, "subLevel": "2", "type": "test", "name": "인증 없이 API 호출 실패", "description": "토큰 없이 API 호출 시 401", "metadata": { "testType": "error_path", "given": "토큰 없음", "when": "GET /api/v1/groups 호출", "then": "401 Unauthorized" } },

    { "id": "RGC-L10-TST-030", "level": 10, "subLevel": "3", "type": "test", "name": "3단계 순환 참조 감지", "description": "A->B->C 구조에서 A의 parentId를 C로 변경 시 감지", "metadata": { "testType": "edge_case", "given": "A -> B -> C 계층 구조", "when": "update(A.id, { parentId: C.id }) 호출", "then": "BadRequestException (400)" } },
    { "id": "RGC-L10-TST-031", "level": 10, "subLevel": "3", "type": "test", "name": "소프트 삭제 후 동일 name 재생성 (Group)", "description": "삭제된 그룹과 같은 name으로 재생성 가능", "metadata": { "testType": "edge_case", "given": "VIP 그룹 소프트 삭제", "when": "create({ name: 'VIP', type: 'Role' }) 호출", "then": "새 VIP 그룹 생성 성공" } },
    { "id": "RGC-L10-TST-032", "level": 10, "subLevel": "3", "type": "test", "name": "소프트 삭제 후 동일 name 재생성 실패 (Category)", "description": "DB unique 제약으로 소프트 삭제된 카테고리와 동일 name 불가", "metadata": { "testType": "edge_case", "given": "ANALYTICS 카테고리 소프트 삭제", "when": "create({ name: 'ANALYTICS' }) 호출", "then": "ConflictException 또는 DB unique 위반" } },
    { "id": "RGC-L10-TST-033", "level": 10, "subLevel": "3", "type": "test", "name": "하위 카테고리 순차 삭제 후 부모 삭제", "description": "리프 노드부터 순차 삭제하여 부모 삭제 가능", "metadata": { "testType": "edge_case", "given": "PARENT -> CHILD 관계", "when": "CHILD 삭제 후 PARENT 삭제 호출", "then": "PARENT 삭제 성공" } },
    { "id": "RGC-L10-TST-034", "level": 10, "subLevel": "3", "type": "test", "name": "다른 type 그룹과 동일 name 허용", "description": "type이 다르면 같은 name 허용", "metadata": { "testType": "edge_case", "given": "type=User인 CUSTOM 그룹 존재", "when": "create({ name: 'CUSTOM', type: 'Role' }) 호출", "then": "Role 타입 CUSTOM 그룹 생성 성공" } }
  ],
  "edges": [
    { "id": "e-901", "source": "RGC-L9-LOG-001", "target": "RGC-L7-FLD-002", "type": "validates", "label": "Group.name 검증" },
    { "id": "e-902", "source": "RGC-L9-LOG-002", "target": "RGC-L7-FLD-002", "type": "validates", "label": "Group.name 중복 검증" },
    { "id": "e-903", "source": "RGC-L9-LOG-003", "target": "RGC-L7-FLD-004", "type": "validates", "label": "Group.label 검증" },
    { "id": "e-904", "source": "RGC-L9-LOG-004", "target": "RGC-L6-API-002", "type": "validates", "label": "존재 확인" },
    { "id": "e-905", "source": "RGC-L9-LOG-004", "target": "RGC-L6-API-004", "type": "validates", "label": "존재 확인" },
    { "id": "e-906", "source": "RGC-L9-LOG-004", "target": "RGC-L6-API-005", "type": "validates", "label": "존재 확인" },
    { "id": "e-907", "source": "RGC-L9-LOG-005", "target": "RGC-L7-FLD-011", "type": "validates", "label": "Category.name 검증" },
    { "id": "e-908", "source": "RGC-L9-LOG-006", "target": "RGC-L7-FLD-011", "type": "validates", "label": "Category.name unique 검증" },
    { "id": "e-909", "source": "RGC-L9-LOG-007", "target": "RGC-L7-FLD-013", "type": "validates", "label": "parentId 존재 검증" },
    { "id": "e-910", "source": "RGC-L9-LOG-008", "target": "RGC-L6-API-007", "type": "validates", "label": "존재 확인" },
    { "id": "e-911", "source": "RGC-L9-LOG-008", "target": "RGC-L6-API-009", "type": "validates", "label": "존재 확인" },
    { "id": "e-912", "source": "RGC-L9-LOG-008", "target": "RGC-L6-API-010", "type": "validates", "label": "존재 확인" },

    { "id": "e-920", "source": "RGC-L9-LOG-010", "target": "RGC-L6-API-001", "type": "validates", "label": "권한 체크" },
    { "id": "e-921", "source": "RGC-L9-LOG-010", "target": "RGC-L6-API-002", "type": "validates", "label": "권한 체크" },
    { "id": "e-922", "source": "RGC-L9-LOG-010", "target": "RGC-L6-API-003", "type": "validates", "label": "권한 체크" },
    { "id": "e-923", "source": "RGC-L9-LOG-010", "target": "RGC-L6-API-004", "type": "validates", "label": "권한 체크" },
    { "id": "e-924", "source": "RGC-L9-LOG-010", "target": "RGC-L6-API-005", "type": "validates", "label": "권한 체크" },
    { "id": "e-925", "source": "RGC-L9-LOG-011", "target": "RGC-L6-API-006", "type": "validates", "label": "권한 체크" },
    { "id": "e-926", "source": "RGC-L9-LOG-011", "target": "RGC-L6-API-007", "type": "validates", "label": "권한 체크" },
    { "id": "e-927", "source": "RGC-L9-LOG-011", "target": "RGC-L6-API-008", "type": "validates", "label": "권한 체크" },
    { "id": "e-928", "source": "RGC-L9-LOG-011", "target": "RGC-L6-API-009", "type": "validates", "label": "권한 체크" },
    { "id": "e-929", "source": "RGC-L9-LOG-011", "target": "RGC-L6-API-010", "type": "validates", "label": "권한 체크" },
    { "id": "e-930", "source": "RGC-L9-LOG-012", "target": "RGC-L6-API-001", "type": "validates", "label": "Space 접근 체크" },
    { "id": "e-931", "source": "RGC-L9-LOG-012", "target": "RGC-L6-API-006", "type": "validates", "label": "Space 접근 체크" },

    { "id": "e-940", "source": "RGC-L9-LOG-020", "target": "RGC-L6-API-005", "type": "validates", "label": "cascade 삭제" },
    { "id": "e-941", "source": "RGC-L9-LOG-021", "target": "RGC-L6-API-010", "type": "validates", "label": "cascade 삭제" },
    { "id": "e-942", "source": "RGC-L9-LOG-022", "target": "RGC-L6-API-001", "type": "validates", "label": "count 집계" },
    { "id": "e-943", "source": "RGC-L9-LOG-023", "target": "RGC-L6-API-006", "type": "validates", "label": "count 집계" },

    { "id": "e-950", "source": "RGC-L9-LOG-030", "target": "RGC-L6-API-009", "type": "validates", "label": "순환 참조 방지" },
    { "id": "e-951", "source": "RGC-L9-LOG-031", "target": "RGC-L6-API-010", "type": "validates", "label": "하위 카테고리 보호" },
    { "id": "e-952", "source": "RGC-L9-LOG-032", "target": "RGC-L6-API-001", "type": "validates", "label": "삭제 데이터 필터" },
    { "id": "e-953", "source": "RGC-L9-LOG-032", "target": "RGC-L6-API-006", "type": "validates", "label": "삭제 데이터 필터" },
    { "id": "e-954", "source": "RGC-L9-LOG-033", "target": "RGC-L6-API-003", "type": "validates", "label": "동시 생성 방지" },
    { "id": "e-955", "source": "RGC-L9-LOG-033", "target": "RGC-L6-API-008", "type": "validates", "label": "동시 생성 방지" },

    { "id": "e-1001", "source": "RGC-L10-TST-001", "target": "RGC-L3-FEA-001", "type": "tests", "label": "테스트" },
    { "id": "e-1002", "source": "RGC-L10-TST-002", "target": "RGC-L3-FEA-003", "type": "tests", "label": "테스트" },
    { "id": "e-1003", "source": "RGC-L10-TST-003", "target": "RGC-L3-FEA-004", "type": "tests", "label": "테스트" },
    { "id": "e-1004", "source": "RGC-L10-TST-004", "target": "RGC-L3-FEA-005", "type": "tests", "label": "테스트" },
    { "id": "e-1005", "source": "RGC-L10-TST-005", "target": "RGC-L3-FEA-006", "type": "tests", "label": "테스트" },
    { "id": "e-1006", "source": "RGC-L10-TST-006", "target": "RGC-L3-FEA-007", "type": "tests", "label": "테스트" },
    { "id": "e-1007", "source": "RGC-L10-TST-007", "target": "RGC-L3-FEA-009", "type": "tests", "label": "테스트" },
    { "id": "e-1008", "source": "RGC-L10-TST-008", "target": "RGC-L3-FEA-010", "type": "tests", "label": "테스트" },
    { "id": "e-1009", "source": "RGC-L10-TST-009", "target": "RGC-L3-FEA-010", "type": "tests", "label": "테스트" },
    { "id": "e-1010", "source": "RGC-L10-TST-010", "target": "RGC-L3-FEA-011", "type": "tests", "label": "테스트" },
    { "id": "e-1020", "source": "RGC-L10-TST-020", "target": "RGC-L3-FEA-004", "type": "tests", "label": "에러 테스트" },
    { "id": "e-1021", "source": "RGC-L10-TST-021", "target": "RGC-L3-FEA-003", "type": "tests", "label": "에러 테스트" },
    { "id": "e-1022", "source": "RGC-L10-TST-022", "target": "RGC-L3-FEA-010", "type": "tests", "label": "에러 테스트" },
    { "id": "e-1023", "source": "RGC-L10-TST-023", "target": "RGC-L3-FEA-010", "type": "tests", "label": "에러 테스트" },
    { "id": "e-1024", "source": "RGC-L10-TST-024", "target": "RGC-L3-FEA-011", "type": "tests", "label": "에러 테스트" },
    { "id": "e-1025", "source": "RGC-L10-TST-025", "target": "RGC-L3-FEA-011", "type": "tests", "label": "에러 테스트" },
    { "id": "e-1026", "source": "RGC-L10-TST-026", "target": "RGC-L3-FEA-012", "type": "tests", "label": "에러 테스트" },
    { "id": "e-1027", "source": "RGC-L10-TST-027", "target": "RGC-L3-FEA-004", "type": "tests", "label": "권한 에러 테스트" },
    { "id": "e-1028", "source": "RGC-L10-TST-028", "target": "RGC-L3-FEA-001", "type": "tests", "label": "인증 에러 테스트" },
    { "id": "e-1030", "source": "RGC-L10-TST-030", "target": "RGC-L3-FEA-011", "type": "tests", "label": "엣지케이스 테스트" },
    { "id": "e-1031", "source": "RGC-L10-TST-031", "target": "RGC-L3-FEA-006", "type": "tests", "label": "엣지케이스 테스트" },
    { "id": "e-1032", "source": "RGC-L10-TST-032", "target": "RGC-L3-FEA-010", "type": "tests", "label": "엣지케이스 테스트" },
    { "id": "e-1033", "source": "RGC-L10-TST-033", "target": "RGC-L3-FEA-012", "type": "tests", "label": "엣지케이스 테스트" },
    { "id": "e-1034", "source": "RGC-L10-TST-034", "target": "RGC-L3-FEA-004", "type": "tests", "label": "엣지케이스 테스트" }
  ]
}
```

---

## 품질 체크리스트

### L9 체크리스트

- [x] 모든 필수 필드에 유효성 검사가 있는가? (Group.name, Category.name, type, spaceId)
- [x] 모든 API에 권한 검사가 정의되었는가? (조회: MANAGE/FULL_ACCESS, CUD: FULL_ACCESS)
- [x] 주요 비즈니스 규칙이 문서화되었는가? (이름 규칙, 트리 구조 규칙, 삭제 정책)
- [x] 엣지케이스가 식별되었는가? (순환 참조, 동시성, 소프트 삭제 중복, 경계값)
- [x] 순환 참조 검증 알고리즘이 상세히 기술되었는가? (재귀 하위 카테고리 탐색)
- [x] cascade 소프트 삭제 동작이 정의되었는가? (Group -> RoleAssociation, Category -> RoleClassification)
- [x] QueryGroupDto 수정 필요사항이 문서화되었는가? (type, label 필드 추가)

### L10 체크리스트

- [x] 모든 Feature에 Happy Path 테스트가 있는가? (10개)
- [x] 주요 Error Path가 테스트되는가? (9개: 중복, 404, 순환 참조, 하위 보호, 권한, 인증)
- [x] 엣지케이스 테스트가 포함되었는가? (5개: 3단계 순환, 소프트 삭제 재생성, 순차 삭제, 다른 type)
- [x] Given-When-Then 형식으로 작성되었는가? (전체 테스트 케이스)
- [x] 백엔드 단위 테스트와 E2E 테스트가 분리되었는가? (단위 36개 + E2E 31개 = 67개)
- [x] 권한 에러 테스트가 포함되었는가? (MANAGE로 CUD 시도, 미인증 시도)

---

## 에이전트 매핑

| 테스트 유형 | 담당 에이전트 | 대상 |
|------------|-------------|------|
| 백엔드 단위 테스트 (GroupsService) | `qa-be-testing` | `packages/be-service/src/groups.service.ts` |
| 백엔드 단위 테스트 (CategoriesService) | `qa-be-testing` | `packages/be-service/src/categories.service.ts` |
| 백엔드 E2E 테스트 (Groups API) | `qa-be-e2e-testing` | `apps/server/test/groups.e2e-spec.ts` |
| 백엔드 E2E 테스트 (Categories API) | `qa-be-e2e-testing` | `apps/server/test/categories.e2e-spec.ts` |

---

## 수량 요약

| 구분 | 항목 | 수량 |
|------|------|:----:|
| L9.1 | 유효성 검사 규칙 | 13 |
| L9.2 | 권한 검사 규칙 | 12 |
| L9.3 | 비즈니스 계산 로직 | 14 |
| L9.4 | 엣지케이스 | 17 |
| L10.1 | Happy Path 테스트 | 10 |
| L10.2 | Error Path 테스트 | 9 |
| L10.3 | Edge Case 테스트 | 5 |
| **L9 합계** | 비즈니스 로직 노드 | **21** |
| **L10 합계** | 테스트 노드 | **24** |
| **전체 합계** | - | **45 노드, 67 테스트** |
