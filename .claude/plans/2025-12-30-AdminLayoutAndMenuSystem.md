# AdminLayout & MenuSystem 화면 기획서

**플랫폼:** Admin Web (Desktop + Mobile)
**최종 수정일:** 2026-01-03
**버전:** 4.0

---

## 개정 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2025-12-30 | 초안 작성 |
| 2.0 | 2026-01-01 | 코드베이스 분석 후 전면 개정 - 네이밍 규칙 수정, 기존 컴포넌트 활용 현황 추가, 현재 구현 구조 반영 |
| 3.0 | 2026-01-01 | 좌측 사이드바 + 2depth 트리 메뉴 구조로 전면 변경 |
| 4.0 | 2026-01-03 | 모바일 반응형 레이아웃 - 바텀 탭 + 전체 화면 서브메뉴 추가 |

### 주요 변경 사항 (v4.0)

1. **모바일 반응형 레이아웃 추가**: 768px 이하에서 좌측 사이드바 숨김, 바텀 탭으로 전환
2. **BottomTab 컴포넌트**: 1depth 메뉴를 하단 탭 바로 표시 (모바일만)
3. **전체 화면 서브메뉴**: 2depth 메뉴를 전체 화면 리스트로 표시
4. **터치 인터랙션 최적화**: 모바일 터치 영역 확대 및 네이티브 앱과 유사한 UX

### 주요 변경 사항 (v3.0)

1. **레이아웃 구조 변경**: 상단 Nav + SubNav 구조 → 좌측 사이드바 + 2depth 트리 메뉴 구조
2. **SideNav 컴포넌트 필수화**: 좌측 사이드바에 아코디언/트리 형태 메뉴 배치
3. **Header 단순화**: 메뉴 네비게이션 제거, 로고 + Space 셀렉터 + 유저메뉴만 유지
4. **메뉴 인터랙션 변경**: 1depth 클릭 시 펼침/접힘, 2depth 클릭 시 페이지 이동

---

## 1. 화면 개요

### 목적

엔터프라이즈급 멀티테넌트 어드민 시스템의 전체 레이아웃과 메뉴 시스템을 제공합니다.

**레이아웃 구조 (좌측 사이드바 + 2depth 트리 메뉴):**
- **Header**: 상단 헤더
  - 왼쪽: 로고 (AppLogo) - 클릭 시 첫 번째 메뉴로 이동
  - 오른쪽: Space 셀렉터 (SpaceSelector) + 유저 아바타 (UserMenu)
- **Sidebar (좌측)**: 사이드 네비게이션 (SideNav)
  - 2depth 트리 메뉴 구조
  - 대시보드: 하위 메뉴 없음, 클릭 시 `/dashboard`로 이동
  - 1depth: 메인 카테고리 (회원, 예약, 알림 등) - 클릭 시 펼침/접힘
  - 2depth: 하위 메뉴 - 클릭 시 페이지 이동
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

### 레이아웃 (Admin Web) - 좌측 사이드바 + 2depth 트리 메뉴

```
+------------------+----------------------------------------------------------+
|      [Logo]      |                                   [Space▼] [Avatar▼]    |  <- Header
+------------------+----------------------------------------------------------+
|                  |                                                          |
|  📊 대시보드      |                                                          |
|                  |                                                          |
|  ▼ 👥 회원        |                                                          |
|     회원 목록     |                                                          |
|     회원 등급 관리 |                    페이지 콘텐츠 영역                      |
|     탈퇴 회원     |                                                          |
|                  |                                                          |
|  ▶ 📅 예약        |                                                          |
|  ▶ 🔔 알림        |                                                          |
|  ▶ 💬 문의        |                                                          |
|  ▶ 📝 콘텐츠      |                                                          |
|  ▶ 📋 템플릿      |                                                          |
|  ▶ ⚙️ 설정        |                                                          |
|                  |                                                          |
+------------------+----------------------------------------------------------+
     Sidebar                                Main
```

