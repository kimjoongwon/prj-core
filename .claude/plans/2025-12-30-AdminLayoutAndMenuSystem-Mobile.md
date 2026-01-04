# AdminLayout 모바일 반응형 레이아웃 상세 기획서

**플랫폼:** Admin Web (Mobile)
**작성일:** 2026-01-03
**버전:** 1.0

---

## 1. 모바일 레이아웃 개요

### 핵심 전략

**데스크톱:** 좌측 사이드바 + 2depth 트리 메뉴
**모바일:** 하단 탭 바(1depth) + 전체 화면 서브메뉴 리스트(2depth)

### 브레이크포인트

- **모바일**: < 768px
- **데스크톱**: >= 768px

---

## 2. 모바일 화면 구조

### 2.1 기본 화면 (1depth 탭만 표시)

```
+----------------------------------------------------------------+
|               [Logo]               [Space▼] [Avatar▼]         |  <- Header (56px)
+----------------------------------------------------------------+
|                                                                |
|                                                                |
|                     페이지 콘텐츠 영역                           |
|                     (스크롤 가능)                               |
|                                                                |
|                                                                |
+----------------------------------------------------------------+
| [대시보드] [회원] [예약] [알림] [문의] ...                        |  <- BottomTab (64px)
+----------------------------------------------------------------+
```

### 2.2 서브메뉴 리스트 화면 (2depth)

```
+----------------------------------------------------------------+
|  [←]  회원                                [Space▼] [Avatar▼]  |  <- Header with Back
+----------------------------------------------------------------+
|                                                                |
|  회원 목록                                              >       |
|  --------------------------------------------------------      |
|  회원 등급 관리                                          >       |
|  --------------------------------------------------------      |
|  탈퇴 회원                                              >       |
|                                                                |
|                                                                |
+----------------------------------------------------------------+
| [대시보드] [회원] [예약] [알림] [문의] ...                        |  <- BottomTab
+----------------------------------------------------------------+
```

---

## 3. 신규 컴포넌트 명세

### 3.1 BottomTab (Feature 컴포넌트)

**경로:** `packages/ui/src/components/feature/BottomTab/BottomTab.tsx`

**역할:**
- 모바일 하단 탭 네비게이션 (1depth 메뉴만)
- HeroUI Tabs 사용
- 아이콘 + 라벨 세로 배치
- 최대 5개 탭 권장

