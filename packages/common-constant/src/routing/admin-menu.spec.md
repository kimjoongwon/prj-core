# Admin Menu 기획서

> 생성일: 2026-02-26
> 타입: menu
> 위치: packages/common-constant/src/routing/admin-menu.ts

## 역할

Admin 앱의 전역 네비게이션 메뉴 구조를 정의합니다. 데스크톱 Sidebar와 모바일 BottomTab에서 사용하는 메뉴 아이템, 경로, Subject, 아이콘을 관리합니다.

## 메뉴 구조

```
Admin
├── 대시보드 (/dashboard)
├── 회원 (/users)
│   └── 회원 목록 (/users)
├── 시설 관리
│   └── 시설 (/spaces)
├── 일정 관리
│   └── 타임라인 (/timelines)
├── 운동 관리
│   ├── 운동 종목 (/tasks)
│   └── 루틴 (/routines)
├── 템플릿
│   └── 템플릿 목록 (/templates)
├── 에셋 (/assets)
│   └── 에셋 목록 (/assets)
├── 문의 관리 (/inquiries)
│   └── 문의 목록 (/inquiries)
└── 권한 관리
    ├── 역할 (/roles)
    ├── 역할 그룹 (/roles/groups)
    ├── 역할 카테고리 (/roles/categories)
    ├── 권한 정의 (/abilities)
    ├── 액션 (/actions)
    └── 대상 (/subjects)
```

## 경로 정의 (ADMIN_PATHS)

