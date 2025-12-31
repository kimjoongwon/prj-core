# AdminLayout & MenuSystem 화면 기획서

**플랫폼:** Admin Web
**최종 수정일:** 2026-01-01
**버전:** 2.0

---

## 개정 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2025-12-30 | 초안 작성 |
| 2.0 | 2026-01-01 | 코드베이스 분석 후 전면 개정 - 네이밍 규칙 수정, 기존 컴포넌트 활용 현황 추가, 현재 구현 구조 반영 |

### 주요 변경 사항 (v2.0)

1. **네이밍 규칙 준수**: `AdminHeader`, `AdminSidebar`, `AdminLayout` -> 범용 이름 사용 (기존 컴포넌트 활용)
2. **기존 컴포넌트 활용 현황 추가**: 이미 구현된 컴포넌트 목록 정리
3. **현재 레이아웃 구조 반영**: 좌측 사이드바 -> 상단 Nav + SubNav 구조
4. **에이전트 문서 참조 추가**: 신규 컴포넌트에 해당 에이전트 문서 참조 명시
5. **구현 완료 확인 체크리스트 추가**

---

## 1. 화면 개요

### 목적

엔터프라이즈급 멀티테넌트 어드민 시스템의 전체 레이아웃과 메뉴 시스템을 제공합니다.

**현재 구현된 구조 (상단 Nav + SubNav):**
- **Header**: 상단 헤더
  - 왼쪽: 로고 (AppLogo) - 클릭 시 첫 번째 메뉴로 이동
  - 중앙: 메인 네비게이션 (Nav) - 주요 메뉴 (회원, 예약, 알림 등)
  - 오른쪽: 컨텍스트 셀렉터 (ContextSelector) + 유저 아바타 (UserMenu)
  - 하단: 서브 네비게이션 (SubNav) - 선택된 메뉴의 하위 메뉴
- **Main**: 페이지 콘텐츠 영역

### 진입 조건

- Space 선택 완료 (PersistStore에 spaceId 저장됨)
- 관리자 인증 완료
- 어드민 페이지 접근 시 (`/(admin)/*` 경로)

### 이탈 조건

- 로그아웃
- Space 재선택

---

## 2. 화면 구조

### 레이아웃 (Admin Web) - 현재 구현 구조

```
+-------------------------------------------------------------------------+
|  [Logo]      [회원] [예약] [알림] [문의] [콘텐츠] [템플릿] [설정]  [Space] [Avatar] |  <- Header
+-------------------------------------------------------------------------+
|  [회원 목록] [회원 등급 관리] [탈퇴 회원]                                     |  <- SubNav
+-------------------------------------------------------------------------+
|                                                                         |
|                                                                         |
|                         페이지 콘텐츠 영역                                 |
|                                                                         |
|                                                                         |
+-------------------------------------------------------------------------+
```

**아바타 클릭 시:**
```
+--------------+
| 관리자        |
| 최고 관리자    |
+--------------+
| 로그아웃      |
+--------------+
```

### 컴포넌트 구성 (기존 컴포넌트 활용)

| 영역 | 컴포넌트 | 유형 | 위치 | 구현 상태 |
|------|----------|------|------|----------|
| Layout 루트 | AppLayout | layouts | `packages/ui/.../layouts/AppLayout` | 완료 |
| Layout 전체 | PageLayout | layouts | `packages/ui/.../layouts/PageLayout` | 완료 |
| Header 전체 | Header | layouts | `packages/ui/.../layouts/Header` | 완료 |
| Header > left | AppLogo | feature | `packages/ui/.../feature/Logo` | 완료 |
| Header > center | Nav | feature | `packages/ui/.../feature/Nav` | 완료 |
| Header > right | ContextSelector | feature | `packages/ui/.../feature/ContextSelector` | 완료 |
| Header > right | UserMenu | feature | `packages/ui/.../feature/UserMenu` | 완료 |
| Header > bottom | SubNav | feature | `packages/ui/.../feature/SubNav` | 완료 |

---

## 3. 기존 컴포넌트 활용 현황 (중요)

### 이미 구현된 Layout 컴포넌트

