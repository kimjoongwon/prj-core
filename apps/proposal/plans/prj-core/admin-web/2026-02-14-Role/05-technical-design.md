# 05. 기술 설계 (L9-L10)

## 이전 레이어 요약

- **L0 Context**: CASL 기반 RBAC+ABAC 권한 관리 시스템의 관리 UI
- **L1 Actor**: 최고 관리자(FULL_ACCESS), 일반 관리자(MANAGE), 조회 사용자(VIEW)
- **L3 Feature 21개**: Role(7), Ability(6), Action(6), Subject(2)
- **L4 Screen 14개**: Role(4), Ability(4), Action(4), Subject(2)
- **L5 Interaction 89개**: 14개 화면별 사용자 액션
- **L6 API 21개**: 기존 19개 + 신규 2개 (GET /api/v1/abilities, PUT /api/v1/grants/roles/:roleId)
- **L7 Entity 7개**: Role, Ability, Grant, Action, Subject, RoleAssociation, RoleClassification
- **L8 Component 63개**: 기존 재사용 32개 + 신규 31개

---

## L9: 비즈니스 로직

### L9.1: 유효성 검사 규칙

#### Role 유효성 검사 매트릭스

| ID | 필드 | 규칙 | 검사 위치 | 에러 메시지 | 에러 코드 |
|----|------|------|----------|------------|----------|
| V-ROL-001 | name | 필수 | FE + BE | "역할 식별자를 입력해주세요" | 400 |
| V-ROL-002 | name | 정규식 `^[A-Z][A-Z0-9_]*$` | FE + BE | "역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" | 400 |
| V-ROL-003 | name | 최대 50자 | FE + BE | "역할 식별자는 50자 이내로 입력해주세요" | 400 |
| V-ROL-004 | name | unique (DB 레벨) | BE | "이미 존재하는 역할 식별자입니다" | 409 |
| V-ROL-005 | displayName | 최대 50자 | FE + BE | "표시명은 50자 이내로 입력해주세요" | 400 |
| V-ROL-006 | description | 최대 200자 | FE + BE | "설명은 200자 이내로 입력해주세요" | 400 |
| V-ROL-007 | id | UUID 형식 | BE | "유효하지 않은 ID 형식입니다" | 400 |
| V-ROL-008 | categoryId | 존재하는 Category ID (FK) | BE | "존재하지 않는 카테고리입니다" | 400 |
| V-ROL-009 | groupId | 존재하는 Group ID (FK) | BE | "존재하지 않는 그룹입니다" | 400 |

#### Ability 유효성 검사 매트릭스

| ID | 필드 | 규칙 | 검사 위치 | 에러 메시지 | 에러 코드 |
|----|------|------|----------|------------|----------|
| V-ABL-001 | name | 필수 | FE + BE | "권한 정의 이름을 입력해주세요" | 400 |
| V-ABL-002 | name | unique (DB 레벨) | BE | "이미 존재하는 권한 정의 이름입니다" | 409 |
| V-ABL-003 | subjectId | 필수 | FE + BE | "Subject를 선택해주세요" | 400 |
| V-ABL-004 | subjectId | 존재하는 Subject ID (FK) | BE | "존재하지 않는 Subject입니다" | 400 |
| V-ABL-005 | actionId | 필수 | FE + BE | "Action을 선택해주세요" | 400 |
| V-ABL-006 | actionId | 존재하는 Action ID (FK) | BE | "존재하지 않는 Action입니다" | 400 |
| V-ABL-007 | fields | string[] 타입 | BE | "fields는 문자열 배열이어야 합니다" | 400 |
| V-ABL-008 | fields | Subject의 DMMF 필드에 존재하는 값 | BE | "존재하지 않는 필드가 포함되어 있습니다: {fieldName}" | 400 |
| V-ABL-009 | conditions | 유효한 JSON 또는 null | FE + BE | "올바른 JSON 형식으로 입력해주세요" | 400 |
| V-ABL-010 | reason | inverted=true일 때 권장 (필수 아님) | FE | "거부 사유를 입력하면 사용자에게 안내됩니다" | - |
| V-ABL-011 | description | 최대 500자 | FE + BE | "설명은 500자 이내로 입력해주세요" | 400 |

#### Action 유효성 검사 매트릭스

| ID | 필드 | 규칙 | 검사 위치 | 에러 메시지 | 에러 코드 |
|----|------|------|----------|------------|----------|
| V-ACT-001 | name | 필수 | FE + BE | "이름을 입력해주세요" | 400 |
| V-ACT-002 | name | 정규식 `^[a-z][a-z0-9:_]*$` | FE + BE | "이름은 영소문자로 시작하며, 영소문자, 숫자, 콜론, 언더스코어만 사용 가능합니다" | 400 |
| V-ACT-003 | name | 최대 100자 | FE + BE | "이름은 100자 이내로 입력해주세요" | 400 |
| V-ACT-004 | name | unique (DB 레벨) | BE | "이미 존재하는 Action 이름입니다" | 409 |
| V-ACT-005 | displayName | 최대 50자 | FE + BE | "표시명은 50자 이내로 입력해주세요" | 400 |
| V-ACT-006 | description | 최대 200자 | FE + BE | "설명은 200자 이내로 입력해주세요" | 400 |
| V-ACT-007 | group | enum ("crud", "visibility", "workflow", "bulk") | FE + BE | "유효하지 않은 그룹입니다" | 400 |
| V-ACT-008 | order | 정수, >= 0 | FE + BE | "정렬 순서는 0 이상의 정수여야 합니다" | 400 |
| V-ACT-009 | config | 유효한 JSON 또는 null | FE + BE | "올바른 JSON 형식으로 입력해주세요" | 400 |

#### Grant 배치 할당 유효성 검사

| ID | 필드 | 규칙 | 검사 위치 | 에러 메시지 | 에러 코드 |
|----|------|------|----------|------------|----------|
| V-GRT-001 | roleId | 존재하는 Role ID | BE | "존재하지 않는 역할입니다" | 404 |
| V-GRT-002 | grants | 배열 타입 | BE | "grants는 배열이어야 합니다" | 400 |
| V-GRT-003 | grants[].abilityId | 존재하는 Ability ID | BE | "존재하지 않는 권한 정의입니다: {abilityId}" | 400 |
| V-GRT-004 | grants[].abilityId | 배열 내 중복 불가 | BE | "중복된 권한 정의가 포함되어 있습니다" | 400 |
| V-GRT-005 | grants[].isActive | boolean 타입 | BE | "isActive는 boolean이어야 합니다" | 400 |
| V-GRT-006 | grants[].priority | 정수, 0-9 (Role Grant) | BE | "우선순위는 0-9 범위여야 합니다" | 400 |

---

### L9.2: 권한 검사 규칙

#### API별 권한 매트릭스

| ID | API | 필요 권한 | Guard | 조건 |
|----|-----|----------|-------|------|
| P-001 | GET /api/v1/roles | `@Roles([MANAGE, FULL_ACCESS])` | RolesGuard | 인증 + 역할 |
| P-002 | GET /api/v1/roles/:id | `@Roles([MANAGE, FULL_ACCESS])` | RolesGuard | 인증 + 역할 |
| P-003 | POST /api/v1/roles | `@Roles([FULL_ACCESS])` | RolesGuard | 인증 + FULL_ACCESS |
| P-004 | PATCH /api/v1/roles/:id | `@Roles([FULL_ACCESS])` | RolesGuard | 인증 + FULL_ACCESS |
| P-005 | DELETE /api/v1/roles/:id | `@Roles([FULL_ACCESS])` | RolesGuard | 인증 + FULL_ACCESS |
| P-006 | GET /api/v1/abilities/my | 인증된 모든 사용자 | JwtAuthGuard | 인증만 |
| P-007 | GET /api/v1/abilities/roles/:roleId | 인증된 모든 사용자 | JwtAuthGuard | 인증만 |
| P-008 | GET /api/v1/abilities | `@Roles([MANAGE, FULL_ACCESS])` | RolesGuard | 인증 + 역할 |
| P-009 | GET /api/v1/abilities/:id | 인증된 모든 사용자 | JwtAuthGuard | 인증만 |
| P-010 | POST /api/v1/abilities | `@Roles([FULL_ACCESS])` | RolesGuard | 인증 + FULL_ACCESS |
| P-011 | PATCH /api/v1/abilities/:id | `@Roles([FULL_ACCESS])` | RolesGuard | 인증 + FULL_ACCESS |
| P-012 | DELETE /api/v1/abilities/:id | `@Roles([FULL_ACCESS])` | RolesGuard | 인증 + FULL_ACCESS |
| P-013 | PUT /api/v1/grants/roles/:roleId | `@Roles([FULL_ACCESS])` | RolesGuard | 인증 + FULL_ACCESS |
| P-014 | GET /api/v1/actions | `@PublicRoute()` | 없음 | 인증 불필요 |
| P-015 | GET /api/v1/actions/:id | `@PublicRoute()` | 없음 | 인증 불필요 |
| P-016 | POST /api/v1/actions | `@RoleCategories([WORKSPACE])` | RoleCategoryGuard | 인증 + WORKSPACE 카테고리 |
| P-017 | PATCH /api/v1/actions/:id | `@RoleCategories([WORKSPACE])` | RoleCategoryGuard | 인증 + WORKSPACE 카테고리 |
| P-018 | DELETE /api/v1/actions/:id | `@RoleCategories([WORKSPACE])` | RoleCategoryGuard | 인증 + WORKSPACE 카테고리 |
| P-019 | GET /api/v1/subjects | `@PublicRoute()` | 없음 | 인증 불필요 |
| P-020 | GET /api/v1/subjects/:id | `@PublicRoute()` | 없음 | 인증 불필요 |
| P-021 | GET /api/v1/subjects/:id/fields | `@PublicRoute()` | 없음 | 인증 불필요 |

