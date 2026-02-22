# Admin 앱 기획서

> 생성일: 2026-02-18
> 타입: app
> 앱: admin

## L0: 시스템 컨텍스트

Admin 앱은 플랫폼의 관리자 콘솔입니다. 회원, 예약, 알림, 콘텐츠, 권한 등 플랫폼 전반의 리소스를 관리하기 위한 웹 애플리케이션입니다.

- **프레임워크**: Next.js (App Router)
- **UI**: HeroUI + Tailwind CSS (다크 모드 기본)
- **상태 관리**: MobX
- **API**: Orval 자동 생성 React Query 훅
- **레이아웃**: AdminLayout (데스크톱: Header + Sidebar, 모바일: Header + BottomTab + FAB)
- **인증**: JWT + X-Space-ID 헤더 기반 Multi-Tenancy
- **브랜드**: "플레이트" (AppLogo)

## L1: 사용자 (Actor)

| ID | Actor | 역할 | 설명 |
|----|-------|------|------|
| ACT-001 | 플랫폼 관리자 | FULL_ACCESS | 전체 시스템 접근 권한. System Space에서 모든 Space의 데이터를 조회/관리 |
| ACT-002 | Space 관리자 | MANAGE | 특정 Space 내의 리소스를 관리. 회원, 예약, 콘텐츠, 알림 등 운영 업무 담당 |
| ACT-003 | 조회자 | VIEW | 특정 Space 내의 리소스를 조회만 가능. 수정/삭제 권한 없음 |

## L2: 사용자 목표 (Goal)

| ID | Actor | 목표 | 우선순위 |
|----|-------|------|----------|
| GOAL-001 | ACT-001, ACT-002 | 회원을 목록 조회/검색/등록/수정/삭제하여 관리한다 | 높음 |
| GOAL-002 | ACT-001, ACT-002 | 역할(Role), 권한(Ability), 액션(Action), 대상(Subject)을 정의하여 접근 제어를 관리한다 | 높음 |
| GOAL-003 | ACT-001, ACT-002 | 역할 그룹(Group)과 카테고리(Category)를 관리하여 역할을 체계적으로 분류한다 | 중간 |
| GOAL-004 | ACT-001, ACT-002 | 메시지 템플릿(SMS, 이메일, 푸시, HTML)을 생성/관리한다 | 중간 |
| GOAL-005 | ACT-001, ACT-002 | 대시보드에서 주요 지표를 한눈에 확인한다 | 높음 |
| GOAL-006 | ACT-001 | IDP(Identity Provider) 관리 콘솔에 접근하여 인증 설정을 관리한다 | 낮음 |
| GOAL-008 | ACT-001, ACT-002 | Space를 전환하여 다른 Space의 데이터를 관리한다 | 높음 |
| GOAL-009 | ACT-001, ACT-002 | 타임라인(Timeline)을 생성/수정/삭제하여 학기나 시즌을 구조화한다 | 높음 |
| GOAL-010 | ACT-001, ACT-002 | 타임라인 내 세션(Session)을 등록/수정/삭제하여 수업 일정을 관리한다 | 높음 |
| GOAL-011 | ACT-001, ACT-002 | 운동 종목(Exercise)을 등록/목록 조회/상세 확인/수정/삭제하여 루틴 구성의 기반 콘텐츠를 관리한다 | 높음 |
| GOAL-012 | ACT-001 | 시설(Ground)을 등록/목록 조회/상세 조회/수정하여 Space와 연결되는 물리적 시설을 관리한다 | 높음 |
| GOAL-013 | ACT-001, ACT-002 | 세션 내 프로그램(Program)을 등록/수정/삭제하여 강사·루틴·정원을 포함한 실제 수업 클래스를 관리한다 | 높음 |
| GOAL-014 | ACT-001, ACT-002, ACT-003 | 에셋을 목록 조회/검색/필터링하고 권한에 따라 미리보기·다운로드·삭제를 수행하여 운영 리소스를 관리한다 | 높음 |

## 도메인 목록