| 컴포넌트 | 용도 | 경로 | 구현 상태 |
|----------|------|------|----------|
| AppLayout | 루트 body 래퍼 (children만) | `packages/ui/src/components/layouts/AppLayout/AppLayout.tsx` | 완료 |
| PageLayout | 페이지 전체 구조 (header, leftAside, rightAside, footer) | `packages/ui/src/components/layouts/PageLayout/PageLayout.tsx` | 완료 |
| SectionLayout | 페이지 내부 구역 (top, left, right, bottom) | `packages/ui/src/components/layouts/SectionLayout/SectionLayout.tsx` | 완료 |
| Header | 헤더 영역 (left, center, right, bottom) | `packages/ui/src/components/layouts/Header/Header.tsx` | 완료 |
| Main | 메인 콘텐츠 | `packages/ui/src/components/layouts/Main/Main.tsx` | 완료 |

### 이미 구현된 Feature 컴포넌트

| 컴포넌트 | 용도 | 경로 | 구현 상태 |
|----------|------|------|----------|
| AppLogo | 로고 + 클릭 시 첫 메뉴 이동 | `packages/ui/src/components/feature/Logo/Logo.tsx` | 완료 |
| Nav | 메인 네비게이션 (MenuStore 사용) | `packages/ui/src/components/feature/Nav/Nav.tsx` | 완료 |
| SubNav | 하위 네비게이션 (MenuStore 사용) | `packages/ui/src/components/feature/SubNav/SubNav.tsx` | 완료 |
| ContextSelector | Space 변경 (PersistStore 사용) | `packages/ui/src/components/feature/ContextSelector/ContextSelector.tsx` | 완료 |
| UserMenu | 사용자 메뉴 + 로그아웃 (AuthStore, PersistStore 사용) | `packages/ui/src/components/feature/UserMenu/UserMenu.tsx` | 완료 |
| CollapsibleSidebar | 접을 수 있는 사이드바 | `packages/ui/src/components/feature/CollapsibleSidebar/CollapsibleSidebarLayout.tsx` | 완료 |

### 이미 구현된 Store

| Store | 용도 | 경로 | 구현 상태 |
|-------|------|------|----------|
| MenuStore | 메뉴 상태 관리, 권한 필터링, 현재 메뉴 선택 | `packages/store/src/stores/menuStore.ts` | 완료 |
| Menu (클래스) | 메뉴 데이터 모델 | `packages/store/src/stores/menu.ts` | 완료 |
| PersistStore | 영속 데이터 (Space 정보 등) | `packages/store/...` | 완료 |
| AuthStore | 인증 상태, 로그아웃 | `packages/store/...` | 완료 |

### 이미 구현된 CASL 훅

| 훅 | 용도 | 경로 | 구현 상태 |
|----|------|------|----------|
| useAbility | 권한 체크 | `packages/hook/src/casl/AbilityContext.tsx` | 완료 |
| useMenuAccess | 메뉴 접근 권한 | `packages/hook/src/casl/useMenuAccess.ts` | 완료 |
| useFilteredMenus | 권한 필터링 메뉴 | `packages/hook/src/casl/useMenuAccess.ts` | 완료 |
| Can | 권한 기반 렌더링 | `packages/hook/src/casl/Can.tsx` | 완료 |

### 이미 구현된 메뉴 상수

| 상수 | 용도 | 경로 | 구현 상태 |
|------|------|------|----------|
| ADMIN_MENUS | 메뉴 설정 배열 | `packages/constant/src/routing/admin-menu.ts` | 완료 |
| ADMIN_PATHS | 경로 상수 | `packages/constant/src/routing/admin-menu.ts` | 완료 |
| ADMIN_SUBJECTS | Subject 상수 | `packages/constant/src/routing/admin-menu.ts` | 완료 |

---

## 4. 데이터 요구사항

### 메뉴 구조 정의 (기존 구현)

**위치:** `packages/constant/src/routing/admin-menu.ts`

```typescript
// 이미 구현된 인터페이스
export interface Menu {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  subject: string;
  children?: Menu[];
}
```

### CASL Subject 명명 규칙 (기존 상수 활용)

| Subject 패턴 | 설명 | 예시 |
|-------------|------|------|
| `menu:{domain}` | 주요 메뉴 접근 | `menu:members` |
| `menu:{domain}:{sub}` | 하위 메뉴 접근 | `menu:members:grades` |
| `feature:{name}` | 특정 기능 접근 | `feature:export` |
| `{Entity}` | 엔티티 CRUD | `User`, `Reservation` |