#### 프론트엔드 CASL 권한 체크

| 화면/액션 | CASL 체크 | 미충족 시 동작 |
|----------|----------|--------------|
| 역할 등록 버튼 | `can('create', 'role')` | 버튼 숨김 |
| 역할 수정 버튼 | `can('update', 'role')` + isSystem=false | 버튼 숨김 (시스템 역할) 또는 disabled |
| 역할 삭제 버튼 | `can('delete', 'role')` + isSystem=false | 버튼 숨김 또는 disabled |
| Grant 배치 할당 영역 | `can('update', 'role')` | 읽기 전용으로 표시 |
| 권한 정의 등록 버튼 | `can('create', 'ability')` | 버튼 숨김 |
| 권한 정의 수정 버튼 | `can('update', 'ability')` | 버튼 숨김 |
| 권한 정의 삭제 버튼 | `can('delete', 'ability')` | 버튼 숨김 |
| 행위 등록 버튼 | RoleCategoryGuard(WORKSPACE) | 버튼 숨김 |
| 행위 수정/삭제 버튼 | RoleCategoryGuard(WORKSPACE) + isSystem=false | 버튼 숨김 |

---

### L9.3: 비즈니스 계산/변환 로직

#### BL-001: Grant 배치 동기화 알고리즘

Grant 배치 할당 API (`PUT /api/v1/grants/roles/:roleId`)의 핵심 동기화 알고리즘입니다.

```
입력: roleId, newGrants[] = [{ abilityId, isActive, priority }]
현재: currentGrants[] = DB에서 해당 roleId의 기존 Grant 조회 (removedAt IS NULL)

1. 기존 Grant를 Map으로 변환 (key: abilityId)
   currentMap = Map<abilityId, Grant>

2. 요청 Grant를 Map으로 변환 (key: abilityId)
   newMap = Map<abilityId, GrantInput>

3. 분류:
   - toAdd    = newMap에 있고 currentMap에 없는 항목 → INSERT
   - toUpdate = 양쪽 모두 있는 항목 중 isActive 또는 priority가 다른 항목 → UPDATE
   - toRemove = currentMap에 있고 newMap에 없는 항목 → SOFT DELETE (removedAt 설정)

4. 트랜잭션 내에서 실행:
   BEGIN TRANSACTION
     - toAdd 각각: Grant INSERT (granteeType="Role", granteeId=roleId, abilityId, isActive, priority)
     - toUpdate 각각: Grant UPDATE (isActive, priority, updatedAt)
     - toRemove 각각: Grant UPDATE (removedAt = now())
   COMMIT

5. 응답: { added: toAdd.length, updated: toUpdate.length, removed: toRemove.length, total: newGrants.length }
```

**트랜잭션 처리**: 반드시 단일 트랜잭션 내에서 실행하여 부분 실패 방지

**캐시 무효화**: 트랜잭션 성공 후 해당 Role에 연결된 Tenant들의 CASL 캐시 무효화
```
Redis Key 패턴: casl:ability:{userId}:{spaceId}
→ 해당 Role을 가진 모든 Tenant의 userId+spaceId 조합으로 캐시 삭제
```

#### BL-002: Ability 삭제 시 연쇄 처리

```
1. Ability 소프트 삭제 (removedAt 설정)
2. 연결된 Grant 일괄 소프트 삭제 (removedAt 설정)
3. 캐시 무효화: 해당 Ability를 참조하는 모든 Grant의 granteeId에 해당하는 CASL 캐시 삭제
```

**경고 메시지**: "이 권한 정의에 연결된 Grant {N}건도 함께 삭제됩니다."
- N = 0이면 경고 없이 바로 삭제
- N > 0이면 프론트엔드에서 경고 모달 표시

#### BL-003: Role 삭제 전 연결 확인

```
1. isSystem=true 확인 → true이면 삭제 불가 (400)
2. 연결된 Tenant(Assignment) 수 확인
   SELECT COUNT(*) FROM tenants WHERE roleId = :id AND removedAt IS NULL
3. 연결 수 > 0이면 삭제 불가 (400)
   에러: "연결된 사용자가 {N}명 있어 삭제할 수 없습니다. 먼저 역할을 변경해주세요."
4. 연결된 Grant 소프트 삭제
5. 연결된 RoleAssociation, RoleClassification 소프트 삭제
6. Role 소프트 삭제
```

**트랜잭션 처리**: 4~6단계를 단일 트랜잭션으로 처리

#### BL-004: Action 삭제 전 연결 확인

```
1. isSystem=true 확인 → true이면 삭제 불가 (400)
2. 연결된 Ability 수 확인
   SELECT COUNT(*) FROM abilities WHERE actionId = :id AND removedAt IS NULL
3. 연결 수 > 0이면 삭제 불가 (400)
   에러: "이 Action을 사용하는 권한 정의가 {N}개 있어 삭제할 수 없습니다."
4. Action 소프트 삭제
```

#### BL-005: Action/Role 시스템 엔티티 보호

```
수정/삭제 요청 시:
1. 엔티티 조회
2. isSystem === true 확인
3. true이면 400 에러 반환
   - Role: "시스템 역할은 수정/삭제할 수 없습니다"
   - Action: "시스템 Action은 수정/삭제할 수 없습니다"
```

#### BL-006: CASL 캐시 무효화 로직

권한 관련 데이터 변경 시 Redis CASL 캐시를 무효화해야 합니다.

| 변경 이벤트 | 캐시 무효화 범위 | 설명 |
|------------|-----------------|------|
| Grant 배치 할당 (Role) | 해당 Role을 가진 모든 Tenant | Role의 Ability가 변경됨 |
| Ability 수정 | 해당 Ability를 참조하는 모든 Grant → Tenant | Ability 내용이 변경됨 |
| Ability 삭제 | 해당 Ability를 참조하는 모든 Grant → Tenant | Ability가 삭제됨 |
| Role 삭제 | 삭제 전 검증으로 Tenant 없음이 보장됨 | 캐시 무효화 불필요 |

**캐시 무효화 구현**:
```typescript
// 1. 변경된 Role/Ability에 연관된 Tenant 조회
const affectedTenants = await this.tenantRepository.findByRoleId(roleId);

// 2. 각 Tenant의 CASL 캐시 키 삭제
for (const tenant of affectedTenants) {
  await this.redisService.del(`casl:ability:${tenant.userId}:${tenant.spaceId}`);
}
```

#### BL-007: Subject 필드 조회 (DMMF)

```
1. Subject 조회
2. group이 "entity"인지 확인
3. entity가 아니면 빈 배열 반환 []
4. entity이면:
   a. Subject.name에서 모델명 추출 (예: "entity:User" → "User")
   b. Prisma DMMF에서 해당 모델의 필드 목록 추출
   c. 각 필드에 대해 SubjectFieldDto 생성
      - name, type, isRequired, isRelation
      - displayName: @displayName 주석에서 추출 (없으면 null)
```

#### BL-008: Ability 목록 조회 필터링/페이지네이션

```
쿼리 파라미터 적용 순서:
1. removedAt IS NULL (소프트 삭제 제외)
2. name LIKE '%{name}%' (이름 검색, 부분 일치)
3. subjectId = {subjectId} (Subject 필터)
4. actionId = {actionId} (Action 필터)
5. inverted = {inverted} (허용/거부 필터)
6. ORDER BY createdAt DESC (기본 정렬)
7. OFFSET {skip} LIMIT {take} (페이지네이션)
8. 전체 건수 별도 카운트 쿼리
```

#### BL-009: Role 생성 시 Group/Category 연결

```
트랜잭션 내에서:
1. Role INSERT
2. groupId가 있으면 RoleAssociation INSERT (roleId, groupId)
3. categoryId가 있으면 RoleClassification INSERT (roleId, categoryId)
```

#### BL-010: Role 수정 시 Group/Category 연결 업데이트

```
트랜잭션 내에서:
1. Role UPDATE (displayName, description)
2. groupId 변경 시:
   - 기존 RoleAssociation 삭제 (해당 Role)
   - 새 RoleAssociation INSERT (또는 null이면 삭제만)
3. categoryId 변경 시:
   - 기존 RoleClassification 삭제 (해당 Role)
   - 새 RoleClassification INSERT (또는 null이면 삭제만)
```

---

### L9.4: 엣지케이스

#### 동시성

| ID | 시나리오 | 처리 방법 |
|----|---------|----------|
| E-001 | 두 관리자가 동시에 같은 Role의 Grant를 배치 저장 | 마지막 저장이 이김 (Last Write Wins). PUT 방식이므로 전체 교체 |
| E-002 | Grant 배치 저장 중 대상 Ability가 삭제됨 | FK 검증 실패 → 트랜잭션 롤백 → 400 에러 |
| E-003 | Role 삭제와 Grant 할당이 동시에 발생 | 트랜잭션 격리로 하나가 실패 (FK 에러) |