| 카테고리 | 상수명 | 경로 | 설명 |
|----------|--------|------|------|
| 대시보드 | DASHBOARD | /dashboard | 메인 대시보드 |
| 회원 | USERS | /users | 회원 목록 |
| 회원 | USERS_DETAIL | /users/[userId] | 회원 상세 |
| 역할 | ROLES | /roles | 역할 목록 |
| 역할 | ROLES_NEW | /roles/new | 역할 등록 |
| 역할 | ROLES_DETAIL | /roles/[roleId] | 역할 상세 |
| 역할 | ROLES_EDIT | /roles/[roleId]/edit | 역할 수정 |
| 역할 그룹 | ROLE_GROUPS | /roles/groups | 역할 그룹 목록 |
| 역할 그룹 | ROLE_GROUPS_NEW | /roles/groups/new | 역할 그룹 등록 |
| 역할 그룹 | ROLE_GROUPS_DETAIL | /roles/groups/[groupId] | 역할 그룹 상세 |
| 역할 그룹 | ROLE_GROUPS_EDIT | /roles/groups/[groupId]/edit | 역할 그룹 수정 |
| 역할 카테고리 | ROLE_CATEGORIES | /roles/categories | 역할 카테고리 목록 |
| 역할 카테고리 | ROLE_CATEGORIES_NEW | /roles/categories/new | 역할 카테고리 등록 |
| 역할 카테고리 | ROLE_CATEGORIES_DETAIL | /roles/categories/[categoryId] | 역할 카테고리 상세 |
| 역할 카테고리 | ROLE_CATEGORIES_EDIT | /roles/categories/[categoryId]/edit | 역할 카테고리 수정 |
| 권한 정의 | ABILITIES | /abilities | 권한 정의 목록 |
| 권한 정의 | ABILITIES_NEW | /abilities/new | 권한 정의 등록 |
| 권한 정의 | ABILITIES_DETAIL | /abilities/[abilityId] | 권한 정의 상세 |
| 권한 정의 | ABILITIES_EDIT | /abilities/[abilityId]/edit | 권한 정의 수정 |
| 액션 | ACTIONS | /actions | 액션 목록 |
| 액션 | ACTIONS_NEW | /actions/new | 액션 등록 |
| 액션 | ACTIONS_DETAIL | /actions/[actionId] | 액션 상세 |
| 액션 | ACTIONS_EDIT | /actions/[actionId]/edit | 액션 수정 |
| 대상 | SUBJECTS | /subjects | 대상 목록 |
| 대상 | SUBJECTS_DETAIL | /subjects/[subjectId] | 대상 상세 |
| 타임라인 | TIMELINES | /timelines | 타임라인 목록 |
| 타임라인 | TIMELINES_NEW | /timelines/new | 타임라인 등록 |
| 타임라인 | TIMELINES_DETAIL | /timelines/[timelineId] | 타임라인 상세 |
| 타임라인 | TIMELINES_EDIT | /timelines/[timelineId]/edit | 타임라인 수정 |
| 세션 | TIMELINE_SESSIONS_NEW | /timelines/[timelineId]/sessions/new | 세션 등록 |
| 세션 | TIMELINE_SESSIONS_DETAIL | /timelines/[timelineId]/sessions/[sessionId] | 세션 상세 |
| 세션 | TIMELINE_SESSIONS_EDIT | /timelines/[timelineId]/sessions/[sessionId]/edit | 세션 수정 |
| 시설 | SPACES | /spaces | 시설 목록 |
| 시설 | SPACES_NEW | /spaces/new | 시설 등록 |
| 시설 | SPACES_DETAIL | /spaces/[spaceId]/ground | 시설 상세 |
| 시설 | SPACES_EDIT | /spaces/[spaceId]/ground/edit | 시설 수정 |
| 운동 종목 | TASKS | /tasks | 운동 종목 목록 |
| 운동 종목 | TASKS_NEW | /tasks/new | 운동 종목 등록 |
| 운동 종목 | TASKS_DETAIL | /tasks/[taskId]/exercise | 운동 종목 상세 |
| 운동 종목 | TASKS_EDIT | /tasks/[taskId]/exercise/edit | 운동 종목 수정 |
| 루틴 | ROUTINES | /routines | 루틴 목록 |
| 루틴 | ROUTINES_NEW | /routines/new | 루틴 등록 |
| 루틴 | ROUTINES_DETAIL | /routines/[routineId] | 루틴 상세 |
| 루틴 | ROUTINES_EDIT | /routines/[routineId]/edit | 루틴 수정 |
| 템플릿 | TEMPLATES | /templates | 템플릿 목록 |
| 템플릿 | TEMPLATES_NEW | /templates/new | 템플릿 등록 |
| 템플릿 | TEMPLATES_DETAIL | /templates/[templateId] | 템플릿 상세 |
| 템플릿 | TEMPLATES_EDIT | /templates/[templateId]/edit | 템플릿 수정 |
| 에셋 | ASSETS | /assets | 에셋 목록 |
| 에셋 | ASSETS_DETAIL | /assets/[assetId] | 에셋 상세 |
| 문의 | INQUIRIES | /inquiries | 문의 목록 |
| 문의 | INQUIRIES_NEW | /inquiries/new | 문의 접수 |
| 문의 | INQUIRIES_DETAIL | /inquiries/[inquiryId] | 문의 상세 |
| 문의 | INQUIRIES_EDIT | /inquiries/[inquiryId]/edit | 문의 수정 |
| 인증 | AUTH_LOGIN | /auth/login | 로그인 |

## Subject 정의 (ADMIN_SUBJECTS)

### 1Depth 메뉴

| 상수명 | 값 | 설명 |
|--------|------|------|
| MENU_DASHBOARD | menu:dashboard | 대시보드 |
| MENU_USERS | menu:users | 회원 |
| MENU_SPACES | menu:spaces | 시설 관리 |
| MENU_TIMELINES | menu:timelines | 일정 관리 |
| MENU_TASKS | menu:tasks | 운동 관리 |
| MENU_ROUTINES | menu:routines | 루틴 |
| MENU_TEMPLATES | menu:templates | 템플릿 |
| MENU_ASSETS | menu:assets | 에셋 |
| MENU_INQUIRIES | menu:inquiries | 문의 관리 |
| MENU_ROLES | menu:roles | 권한 관리 |

### 2Depth 메뉴