**메뉴 상태:**
- `▶`: 접힌 상태 (하위 메뉴 숨김)
- `▼`: 펼친 상태 (하위 메뉴 표시)
- 대시보드: 하위 메뉴 없이 바로 이동

**아바타 클릭 시:**
```
+--------------+
| 관리자        |
| 최고 관리자    |
+--------------+
| 로그아웃      |
+--------------+
```

### 컴포넌트 구성

| 영역 | 컴포넌트 | 유형 | 위치 | 구현 상태 |
|------|----------|------|------|----------|
| Layout 루트 | AppLayout | layouts | `packages/ui/.../layouts/AppLayout` | 완료 |
| Layout 전체 | PageLayout | layouts | `packages/ui/.../layouts/PageLayout` | 완료 |
| Header 전체 | Header | layouts | `packages/ui/.../layouts/Header` | 완료 |
| Header > left | AppLogo | feature | `packages/ui/.../feature/Logo` | 완료 |
| Header > right | ContextSelector | feature | `packages/ui/.../feature/ContextSelector` | 완료 |
| Header > right | UserMenu | feature | `packages/ui/.../feature/UserMenu` | 완료 |
| Sidebar (leftAside) | SideNav | feature | `packages/ui/.../feature/SideNav` | **신규 필요** |

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

| 컴포넌트 | 용도 | 경로 | 구현 상태 | 사용 여부 |
|----------|------|------|----------|----------|
| AppLogo | 로고 + 클릭 시 대시보드 이동 | `packages/ui/src/components/feature/Logo/Logo.tsx` | 완료 | ✅ 사용 |
| Nav | 상단 메인 네비게이션 | `packages/ui/src/components/feature/Nav/Nav.tsx` | 완료 | ❌ 미사용 |
| SubNav | 상단 하위 네비게이션 | `packages/ui/src/components/feature/SubNav/SubNav.tsx` | 완료 | ❌ 미사용 |
| ContextSelector | Space 변경 (PersistStore 사용) | `packages/ui/src/components/feature/ContextSelector/ContextSelector.tsx` | 완료 | ✅ 사용 |
| UserMenu | 사용자 메뉴 + 로그아웃 | `packages/ui/src/components/feature/UserMenu/UserMenu.tsx` | 완료 | ✅ 사용 |
| CollapsibleSidebar | 접을 수 있는 사이드바 | `packages/ui/src/components/feature/CollapsibleSidebar/CollapsibleSidebarLayout.tsx` | 완료 | 참조용 |

> **참고:** Nav, SubNav는 이번 레이아웃에서 사용하지 않습니다. 좌측 사이드바의 SideNav로 대체됩니다.

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
| 로고 클릭 | 로고 클릭 | 대시보드 (`/`)로 이동 | AppLogo |
| Space 변경 | 컨텍스트 셀렉터 클릭 | Space 선택 페이지로 이동 | ContextSelector |
| 아바타 클릭 | 우측 상단 아바타 클릭 | 로그아웃 메뉴 표시 | UserMenu |
| 로그아웃 | 로그아웃 메뉴 클릭 | 인증 정보 제거, 로그인 페이지로 이동 | UserMenu |
| **Sidebar** | | | |
| 대시보드 클릭 | 대시보드 메뉴 클릭 | 대시보드 (`/`)로 이동 | SideNav |
| 1depth 메뉴 클릭 | 하위 메뉴가 있는 1depth 클릭 | 해당 메뉴 펼침/접힘 토글 | SideNav |
| 2depth 메뉴 클릭 | 하위 메뉴 클릭 | 해당 페이지로 이동 | SideNav |

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
SideNav에서:
  - selectedMenu에 해당하는 1depth 메뉴 자동 펼침 (expanded)
  - selectedSubMenu에 해당하는 2depth 메뉴 활성화 (active) 스타일 적용
    |
    v