**Props:**
```typescript
export interface BottomTabProps {
  /** 1depth 메뉴 목록 */
  menus: Menu[];
  /** 현재 선택된 메뉴 ID */
  selectedMenuId?: string;
  /** 탭 선택 핸들러 */
  onSelectTab: (menuId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

**구현 예시:**
```tsx
import { Tabs, Tab, cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../utils/iconUtils";
import { Text } from "../../ui/data-display/Text/Text";

export const BottomTab = observer(({
  menus,
  selectedMenuId,
  onSelectTab,
  className,
}: BottomTabProps) => {
  return (
    <div className={cn("md:hidden", className)}>
      <Tabs
        variant="light"
        selectedKey={selectedMenuId}
        onSelectionChange={(key) => onSelectTab(key as string)}
        classNames={{
          base: "w-full",
          tabList: "w-full bg-content1 border-t border-divider h-16",
          tab: "h-16 px-2",
          cursor: "bg-primary/10",
        }}
      >
        {menus.map((menu) => (
          <Tab
            key={menu.id}
            title={
              <div className="flex flex-col items-center gap-1">
                {menu.icon && renderLucideIcon(menu.icon, "h-6 w-6", 24)}
                <Text className="text-xs">{menu.label}</Text>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
});

BottomTab.displayName = "BottomTab";
```

**스타일:**
- 높이: 64px
- 배경: `bg-content1 border-t border-divider`
- 활성 탭: `text-primary`
- 비활성 탭: `text-foreground/60`
- `md:hidden` - 데스크톱에서 숨김

---

### 3.2 SubMenuList (Feature 컴포넌트)

**경로:** `packages/ui/src/components/feature/SubMenuList/SubMenuList.tsx`

**역할:**
- 2depth 메뉴를 전체 화면 리스트로 표시
- 각 항목 클릭 시 페이지 이동
- Header 아래 ~ BottomTab 위 영역 차지

**Props:**
```typescript
export interface SubMenuListProps {
  /** 표시할 서브메뉴 목록 */
  subMenus: Menu[];
  /** 현재 선택된 서브메뉴 ID */
  selectedSubMenuId?: string;
  /** 서브메뉴 선택 핸들러 */
  onSelectSubMenu: (subMenuId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

**구현 예시:**
```tsx
import { ChevronRight } from "lucide-react";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Text } from "../../ui/data-display/Text/Text";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export const SubMenuList = observer(({
  subMenus,
  selectedSubMenuId,
  onSelectSubMenu,
  className,
}: SubMenuListProps) => {
  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      <VStack className="flex-1 overflow-y-auto" gap={0}>
        {subMenus.map((subMenu) => (
          <button
            key={subMenu.id}
            type="button"
            onClick={() => onSelectSubMenu(subMenu.id)}
            className={cn(
              "flex w-full items-center justify-between px-4 py-4",
              "border-b border-divider transition-colors",
              "hover:bg-default-100 active:bg-default-200",
              subMenu.id === selectedSubMenuId && "bg-primary/10"
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
  );
});

SubMenuList.displayName = "SubMenuList";
```

**스타일:**
- 전체 화면 높이 (flex-1)
- 배경: `bg-background`
- 리스트 아이템 높이: 56px
- 구분선: `border-b border-divider`
- 활성 항목: `bg-primary/10`
- 우측 화살표: `ChevronRight`

---

### 3.3 BackButton (Widget 컴포넌트)

**경로:** `packages/ui/src/components/widgets/BackButton/BackButton.tsx`

**역할:**
- Header 좌측 뒤로가기 버튼
- SubMenuList 화면에서만 표시

**Props:**
```typescript
export interface BackButtonProps {
  /** 뒤로가기 핸들러 */
  onBack: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

**구현 예시:**
```tsx
import { ChevronLeft } from "lucide-react";
import { Button, cn } from "@heroui/react";

export function BackButton({ onBack, className }: BackButtonProps) {
  return (
    <Button
      isIconOnly
      variant="light"
      onPress={onBack}
      className={cn("min-w-11 h-11", className)}
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>
  );
}

BackButton.displayName = "BackButton";
```

**스타일:**
- 크기: 44x44px (터치 영역)
- 아이콘: 24x24px
- `text-foreground/70`
- `hover:bg-default-100`

---

## 4. Layout 반응형 구현

### 4.1 AdminLayout 수정

**파일:** `apps/admin/app/(admin)/layout.tsx`

```tsx
"use client";

import { PageLayout, Header } from "@cocrepo/ui/layouts";
import {
  AppLogo,
  SpaceSelector,
  UserMenu,
  SideNav,
  BottomTab,
  SubMenuList,
} from "@cocrepo/ui/feature";
import { BackButton } from "@cocrepo/ui/widgets";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@cocrepo/hook";
import { useMenuStore } from "@cocrepo/store";
import { observer } from "mobx-react-lite";

const AdminLayout = observer(({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const menuStore = useMenuStore();

  // 모바일: SubMenuList 표시 상태
  const [showSubMenuList, setShowSubMenuList] = useState(false);

  /**
   * BottomTab 탭 선택 핸들러
   */
  const handleSelectTab = (menuId: string) => {
    const menu = menuStore.items.find((m) => m.id === menuId);
    if (!menu) return;

    // 하위 메뉴가 있으면 SubMenuList 표시
    if (menu.hasChildren) {
      menuStore.selectMenu(menuId);
      setShowSubMenuList(true);
    } else {
      // 하위 메뉴 없으면 바로 페이지 이동
      menuStore.selectMenu(menuId);
      setShowSubMenuList(false);
    }
  };

  /**
   * SubMenuList 항목 선택 핸들러
   */
  const handleSelectSubMenu = (subMenuId: string) => {
    menuStore.selectSubMenu(subMenuId);
    setShowSubMenuList(false); // 페이지 이동 후 리스트 닫기
  };

  /**
   * 뒤로가기 핸들러
   */
  const handleBack = () => {
    setShowSubMenuList(false);
  };

  // 데스크톱으로 전환 시 SubMenuList 숨김
  useEffect(() => {
    if (!isMobile) {
      setShowSubMenuList(false);
    }
  }, [isMobile]);

  return (
    <PageLayout
      header={
        <Header
          left={
            <>
              {/* 모바일: SubMenuList 화면에서 뒤로가기 버튼 */}
              {isMobile && showSubMenuList && (
                <BackButton onBack={handleBack} />
              )}

              {/* 로고 또는 현재 메뉴명 */}
              {isMobile && showSubMenuList && menuStore.selectedMenu ? (
                <span className="text-lg font-semibold">
                  {menuStore.selectedMenu.label}
                </span>
              ) : (
                <AppLogo icon="LayoutGrid" text={isMobile ? "" : "Admin"} />
              )}
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
        // 데스크톱만 좌측 사이드바 표시
        !isMobile ? <SideNav width={240} /> : null
      }
      footer={
        // 모바일만 바텀 탭 표시
        isMobile ? (
          <BottomTab
            menus={menuStore.items}
            selectedMenuId={menuStore.selectedMenu?.id}
            onSelectTab={handleSelectTab}
          />
        ) : null
      }
    >
      {/* 모바일: SubMenuList 또는 페이지 콘텐츠 */}
      {isMobile && showSubMenuList && menuStore.selectedMenu?.hasChildren ? (
        <SubMenuList
          subMenus={menuStore.selectedMenu.children}
          selectedSubMenuId={menuStore.selectedSubMenu?.id}
          onSelectSubMenu={handleSelectSubMenu}
        />
      ) : (
        children
      )}
    </PageLayout>
  );
});

export default AdminLayout;
```

---

## 5. 모바일 인터랙션 상세

### 5.1 사용자 시나리오

**시나리오 1: 하위 메뉴가 없는 탭 (대시보드)**
1. 사용자가 "대시보드" 탭 클릭
2. 즉시 대시보드 페이지로 이동
3. SubMenuList 표시 없음

**시나리오 2: 하위 메뉴가 있는 탭 (회원)**
1. 사용자가 "회원" 탭 클릭
2. SubMenuList 전체 화면 표시 (회원 목록, 회원 등급 관리, 탈퇴 회원)
3. 사용자가 "회원 목록" 클릭
4. 회원 목록 페이지로 이동 + SubMenuList 닫힘

**시나리오 3: 뒤로가기**
1. SubMenuList 화면에서 Header 좌측 뒤로가기 버튼 클릭
2. SubMenuList 닫힘
3. 이전 페이지로 복귀

**시나리오 4: 다른 탭 선택**
1. SubMenuList 화면에서 BottomTab의 다른 탭 클릭
2. 현재 SubMenuList 닫힘
3. 새로운 메뉴의 SubMenuList 또는 페이지 표시

---

## 6. 성능 최적화

### 6.1 조건부 렌더링
- SubMenuList는 `showSubMenuList` 상태가 true일 때만 렌더링
- 불필요한 DOM 생성 방지

### 6.2 메모이제이션
```tsx
const parentMenus = useMemo(
  () => menuStore.items.filter((menu) => menu.hasChildren),
  [menuStore.items]
);

const standaloneMenus = useMemo(
  () => menuStore.items.filter((menu) => !menu.hasChildren),
  [menuStore.items]
);
```

### 6.3 터치 반응성
- `active:bg-default-200` 클래스로 즉각 피드백
- `touchstart` 이벤트 활용 (300ms 지연 제거)

### 6.4 애니메이션 최적화
- `transform`, `opacity`만 사용 (GPU 가속)
- 60fps 유지

---

## 7. 테스트 체크리스트

### 7.1 기능 테스트

- [ ] BottomTab에서 하위 메뉴 없는 탭 클릭 시 페이지 이동
- [ ] BottomTab에서 하위 메뉴 있는 탭 클릭 시 SubMenuList 표시
- [ ] SubMenuList에서 항목 클릭 시 페이지 이동 + 리스트 닫힘
- [ ] 뒤로가기 버튼 클릭 시 SubMenuList 닫힘
- [ ] SubMenuList 화면에서 다른 탭 클릭 시 정상 동작
- [ ] 768px 이상에서 BottomTab 숨김, SideNav 표시
- [ ] 768px 이하에서 SideNav 숨김, BottomTab 표시

### 7.2 UI/UX 테스트

- [ ] BottomTab 탭 터치 영역 충분 (최소 48px)
- [ ] SubMenuList 항목 터치 영역 충분 (56px)
- [ ] 뒤로가기 버튼 터치 영역 충분 (44x44px)
- [ ] 스크롤 동작 부드러움
- [ ] 탭 전환 애니메이션 자연스러움
- [ ] 활성 탭 시각적으로 명확
- [ ] Header 타이틀 변경 정상 (일반 ↔ SubMenuList)

### 7.3 반응형 테스트

- [ ] 767px → 768px 전환 시 레이아웃 정상 변경
- [ ] 768px → 767px 전환 시 레이아웃 정상 변경
- [ ] 가로/세로 모드 전환 정상 동작
- [ ] 다양한 모바일 기기에서 정상 표시 (iPhone, Android)

### 7.4 성능 테스트

- [ ] BottomTab 탭 전환 지연 없음 (< 100ms)
- [ ] SubMenuList 표시/숨김 지연 없음 (< 200ms)
- [ ] 스크롤 60fps 유지
- [ ] 메모리 누수 없음

### 7.5 브라우저 테스트

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet
- [ ] Firefox Mobile

---

## 8. 구현 우선순위

1. **BottomTab 컴포넌트** - 최우선
2. **SubMenuList 컴포넌트** - 최우선
3. **BackButton 컴포넌트** - 높음
4. **AdminLayout 반응형 로직** - 높음
5. **useMediaQuery 훅 확인/생성** - 높음
6. **모바일 스타일 최적화** - 중간
7. **터치 제스처 (선택적)** - 낮음

---

**문서 끝**