#### 경계값

| ID | 시나리오 | 처리 방법 |
|----|---------|----------|
| E-004 | Grant 배치 저장 시 빈 배열 전송 | 기존 Grant 전부 소프트 삭제 (모든 할당 해제) |
| E-005 | Grant 배치 저장 시 기존과 완전 동일한 목록 | toUpdate, toAdd, toRemove 모두 0 → 변경 없이 성공 응답 |
| E-006 | Role name이 정확히 50자 | 허용 (최대 50자) |
| E-007 | Ability의 fields가 빈 배열 [] | 전체 필드 접근 허용 의미 (정상 동작) |
| E-008 | Ability의 conditions가 null | 조건 없음 (무조건 적용) |
| E-009 | Grant priority가 0 (최소값) | 허용 (기본값) |
| E-010 | Grant priority가 9 (최대값, Role) | 허용 (Role Grant 최대) |

#### 상태 전이

| ID | 시나리오 | 처리 방법 |
|----|---------|----------|
| E-011 | 소프트 삭제된 Role에 대해 수정/삭제 요청 | 404 반환 (조회 시 removedAt IS NULL 필터) |
| E-012 | 소프트 삭제된 Ability에 Grant 할당 시도 | FK 검증 시 removedAt IS NULL 조건 포함 → 400 에러 |
| E-013 | 시스템 역할(isSystem=true)에 대한 수정 요청 | 400 에러 "시스템 역할은 수정할 수 없습니다" |
| E-014 | 시스템 역할의 Grant 배치 할당 | 허용 (시스템 역할의 권한 구성은 변경 가능) |
| E-015 | 이미 삭제된(removedAt 설정) Grant가 있는 상태에서 같은 abilityId로 재할당 | 기존 소프트 삭제 Grant를 복원하지 않고 새로 INSERT |

#### 데이터 무결성

| ID | 시나리오 | 처리 방법 |
|----|---------|----------|
| E-016 | Ability의 Subject 또는 Action이 삭제된 경우 | FK로 인해 Ability가 먼저 삭제되어야 함. 순서 강제 |
| E-017 | Role 삭제 시 연결된 Tenant 존재 | 삭제 불가 (400) + 사용자 수 안내 |
| E-018 | Action 삭제 시 연결된 Ability 존재 | 삭제 불가 (400) + Ability 수 안내 |
| E-019 | Grant 배치 저장 시 동일 abilityId 중복 포함 | 400 에러 "중복된 권한 정의가 포함되어 있습니다" |

---

## L10: 테스트 케이스

### 테스트 커버리지 매트릭스

| 도메인 | 기능 | Happy Path | Error Path | Edge Case | 합계 |
|--------|------|:----------:|:----------:|:---------:|:----:|
| Role | 목록 조회 | 2 | 2 | 0 | 4 |
| Role | 상세 조회 | 1 | 2 | 0 | 3 |
| Role | 등록 | 2 | 4 | 1 | 7 |
| Role | 수정 | 2 | 3 | 1 | 6 |
| Role | 삭제 | 1 | 3 | 1 | 5 |
| Grant | 배치 할당 | 3 | 3 | 4 | 10 |
| Ability | 목록 조회 | 2 | 1 | 1 | 4 |
| Ability | 상세 조회 | 1 | 1 | 0 | 2 |
| Ability | 등록 | 2 | 4 | 1 | 7 |
| Ability | 수정 | 1 | 2 | 0 | 3 |
| Ability | 삭제 | 1 | 1 | 1 | 3 |
| Action | 목록 조회 | 2 | 0 | 0 | 2 |
| Action | 상세 조회 | 1 | 1 | 0 | 2 |
| Action | 등록 | 1 | 3 | 0 | 4 |
| Action | 수정 | 1 | 2 | 0 | 3 |
| Action | 삭제 | 1 | 2 | 0 | 3 |
| Subject | 목록 조회 | 2 | 0 | 0 | 2 |
| Subject | 상세 조회 | 1 | 1 | 0 | 2 |
| Subject | 필드 조회 | 1 | 1 | 1 | 3 |
| **합계** | | **28** | **36** | **11** | **75** |

---

### L10.1: Happy Path 테스트

#### Role CRUD

##### [TC-001] 역할 목록 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | 시스템 역할 3개(FULL_ACCESS, MANAGE, VIEW)와 커스텀 역할 2개가 존재한다 |
| **When** | GET /api/v1/roles 호출 |
| **Then** | 200 OK 응답 |
|          | data 배열에 5개의 역할 정보 포함 |
|          | 각 역할에 classification, associations 중첩 데이터 포함 |
|          | isSystem=true인 역할 3개, false인 역할 2개 |

##### [TC-002] 역할 목록 조회 - MANAGE 역할 사용자

**분류**: Happy Path | **API**: GET /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | MANAGE 역할의 관리자가 인증되어 있다 |
| **When** | GET /api/v1/roles 호출 |
| **Then** | 200 OK 응답 |
|          | data 배열에 전체 역할 목록 포함 (조회 권한 있음) |

##### [TC-003] 역할 상세 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | ID가 "role-uuid-001"인 역할이 존재한다 |
| **When** | GET /api/v1/roles/role-uuid-001 호출 |
| **Then** | 200 OK 응답 |
|          | data에 역할 상세 정보 포함 (name, displayName, description, isSystem) |
|          | classification, associations 중첩 정보 포함 |

##### [TC-004] 역할 등록 성공

**분류**: Happy Path | **API**: POST /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | "CUSTOM_EDITOR" 이름의 역할이 존재하지 않는다 |
| **When** | POST /api/v1/roles { name: "CUSTOM_EDITOR", displayName: "커스텀 편집자", description: "편집 권한을 가진 커스텀 역할" } |
| **Then** | 201 Created 응답 |
|          | data.name === "CUSTOM_EDITOR" |
|          | data.isSystem === false |
|          | data.id가 UUID 형식 |

##### [TC-005] 역할 등록 성공 (Group/Category 포함)

**분류**: Happy Path | **API**: POST /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | categoryId "cat-001", groupId "grp-001"이 존재한다 |
| **When** | POST /api/v1/roles { name: "PROJECT_LEAD", displayName: "프로젝트 리더", categoryId: "cat-001", groupId: "grp-001" } |
| **Then** | 201 Created 응답 |
|          | data.classification.categoryId === "cat-001" |
|          | data.associations[0].groupId === "grp-001" |

##### [TC-006] 역할 수정 성공

**분류**: Happy Path | **API**: PATCH /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | isSystem=false인 커스텀 역할이 존재한다 |
| **When** | PATCH /api/v1/roles/:id { displayName: "수정된 표시명", description: "수정된 설명" } |
| **Then** | 200 OK 응답 |
|          | data.displayName === "수정된 표시명" |
|          | data.description === "수정된 설명" |

##### [TC-007] 역할 수정 성공 (Group/Category 변경)

**분류**: Happy Path | **API**: PATCH /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | isSystem=false인 커스텀 역할이 카테고리 "cat-001"에 연결되어 있다 |
| **When** | PATCH /api/v1/roles/:id { categoryId: "cat-002" } |
| **Then** | 200 OK 응답 |
|          | data.classification.categoryId === "cat-002" |

##### [TC-008] 역할 삭제 성공

**분류**: Happy Path | **API**: DELETE /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | isSystem=false인 커스텀 역할이 존재한다 |
|           | 해당 역할에 연결된 Tenant가 없다 |
| **When** | DELETE /api/v1/roles/:id 호출 |
| **Then** | 204 No Content 응답 |
|          | 이후 GET /api/v1/roles/:id 호출 시 404 |

#### Grant 배치 할당

##### [TC-009] Grant 배치 할당 - 새 할당 추가

**분류**: Happy Path | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | roleId "role-001"에 현재 Grant가 없다 |
|           | Ability "abl-001", "abl-002"가 존재한다 |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [{ abilityId: "abl-001", isActive: true, priority: 0 }, { abilityId: "abl-002", isActive: true, priority: 5 }] } |
| **Then** | 200 OK 응답 |
|          | data.added === 2, data.updated === 0, data.removed === 0, data.total === 2 |

##### [TC-010] Grant 배치 할당 - 기존 수정 + 해제

**분류**: Happy Path | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | roleId "role-001"에 Grant 3건이 할당되어 있다 (abl-001, abl-002, abl-003) |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [{ abilityId: "abl-001", isActive: false, priority: 3 }, { abilityId: "abl-002", isActive: true, priority: 0 }] } |
| **Then** | 200 OK 응답 |
|          | data.added === 0, data.updated === 1 (abl-001의 isActive/priority 변경), data.removed === 1 (abl-003 해제) |

##### [TC-011] Grant 배치 할당 - 전체 교체

**분류**: Happy Path | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | roleId "role-001"에 Grant 2건이 할당되어 있다 (abl-001, abl-002) |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [{ abilityId: "abl-003", isActive: true, priority: 0 }] } |
| **Then** | 200 OK 응답 |
|          | data.added === 1, data.removed === 2, data.total === 1 |
|          | 이후 GET /api/v1/abilities/roles/role-001 호출 시 abl-003만 반환 |

#### Ability CRUD