사용자가 SideNav의 "예약" (1depth) 클릭
    |
    v
SideNav.handleToggleMenu("reservations") 호출
    |
    v
menuStore.toggleMenu("reservations")
  -> "예약" 메뉴의 펼침/접힘 상태 토글
  -> 펼쳐지면 하위 메뉴 표시
    |
    v
사용자가 "예약 캘린더" (2depth) 클릭
    |
    v
SideNav.handleClickSubMenu("reservations-calendar") 호출
    |
    v
menuStore.selectSubMenu("reservations-calendar")
  -> selectedMenu = reservations (자동 설정)
  -> selectedSubMenu = reservations-calendar
  -> /reservations/calendar 로 이동
```

---

## 6. UI 상세

### Header

**구현 컴포넌트:** `packages/ui/src/components/layouts/Header/Header.tsx`

**구성 요소:**
- `left`: AppLogo (로고 + 앱 이름)
- `right`: ContextSelector + UserMenu

**스타일:**
- 높이: 4rem (64px)
- 배경: `bg-background/70 backdrop-blur-md`
- 테두리: `border-b border-divider`
- HeroUI Navbar 컴포넌트 사용

### SideNav (신규)

**생성 위치:** `packages/ui/src/components/feature/SideNav/SideNav.tsx`

**구조:**
```
+------------------+
|  📊 대시보드      |  <- 하위 메뉴 없음, 클릭 시 바로 이동
+------------------+
|  ▼ 👥 회원        |  <- 1depth (펼침 상태)
|     회원 목록     |  <- 2depth
|     회원 등급 관리 |  <- 2depth (활성화)
|     탈퇴 회원     |  <- 2depth
+------------------+
|  ▶ 📅 예약        |  <- 1depth (접힘 상태)
+------------------+
```

**스타일:**
- 너비: 240px (고정)
- 배경: `bg-content1`
- 테두리: `border-r border-divider`

**1depth 메뉴 스타일:**
- 기본: `text-foreground/70 hover:bg-default-100`
- 활성화 (하위 메뉴 선택됨): `text-primary font-medium`
- 아이콘 + 라벨 + 펼침/접힘 화살표

**2depth 메뉴 스타일:**
- 기본: `text-foreground/60 hover:bg-default-100 pl-10`
- 활성화: `bg-primary/10 text-primary font-medium`
- 들여쓰기로 계층 구분

**인터랙션:**
- 1depth 클릭: 펼침/접힘 토글 (하위 메뉴가 있는 경우)
- 1depth 클릭: 바로 이동 (하위 메뉴가 없는 경우, 예: 대시보드)
- 2depth 클릭: 해당 페이지로 이동

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

### 결론: SideNav 컴포넌트 신규 생성 필요

좌측 사이드바 + 2depth 트리 메뉴 구조를 위해 **SideNav** 컴포넌트가 필요합니다.

### 필요 작업

| 항목 | 현재 상태 | 작업 내용 | 우선순위 |
|------|----------|----------|----------|
| **SideNav 컴포넌트** | 미구현 | 좌측 사이드바 2depth 트리 메뉴 컴포넌트 생성 | **최우선** |
| 대시보드 메뉴 | ADMIN_MENUS에 없음 | 대시보드 메뉴 추가 (path: "/", 하위 없음) | 높음 |
| MenuStore 확장 | toggleMenu 메서드 없음 | 메뉴 펼침/접힘 상태 관리 메서드 추가 | 높음 |
| UserMenu 사용자 정보 | 하드코딩된 임시 데이터 | AuthStore에서 실제 사용자 정보 연동 | 중간 |
| 권한 연동 | MenuStore에 직접 ability 체커 설정 | AbilityProvider와 연동 자동화 | 중간 |

---

## 8. 개선 작업 요청

### 8.1 SideNav 컴포넌트 생성 요청 (최우선)

**SideNav Feature 컴포넌트를 만들어주세요.**

> **참조:** `.claude/agents/기능-컴포넌트-빌더.md`

**유형:** feature
**경로:** `packages/ui/src/components/feature/SideNav/SideNav.tsx`

**역할:**
- 2depth 트리 형태의 좌측 사이드바 네비게이션
- 하위 메뉴가 있는 항목: 클릭 시 펼침/접힘
- 하위 메뉴가 없는 항목: 클릭 시 바로 이동

**조합:**
- ui: VStack, Text, HStack
- inputs: Button
- icons: lucide-react (ChevronRight, ChevronDown 등)

**사용 Store:**
- MenuStore (items, selectedMenu, selectedSubMenu, expandedMenuIds)

**핸들러:**
- handleToggleMenu(menuId: string) -> menuStore.toggleMenu(menuId)
- handleClickMenu(menuId: string) -> menuStore.selectMenu(menuId) (하위 메뉴 없는 경우)
- handleClickSubMenu(subMenuId: string) -> menuStore.selectSubMenu(subMenuId)

**Storybook:** 필요

### 8.2 MenuStore 확장 요청

**파일:** `packages/store/src/stores/menuStore.ts`

**추가할 기능:**
```typescript
class MenuStore {
  // 기존 기능들...

