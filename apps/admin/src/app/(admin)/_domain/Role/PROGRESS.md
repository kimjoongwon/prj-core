# Role 권한 관리 기능 개발 진행 상황

## 기본 정보
- **프로젝트**: prj-core
- **앱**: admin-web
- **기능**: Role (권한 관리 - 전체 재기획)
- **시작일**: 2026-02-14
- **경로**: /admin/roles, /admin/abilities, /admin/actions, /admin/subjects

## 요구사항 요약
- Role CRUD 재구성 (기존 페이지 개선)
- Ability 관리 (CRUD, Role/User에 Grant 할당)
- Grant 배치 할당 API (신규 구현)
- Action 관리 (CRUD)
- Subject 관리 (조회 + 필드)
- Role Group 관리 (RoleAssociation)
- Role Category 관리 (RoleClassification)
- 백엔드 전체 재구현 포함
- E2E 테스트 포함

## 기존 스키마 구조
```
Role → Grant(다형성) ← Ability → Subject + Action
Role → RoleAssociation → Group
Role → RoleClassification → Category
Role → Assignment ← Tenant
```

## Stage 진행 상황

### Stage 1: 기획 ✅ COMPLETE
- [x] L0-L2: 컨텍스트/사용자/목표 기획 (2026-02-14)
  - 생성: `01-overview.md`
  - Actor 3종: 최고 관리자(FULL_ACCESS), 일반 관리자(MANAGE), 조회 사용자(VIEW)
  - Goal 16개: Role CRUD, Ability CRUD, Grant 배치 할당, Action/Subject 관리, 내 권한 조회
- [x] L3-L4: 기능/화면 기획 (2026-02-14)
  - 생성: `02-structure.md`
  - Feature 21개: Role(7), Ability(6), Action(6), Subject(2)
  - Screen 14개: Role(4), Ability(4), Action(4), Subject(2)
  - Grant 배치 할당은 역할 상세 화면 내 인라인 섹션으로 배치
- [x] L5-L6: 인터랙션/API 기획 (2026-02-14)
  - 생성: `03-interactions.md`
  - L5 인터랙션: 14개 화면별 사용자 액션 89개 정의
  - L6 API: 21개 엔드포인트 (기존 19개 + 신규 2개)
  - 신규 API: GET /api/v1/abilities (전체 목록), PUT /api/v1/grants/roles/:roleId (배치 할당)
  - 모달 2종: 삭제 확인, Grant 일괄 저장 확인
  - 피드백 메시지 18종 정의
- [x] L7-L8: 데이터 모델/컴포넌트 기획 (2026-02-14)
  - 생성: `04-ui-details.md`
  - L7 Entity 7개: Role, Ability, Grant, Action, Subject, RoleAssociation, RoleClassification
  - L7 Field 21개: 주요 필드 메타데이터 (타입, 제약조건, FK 참조)
  - L8 기존 컴포넌트 재사용 32개
  - L8 신규 컴포넌트 31개: Cell(6), UI(1), Input(3), Widget(19), Feature(1), Store(1)
  - 화면별 컴포넌트 계층 구조 정의 (14개 화면)
  - 에이전트 매핑 완료 (Stage 4/5 실행 순서 포함)
  - 동적 동작 상세: Subject 선택 시 필드 자동완성, Grant 배치 할당 플로우, inverted 토글 연동
- [x] L9-L10: 비즈니스 로직/테스트 기획 (2026-02-14)
  - 생성: `05-technical-design.md`
  - L9 비즈니스 로직 22개: 유효성 검사(6), 권한 검사(4), 계산/변환(7), 엣지케이스(5)
  - L10 테스트 케이스 75개: Happy Path(28), Error Path(36), Edge Case(11)
  - 프론트엔드 E2E 테스트 시나리오 8개
  - Grant 배치 동기화 알고리즘 상세 정의
  - CASL 캐시 무효화 로직 정의
  - 트랜잭션 처리 대상 5개 작업 식별
  - 시스템 엔티티 보호 규칙 (Role/Action isSystem)
  - 삭제 전 연결 확인 규칙 (Role→Tenant, Action→Ability, Ability→Grant)
  - Stage 2/3/6 에이전트 실행 매핑 완료

### Stage 2: 스키마 구현 ✅ COMPLETE
- [x] Entity: 기존 완료 (Role, Ability, Grant, Action, Subject, RoleAssociation, RoleClassification)
- [x] DTO: 기존 완료 + BatchGrantItemDto, BatchGrantRequestDto 신규 생성 (2026-02-14)
  - 생성: `packages/be-dto/src/grants/batch-grant.dto.ts`

### Stage 3: 백엔드 로직 ✅ COMPLETE
- [x] Repository: 기존 완료 (Roles, Abilities, Grants, Actions, Subjects)
- [x] Service: AbilitiesService.getAllAbilities() 추가, GrantsService.batchAssignToRole() 추가 (2026-02-14)
- [x] Facade: AbilitiesFacade.getAllAbilities() 추가 (2026-02-14)
- [x] Controller: GrantsController 신규 생성 (2026-02-14)
  - 생성: `apps/server/src/module/grant/grants.controller.ts`
  - PUT /api/v1/grants/roles/:roleId (배치 할당)
  - GET /api/v1/grants/roles/:roleId (역할별 Grant 조회)
