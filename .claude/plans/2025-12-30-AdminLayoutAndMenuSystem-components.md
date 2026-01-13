# AdminLayout & MenuSystem v7.0 컴포넌트 구현 결과

## 생성 일시
2026-01-13

## Stage 4 구현 범위

### 1. Pure UI 컴포넌트 (packages/ui)

#### 신규 생성

| 컴포넌트 | 파일 | 설명 |
|---------|------|------|
| AdminBottomTab | `AdminBottomTab.tsx` | 모바일 하단 탭바 (5개 탭) |
| AdminFAB | `AdminFAB.tsx` | 모바일 FAB (Floating Action Button) |
| AdminSubMenuList | `AdminSubMenuList.tsx` | 모바일 서브메뉴 리스트 (전체 화면) |

#### 수정

| 컴포넌트 | 변경사항 |
|---------|---------|
| AdminLayout | v7.0 NavItem 기반 props, 반응형 레이아웃 (Desktop/Mobile) 통합 |
| AdminSidebar | 항상 펼침 모드 (collapsed 제거), NavItem 기반 props |
| AdminHeader | NavItem 기반 props, 모바일에서 로고 표시 |
| types.ts | v7.0 타입 정의 (AdminLayoutProps, BottomTabItem, FABAction 등) |

---

### 2. Feature 컴포넌트 (apps/admin)

#### 신규 훅

| 훅 | 파일 | 설명 |
|---|------|------|
| useAdminLayout | `src/hooks/useAdminLayout.ts` | AdminLayout v7.0 통합 훅 (Store 연결) |

#### 수정

| 파일 | 변경사항 |
|------|---------|
| AppStoreProvider.tsx | BottomTabStore, FABStore 생성 및 주입 |
| stores/index.ts | useBottomTabStore, useFABStore export 추가 |

---

## 파일 경로 요약

### packages/ui/src/components/ui/layouts/Admin/

```
Admin/
├── index.ts              # export 업데이트
├── types.ts              # v7.0 타입 정의
├── AdminLayout.tsx       # 반응형 레이아웃 컨테이너
├── AdminHeader.tsx       # 헤더 (Desktop/Mobile 공용)
├── AdminSidebar.tsx      # 데스크톱 사이드바 (항상 펼침)
├── AdminBottomTab.tsx    # [신규] 모바일 하단 탭
├── AdminFAB.tsx          # [신규] 모바일 FAB
└── AdminSubMenuList.tsx  # [신규] 모바일 서브메뉴 리스트
```

### apps/admin/src/

```
src/
├── hooks/
│   ├── index.ts           # useAdminLayout export 추가
│   └── useAdminLayout.ts  # [신규] AdminLayout 통합 훅
└── stores/
    └── AppStoreProvider.tsx  # BottomTabStore, FABStore 추가
```

---

## 컴포넌트 계층 구조

### v7.0 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout (Pure UI)                                        │
│  - navItems, selectedNavItem, selectedSubNavItem            │
│  - bottomTabItems, activeBottomTabId                        │
│  - isSubMenuOpen, subMenuTitle, subMenuItems                │
│  - isFABOpen, fabActions                                    │
│  - handlers (onNavItemClick, onSubNavItemClick, etc.)       │
├─────────────────────────────────────────────────────────────┤
│         ↓                           ↓                        │
│  AdminSidebar (Desktop)      AdminBottomTab (Mobile)        │
│  - 항상 펼침                  - 5개 탭                        │
│  - 2depth 모두 표시           - SubMenuList 연동             │
│                                                              │
│                              AdminFAB (Mobile)               │
│                              - 3개 빠른 액션                  │
│                                                              │
│                              AdminSubMenuList (Mobile)       │
│                              - 전체 화면 모달                 │
└─────────────────────────────────────────────────────────────┘
```

### Store 연결 (Feature Layer)

```
┌─────────────────────────────────────────────────────────────┐
│ useAdminLayout (통합 훅)                                     │
│  - NavigationStore → navItems, selectedNavItem, ...         │
│  - BottomTabStore → bottomTabItems, isSubMenuOpen, ...      │
│  - FABStore → isFABOpen, fabActions, ...                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 사용 예시

### AdminLayout 사용법

```tsx
// apps/admin/app/(admin)/layout.tsx

"use client";

import { observer } from "mobx-react-lite";
import { AdminLayout } from "@cocrepo/ui";
import { useAdminLayout } from "@/src/hooks";
import { Logo } from "@/src/components";

function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  const layoutProps = useAdminLayout();

  return (
    <AdminLayout
      {...layoutProps}
      logo={<Logo />}
      userInfo={{ name: "관리자", role: "Owner" }}
      headerActions={<HeaderActions />}
      onLogout={handleLogout}
    >
      {children}
    </AdminLayout>
  );
}

export default observer(AdminLayoutWrapper);
```

---

## 반응형 브레이크포인트

| 브레이크포인트 | 범위 | 레이아웃 |
|---------------|------|----------|
| Desktop | >= 768px (md) | Header + Sidebar (항상 펼침) + Main |
| Mobile | < 768px | Header + Main + BottomTab + FAB |

---

## 삭제된 파일

| 파일 | 사유 |
|------|------|
| `apps/admin/app/config/menu.ts` | v7.0에서 ADMIN_NAV_ITEMS를 @cocrepo/constant에서 직접 사용 |

---

## 검증 결과

### TypeScript 체크
- packages/ui: 통과
- apps/admin: 통과

### Biome 린트
- packages/ui/src/components/ui/layouts/Admin/: 통과
- apps/admin/src/: 통과

---

## 다음 단계

**Stage 5: 페이지 통합**
1. (admin) 레이아웃 래퍼 컴포넌트 생성
2. 페이지 규칙 검증 (page-reviewer)
3. 완료 보고서 작성