##### [TC-012] Ability 전체 목록 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | Ability 25개가 존재한다 |
| **When** | GET /api/v1/abilities?skip=0&take=10 호출 |
| **Then** | 200 OK 응답 |
|          | data 배열에 10개의 Ability 포함 |
|          | meta.total === 25, meta.skip === 0, meta.take === 10 |
|          | 각 Ability에 subject, action 중첩 정보 포함 |

##### [TC-013] Ability 목록 필터 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | Subject "entity:User"에 연결된 Ability 5개가 존재한다 |
| **When** | GET /api/v1/abilities?subjectId=sub-001&inverted=false 호출 |
| **Then** | 200 OK 응답 |
|          | data의 모든 항목에 subjectId === "sub-001", inverted === false |

##### [TC-014] Ability 상세 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | 인증된 사용자가 있다 |
|           | Ability "abl-001"이 존재한다 |
| **When** | GET /api/v1/abilities/abl-001 호출 |
| **Then** | 200 OK 응답 |
|          | data에 name, description, subject, action, fields, conditions, inverted, reason 포함 |

##### [TC-015] Ability 등록 성공 (기본)

**분류**: Happy Path | **API**: POST /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | Subject "sub-001" (entity:User), Action "act-001" (read)이 존재한다 |
| **When** | POST /api/v1/abilities { name: "Read User", subjectId: "sub-001", actionId: "act-001", fields: [], conditions: null, inverted: false } |
| **Then** | 201 Created 응답 |
|          | data.name === "Read User" |
|          | data.subjectId === "sub-001" |
|          | data.inverted === false |

##### [TC-016] Ability 등록 성공 (거부 규칙)

**분류**: Happy Path | **API**: POST /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/abilities { name: "Deny Delete Role", subjectId: "sub-002", actionId: "act-004", inverted: true, reason: "시스템 역할 삭제 방지" } |
| **Then** | 201 Created 응답 |
|          | data.inverted === true |
|          | data.reason === "시스템 역할 삭제 방지" |

##### [TC-017] Ability 수정 성공

**분류**: Happy Path | **API**: PATCH /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | Ability "abl-001"이 존재한다 |
| **When** | PATCH /api/v1/abilities/abl-001 { fields: ["email", "name"], conditions: { "departmentId": "${user.dept}" } } |
| **Then** | 200 OK 응답 |
|          | data.fields === ["email", "name"] |
|          | data.conditions.departmentId === "${user.dept}" |

##### [TC-018] Ability 삭제 성공

**분류**: Happy Path | **API**: DELETE /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | Ability "abl-001"이 존재하고, 연결된 Grant가 2건 있다 |
| **When** | DELETE /api/v1/abilities/abl-001 호출 |
| **Then** | 204 No Content 응답 |
|          | 이후 GET /api/v1/abilities/abl-001 호출 시 404 |
|          | 연결된 Grant 2건도 소프트 삭제됨 |

#### Action CRUD

##### [TC-019] Action 목록 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/actions

| 구분 | 설명 |
|------|------|
| **Given** | 인증 불필요 (Public) |
|           | Action 10개가 존재한다 |
| **When** | GET /api/v1/actions 호출 |
| **Then** | 200 OK 응답 |
|          | data 배열에 10개의 Action 포함 |

##### [TC-020] Action 목록 그룹 필터 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/actions?group=crud

| 구분 | 설명 |
|------|------|
| **Given** | crud 그룹의 Action 4개가 존재한다 |
| **When** | GET /api/v1/actions?group=crud 호출 |
| **Then** | 200 OK 응답 |
|          | data의 모든 항목에 group === "crud" |

##### [TC-021] Action 상세 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | Action "act-001"이 존재한다 |
| **When** | GET /api/v1/actions/act-001 호출 |
| **Then** | 200 OK 응답 |
|          | data에 name, displayName, description, group, order, isSystem, config 포함 |

##### [TC-022] Action 등록 성공

**분류**: Happy Path | **API**: POST /api/v1/actions

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/actions { name: "read:masked:phone", displayName: "전화번호 마스킹", group: "visibility", config: { type: "masking", preset: "PRESET_PHONE" } } |
| **Then** | 201 Created 응답 |
|          | data.name === "read:masked:phone" |
|          | data.isSystem === false |

##### [TC-023] Action 수정 성공

**분류**: Happy Path | **API**: PATCH /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
|           | isSystem=false인 커스텀 Action이 존재한다 |
| **When** | PATCH /api/v1/actions/:id { displayName: "수정된 마스킹", config: { type: "masking", preset: "PRESET_PHONE_V2" } } |
| **Then** | 200 OK 응답 |
|          | data.displayName === "수정된 마스킹" |

##### [TC-024] Action 삭제 성공

**분류**: Happy Path | **API**: DELETE /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
|           | isSystem=false인 커스텀 Action이 존재하고, 연결된 Ability가 없다 |
| **When** | DELETE /api/v1/actions/:id 호출 |
| **Then** | 204 No Content 응답 |

#### Subject 조회

##### [TC-025] Subject 목록 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/subjects

| 구분 | 설명 |
|------|------|
| **Given** | 인증 불필요 (Public) |
| **When** | GET /api/v1/subjects 호출 |
| **Then** | 200 OK 응답 |
|          | data 배열에 Subject 목록 포함 |

##### [TC-026] Subject 그룹 필터 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/subjects?group=entity

| 구분 | 설명 |
|------|------|
| **Given** | entity 그룹의 Subject 10개가 존재한다 |
| **When** | GET /api/v1/subjects?group=entity 호출 |
| **Then** | 200 OK 응답 |
|          | data의 모든 항목에 group === "entity" |

##### [TC-027] Subject 상세 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/subjects/:id

| 구분 | 설명 |
|------|------|
| **Given** | Subject "sub-001" (entity:User)가 존재한다 |
| **When** | GET /api/v1/subjects/sub-001 호출 |
| **Then** | 200 OK 응답 |
|          | data에 name, displayName, icon, group, order, isSystem 포함 |

##### [TC-028] Subject 필드 목록 조회 성공

**분류**: Happy Path | **API**: GET /api/v1/subjects/:id/fields

| 구분 | 설명 |
|------|------|
| **Given** | Subject "sub-001" (entity:User, group=entity)가 존재한다 |
| **When** | GET /api/v1/subjects/sub-001/fields 호출 |
| **Then** | 200 OK 응답 |
|          | data 배열에 User 모델의 필드 목록 포함 |
|          | 각 필드에 name, type, isRequired, isRelation 포함 |

---

### L10.2: Error Path 테스트

#### 인증/권한 에러

##### [TC-029] 역할 목록 조회 - 미인증

**분류**: Error Path | **API**: GET /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | 인증되지 않은 상태 |
| **When** | GET /api/v1/roles 호출 (Authorization 헤더 없음) |
| **Then** | 401 Unauthorized 응답 |

##### [TC-030] 역할 목록 조회 - 권한 부족

**분류**: Error Path | **API**: GET /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | VIEW 역할의 사용자가 인증되어 있다 |
| **When** | GET /api/v1/roles 호출 |
| **Then** | 403 Forbidden 응답 |

##### [TC-031] 역할 등록 - 권한 부족 (MANAGE)

**분류**: Error Path | **API**: POST /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | MANAGE 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/roles { name: "NEW_ROLE" } |
| **Then** | 403 Forbidden 응답 |

##### [TC-032] Grant 배치 할당 - 권한 부족

**분류**: Error Path | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | MANAGE 역할의 관리자가 인증되어 있다 |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [] } |
| **Then** | 403 Forbidden 응답 |

#### Role 유효성 에러

##### [TC-033] 역할 등록 - 이름 필수 누락

**분류**: Error Path | **API**: POST /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/roles { displayName: "테스트" } (name 누락) |
| **Then** | 400 Bad Request 응답 |
|          | message: "역할 식별자를 입력해주세요" |

##### [TC-034] 역할 등록 - 이름 형식 오류

**분류**: Error Path | **API**: POST /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/roles { name: "invalid-name" } (소문자, 하이픈) |
| **Then** | 400 Bad Request 응답 |
|          | message: "역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" |

##### [TC-035] 역할 등록 - 이름 중복

**분류**: Error Path | **API**: POST /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | "FULL_ACCESS" 이름의 역할이 이미 존재한다 |
| **When** | POST /api/v1/roles { name: "FULL_ACCESS" } |
| **Then** | 409 Conflict 응답 |
|          | message: "이미 존재하는 역할 식별자입니다" |

##### [TC-036] 역할 수정 - 시스템 역할 수정 시도

**분류**: Error Path | **API**: PATCH /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | 대상 역할의 isSystem=true |
| **When** | PATCH /api/v1/roles/:id { displayName: "변경 시도" } |
| **Then** | 400 Bad Request 응답 |
|          | message: "시스템 역할은 수정할 수 없습니다" |

##### [TC-037] 역할 수정 - 존재하지 않는 역할

**분류**: Error Path | **API**: PATCH /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | PATCH /api/v1/roles/non-existent-uuid { displayName: "변경" } |
| **Then** | 404 Not Found 응답 |

##### [TC-038] 역할 상세 조회 - 존재하지 않는 역할

**분류**: Error Path | **API**: GET /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | GET /api/v1/roles/non-existent-uuid 호출 |
| **Then** | 404 Not Found 응답 |

##### [TC-039] 역할 삭제 - 시스템 역할 삭제 시도