- [x] Controller: AbilitiesController에 GET /api/v1/abilities (전체 목록) 추가 (2026-02-14)
- [x] Module: GrantsModule 생성 및 AppModule 등록 (2026-02-14)
  - 생성: `apps/server/src/module/grant/grants.module.ts`
- [x] i18n: Grant 관련 다국어 메시지 추가 (4개 언어)
### Stage 4-5: 프론트엔드 구현 ✅ COMPLETE
- [x] 메뉴 시스템 업데이트 (2026-02-14)
  - 수정: `packages/common-constant/src/routing/admin-menu.ts`
  - "역할 관리" → "권한 관리" 그룹으로 변경 (역할, 권한 정의, 액션, 대상)
  - 신규 경로: ABILITIES, ACTIONS, SUBJECTS 및 하위 경로 추가
  - 신규 Subject: MENU_ROLES_LIST, MENU_ABILITIES, MENU_ACTIONS, MENU_SUBJECTS
- [x] Role 페이지 (4개) - 기존 개선 (2026-02-14)
  - 수정: `apps/admin/src/app/(admin)/roles/[roleId]/_client.tsx` - Grant 배치 할당 섹션 추가
  - 임시 API 함수: getAllAbilities, batchAssignGrantsToRole (Orval 재생성 전)
  - 편집/보기 모드 토글, 변경 요약 모달, isActive/priority 설정
- [x] Ability 페이지 (4개) - 신규 생성 (2026-02-14)
  - List: `apps/admin/src/app/(admin)/abilities/page.tsx`, `_client.tsx`
  - Detail: `apps/admin/src/app/(admin)/abilities/[abilityId]/page.tsx`, `_client.tsx`
  - New: `apps/admin/src/app/(admin)/abilities/new/page.tsx`, `_client.tsx`
  - Edit: `apps/admin/src/app/(admin)/abilities/[abilityId]/edit/page.tsx`, `_client.tsx`
  - CASL 필드 관리: Subject/Action 선택, fields, conditions JSON, inverted
- [x] Action 페이지 (4개) - 신규 생성 (2026-02-14)
  - List: `apps/admin/src/app/(admin)/actions/page.tsx`, `_client.tsx`
  - Detail: `apps/admin/src/app/(admin)/actions/[actionId]/page.tsx`, `_client.tsx`
  - New: `apps/admin/src/app/(admin)/actions/new/page.tsx`, `_client.tsx`
  - Edit: `apps/admin/src/app/(admin)/actions/[actionId]/edit/page.tsx`, `_client.tsx`
  - 그룹 필터링: crud, visibility, workflow, bulk
- [x] Subject 페이지 (2개) - 신규 생성 (2026-02-14)
  - List: `apps/admin/src/app/(admin)/subjects/page.tsx`, `_client.tsx`
  - Detail: `apps/admin/src/app/(admin)/subjects/[subjectId]/page.tsx`, `_client.tsx`
  - Entity 그룹 Subject는 DMMF 필드 목록 표시
- [x] 타입 에러 수정 완료 (2026-02-14)

### Stage 6: E2E 검증 ✅ COMPLETE
- [x] 프론트엔드 E2E 테스트 (Playwright) - 4개 파일 생성 (2026-02-14)
  - `apps/e2e/tests/admin/role-management.spec.ts` (E2E-001, E2E-002, E2E-004, E2E-005)
    - 역할 CRUD 전체 플로우, Grant 배치 할당, 시스템 역할 보호, 조회 권한 제한
  - `apps/e2e/tests/admin/ability-management.spec.ts` (E2E-003, E2E-006)
    - 권한 정의 CRUD, Subject/Action 선택, inverted 거부 규칙
  - `apps/e2e/tests/admin/action-management.spec.ts` (E2E-007)
    - Action CRUD, 시스템 Action 보호, 이름 패턴 검증
  - `apps/e2e/tests/admin/subject-management.spec.ts` (E2E-008)
    - Subject 목록/상세, entity vs non-entity 필드 조회, 그룹 필터링

## 페이지 목록
| 페이지 | 경로 | Stage 4-5 |
|--------|------|-----------|
| RoleList | /roles | ✅ (기존) |
| RoleDetail | /roles/[roleId] | ✅ (Grant 배치 할당 추가) |
| RoleNew | /roles/new | ✅ (기존) |
| RoleEdit | /roles/[roleId]/edit | ✅ (기존) |
| AbilityList | /abilities | ✅ |
| AbilityDetail | /abilities/[abilityId] | ✅ |
| AbilityNew | /abilities/new | ✅ |
| AbilityEdit | /abilities/[abilityId]/edit | ✅ |
| ActionList | /actions | ✅ |
| ActionDetail | /actions/[actionId] | ✅ |
| ActionNew | /actions/new | ✅ |
| ActionEdit | /actions/[actionId]/edit | ✅ |
| SubjectList | /subjects | ✅ |
| SubjectDetail | /subjects/[subjectId] | ✅ |