  // 추가: 펼침/접힘 상태 관리
  expandedMenuIds: Set<string> = new Set();

  // 메뉴 펼침/접힘 토글
  toggleMenu(menuId: string): void {
    if (this.expandedMenuIds.has(menuId)) {
      this.expandedMenuIds.delete(menuId);
    } else {
      this.expandedMenuIds.add(menuId);
    }
  }

  // 메뉴가 펼쳐진 상태인지 확인
  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenuIds.has(menuId);
  }

  // setCurrentPath에서 selectedMenu의 부모 메뉴 자동 펼침
  setCurrentPath(path: string): void {
    // 기존 로직...
    // 추가: selectedMenu가 있으면 해당 메뉴 자동 펼침
    if (this.selectedMenu) {
      this.expandedMenuIds.add(this.selectedMenu.id);
    }
  }
}
```

### 8.3 대시보드 메뉴 추가 요청

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

### 8.4 UserMenu 실제 사용자 정보 연동 요청

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

## 9. Layout 구현 가이드

### 구현 파일

**파일:** `apps/admin/app/(admin)/layout.tsx`

### 구현 코드

```tsx
import { PageLayout, Header } from "@cocrepo/ui/layouts";
import { AppLogo, ContextSelector, UserMenu, SideNav } from "@cocrepo/ui/feature";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout
      header={
        <Header
          left={<AppLogo icon="LayoutGrid" text="Admin" />}
          right={
            <>
              <ContextSelector />
              <UserMenu />
            </>
          }
        />
      }
      leftAside={<SideNav />}
    >
      {children}
    </PageLayout>
  );
}
```

### 레이아웃 구조

```
+------------------+----------------------------------------------------------+
|      Header      |                                                          |
|  [Logo]          |                                   [Space▼] [Avatar▼]    |
+------------------+----------------------------------------------------------+
|                  |                                                          |
|    leftAside     |                                                          |
|    (SideNav)     |                     children                             |
|                  |                     (Main)                               |
|                  |                                                          |
+------------------+----------------------------------------------------------+
```

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

| 컴포넌트 | 유형 | 경로 | 사용 여부 |
|----------|------|------|----------|
| AppLayout | layouts | `packages/ui/src/components/layouts/AppLayout/AppLayout.tsx` | ✅ 사용 |
| PageLayout | layouts | `packages/ui/src/components/layouts/PageLayout/PageLayout.tsx` | ✅ 사용 |
| SectionLayout | layouts | `packages/ui/src/components/layouts/SectionLayout/SectionLayout.tsx` | ✅ 사용 |
| Header | layouts | `packages/ui/src/components/layouts/Header/Header.tsx` | ✅ 사용 |
| Main | layouts | `packages/ui/src/components/layouts/Main/Main.tsx` | ✅ 사용 |
| AppLogo | feature | `packages/ui/src/components/feature/Logo/Logo.tsx` | ✅ 사용 |
| Nav | feature | `packages/ui/src/components/feature/Nav/Nav.tsx` | ❌ 미사용 |
| SubNav | feature | `packages/ui/src/components/feature/SubNav/SubNav.tsx` | ❌ 미사용 |
| ContextSelector | feature | `packages/ui/src/components/feature/ContextSelector/ContextSelector.tsx` | ✅ 사용 |
| UserMenu | feature | `packages/ui/src/components/feature/UserMenu/UserMenu.tsx` | ✅ 사용 |
| CollapsibleSidebar | feature | `packages/ui/src/components/feature/CollapsibleSidebar/CollapsibleSidebarLayout.tsx` | 참조용 |

### 신규 컴포넌트 (필수)

| 컴포넌트 | 유형 | 경로 | 우선순위 |
|----------|------|------|----------|
| **SideNav** | feature | `packages/ui/src/components/feature/SideNav/SideNav.tsx` | **최우선** |
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
| 레이아웃 구조 (PageLayout + Header + leftAside) | O | `app/(admin)/layout.tsx` 수정 필요 |
| **SideNav 컴포넌트** | **X** | **신규 생성 필요 (최우선)** |
| **MenuStore 확장 (toggleMenu)** | **X** | **펼침/접힘 상태 관리 추가 필요** |
| 사용자 메뉴 (UserMenu) | O | 로그아웃 기능 |
| 컨텍스트 선택 (ContextSelector) | O | Space 변경 기능 |
| MenuStore | O | 메뉴 상태 관리, 권한 필터링 |
| CASL 권한 시스템 | O | AbilityProvider, useAbility |
| 메뉴 상수 (ADMIN_MENUS) | O | 대시보드 메뉴 추가 필요 |
| 대시보드 메뉴 추가 | X | 작업 필요 |
| UserMenu 실제 사용자 정보 연동 | X | 작업 필요 |
| 권한 관리 페이지 | X | 별도 기획서로 분리 권장 |

### 구현 우선순위

1. **SideNav 컴포넌트 생성** - 좌측 사이드바 2depth 트리 메뉴
2. **MenuStore 확장** - toggleMenu, expandedMenuIds 추가
3. **대시보드 메뉴 추가** - ADMIN_MENUS에 추가
4. **Layout 수정** - `app/(admin)/layout.tsx`에서 SideNav 적용
5. **모바일 반응형 대응** - MobileMenuButton, Drawer 방식 SideNav
6. UserMenu 실제 사용자 정보 연동

---

## 17. 모바일 반응형 레이아웃 (v4.0)

### 반응형 브레이크포인트

| 뷰포트 | 브레이크포인트 | 레이아웃 모드 | 설명 |
|--------|---------------|--------------|------|
| 모바일 | < 768px | Mobile | 좌측 사이드바 숨김, 바텀 탭 표시 |
| 태블릿/데스크톱 | >= 768px | Desktop | 좌측 사이드바 고정 표시 |

### 모바일 레이아웃 구조

**1depth 메뉴 (바텀 탭):**

```
+----------------------------------------------------------------+
|               [Logo]               [Space▼] [Avatar▼]         |  <- Header
+----------------------------------------------------------------+
|                                                                |
|                                                                |
|                     페이지 콘텐츠 영역                           |
|                                                                |
|                                                                |
+----------------------------------------------------------------+
| [대시보드] [회원] [예약] [알림] [문의] ...                        |  <- BottomTab (1depth)
+----------------------------------------------------------------+
```

**2depth 메뉴 선택 시 (전체 화면 리스트):**

1depth 탭 클릭 → 2depth 서브메뉴가 있으면 전체 화면 리스트로 전환

```
+----------------------------------------------------------------+
|  [←]  회원                                [Space▼] [Avatar▼]  |  <- Header (뒤로가기 추가)
+----------------------------------------------------------------+
|                                                                |
|  회원 목록                                              >       |
|  --------------------------------------------------------      |
|  회원 등급 관리                                          >       |
|  --------------------------------------------------------      |
|  탈퇴 회원                                              >       |
|                                                                |
+----------------------------------------------------------------+
| [대시보드] [회원] [예약] [알림] [문의] ...                        |  <- BottomTab (활성화)
+----------------------------------------------------------------+
```

**하위 메뉴가 없는 1depth (대시보드 등):**
- 바로 해당 페이지로 이동
- 전체 화면 리스트 표시 없음

### 모바일 UI 상세

#### Header (모바일)

**구성:**
- **좌측**:
  - BackButton (2depth 화면에서만 표시, 뒤로가기)
  - AppLogo (또는 현재 1depth 메뉴명)
- **우측**:
  - SpaceSelector (축소 버전)
  - UserMenu (아바타만)

**스타일:**
- 높이: 3.5rem (56px) - 데스크톱보다 약간 낮춤
- 뒤로가기 터치 영역: 44x44px
- `md:hidden` 클래스로 모바일만 표시

**상태별 표시:**
- **일반 페이지**: `[Logo] ... [Space▼] [Avatar▼]`
- **2depth 리스트**: `[←] 회원 ... [Space▼] [Avatar▼]`

#### BottomTab (신규)

**생성 위치:** `packages/ui/src/components/feature/BottomTab/BottomTab.tsx`

**Props:**
```typescript
interface BottomTabProps {
  /** 1depth 메뉴 목록 */
  menus: Menu[];
  /** 현재 선택된 메뉴 ID */
  selectedMenuId?: string;
  /** 탭 선택 핸들러 */
  onSelectTab: (menuId: string) => void;
}
```

**스타일:**
- 높이: 64px
- 배경: `bg-content1 border-t border-divider`
- 탭 아이템: 아이콘 + 라벨 (세로 배치)
- 최대 탭 수: 5개 (그 이상은 "더보기" 처리)
- 활성 탭: `text-primary`, 비활성: `text-foreground/60`
- 아이콘 크기: 24x24px
- 라벨 크기: 10px
- 각 탭 터치 영역: 최소 48px

**동작:**
- 하위 메뉴 없는 탭: 바로 페이지 이동
- 하위 메뉴 있는 탭: SubMenuList 전체 화면 표시

**HeroUI 사용:**
```tsx
<Tabs
  variant="light"
  selectedKey={selectedMenuId}
  onSelectionChange={onSelectTab}
  classNames={{
    base: "w-full",
    tabList: "w-full bg-content1 border-t border-divider",
    tab: "h-16 flex-col gap-1",
  }}