### 메뉴 데이터 구조 (기존 구현)

```typescript
// packages/constant/src/routing/admin-menu.ts
export const ADMIN_MENUS: Menu[] = [
  {
    id: "members",
    label: "회원",
    icon: "Users",
    subject: ADMIN_SUBJECTS.MENU_MEMBERS,
    children: [
      { id: "members-list", label: "회원 목록", path: "/members", subject: "..." },
      { id: "members-grade", label: "회원 등급 관리", path: "/members/grades", subject: "..." },
      { id: "members-withdrawn", label: "탈퇴 회원", path: "/members/withdrawn", subject: "..." },
    ],
  },
  // ... 예약, 알림, 문의, 콘텐츠, 템플릿, 설정
];
```

> **개선 필요:** 대시보드 메뉴 추가 필요 (하위 메뉴 없이 바로 이동)

### 상태 관리 (기존 Store 활용)

**MenuStore 주요 기능:**
```typescript
class MenuStore {
  // 권한 체크 함수 설정
  setAbilityChecker(checker: AbilityChecker): void;

  // 네비게이션 핸들러 설정
  setNavigateHandler(handler: (path: string) => void): void;

  // 권한 필터링된 메뉴
  get items(): Menu[];

  // 현재 선택된 메뉴
  get selectedMenu(): Menu | null;
  get selectedSubMenu(): Menu | null;

  // 선택된 메뉴의 하위 메뉴 목록
  get subMenuItems(): Menu[];

  // 현재 경로 기반 메뉴 활성화
  setCurrentPath(path: string): void;

  // 메뉴 선택
  selectMenu(menuId: string): void;
  selectSubMenu(subMenuId: string): void;
}
```

### 저장소에서 가져올 데이터

```typescript
// PersistStore (localStorage 기반)
persistStore.spaceId     // 현재 선택된 Space ID
persistStore.spaceName   // 현재 선택된 Space 이름

// sessionStorage
sessionStorage.getItem('adminRole')  // 관리자 역할
```

---

## 5. 인터랙션 정의

### 사용자 액션

| 액션 | 트리거 | 결과 | 담당 컴포넌트 |
|------|--------|------|--------------|
| **Header** | | | |
| 로고 클릭 | 로고 클릭 | 첫 번째 메뉴로 이동 | AppLogo |
| 메뉴 클릭 | Nav 메뉴 클릭 | 해당 메뉴의 첫 번째 하위 메뉴로 이동, SubNav 업데이트 | Nav |
| 하위 메뉴 클릭 | SubNav 메뉴 클릭 | 해당 페이지로 이동 | SubNav |
| Space 변경 | 컨텍스트 셀렉터 클릭 | Space 선택 페이지로 이동 | ContextSelector |
| 아바타 클릭 | 우측 상단 아바타 클릭 | 로그아웃 메뉴 표시 | UserMenu |
| 로그아웃 | 로그아웃 메뉴 클릭 | 인증 정보 제거, 로그인 페이지로 이동 | UserMenu |

### 상태 변화 흐름

```
페이지 진입 (예: /members/grades)
    |
    v
MenuProvider에서 MenuStore 초기화
    |
    v
useEffect에서 menuStore.setCurrentPath(pathname) 호출
    |
    v
MenuStore가 URL 기반으로 selectedMenu, selectedSubMenu 자동 설정
    |
    v
Nav에서 selectedMenu.active 기반 스타일 적용
SubNav에서 subMenuItems 렌더링
    |
    v
사용자가 Nav의 "예약" 클릭
    |
    v
Nav.handleClickMenu("reservations") 호출
    |
    v
menuStore.selectMenu("reservations")
  -> selectedMenu = reservations
  -> 첫 번째 하위 메뉴 (/reservations) 로 이동
  -> SubNav 업데이트
    |
    v
사용자가 SubNav의 "예약 캘린더" 클릭
    |
    v
SubNav.handleClickSubMenu("reservations-calendar") 호출
    |
    v
menuStore.selectSubMenu("reservations-calendar")
  -> selectedSubMenu = reservations-calendar
  -> /reservations/calendar 로 이동
```

---

## 6. UI 상세

### Header

**구현 컴포넌트:** `packages/ui/src/components/layouts/Header/Header.tsx`