**분류**: Error Path | **API**: DELETE /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | 대상 역할의 isSystem=true |
| **When** | DELETE /api/v1/roles/:id 호출 |
| **Then** | 400 Bad Request 응답 |
|          | message: "시스템 역할은 삭제할 수 없습니다" |

##### [TC-040] 역할 삭제 - 연결된 사용자 존재

**분류**: Error Path | **API**: DELETE /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | 대상 역할에 연결된 Tenant가 5명 있다 |
| **When** | DELETE /api/v1/roles/:id 호출 |
| **Then** | 400 Bad Request 응답 |
|          | message: "연결된 사용자가 5명 있어 삭제할 수 없습니다. 먼저 역할을 변경해주세요." |

##### [TC-041] 역할 삭제 - 존재하지 않는 역할

**분류**: Error Path | **API**: DELETE /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | DELETE /api/v1/roles/non-existent-uuid 호출 |
| **Then** | 404 Not Found 응답 |

#### Grant 에러

##### [TC-042] Grant 배치 할당 - 존재하지 않는 Role

**분류**: Error Path | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | PUT /api/v1/grants/roles/non-existent-uuid { grants: [] } |
| **Then** | 404 Not Found 응답 |

##### [TC-043] Grant 배치 할당 - 존재하지 않는 Ability

**분류**: Error Path | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | roleId "role-001"이 존재한다 |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [{ abilityId: "non-existent", isActive: true, priority: 0 }] } |
| **Then** | 400 Bad Request 응답 |
|          | message: "존재하지 않는 권한 정의입니다: non-existent" |

##### [TC-044] Grant 배치 할당 - 중복 abilityId

**분류**: Error Path | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [{ abilityId: "abl-001", isActive: true, priority: 0 }, { abilityId: "abl-001", isActive: false, priority: 5 }] } |
| **Then** | 400 Bad Request 응답 |
|          | message: "중복된 권한 정의가 포함되어 있습니다" |

#### Ability 에러

##### [TC-045] Ability 목록 조회 - 권한 부족

**분류**: Error Path | **API**: GET /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | VIEW 역할의 사용자가 인증되어 있다 |
| **When** | GET /api/v1/abilities 호출 |
| **Then** | 403 Forbidden 응답 |

##### [TC-046] Ability 등록 - 필수 필드 누락

**분류**: Error Path | **API**: POST /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/abilities { name: "Test" } (subjectId, actionId 누락) |
| **Then** | 400 Bad Request 응답 |

##### [TC-047] Ability 등록 - JSON conditions 형식 오류

**분류**: Error Path | **API**: POST /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/abilities { name: "Test", subjectId: "sub-001", actionId: "act-001", conditions: "invalid json" } |
| **Then** | 400 Bad Request 응답 |
|          | message: "올바른 JSON 형식으로 입력해주세요" |

##### [TC-048] Ability 등록 - 존재하지 않는 Subject

**분류**: Error Path | **API**: POST /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/abilities { name: "Test", subjectId: "non-existent", actionId: "act-001" } |
| **Then** | 400 Bad Request 응답 |
|          | message: "존재하지 않는 Subject입니다" |

##### [TC-049] Ability 등록 - 이름 중복

**분류**: Error Path | **API**: POST /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | "Read User"라는 이름의 Ability가 이미 존재한다 |
| **When** | POST /api/v1/abilities { name: "Read User", subjectId: "sub-001", actionId: "act-001" } |
| **Then** | 409 Conflict 응답 |

##### [TC-050] Ability 수정 - 존재하지 않는 Ability

**분류**: Error Path | **API**: PATCH /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | PATCH /api/v1/abilities/non-existent { name: "Updated" } |
| **Then** | 404 Not Found 응답 |

##### [TC-051] Ability 수정 - 권한 부족

**분류**: Error Path | **API**: PATCH /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | MANAGE 역할의 관리자가 인증되어 있다 |
| **When** | PATCH /api/v1/abilities/abl-001 { name: "Updated" } |
| **Then** | 403 Forbidden 응답 |

##### [TC-052] Ability 상세 조회 - 존재하지 않는 Ability

**분류**: Error Path | **API**: GET /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | 인증된 사용자가 있다 |
| **When** | GET /api/v1/abilities/non-existent 호출 |
| **Then** | 404 Not Found 응답 |

##### [TC-053] Ability 삭제 - 권한 부족

**분류**: Error Path | **API**: DELETE /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | MANAGE 역할의 관리자가 인증되어 있다 |
| **When** | DELETE /api/v1/abilities/abl-001 호출 |
| **Then** | 403 Forbidden 응답 |

#### Action 에러

##### [TC-054] Action 등록 - 이름 형식 오류

**분류**: Error Path | **API**: POST /api/v1/actions

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/actions { name: "Invalid Name!" } |
| **Then** | 400 Bad Request 응답 |
|          | message: "이름은 영소문자로 시작하며, 영소문자, 숫자, 콜론, 언더스코어만 사용 가능합니다" |

##### [TC-055] Action 등록 - 이름 중복

**분류**: Error Path | **API**: POST /api/v1/actions

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
|           | "read" 이름의 Action이 이미 존재한다 |
| **When** | POST /api/v1/actions { name: "read" } |
| **Then** | 409 Conflict 응답 |

##### [TC-056] Action 등록 - 권한 부족

**분류**: Error Path | **API**: POST /api/v1/actions

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리가 아닌 역할의 사용자가 인증되어 있다 |
| **When** | POST /api/v1/actions { name: "custom:action" } |
| **Then** | 403 Forbidden 응답 |

##### [TC-057] Action 수정 - 시스템 Action 수정 시도

**분류**: Error Path | **API**: PATCH /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
|           | 대상 Action의 isSystem=true |
| **When** | PATCH /api/v1/actions/:id { displayName: "변경 시도" } |
| **Then** | 400 Bad Request 응답 |
|          | message: "시스템 Action은 수정할 수 없습니다" |

##### [TC-058] Action 수정 - 존재하지 않는 Action

**분류**: Error Path | **API**: PATCH /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
| **When** | PATCH /api/v1/actions/non-existent { displayName: "변경" } |
| **Then** | 404 Not Found 응답 |

##### [TC-059] Action 삭제 - 시스템 Action 삭제 시도

**분류**: Error Path | **API**: DELETE /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
|           | 대상 Action의 isSystem=true |
| **When** | DELETE /api/v1/actions/:id 호출 |
| **Then** | 400 Bad Request 응답 |
|          | message: "시스템 Action은 삭제할 수 없습니다" |

##### [TC-060] Action 삭제 - 연결된 Ability 존재

**분류**: Error Path | **API**: DELETE /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자가 인증되어 있다 |
|           | 대상 Action에 연결된 Ability가 3개 있다 |
| **When** | DELETE /api/v1/actions/:id 호출 |
| **Then** | 400 Bad Request 응답 |
|          | message: "이 Action을 사용하는 권한 정의가 3개 있어 삭제할 수 없습니다" |

##### [TC-061] Action 상세 조회 - 존재하지 않는 Action

**분류**: Error Path | **API**: GET /api/v1/actions/:id

| 구분 | 설명 |
|------|------|
| **Given** | 인증 불필요 |
| **When** | GET /api/v1/actions/non-existent 호출 |
| **Then** | 404 Not Found 응답 |

#### Subject 에러

##### [TC-062] Subject 상세 조회 - 존재하지 않는 Subject

**분류**: Error Path | **API**: GET /api/v1/subjects/:id

| 구분 | 설명 |
|------|------|
| **Given** | 인증 불필요 |
| **When** | GET /api/v1/subjects/non-existent 호출 |
| **Then** | 404 Not Found 응답 |

##### [TC-063] Subject 필드 조회 - 존재하지 않는 Subject

**분류**: Error Path | **API**: GET /api/v1/subjects/:id/fields

| 구분 | 설명 |
|------|------|
| **Given** | 인증 불필요 |
| **When** | GET /api/v1/subjects/non-existent/fields 호출 |
| **Then** | 404 Not Found 응답 |

---

### L10.3: Edge Case 테스트

##### [TC-064] Grant 배치 할당 - 빈 배열 (전부 해제)

**분류**: Edge Case | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | roleId "role-001"에 Grant 3건이 할당되어 있다 |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [] } |
| **Then** | 200 OK 응답 |
|          | data.added === 0, data.updated === 0, data.removed === 3, data.total === 0 |
|          | 이후 GET /api/v1/abilities/roles/role-001 호출 시 빈 배열 |

##### [TC-065] Grant 배치 할당 - 기존과 동일한 목록 (변경 없음)

**분류**: Edge Case | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | roleId "role-001"에 Grant 2건: { abl-001, isActive:true, priority:0 }, { abl-002, isActive:true, priority:5 } |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [{ abilityId: "abl-001", isActive: true, priority: 0 }, { abilityId: "abl-002", isActive: true, priority: 5 }] } |
| **Then** | 200 OK 응답 |
|          | data.added === 0, data.updated === 0, data.removed === 0, data.total === 2 |

##### [TC-066] Grant 배치 할당 - 시스템 역할의 Grant 변경

**분류**: Edge Case | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | 대상 Role이 시스템 역할(isSystem=true) |
| **When** | PUT /api/v1/grants/roles/:roleId { grants: [...] } |
| **Then** | 200 OK 응답 (시스템 역할이라도 Grant 할당은 가능) |
|          | Grant 변경 성공 |

##### [TC-067] Grant 배치 할당 - CASL 캐시 무효화 확인