| 도메인 | 경로 | 설명 | 구현 상태 |
|--------|------|------|-----------|
| 대시보드 | `/dashboard` | 주요 지표 대시보드 | 폴더 존재 |
| 시설 (Grounds) | `/grounds` | 시설(Ground) CRUD 관리. Space를 구체화하는 물리적 시설 (이름, 주소, 사업자번호 등) | 기획 중 |
| 회원 (Users) | `/users` | 회원 CRUD 관리 | 목록 구현 완료, 상세/등록/수정 TODO |
| 역할 (Roles) | `/roles` | 역할 정의 및 관리 | 구현 중 |
| 역할 그룹 | `/roles/groups` | 역할 그룹 관리 | 구현 중 |
| 역할 카테고리 | `/roles/categories` | 역할 카테고리 관리 | 구현 중 |
| 권한 정의 (Abilities) | `/abilities` | 권한(Ability) CRUD 관리 | 구현 중 |
| 액션 (Actions) | `/actions` | 액션 CRUD 관리 | 구현 중 |
| 대상 (Subjects) | `/subjects` | 대상 조회 관리 | 구현 중 |
| 템플릿 (Templates) | `/templates` | 메시지 템플릿 관리 | 구현 완료 |
| 루틴 (Routines) | `/routines` | 운동 루틴(커리큘럼) CRUD 관리 | 기획 완료, 구현 TODO |
| 운동 종목 (Exercises) | `/exercises` | 운동 종목 CRUD 관리. Task와 1:1 연결 | 기획 완료, 구현 TODO |
| 에셋 (Assets) | `/assets` | 업로드된 에셋 목록 조회/검색/필터링, 미리보기/다운로드, 삭제 및 일괄 삭제 관리 | 기획 완료, 구현 TODO |
| 타임라인 (Timelines) | `/timelines` | 학기/시즌 타임라인 관리 | 기획 중 |
| 세션 (Sessions) | `/timelines/[timelineId]/sessions` | 세션 일정 관리 (타임라인 하위) | 기획 중 |
| 프로그램 (Programs) | `/timelines/[timelineId]/sessions/[sessionId]/programs` | 수업 프로그램 관리 (세션 하위) - 강사·루틴·정원 연결 | 기획 중 |

## Ground 도메인 맥락

Ground는 Space를 구체화하는 물리적 시설입니다. Space 자체는 추상 컨테이너(id만 존재)이고, Ground가 실제 비즈니스 의미(이름, 주소, 사업자번호 등)를 부여합니다.

```
Space (추상) ◄─── Ground (구체화: name, address, phone, email, businessNo)
  │
  ├─── Timeline (학기/시즌)
  ├─── Routine (커리큘럼)
  └─── Task/Exercise (운동)
```

- Ground와 Space는 1:1 관계입니다
- Ground 등록 시 새 Space가 자동으로 함께 생성됩니다 (서버에서 처리)
- FULL_ACCESS 역할만 시설 등록/수정이 가능합니다 (플랫폼 관리자 전용)
- `businessNo`(사업자등록번호)는 유니크하며 한 번 등록 후 변경 불가합니다

## Program 도메인 맥락

Program은 Session에 배치되는 실제 수업 클래스입니다. 강사(instructorId), 루틴(routineId), 세션(sessionId)을 연결합니다.

```
Timeline (학기/시즌)
  │
  └─── Session (수업 일정)
         │
         └─── Program (실제 클래스: 강사 + 루틴 + 정원)
                │
                ├─── Routine (커리큘럼)
                └─── instructorId (강사 User)
```

- Session을 만들어도 Program을 배치해야 실제 수업이 됩니다
- 한 세션에 같은 루틴을 중복 배치할 수 없습니다 (`@@unique([sessionId, routineId])`)
- Program은 독립 메뉴 없이 세션 상세 페이지 내에서 관리됩니다

## 레이아웃 구조

```
AdminLayout
├── Header
│   ├── AppLogo ("플레이트", LayoutGrid 아이콘)
│   ├── IDP 관리 버튼 (KeyRound 아이콘, 새 탭으로 IDP Client 열기)
│   └── HeaderSpaceSelector (Space 전환)
├── Sidebar (데스크톱) / BottomTab (모바일)
│   └── ADMIN_NAV_ITEMS 기반 메뉴 트리
├── Main Content
│   └── {children} (각 페이지)
└── FAB (모바일, 빠른 액션)
```

## 인증/인가 흐름

1. JWT 토큰으로 인증 (Authorization 헤더)
2. X-Space-ID 헤더로 현재 Space 지정 (필수)
3. Space 미선택 시 `/select-space`로 리다이렉트 (useSpaceGuard)
4. PersistStore에 선택된 Space ID/이름 저장
5. 로그아웃 시 PersistStore 초기화 후 `/admin/auth/login`으로 이동

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | Timeline/Session 도메인 추가, GOAL-009/010 추가 | req-L0L2-planner |
| 2026-02-19 | Exercise 도메인 추가 (GOAL-011), 도메인 목록에 운동 종목 항목 추가 | req-L0L2-planner |
| 2026-02-19 | Ground 도메인 추가 (GOAL-012, 도메인 목록, Ground 맥락 섹션) | req-L0L2-planner |
| 2026-02-19 | Program 도메인 추가 (GOAL-013), 도메인 목록에 세션/프로그램 항목 추가, Program 맥락 섹션 추가 | orch-requirement |
| 2026-02-20 | 삭제된 self-service 페이지(`/my-sessions`, `/my-account/change-password`) 관련 항목 정리 | OpenCode |
| 2026-02-22 | 에셋 도메인 초안 추가 (GOAL-014, 도메인 목록 항목 추가) | orch-requirement |
| 2026-02-22 | 도메인 명칭 오기 정정: GOAL-014 및 도메인 목록을 Asset(`/assets`) 기준으로 수정 | OpenCode |