**구성 요소:**
- `left`: AppLogo (로고 + 앱 이름)
- `center`: Nav (메인 네비게이션)
- `right`: ContextSelector + UserMenu
- `bottom`: SubNav (하위 네비게이션)

**스타일 (현재 구현):**
- 높이: 4rem (64px)
- 배경: `bg-background/70 backdrop-blur-md`
- 테두리: `border-b border-divider`
- HeroUI Navbar 컴포넌트 사용

### Nav

**구현 컴포넌트:** `packages/ui/src/components/feature/Nav/Nav.tsx`

**스타일:**
- 선택된 메뉴: `bg-primary text-primary-foreground`
- 미선택 메뉴: `text-foreground/70 hover:bg-default-100`
- 아이콘 + 라벨 표시

### SubNav

**구현 컴포넌트:** `packages/ui/src/components/feature/SubNav/SubNav.tsx`

**스타일:**
- 배경: `bg-background/50`
- 테두리: `border-t border-divider`
- 선택된 메뉴: `bg-default-200 text-foreground`
- 미선택 메뉴: `text-foreground/60 hover:bg-default-100`

### UserMenu 드롭다운

**구현 컴포넌트:** `packages/ui/src/components/feature/UserMenu/UserMenu.tsx`

**표시 정보:**
- 관리자 이름
- 역할 (예: "최고 관리자")
- 로그아웃 버튼

**동작:**
- HeroUI Dropdown 컴포넌트 사용
- 아바타 클릭 시 드롭다운 열림
- 로그아웃 클릭 시 PersistStore 초기화 + AuthStore 로그아웃

---

## 7. 신규 컴포넌트 필요 여부

### 결론: 레이아웃/메뉴 시스템은 신규 컴포넌트 불필요

현재 상단 Nav + SubNav 구조는 기존 컴포넌트로 완전히 구현되어 있습니다.

### 개선이 필요한 부분

| 항목 | 현재 상태 | 개선 내용 | 우선순위 |
|------|----------|----------|----------|
| 대시보드 메뉴 | ADMIN_MENUS에 없음 | 대시보드 메뉴 추가 (path: "/", 하위 없음) | 높음 |
| UserMenu 사용자 정보 | 하드코딩된 임시 데이터 | AuthStore에서 실제 사용자 정보 연동 | 중간 |
| 권한 연동 | MenuStore에 직접 ability 체커 설정 | AbilityProvider와 연동 자동화 | 중간 |

---

## 8. 개선 작업 요청

### 8.1 대시보드 메뉴 추가 요청

**파일:** `packages/constant/src/routing/admin-menu.ts`

**추가 내용:**
```typescript
// ADMIN_PATHS에 추가
DASHBOARD: "/",

// ADMIN_SUBJECTS에 추가
MENU_DASHBOARD: "menu:dashboard",

// ADMIN_MENUS 배열 맨 앞에 추가
{
  id: "dashboard",
  label: "대시보드",
  icon: "LayoutDashboard",
  path: "/",  // 하위 메뉴 없음 - 바로 이동
  subject: ADMIN_SUBJECTS.MENU_DASHBOARD,
  // children 없음
},
```

### 8.2 UserMenu 실제 사용자 정보 연동 요청

**파일:** `packages/ui/src/components/feature/UserMenu/UserMenu.tsx`

**현재 상태:**
```typescript
// 임시 사용자 정보 (추후 authStore에서 가져오도록 수정)
const user = {
  id: "1",
  name: "관리자",
  role: "최고 관리자",
  avatarUrl: undefined as string | undefined,
};
```

**수정 방향:**
- AuthStore에서 currentUser 정보 가져오기
- currentUser가 없으면 null 반환
- 로그인된 사용자 정보 표시

---

## 9. 좌측 사이드바 레이아웃 변형 (선택적)

현재는 상단 Nav + SubNav 구조이지만, 향후 좌측 사이드바 레이아웃이 필요한 경우:

### 변경 방법

**수정 파일:** `apps/admin/app/(admin)/layout.tsx`