**분류**: Edge Case | **API**: PUT /api/v1/grants/roles/:roleId

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | roleId "role-001"에 Tenant 3명이 연결되어 있다 |
|           | 각 Tenant의 CASL 캐시가 Redis에 존재한다 |
| **When** | PUT /api/v1/grants/roles/role-001 { grants: [...] } (Grant 변경) |
| **Then** | 200 OK 응답 |
|          | 3명의 Tenant CASL 캐시가 모두 무효화됨 |

##### [TC-068] 역할 등록 - name 최대 길이 (50자)

**분류**: Edge Case | **API**: POST /api/v1/roles

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | POST /api/v1/roles { name: "A".repeat(50) } (정확히 50자) |
| **Then** | 201 Created 응답 (경계값 허용) |

##### [TC-069] 역할 수정 - 변경사항 없이 수정 요청

**분류**: Edge Case | **API**: PATCH /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | 커스텀 역할의 displayName이 "기존 이름" |
| **When** | PATCH /api/v1/roles/:id { displayName: "기존 이름" } (동일 값) |
| **Then** | 200 OK 응답 (변경사항 없어도 성공) |

##### [TC-070] 역할 삭제 - Grant가 있는 역할 삭제

**분류**: Edge Case | **API**: DELETE /api/v1/roles/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | 커스텀 역할에 Grant 5건이 할당되어 있지만, Tenant는 없다 |
| **When** | DELETE /api/v1/roles/:id 호출 |
| **Then** | 204 No Content 응답 |
|          | Role + Grant 5건 + RoleAssociation + RoleClassification 모두 소프트 삭제됨 |

##### [TC-071] Ability 등록 - fields에 존재하지 않는 필드명

**분류**: Edge Case | **API**: POST /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | Subject "entity:User"의 필드에 "nonExistentField"가 없다 |
| **When** | POST /api/v1/abilities { name: "Test", subjectId: "sub-001", actionId: "act-001", fields: ["nonExistentField"] } |
| **Then** | 400 Bad Request 응답 |
|          | message: "존재하지 않는 필드가 포함되어 있습니다: nonExistentField" |

##### [TC-072] Ability 목록 조회 - 모든 필터 적용

**분류**: Edge Case | **API**: GET /api/v1/abilities

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
| **When** | GET /api/v1/abilities?subjectId=sub-001&actionId=act-001&inverted=true&name=Deny&skip=0&take=5 호출 |
| **Then** | 200 OK 응답 |
|          | 모든 필터 조건을 만족하는 결과만 반환 |

##### [TC-073] Ability 삭제 - 연결된 Grant cascade 삭제 확인

**분류**: Edge Case | **API**: DELETE /api/v1/abilities/:id

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자가 인증되어 있다 |
|           | Ability "abl-001"에 Grant 3건이 연결되어 있다 (Role Grant 2건, User Grant 1건) |
| **When** | DELETE /api/v1/abilities/abl-001 호출 |
| **Then** | 204 No Content 응답 |
|          | Ability + Grant 3건 모두 소프트 삭제됨 |
|          | 관련 Tenant의 CASL 캐시 무효화됨 |

##### [TC-074] Subject 필드 조회 - entity가 아닌 Subject

**분류**: Edge Case | **API**: GET /api/v1/subjects/:id/fields

| 구분 | 설명 |
|------|------|
| **Given** | Subject "menu:dashboard" (group=menu)가 존재한다 |
| **When** | GET /api/v1/subjects/sub-menu-001/fields 호출 |
| **Then** | 200 OK 응답 |
|          | data === [] (빈 배열) |

---

## 프론트엔드 E2E 테스트 케이스

### E2E 테스트 시나리오

#### [E2E-001] 역할 전체 CRUD 플로우

**분류**: Happy Path | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자로 로그인되어 있다 |
| **When** | 1. /roles 페이지 진입 |
|          | 2. "역할 등록" 버튼 클릭 |
|          | 3. name: "E2E_TEST_ROLE", displayName: "E2E 테스트" 입력 |
|          | 4. "등록" 버튼 클릭 |
|          | 5. 상세 화면에서 "수정" 버튼 클릭 |
|          | 6. displayName: "E2E 테스트 수정됨"으로 변경 |
|          | 7. "저장" 버튼 클릭 |
|          | 8. 상세 화면에서 "삭제" 버튼 클릭 |
|          | 9. 삭제 확인 모달에서 "삭제" 클릭 |
| **Then** | 역할 목록으로 이동, "E2E_TEST_ROLE" 없음 확인 |

#### [E2E-002] Grant 배치 할당 플로우

**분류**: Happy Path | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자로 로그인되어 있다 |
|           | 커스텀 역할이 존재한다 |
| **When** | 1. /roles/[roleId] 상세 페이지 진입 |
|          | 2. "할당된 권한" 섹션에서 Ability 3개 체크 |
|          | 3. 첫 번째 Ability의 priority를 5로 변경 |
|          | 4. "일괄 저장" 버튼 클릭 |
|          | 5. 확인 모달에서 변경 요약 확인 (추가 3건) |
|          | 6. "저장" 클릭 |
| **Then** | 성공 토스트 표시 |
|          | Grant 목록 갱신되어 체크된 3개 표시 |

#### [E2E-003] 권한 정의 등록 - Subject 선택 시 필드 자동완성

**분류**: Happy Path | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자로 로그인되어 있다 |
| **When** | 1. /abilities/new 페이지 진입 |
|          | 2. name 입력: "Test Read User" |
|          | 3. Subject Select에서 "entity:User (이용자)" 선택 |
|          | 4. Action Select에서 "read (읽기)" 선택 |
|          | 5. fields TagInput에서 "email" 입력 → 자동완성 표시 확인 |
|          | 6. "email" 선택 |
|          | 7. "등록" 버튼 클릭 |
| **Then** | 성공 토스트 표시 |
|          | 목록 페이지로 이동 |

#### [E2E-004] 시스템 역할 보호 확인

**분류**: Edge Case | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자로 로그인되어 있다 |
| **When** | 1. /roles 목록에서 시스템 역할(FULL_ACCESS) 클릭 |
|          | 2. 상세 화면에서 "수정" 버튼 상태 확인 |
|          | 3. "삭제" 버튼 상태 확인 |
| **Then** | "수정" 버튼이 disabled 또는 숨김 |
|          | "삭제" 버튼이 disabled 또는 숨김 |

#### [E2E-005] 조회 권한 사용자 제한 확인

**분류**: Error Path | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | MANAGE 역할의 관리자로 로그인되어 있다 |
| **When** | 1. /roles 목록 페이지 진입 |
|          | 2. "역할 등록" 버튼 존재 여부 확인 |
|          | 3. 역할 상세 페이지에서 "수정"/"삭제" 버튼 확인 |
|          | 4. Grant 배치 할당 영역 확인 |
| **Then** | "역할 등록" 버튼 숨김 |
|          | "수정"/"삭제" 버튼 숨김 |
|          | Grant 영역이 읽기 전용 |

#### [E2E-006] Ability 거부 규칙(inverted) 등록

**분류**: Happy Path | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | FULL_ACCESS 역할의 관리자로 로그인되어 있다 |
| **When** | 1. /abilities/new 페이지 진입 |
|          | 2. name, Subject, Action 입력 |
|          | 3. inverted Switch를 true로 토글 |
|          | 4. reason 입력 필드 활성화 확인 |
|          | 5. reason 입력: "관리자만 접근 가능" |
|          | 6. "등록" 버튼 클릭 |
| **Then** | 성공 토스트 표시 |
|          | 상세 화면에서 inverted=true, reason 표시 확인 |

#### [E2E-007] Action 시스템 보호 확인

**분류**: Edge Case | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | WORKSPACE 카테고리 역할의 관리자로 로그인되어 있다 |
| **When** | 1. /actions 목록에서 시스템 Action(read, isSystem=true) 클릭 |
|          | 2. 상세 화면에서 "수정"/"삭제" 버튼 상태 확인 |
| **Then** | "수정" 버튼이 disabled 또는 숨김 |
|          | "삭제" 버튼이 disabled 또는 숨김 |

#### [E2E-008] Subject 필드 조회 (entity vs non-entity)

**분류**: Edge Case | **도구**: Playwright

| 구분 | 설명 |
|------|------|
| **Given** | 로그인되어 있다 |
| **When** | 1. /subjects 목록에서 entity 그룹 Subject 클릭 |
|          | 2. 필드 목록 섹션 확인 |
|          | 3. 뒤로 이동, menu 그룹 Subject 클릭 |
|          | 4. 필드 목록 섹션 확인 |
| **Then** | entity Subject: 필드 목록 테이블에 데이터 표시 |
|          | menu Subject: "필드 정보가 없습니다" 안내 표시 |

---

## 비즈니스 규칙 요약

### 유효성 검사 규칙

| ID | 필드/기능 | 규칙 | 에러 메시지 |
|----|----------|------|------------|
| V-ROL-002 | Role.name | `^[A-Z][A-Z0-9_]*$`, 최대 50자, unique | "역할 식별자는 영문 대문자로 시작하며..." |
| V-ACT-002 | Action.name | `^[a-z][a-z0-9:_]*$`, 최대 100자, unique | "이름은 영소문자로 시작하며..." |
| V-ABL-009 | Ability.conditions | 유효한 JSON 또는 null | "올바른 JSON 형식으로 입력해주세요" |
| V-GRT-006 | Grant.priority | 정수, Role: 0-9 | "우선순위는 0-9 범위여야 합니다" |