>
  {menus.map((menu) => (
    <Tab
      key={menu.id}
      title={
        <div className="flex flex-col items-center gap-1">
          {renderLucideIcon(menu.icon, "h-6 w-6", 24)}
          <span className="text-xs">{menu.label}</span>
        </div>
      }
    />
  ))}
</Tabs>
```

#### SubMenuList (신규)

**생성 위치:** `packages/ui/src/components/feature/SubMenuList/SubMenuList.tsx`

**역할:**
- 2depth 메뉴를 전체 화면 리스트로 표시
- 각 항목 클릭 시 해당 페이지로 이동

**Props:**
```typescript
interface SubMenuListProps {
  /** 표시할 서브메뉴 목록 */
  subMenus: Menu[];
  /** 현재 선택된 서브메뉴 ID */
  selectedSubMenuId?: string;
  /** 서브메뉴 선택 핸들러 */
  onSelectSubMenu: (subMenuId: string) => void;
  /** 뒤로가기 핸들러 */
  onBack: () => void;
}
```

**스타일:**
- 전체 화면 (Header 아래 ~ BottomTab 위)
- 배경: `bg-background`
- 리스트 아이템 높이: 56px
- 구분선: `border-b border-divider`
- 우측 화살표 아이콘: `ChevronRight`

**구현:**
```tsx
<div className="flex h-full flex-col bg-background">
  <VStack className="flex-1 overflow-y-auto" gap={0}>
    {subMenus.map((subMenu) => (
      <button
        key={subMenu.id}
        onClick={() => onSelectSubMenu(subMenu.id)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-4",
          "border-b border-divider hover:bg-default-100",
          subMenu.active && "bg-primary/10"
        )}
      >
        <Text className="text-base font-medium">
          {subMenu.label}
        </Text>
        <ChevronRight className="h-5 w-5 text-foreground/40" />
      </button>
    ))}
  </VStack>
