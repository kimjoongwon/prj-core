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
| GOAL-007 | ACT-001, ACT-002, ACT-003 | 자신의 세션을 관리하고 비밀번호를 변경한다 | 중간 |
| GOAL-008 | ACT-001, ACT-002 | Space를 전환하여 다른 Space의 데이터를 관리한다 | 높음 |

## 도메인 목록

| 도메인 | 경로 | 설명 | 구현 상태 |
|--------|------|------|-----------|
| 대시보드 | `/dashboard` | 주요 지표 대시보드 | 폴더 존재 |
| 회원 (Users) | `/users` | 회원 CRUD 관리 | 목록 구현 완료, 상세/등록/수정 TODO |
| 역할 (Roles) | `/roles` | 역할 정의 및 관리 | 구현 중 |
| 역할 그룹 | `/roles/groups` | 역할 그룹 관리 | 구현 중 |
| 역할 카테고리 | `/roles/categories` | 역할 카테고리 관리 | 구현 중 |
| 권한 정의 (Abilities) | `/abilities` | 권한(Ability) CRUD 관리 | 구현 중 |
| 액션 (Actions) | `/actions` | 액션 CRUD 관리 | 구현 중 |
| 대상 (Subjects) | `/subjects` | 대상 조회 관리 | 구현 중 |
| 템플릿 (Templates) | `/templates` | 메시지 템플릿 관리 | 구현 완료 |
| 내 세션 | `/my-sessions` | 로그인 세션 관리 | 폴더 존재 |
| 내 계정 | `/my-account` | 비밀번호 변경 등 | 폴더 존재 |

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