### 권한 규칙

| ID | 기능 | 필요 권한 | 조건 |
|----|------|----------|------|
| P-003 | Role CUD | FULL_ACCESS | RolesGuard |
| P-010~012 | Ability CUD | FULL_ACCESS | RolesGuard |
| P-013 | Grant 배치 할당 | FULL_ACCESS | RolesGuard |
| P-016~018 | Action CUD | WORKSPACE Category | RoleCategoryGuard |

### 시스템 엔티티 보호 규칙

| 엔티티 | 조건 | 보호 범위 | 허용 |
|--------|------|----------|------|
| Role (isSystem=true) | FULL_ACCESS, MANAGE, VIEW | 수정/삭제 불가 | 조회, Grant 배치 할당 |
| Action (isSystem=true) | create, read, update, delete 등 | 수정/삭제 불가 | 조회 |

### 삭제 전 연결 확인 규칙

| 엔티티 | 연결 확인 대상 | 연결 시 동작 |
|--------|---------------|-------------|
| Role | Tenant (Assignment) | 삭제 불가 (400) |
| Role | Grant | cascade 소프트 삭제 |
| Role | RoleAssociation, RoleClassification | cascade 소프트 삭제 |
| Ability | Grant | cascade 소프트 삭제 + 경고 |
| Action | Ability | 삭제 불가 (400) |

### 트랜잭션 처리 대상

| 작업 | 트랜잭션 범위 | 이유 |
|------|-------------|------|
| Grant 배치 할당 | add + update + remove 일괄 | 부분 실패 방지, 데이터 일관성 |
| Role 삭제 | Role + Grant + Association + Classification | 연관 데이터 일괄 삭제 |
| Ability 삭제 | Ability + 연결된 Grant | cascade 삭제 일관성 |
| Role 생성 (Group/Category 포함) | Role + RoleAssociation + RoleClassification | 연관 데이터 일괄 생성 |
| Role 수정 (Group/Category 변경) | Role + Association/Classification 교체 | 연관 데이터 교체 일관성 |

---

## 에이전트 매핑

### Stage 2: 스키마 구현

기존 스키마가 이미 존재하므로 최소한의 스키마 변경만 필요합니다.

| 순서 | 에이전트 | 작업 내용 |
|:----:|---------|----------|
| 1 | `be-schema-builder` | Grant 모델 확인, CreateRoleDto에 groupId/categoryId 추가 확인 |
| 2 | `be-entity-builder` | Grant Entity 클래스 확인/보완 |
| 3 | `be-dto-builder` | GrantBatchDto, GrantBatchItemDto 신규 생성. CreateRoleDto에 groupId/categoryId 추가 |
| 4 | `be-query-dto-builder` | AbilityQueryDto 생성 (skip, take, subjectId, actionId, inverted, name 필터) |
| 5 | `be-seed-maker` | Grant 시드 데이터 추가 (Role별 기본 권한 할당) |

### Stage 3: 백엔드 로직

| 순서 | 에이전트 | 작업 내용 |
|:----:|---------|----------|
| 1 | `be-repository-builder` | GrantRepository 생성 (findByGrantee, upsertBatch, softDeleteByIds) |
| 2 | `be-repository-builder` | AbilityRepository 보완 (findAll with pagination/filter) |
| 3 | `be-service-builder` | GrantService 생성 (배치 동기화 알고리즘, 캐시 무효화 로직) |
| 4 | `be-service-builder` | RolesService 보완 (삭제 시 연결 확인, Group/Category 연결 관리) |
| 5 | `be-service-builder` | AbilitiesService 보완 (전체 목록 조회, 삭제 시 cascade Grant 처리) |
| 6 | `be-service-builder` | ActionsService 보완 (삭제 시 연결된 Ability 확인) |
| 7 | `be-controller-builder` | GrantsController 생성 (PUT /api/v1/grants/roles/:roleId) |
| 8 | `be-controller-builder` | AbilitiesController 보완 (GET /api/v1/abilities 전체 목록 엔드포인트 추가) |
| 9 | `be-controller-builder` | RolesController 보완 (Guard 적용, Group/Category 연결 요청 처리) |
| 10 | `be-bootstrap-integrator` | GrantModule 등록, AppModule 업데이트 |

### Stage 6: E2E 검증

| 순서 | 에이전트 | 작업 내용 |
|:----:|---------|----------|
| 1 | `qa-be-e2e-testing` | 백엔드 E2E 테스트 (TC-001 ~ TC-074) |
| 2 | `qa-fe-e2e-testing` | 프론트엔드 E2E 테스트 (E2E-001 ~ E2E-008) |

**백엔드 E2E 테스트 구성**:
```
apps/e2e/tests/
  admin/
    roles.spec.ts          # Role CRUD E2E (TC-001 ~ TC-008, TC-029 ~ TC-041, TC-068 ~ TC-070)
    abilities.spec.ts      # Ability CRUD E2E (TC-012 ~ TC-018, TC-045 ~ TC-053, TC-071 ~ TC-073)
    grants.spec.ts         # Grant 배치 할당 E2E (TC-009 ~ TC-011, TC-042 ~ TC-044, TC-064 ~ TC-067)
    actions.spec.ts        # Action CRUD E2E (TC-019 ~ TC-024, TC-054 ~ TC-061)
    subjects.spec.ts       # Subject 조회 E2E (TC-025 ~ TC-028, TC-062 ~ TC-063, TC-074)
```

**프론트엔드 E2E 테스트 구성**:
```
apps/e2e/tests/
  admin/
    role-management.spec.ts     # E2E-001, E2E-002, E2E-004, E2E-005
    ability-management.spec.ts  # E2E-003, E2E-006
    action-management.spec.ts   # E2E-007
    subject-management.spec.ts  # E2E-008
```

---

## Requirement Graph (L9-L10)