**변경 내용:**
```tsx
// 현재 구조 (상단 Nav + SubNav)
<PageLayout
  header={
    <Header
      left={<AppLogo icon="LayoutGrid" text="Admin" />}
      center={<Nav />}
      right={<><ContextSelector /><UserMenu /></>}
      bottom={<SubNav />}
    />
  }
>
  {children}
</PageLayout>

// 변경 구조 (좌측 사이드바)
<PageLayout
  header={
    <Header
      left={<AppLogo icon="LayoutGrid" text="Admin" />}
      right={<><ContextSelector /><UserMenu /></>}
    />
  }
  leftAside={<SideNav />}  // 새 Feature 컴포넌트 필요
>
  {children}
</PageLayout>
```

### 필요 컴포넌트 (좌측 사이드바용)

**SideNav Feature 컴포넌트**

> **참조:** `.claude/agents/feature-builder.md`

**유형:** feature
**경로:** `packages/ui/src/components/feature/SideNav/SideNav.tsx`

**역할:**
- 2depth 아코디언/트리 형태의 네비게이션
- 하위 메뉴가 있는 항목: 클릭 시 펼침/접힘
- 하위 메뉴가 없는 항목: 클릭 시 바로 이동

**조합:**
- ui: VStack, Text
- inputs: Button
- HeroUI: Accordion
- 기존 CollapsibleSidebar 컴포넌트 활용 가능

**사용 Store:**
- MenuStore (items, selectedMenu, selectedSubMenu)

**핸들러:**
- handleClickMenu(menuId: string) -> menuStore.selectMenu(menuId)
- handleClickSubMenu(subMenuId: string) -> menuStore.selectSubMenu(subMenuId)

---

## 10. CASL 기반 권한 시스템

> **참조:** 상세 설계는 [CASL 권한 시스템 기획서](./2025-12-30-CASL-Permission-System.md) 참조

### 권한 체계 (기존 구현)

**위치:** `packages/hook/src/casl/AbilityContext.tsx`

```typescript
// AbilityProvider에서 rules 전달
<AbilityProvider rules={userRules}>
  {children}
</AbilityProvider>

// 기본 규칙 (SUPER_ADMIN - 모든 권한)
const defaultRules: AbilityRule[] = [{ action: "MANAGE", subject: "all" }];
```

### 메뉴 권한 제어 패턴

```tsx
// 방법 1: MenuStore의 items getter 사용 (자동 필터링)
// MenuStore에 abilityChecker가 설정되어 있으면 자동으로 필터링됨
const menuStore = useMenuStore();
menuStore.items; // 권한 필터링된 메뉴

// 방법 2: Can 컴포넌트 사용
<Can I="ACCESS" a="menu:members">
  <MenuItemLink menu={membersMenu} />
</Can>

// 방법 3: useFilteredMenus 훅 사용
const filteredMenus = useFilteredMenus(ADMIN_MENUS);
```

### 메뉴 확장성

향후 도메인별 메뉴 추가 시:
```typescript
// ADMIN_MENUS에 추가
{
  id: 'payments',
  label: '결제',
  icon: 'CreditCard',
  subject: 'menu:payments',
  children: [
    { id: 'payments-list', label: '결제 내역', path: '/payments', subject: 'menu:payments:list' },
    // ...
  ],
}
```

**새 메뉴 추가 시 체크리스트:**
1. `ADMIN_PATHS`에 경로 상수 추가
2. `ADMIN_SUBJECTS`에 Subject 상수 추가
3. `ADMIN_MENUS`에 메뉴 설정 추가
4. Subject DB에 해당 Subject 시드 데이터 추가 (권한 관리 페이지용)
5. 역할별 Ability 규칙 추가

---

## 11. 권한 관리 화면 기획 (설정 > 권한 관리)

> **경로:** `/settings/permissions`
> **Subject:** `menu:settings:permissions`
> **접근 권한:** SUPER_ADMIN만 접근 가능

### 화면 목적

관리자가 역할(Role)별로 메뉴, 엔티티, 기능에 대한 권한을 시각적으로 설정할 수 있는 화면입니다.

### 화면 레이아웃