| 상수명 | 값 | 설명 |
|--------|------|------|
| MENU_USERS_LIST | menu:users:list | 회원 목록 |
| MENU_SPACES_LIST | menu:spaces:list | 시설 |
| MENU_TIMELINES_LIST | menu:timelines:list | 타임라인 |
| MENU_TASKS_LIST | menu:tasks:list | 운동 종목 |
| MENU_ROUTINES_LIST | menu:routines:list | 루틴 |
| MENU_TEMPLATES_LIST | menu:templates:list | 템플릿 목록 |
| MENU_ASSETS_LIST | menu:assets:list | 에셋 |
| MENU_INQUIRIES_LIST | menu:inquiries:list | 문의 목록 |
| MENU_ROLES_LIST | menu:roles:list | 역할 |
| MENU_ROLE_GROUPS | menu:role-groups | 역할 그룹 (1depth) |
| MENU_ROLE_GROUPS_LIST | menu:role-groups:list | 역할 그룹 |
| MENU_ROLE_CATEGORIES | menu:role-categories | 역할 카테고리 (1depth) |
| MENU_ROLE_CATEGORIES_LIST | menu:role-categories:list | 역할 카테고리 |
| MENU_ABILITIES | menu:abilities | 권한 정의 (1depth) |
| MENU_ABILITIES_LIST | menu:abilities:list | 권한 정의 |
| MENU_ACTIONS | menu:actions | 액션 (1depth) |
| MENU_ACTIONS_LIST | menu:actions:list | 액션 |
| MENU_SUBJECTS | menu:subjects | 대상 (1depth) |
| MENU_SUBJECTS_LIST | menu:subjects:list | 대상 |

## 네비게이션 아이템 (ADMIN_NAV_ITEMS)

| ID | 라벨 | 아이콘 | 경로 | Subject | 자식 수 |
|----|------|--------|------|---------|---------|
| dashboard | 대시보드 | LayoutDashboard | /dashboard | menu:dashboard | 0 |
| users | 회원 | Users | /users | menu:users | 1 |
| spaces | 공간 관리 | Building2 | - | menu:spaces | 1 |
| timelines | 일정 관리 | CalendarDays | - | menu:timelines | 1 |
| tasks | 태스크 관리 | Dumbbell | - | menu:tasks | 2 |
| templates | 템플릿 | Mail | - | menu:templates | 1 |
| assets | 에셋 | Images | /assets | menu:assets | 1 |
| inquiries | 문의 관리 | MessageCircleQuestionMark | /inquiries | menu:inquiries | 1 |
| roles | 권한 관리 | Shield | - | menu:roles | 6 |

## 메뉴 권한 편집 카탈로그

### `ADMIN_MENU_PERMISSION_LEAFS`

| 필드 | 설명 |
|------|------|
| groupId / groupLabel | 메뉴 권한 편집기에서 묶는 1depth 그룹 |
| groupSubject | 부모 메뉴 노출에 필요한 `menu:*` subject |
| leafId / leafLabel | 실제 편집 단위인 leaf menu |
| leafSubject | leaf menu 자체의 canonical subject |
| requiredSubjects | 실제 메뉴 표시 판정에 필요한 subject 집합. child가 있는 경우 parent + child를 모두 포함 |
| path | leaf가 연결되는 admin 화면 경로 |

### `ADMIN_MENU_PERMISSION_SUBJECTS`

- `ADMIN_MENU_PERMISSION_LEAFS` 의 `requiredSubjects` 를 평탄화한 유니크 subject 목록입니다.
- 역할 상세 페이지의 drift 진단에서 "catalog에 존재해야 하는 menu subject 집합" 기준으로 사용합니다.

## BottomTab 구성 (BOTTOM_TAB_IDS)

| 순서 | ID | 라벨 |
|------|------|------|
| 1 | dashboard | 대시보드 |
| 2 | users | 회원 |
| 3 | inquiries | 문의 |
| 4 | more | 더보기 |