```json
{
  "level_range": "L9-L10",
  "nodes": [
    { "id": "ROL-L9-LOG-001", "level": 9, "subLevel": "1", "type": "logic", "name": "Role name 유효성 검사", "description": "영문 대문자+언더스코어 패턴, unique, 최대 50자" },
    { "id": "ROL-L9-LOG-002", "level": 9, "subLevel": "1", "type": "logic", "name": "Action name 유효성 검사", "description": "영소문자+콜론+언더스코어 패턴, unique, 최대 100자" },
    { "id": "ROL-L9-LOG-003", "level": 9, "subLevel": "1", "type": "logic", "name": "Ability 필수 필드 검사", "description": "name, subjectId, actionId 필수, FK 존재 확인" },
    { "id": "ROL-L9-LOG-004", "level": 9, "subLevel": "1", "type": "logic", "name": "Grant 배치 유효성 검사", "description": "abilityId 존재 확인, 중복 불가, priority 범위 0-9" },
    { "id": "ROL-L9-LOG-005", "level": 9, "subLevel": "1", "type": "logic", "name": "JSON 형식 유효성 검사", "description": "conditions, config 필드의 JSON 형식 검증" },
    { "id": "ROL-L9-LOG-006", "level": 9, "subLevel": "1", "type": "logic", "name": "Ability fields 존재 검사", "description": "DMMF 기반 Subject 필드에 존재하는 값인지 확인" },
    { "id": "ROL-L9-LOG-007", "level": 9, "subLevel": "2", "type": "logic", "name": "Role CRUD 권한 검사", "description": "조회: MANAGE/FULL_ACCESS, CUD: FULL_ACCESS" },
    { "id": "ROL-L9-LOG-008", "level": 9, "subLevel": "2", "type": "logic", "name": "Ability CRUD 권한 검사", "description": "조회: 인증 사용자, CUD: FULL_ACCESS" },
    { "id": "ROL-L9-LOG-009", "level": 9, "subLevel": "2", "type": "logic", "name": "Action CUD 권한 검사", "description": "조회: Public, CUD: WORKSPACE 카테고리" },
    { "id": "ROL-L9-LOG-010", "level": 9, "subLevel": "2", "type": "logic", "name": "Grant 배치 할당 권한 검사", "description": "FULL_ACCESS 역할만 Grant 배치 할당 가능" },
    { "id": "ROL-L9-LOG-011", "level": 9, "subLevel": "3", "type": "logic", "name": "Grant 배치 동기화 알고리즘", "description": "추가/수정/해제 자동 계산, 트랜잭션 처리" },
    { "id": "ROL-L9-LOG-012", "level": 9, "subLevel": "3", "type": "logic", "name": "CASL 캐시 무효화", "description": "Grant/Ability 변경 시 관련 Tenant CASL 캐시 삭제" },
    { "id": "ROL-L9-LOG-013", "level": 9, "subLevel": "3", "type": "logic", "name": "Role 삭제 cascade 처리", "description": "Role + Grant + Association + Classification 일괄 소프트 삭제" },
    { "id": "ROL-L9-LOG-014", "level": 9, "subLevel": "3", "type": "logic", "name": "Ability 삭제 cascade 처리", "description": "Ability + 연결된 Grant 일괄 소프트 삭제" },
    { "id": "ROL-L9-LOG-015", "level": 9, "subLevel": "3", "type": "logic", "name": "DMMF 필드 추출", "description": "Subject의 entity 모델에서 Prisma DMMF 기반 필드 목록 생성" },
    { "id": "ROL-L9-LOG-016", "level": 9, "subLevel": "3", "type": "logic", "name": "Ability 목록 필터/페이지네이션", "description": "subjectId, actionId, inverted, name 필터 + skip/take 페이지네이션" },
    { "id": "ROL-L9-LOG-017", "level": 9, "subLevel": "3", "type": "logic", "name": "Role 생성 시 Group/Category 연결", "description": "트랜잭션 내 Role + RoleAssociation + RoleClassification 생성" },
    { "id": "ROL-L9-LOG-018", "level": 9, "subLevel": "4", "type": "logic", "name": "시스템 엔티티 보호", "description": "isSystem=true인 Role/Action 수정/삭제 차단" },
    { "id": "ROL-L9-LOG-019", "level": 9, "subLevel": "4", "type": "logic", "name": "Role 삭제 시 Tenant 연결 확인", "description": "연결된 Tenant 있으면 삭제 불가" },
    { "id": "ROL-L9-LOG-020", "level": 9, "subLevel": "4", "type": "logic", "name": "Action 삭제 시 Ability 연결 확인", "description": "연결된 Ability 있으면 삭제 불가" },
    { "id": "ROL-L9-LOG-021", "level": 9, "subLevel": "4", "type": "logic", "name": "동시 Grant 배치 저장 처리", "description": "Last Write Wins 방식, 트랜잭션 격리" },
    { "id": "ROL-L9-LOG-022", "level": 9, "subLevel": "4", "type": "logic", "name": "소프트 삭제 엔티티 접근 차단", "description": "removedAt IS NULL 필터로 삭제된 엔티티 조회 불가" },
    { "id": "ROL-L10-TST-001", "level": 10, "subLevel": "1", "type": "test", "name": "역할 목록 조회 성공", "description": "FULL_ACCESS 사용자가 전체 역할 목록을 조회", "metadata": { "given": "인증된 FULL_ACCESS 사용자, 역할 5개 존재", "when": "GET /api/v1/roles", "then": "200 OK, data에 5개 역할" } },
    { "id": "ROL-L10-TST-002", "level": 10, "subLevel": "1", "type": "test", "name": "Grant 배치 할당 성공 (새 할당)", "description": "빈 Grant에 새 Ability 할당", "metadata": { "given": "Grant 없는 Role", "when": "PUT grants/roles/:roleId + 2건", "then": "added=2, removed=0" } },
    { "id": "ROL-L10-TST-003", "level": 10, "subLevel": "1", "type": "test", "name": "Ability 등록 성공", "description": "Subject+Action 조합으로 새 Ability 생성", "metadata": { "given": "Subject, Action 존재", "when": "POST /api/v1/abilities", "then": "201 Created" } },
    { "id": "ROL-L10-TST-004", "level": 10, "subLevel": "2", "type": "test", "name": "역할 등록 이름 중복 실패", "description": "이미 존재하는 이름으로 역할 생성 시도", "metadata": { "given": "동일 이름 역할 존재", "when": "POST /api/v1/roles", "then": "409 Conflict" } },
    { "id": "ROL-L10-TST-005", "level": 10, "subLevel": "2", "type": "test", "name": "시스템 역할 삭제 불가", "description": "isSystem=true 역할 삭제 시도", "metadata": { "given": "시스템 역할", "when": "DELETE /api/v1/roles/:id", "then": "400 Bad Request" } },
    { "id": "ROL-L10-TST-006", "level": 10, "subLevel": "2", "type": "test", "name": "권한 부족 시 403 반환", "description": "MANAGE 사용자가 CUD 시도", "metadata": { "given": "MANAGE 역할 사용자", "when": "POST /api/v1/roles", "then": "403 Forbidden" } },
    { "id": "ROL-L10-TST-007", "level": 10, "subLevel": "3", "type": "test", "name": "Grant 배치 빈 배열 전송", "description": "빈 배열로 전체 Grant 해제", "metadata": { "given": "Grant 3건 할당", "when": "PUT grants/roles/:roleId + []", "then": "removed=3, total=0" } },
    { "id": "ROL-L10-TST-008", "level": 10, "subLevel": "3", "type": "test", "name": "entity가 아닌 Subject 필드 조회", "description": "menu 그룹 Subject의 필드 조회", "metadata": { "given": "menu 그룹 Subject", "when": "GET subjects/:id/fields", "then": "빈 배열 반환" } }
  ],
  "edges": [
    { "id": "e-901", "source": "ROL-L9-LOG-001", "target": "ROL-L6-API-003", "type": "validates", "label": "name 검증 (생성)" },
    { "id": "e-902", "source": "ROL-L9-LOG-002", "target": "ROL-L6-API-014", "type": "validates", "label": "name 검증 (생성)" },
    { "id": "e-903", "source": "ROL-L9-LOG-003", "target": "ROL-L6-API-009", "type": "validates", "label": "필수 필드 검증" },
    { "id": "e-904", "source": "ROL-L9-LOG-004", "target": "ROL-L6-API-021", "type": "validates", "label": "배치 입력 검증" },
    { "id": "e-905", "source": "ROL-L9-LOG-005", "target": "ROL-L6-API-009", "type": "validates", "label": "JSON 형식 검증" },
    { "id": "e-906", "source": "ROL-L9-LOG-006", "target": "ROL-L6-API-009", "type": "validates", "label": "fields 검증" },
    { "id": "e-907", "source": "ROL-L9-LOG-007", "target": "ROL-L6-API-001", "type": "validates", "label": "권한 체크" },
    { "id": "e-908", "source": "ROL-L9-LOG-007", "target": "ROL-L6-API-003", "type": "validates", "label": "권한 체크" },
    { "id": "e-909", "source": "ROL-L9-LOG-008", "target": "ROL-L6-API-009", "type": "validates", "label": "권한 체크" },
    { "id": "e-910", "source": "ROL-L9-LOG-009", "target": "ROL-L6-API-014", "type": "validates", "label": "권한 체크" },
    { "id": "e-911", "source": "ROL-L9-LOG-010", "target": "ROL-L6-API-021", "type": "validates", "label": "권한 체크" },
    { "id": "e-912", "source": "ROL-L9-LOG-011", "target": "ROL-L6-API-021", "type": "validates", "label": "동기화 로직" },
    { "id": "e-913", "source": "ROL-L9-LOG-012", "target": "ROL-L6-API-021", "type": "validates", "label": "캐시 무효화" },
    { "id": "e-914", "source": "ROL-L9-LOG-013", "target": "ROL-L6-API-005", "type": "validates", "label": "cascade 삭제" },
    { "id": "e-915", "source": "ROL-L9-LOG-014", "target": "ROL-L6-API-011", "type": "validates", "label": "cascade 삭제" },
    { "id": "e-916", "source": "ROL-L9-LOG-015", "target": "ROL-L6-API-019", "type": "validates", "label": "DMMF 추출" },
    { "id": "e-917", "source": "ROL-L9-LOG-016", "target": "ROL-L6-API-020", "type": "validates", "label": "필터/페이지네이션" },
    { "id": "e-918", "source": "ROL-L9-LOG-017", "target": "ROL-L6-API-003", "type": "validates", "label": "연결 생성" },
    { "id": "e-919", "source": "ROL-L9-LOG-018", "target": "ROL-L6-API-004", "type": "validates", "label": "시스템 보호" },
    { "id": "e-920", "source": "ROL-L9-LOG-018", "target": "ROL-L6-API-005", "type": "validates", "label": "시스템 보호" },
    { "id": "e-921", "source": "ROL-L9-LOG-018", "target": "ROL-L6-API-015", "type": "validates", "label": "시스템 보호" },
    { "id": "e-922", "source": "ROL-L9-LOG-018", "target": "ROL-L6-API-016", "type": "validates", "label": "시스템 보호" },
    { "id": "e-923", "source": "ROL-L9-LOG-019", "target": "ROL-L6-API-005", "type": "validates", "label": "Tenant 연결 확인" },
    { "id": "e-924", "source": "ROL-L9-LOG-020", "target": "ROL-L6-API-016", "type": "validates", "label": "Ability 연결 확인" },
    { "id": "e-950", "source": "ROL-L10-TST-001", "target": "ROL-L3-FEA-001", "type": "tests", "label": "테스트" },
    { "id": "e-951", "source": "ROL-L10-TST-002", "target": "ROL-L3-FEA-007", "type": "tests", "label": "테스트" },
    { "id": "e-952", "source": "ROL-L10-TST-003", "target": "ROL-L3-FEA-011", "type": "tests", "label": "테스트" },
    { "id": "e-953", "source": "ROL-L10-TST-004", "target": "ROL-L3-FEA-004", "type": "tests", "label": "테스트" },
    { "id": "e-954", "source": "ROL-L10-TST-005", "target": "ROL-L3-FEA-006", "type": "tests", "label": "테스트" },
    { "id": "e-955", "source": "ROL-L10-TST-006", "target": "ROL-L3-FEA-004", "type": "tests", "label": "테스트" },
    { "id": "e-956", "source": "ROL-L10-TST-007", "target": "ROL-L3-FEA-007", "type": "tests", "label": "테스트" },
    { "id": "e-957", "source": "ROL-L10-TST-008", "target": "ROL-L3-FEA-021", "type": "tests", "label": "테스트" }
  ]
}
```