</div>
```

#### Layout 반응형 적용

**파일:** `apps/admin/app/(admin)/layout.tsx`

```tsx
"use client";

import { PageLayout, Header } from "@cocrepo/ui/layouts";
import { AppLogo, SpaceSelector, UserMenu, SideNav, MobileMenuButton } from "@cocrepo/ui/feature";
import { useState } from "react";
import { useMediaQuery } from "@cocrepo/hook";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <PageLayout
      header={
        <Header
          left={
            <>
              {/* 모바일: 햄버거 메뉴 */}
              {isMobile && (
                <MobileMenuButton
                  isOpen={isMobileMenuOpen}
                  onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              )}
              <AppLogo icon="LayoutGrid" text={isMobile ? "" : "Admin"} />
            </>
          }
          right={
            <>
              <SpaceSelector />
              <UserMenu />
            </>
          }
        />
      }
      leftAside={
        isMobile ? (
          // 모바일: Drawer 모드
          <SideNav
            isMobile
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            width={280}
          />
        ) : (
          // 데스크톱: 고정 사이드바
          <SideNav width={240} />
        )
      }
    >
      {children}
    </PageLayout>
  );
}
```

### 모바일 인터랙션

| 액션 | 트리거 | 결과 |
|------|--------|------|
| **BottomTab** | | |
| 1depth 탭 클릭 (하위 없음) | 대시보드 등 탭 클릭 | 해당 페이지로 이동 |
| 1depth 탭 클릭 (하위 있음) | 회원, 예약 등 탭 클릭 | SubMenuList 전체 화면 표시 |
| **SubMenuList** | | |
| 뒤로가기 버튼 | Header 좌측 뒤로가기 클릭 | SubMenuList 닫힘, 이전 페이지로 복귀 |
| 2depth 메뉴 선택 | 리스트 항목 클릭 | 해당 페이지로 이동 + SubMenuList 닫힘 |
| BottomTab 다른 탭 | 다른 1depth 탭 클릭 | 현재 SubMenuList 닫힘 + 새 SubMenuList 또는 페이지 이동 |

### 모바일 상태 흐름

```
[초기 상태: 대시보드 페이지]
    ↓