## 아이콘 매핑

| 메뉴 | Lucide 아이콘 | 설명 |
|------|---------------|------|
| 대시보드 | LayoutDashboard | 대시보드 레이아웃 |
| 회원 | Users | 사용자 그룹 |
| 공간 관리 | Building2 | 건물 |
| 일정 관리 | CalendarDays | 달력 |
| 태스크 관리 | Dumbbell | 덤벨 |
| 템플릿 | Mail | 메일 |
| 에셋 | Images | 겹쳐진 이미지 |
| 문의 관리 | MessageCircleQuestionMark | 말풍선 + 물음표 |
| 권한 관리 | Shield | 방패 |

## 비즈니스 규칙

- 모든 경로는 동적 파라미터에 전체 엔티티명 사용 (예: `[userId]`, `[inquiryId]`)
- Subject는 `menu:` 접두어로 시작
- `ADMIN_NAV_ITEMS` 는 각 admin route 폴더의 `route.meta.ts` generated catalog를 직접 사용합니다.
- `ADMIN_NAV_ITEMS` 는 generated catalog에 `scopeKind`를 병합해 현재 tenant `FULL_ACCESS` 여부에 따라 재사용 가능한 노출 정책을 제공합니다.
- 1depth 메뉴는 하위 메뉴가 있을 경우 path 없이 children만 정의
- 1depth 메뉴가 단일 페이지면 path 포함 (예: 문의 관리)
- 메뉴 권한 편집은 `ADMIN_NAV_ITEMS` 를 직접 수정하지 않고 `ADMIN_MENU_PERMISSION_LEAFS` 파생 결과를 사용
- child leaf가 있는 메뉴는 parent subject와 child subject가 모두 있어야 실제 sidebar/mobile 메뉴가 노출됩니다
- `templates`, `abilities`, `actions`, `subjects` 계열은 `global-full-access-only`로 분류하고, 나머지 운영 화면은 기본적으로 `space` scope를 사용합니다.

## 구현 체크리스트

- [x] ADMIN_PATHS 상수 정의
- [x] ADMIN_SUBJECTS 상수 정의
- [x] ADMIN_NAV_ITEMS 배열 정의
- [x] BOTTOM_TAB_IDS 배열 정의
- [x] 문의(Inquiry) 메뉴 추가
- [x] 에셋 메뉴 추가 (경로/Subject/Sidebar)
- [ ] TypeScript 타입 검증

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | generated admin nav에 `scopeKind`를 병합해 현재 tenant FULL_ACCESS 기준 메뉴 노출 정책을 추가 | codex |
| 2026-04-07 | 전체 admin route meta rollout 이후 `ADMIN_NAV_ITEMS` 를 generated-only SOT로 전환 | codex |
| 2026-04-07 | `route.meta.ts` generated nav catalog를 수동 `ADMIN_NAV_ITEMS` 에 merge하는 점진 이행 규칙 추가 | codex |
| 2026-04-06 | 역할 상세 메뉴 권한 편집기용 `ADMIN_MENU_PERMISSION_LEAFS`, `ADMIN_MENU_PERMISSION_SUBJECTS` 계약과 parent+child required subject 규칙을 문서화 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-26 | 초기 생성 (기존 admin-menu.ts 역기획) | orch-screen-planner |
| 2026-02-26 | 문의(Inquiry) 메뉴 추가 (INQUIRIES, INQUIRIES_NEW, INQUIRIES_DETAIL) | orch-screen-planner |
| 2026-02-26 | 문의를 BottomTab에 추가 (users, inquiries 순서) | orch-screen-planner |
| 2026-03-01 | 문의 수정 경로 `INQUIRIES_EDIT` 추가 | codex |
| 2026-03-04 | 에셋 메뉴/경로/Subject 추가, Sidebar 노출 | fe-menu-builder |
| 2026-03-08 | Lucide registry 경고 제거를 위해 문의 메뉴 아이콘명을 canonical 이름으로 교체 | codex |