```
+-------------------------------------------------------------------------+
|  권한 관리                                                               |
+-------------------------------------------------------------------------+
|                                                                         |
|  역할 선택: [ADMIN v]                              [초기화] [저장]       |
|                                                                         |
+-------------------------------------------------------------------------+
|  [메뉴 권한] [엔티티 권한] [기능 권한]  <- 탭                              |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------------------------------------------------------------+ |
|  |  메뉴 권한 (ACCESS)                                               | |
|  +-------------------------------------------------------------------+ |
|  |  메뉴                                              | 접근 허용    | |
|  +-------------------------------------------------------------------+ |
|  |  대시보드                                          |    [v]      | |
|  |  회원                                              |    [v]      | |
|  |     +- 회원 목록                                   |    [v]      | |
|  |     +- 회원 등급 관리                              |    [v]      | |
|  |     +- 탈퇴 회원                                   |    [ ]      | |
|  |  예약                                              |    [v]      | |
|  |  ...                                               |             | |
|  +-------------------------------------------------------------------+ |
|                                                                         |
|  참고: 상위 메뉴를 해제하면 하위 메뉴도 자동으로 해제됩니다.                   |
|                                                                         |
+-------------------------------------------------------------------------+
```

### 필요한 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/roles` | 역할 목록 조회 |
| GET | `/api/v1/subjects` | Subject 목록 조회 (트리 구조) |
| GET | `/api/v1/abilities/roles/:roleId` | 역할별 권한 목록 조회 |
| PUT | `/api/v1/abilities/roles/:roleId` | 역할 권한 일괄 업데이트 |

### 신규 컴포넌트 명세

---
**PermissionMatrix 컴포넌트를 만들어주세요.**

**유형:** feature
**참조:** `.claude/agents/feature-builder.md`
**경로:** `packages/ui/src/components/feature/PermissionMatrix/PermissionMatrix.tsx`

**역할:**
- 역할별 권한 매트릭스 표시 및 편집
- 메뉴/엔티티/기능 탭 지원
- 체크박스로 권한 토글
- 상위 메뉴 해제 시 하위 자동 해제

**조합:**
- ui: VStack, Text, HStack
- inputs: Checkbox, Tabs, Button
- HeroUI: Accordion, Table

**Props:**
- subjects: Subject[] (Subject 트리)
- abilities: Ability[] (현재 권한)
- type: 'menu' | 'entity' | 'feature'
- onChange: (subjectId: string, action: AbilityActions, enabled: boolean) => void
- isLoading?: boolean

**API 사용:**
- useGetSubjects (Orval 생성)
- useGetAbilitiesByRole (Orval 생성)
- useUpdateRoleAbilities (Orval 생성)

**Storybook:** 필요

---

---
**RoleSelector 컴포넌트를 만들어주세요.**

**유형:** widget
**참조:** `.claude/agents/widget-builder.md`
**경로:** `packages/ui/src/components/widget/RoleSelector/RoleSelector.tsx`

**역할:**
- 역할 드롭다운 선택

**조합:**
- ui: Text
- inputs: Select (또는 HeroUI Dropdown)

**Props:**
- roles: Role[]
- selectedRoleId: string | null
- onChange: (roleId: string) => void
- disabled?: boolean

**Storybook:** 필요

---

### 주의사항

1. **SUPER_ADMIN 권한은 수정 불가** - 모든 권한이 항상 허용
2. **자기 자신의 역할은 수정 불가** - 실수로 권한 잠김 방지
3. **하위 메뉴 자동 처리** - 상위 해제 시 하위 자동 해제
4. **변경사항 미저장 경고** - 페이지 이탈 시 확인 다이얼로그

---

## 12. 공통 도메인 메뉴 요약

현재 `ADMIN_MENUS`에 정의된 메뉴:

1. **회원 관리** - 회원 목록, 등급 관리, 탈퇴 회원
2. **예약 관리** - 예약 목록, 캘린더, 통계, 취소/환불
3. **알림 관리** - 발송, 템플릿, 이력, 설정
4. **문의 관리** - 문의 목록, 답변, FAQ, 1:1
5. **콘텐츠 관리** - 공지사항, 이벤트, 배너, 약관
6. **템플릿 관리** - 이메일, SMS, 푸시, HTML
7. **설정** - Ground 정보, 관리자, 권한, 시스템

**추가 필요:**
- **대시보드** - 하위 메뉴 없이 바로 이동 (path: "/")

---

## 13. 관련 문서

| 문서 | 설명 |
|------|------|
| [CASL 권한 시스템 기획서](./2025-12-30-CASL-Permission-System.md) | CASL 기반 권한 체계 상세 설계 |
| [에이전트: layout-builder](../.claude/agents/layout-builder.md) | 레이아웃 컴포넌트 규칙 |
| [에이전트: feature-builder](../.claude/agents/feature-builder.md) | Feature 컴포넌트 규칙 |
| [에이전트: widget-builder](../.claude/agents/widget-builder.md) | Widget 컴포넌트 규칙 |