사용자가 BottomTab에서 "회원" 탭 클릭
    ↓
[SubMenuList 표시: 회원 목록, 회원 등급 관리, 탈퇴 회원]
    ↓
사용자가 "회원 목록" 클릭
    ↓
[회원 목록 페이지로 이동, SubMenuList 닫힘]
    ↓
사용자가 BottomTab에서 "예약" 탭 클릭
    ↓
[SubMenuList 표시: 예약 목록, 예약 캘린더, ...]
```

### 터치 제스처 지원

**뒤로가기 스와이프 (선택적):**
- 화면 왼쪽 가장자리(20px)에서 오른쪽 스와이프
- SubMenuList 닫힘 (뒤로가기와 동일)
- iOS/Android 네이티브 앱과 유사한 UX

**리스트 스크롤:**
- SubMenuList 내에서 세로 스크롤
- 부드러운 스크롤 애니메이션
- 오버스크롤 효과 (iOS 스타일)

### 모바일 성능 최적화

1. **조건부 렌더링**: SubMenuList는 표시 필요 시에만 렌더링
2. **가상화**: 서브메뉴 항목이 많을 경우 react-window 사용
3. **터치 반응성**: `touchstart` 이벤트 사용, 300ms 지연 제거
4. **애니메이션 최적화**: `transform`, `opacity`만 사용 (GPU 가속)
5. **메모이제이션**: 메뉴 데이터 useMemo로 캐싱

### 필요 작업

| 항목 | 현재 상태 | 작업 내용 | 우선순위 |
|------|----------|----------|----------|
| BottomTab | 미구현 | 바텀 탭 네비게이션 컴포넌트 생성 | **최우선** |
| SubMenuList | 미구현 | 전체 화면 서브메뉴 리스트 컴포넌트 생성 | **최우선** |
| BackButton | 미구현 | Header 뒤로가기 버튼 컴포넌트 생성 | 높음 |
| useMediaQuery 훅 | 확인 필요 | 반응형 브레이크포인트 감지 훅 | 높음 |
| Layout 반응형 로직 | 미구현 | 모바일/데스크톱 분기 로직 | 높음 |
| 터치 제스처 | 미구현 | 스와이프 닫기 구현 | 중간 |
| SpaceSelector 모바일 최적화 | 부분 완료 | 모바일에서 텍스트 축소 또는 아이콘만 | 중간 |

### 신규 컴포넌트 명세

---

**MobileMenuButton Feature 컴포넌트를 만들어주세요.**

**유형:** feature
**경로:** `packages/ui/src/components/feature/MobileMenuButton/MobileMenuButton.tsx`

**역할:**
- 모바일에서 햄버거 메뉴 버튼 표시
- 열림/닫힘 상태에 따라 아이콘 전환 (Menu ↔ X)

**조합:**
- ui: IconButton 또는 Button
- icons: lucide-react (Menu, X)

**Props:**
```typescript
interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}
```

**스타일:**
- 크기: 44x44px (터치 영역)
- 아이콘: 24x24px
- `md:hidden` - 768px 이상에서 숨김
- 애니메이션: 200ms fade transition

**Storybook:** 필요

---

### useMediaQuery 훅 확인

**위치:** `packages/hook/src/useMediaQuery.ts` (확인 필요)

**기능:**
```typescript
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
```

**사용 예:**
```typescript
const isMobile = useMediaQuery("(max-width: 767px)");
const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
const isDesktop = useMediaQuery("(min-width: 1024px)");
```

---

## 18. 모바일 테스트 체크리스트

### 기능 테스트

- [ ] 햄버거 메뉴 클릭 시 Drawer 열림
- [ ] Drawer 외부 클릭 시 닫힘
- [ ] X 버튼 클릭 시 닫힘
- [ ] 메뉴 선택 시 페이지 이동 + Drawer 자동 닫힘
- [ ] 왼쪽 스와이프로 Drawer 닫힘
- [ ] 768px 이상에서 햄버거 메뉴 숨김, 사이드바 고정
- [ ] 768px 이하에서 햄버거 메뉴 표시, 사이드바 Drawer

### UI/UX 테스트

- [ ] 터치 영역 최소 44x44px
- [ ] 메뉴 아이템 높이 충분 (48px)
- [ ] 스크롤 동작 정상
- [ ] 애니메이션 부드러움 (60fps)
- [ ] 오버레이 블러 효과 정상
- [ ] SpaceSelector 모바일에서 정상 표시
- [ ] UserMenu 모바일에서 정상 표시

### 성능 테스트

- [ ] Drawer 열기/닫기 지연 없음 (< 300ms)
- [ ] 스와이프 반응성 양호
- [ ] 메모리 누수 없음
- [ ] 배터리 소모 정상

### 브라우저 테스트

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet
- [ ] Firefox Mobile

---

**문서 끝**