---

## 14. 컴포넌트 경로 요약

### 기존 컴포넌트 (구현 완료)

| 컴포넌트 | 유형 | 경로 |
|----------|------|------|
| AppLayout | layouts | `packages/ui/src/components/layouts/AppLayout/AppLayout.tsx` |
| PageLayout | layouts | `packages/ui/src/components/layouts/PageLayout/PageLayout.tsx` |
| SectionLayout | layouts | `packages/ui/src/components/layouts/SectionLayout/SectionLayout.tsx` |
| Header | layouts | `packages/ui/src/components/layouts/Header/Header.tsx` |
| Main | layouts | `packages/ui/src/components/layouts/Main/Main.tsx` |
| AppLogo | feature | `packages/ui/src/components/feature/Logo/Logo.tsx` |
| Nav | feature | `packages/ui/src/components/feature/Nav/Nav.tsx` |
| SubNav | feature | `packages/ui/src/components/feature/SubNav/SubNav.tsx` |
| ContextSelector | feature | `packages/ui/src/components/feature/ContextSelector/ContextSelector.tsx` |
| UserMenu | feature | `packages/ui/src/components/feature/UserMenu/UserMenu.tsx` |
| CollapsibleSidebar | feature | `packages/ui/src/components/feature/CollapsibleSidebar/CollapsibleSidebarLayout.tsx` |

### 신규 컴포넌트 (필요 시)

| 컴포넌트 | 유형 | 경로 | 필요 상황 |
|----------|------|------|----------|
| SideNav | feature | `packages/ui/src/components/feature/SideNav/SideNav.tsx` | 좌측 사이드바 레이아웃 변형 시 |
| PermissionMatrix | feature | `packages/ui/src/components/feature/PermissionMatrix/PermissionMatrix.tsx` | 권한 관리 페이지 구현 시 |
| RoleSelector | widget | `packages/ui/src/components/widget/RoleSelector/RoleSelector.tsx` | 권한 관리 페이지 구현 시 |

---

## 15. 에이전트 규칙 적용 체크리스트

### packages 공용 컴포넌트 네이밍 규칙

- [x] 앱 종속 이름 사용하지 않음 (AdminHeader X -> Header O)
- [x] 범용적인 이름 사용 (AppLogo, Nav, UserMenu 등)

### Layout 컴포넌트 규칙

- [x] Page 컴포넌트 내부에서 Layout 사용하지 않음
- [x] Layout은 Next.js layout.tsx에서만 사용
- [x] 순수 위치 영역만 정의 (header, leftAside, rightAside, footer)
- [x] 비즈니스 데이터를 Layout에 직접 전달하지 않음

### Feature 컴포넌트 규칙

- [x] 자체적으로 Store 사용 (MenuStore, AuthStore, PersistStore)
- [x] observer로 MobX 상태 구독
- [x] displayName 설정
- [x] API 호출은 @cocrepo/api 사용

### Widget 컴포넌트 규칙

- [x] 상태/API 호출 없음 (Pure UI)
- [x] Props로만 동작
- [x] UI 컴포넌트 조합

---

## 16. 구현 완료 확인 체크리스트

| 항목 | 상태 | 비고 |
|------|:----:|------|
| 레이아웃 구조 (PageLayout + Header) | O | `app/(admin)/layout.tsx` |
| 메인 네비게이션 (Nav) | O | 권한 필터링 적용 |
| 서브 네비게이션 (SubNav) | O | 선택된 메뉴 하위 메뉴 표시 |
| 사용자 메뉴 (UserMenu) | O | 로그아웃 기능 |
| 컨텍스트 선택 (ContextSelector) | O | Space 변경 기능 |
| MenuStore | O | 메뉴 상태 관리, 권한 필터링 |
| CASL 권한 시스템 | O | AbilityProvider, useAbility |
| 메뉴 상수 (ADMIN_MENUS) | O | 대시보드 메뉴 추가 필요 |
| 대시보드 메뉴 추가 | X | 작업 필요 |
| UserMenu 실제 사용자 정보 연동 | X | 작업 필요 |
| 권한 관리 페이지 | X | 별도 기획서로 분리 권장 |

---

**문서 끝**
