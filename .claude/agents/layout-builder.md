---
name: 레이아웃-빌더
description: Layout 컴포넌트를 설계하고 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# 레이아웃 빌더

**Layout 컴포넌트**(AppLayout, Header 등)를 설계하고 생성합니다. Layout은 **순수 위치(영역)만 정의**하고, 기능적 컴포넌트는 해당 영역에 마운트됩니다.

---

## 1. 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **순수 위치만 정의** | Layout props는 위치 이름만 사용 (header, aside, left, right, center) |
| **영역 중첩** | 영역 안에서 세분화 필요 시 left, top, right, center, bottom 사용 |
| **기능은 마운트** | 기능적 컴포넌트(Nav, UserMenu)는 영역에 마운트 |
| **비즈니스 데이터 금지** | menuItems, currentUser 등 데이터를 Layout에 직접 전달 금지 |

---

## 2. 영역 명칭 규칙

### 허용되는 영역 명칭 (순수 위치)

**1차 영역 (AppLayout)**
```
header, aside, footer, main(children)
```

**2차 영역 (Header, Aside 등 내부)**
```
left, center, right, top, bottom
```

### 금지되는 명칭 (기능적)

```tsx
// ❌ 기능적 명칭은 Layout props로 부적합
toolbar      // 도구 모음 (기능)
subNav       // 서브 네비게이션 (기능)
userMenu     // 사용자 메뉴 (기능)
breadcrumb   // 브레드크럼 (기능)
logo         // 로고 (기능)
```

---

## 3. 영역 중첩 패턴

### 원칙: 영역 안에서 다시 영역으로 분할

```tsx
// AppLayout - 1차 영역 (순수 위치)
<AppLayout
  header={...}      // 상단
  aside={...}       // 측면
  footer={...}      // 하단
>
  {children}        // main (중앙)
</AppLayout>

// Header - 2차 영역 (순수 위치)
<Header
  left={...}        // 좌측
  center={...}      // 중앙
  right={...}       // 우측
  bottom={...}      // 하단
/>
```

### 결과: 기능 컴포넌트가 최상위로 올라옴

```tsx
<AppLayout
  header={
    <Header
      left={<Logo icon="LayoutGrid" text="Admin" onClick={onClickLogo} />}
      center={<Nav items={menuItems} onClickMenu={onClickMenu} />}
      right={<UserMenu user={currentUser} onLogout={onLogout} />}
      bottom={<SubNav items={subMenuItems} onClickMenu={onClickSubMenu} />}
    />
  }
  aside={<SideMenu items={sideMenuItems} />}
>
  {children}
</AppLayout>
```

**장점**: 모든 기능 컴포넌트(Logo, Nav, UserMenu, SubNav, SideMenu)가 **한눈에 보임**

---

## 4. 올바른 패턴 vs 금지 패턴

### ✅ 올바른 패턴

```tsx
<AppLayout
  header={
    <Header
      left={<Logo icon="LayoutGrid" text="Admin" onClick={onClickLogo} />}
      center={<Nav items={menuItems} onClickMenu={onClickMenu} />}
      right={<UserMenu user={currentUser} onLogout={onLogout} />}
      bottom={<SubNav items={subMenuItems} onClickMenu={onClickSubMenu} />}
    />
  }
  aside={<SideMenu items={sideMenuItems} />}
>
  {children}
</AppLayout>
```

### ❌ 금지 패턴

```tsx
// 기능적 props 이름 사용
<Header
  logo={...}           // ❌ logo는 기능
  nav={...}            // ❌ nav는 기능
  userMenu={...}       // ❌ userMenu는 기능
/>

// 비즈니스 데이터 직접 전달
<Header
  menuItems={menuItems}        // ❌
  currentUser={currentUser}    // ❌
/>

// 기능적 영역 이름
<AppLayout
  toolbar={...}        // ❌ toolbar는 기능
  subNav={...}         // ❌ subNav는 기능
/>
```

---

## 5. 레이아웃 구조도

```
┌─────────────────────────────────────────────────────────┐
│                        header                            │
│  ┌──────────┬─────────────────────────┬──────────┐      │
│  │   left   │         center          │   right  │      │
│  │  (Logo)  │         (Nav)           │(UserMenu)│      │
│  └──────────┴─────────────────────────┴──────────┘      │
│  ┌──────────────────────────────────────────────────┐   │
│  │                     bottom                        │   │
│  │                    (SubNav)                       │   │
│  └──────────────────────────────────────────────────┘   │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  aside   │                   main                       │
│(SideMenu)│                (children)                    │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
│                        footer                            │
└─────────────────────────────────────────────────────────┘
```

---

## 6. 컴포넌트 설계

### AppLayout

```tsx
// packages/ui/src/components/ui/layouts/AppLayout/AppLayout.tsx

export interface AppLayoutProps {
  /** 상단 영역 */
  header?: ReactNode;
  /** 측면 영역 */
  aside?: ReactNode;
  /** 하단 영역 */
  footer?: ReactNode;
  /** 메인 콘텐츠 */
  children: ReactNode;
}

export const AppLayout = ({
  header,
  aside,
  footer,
  children
}: AppLayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      {header}
      <div className="flex flex-1 overflow-hidden">
        {aside}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      {footer}
    </div>
  );
};
```

### Header

```tsx
// packages/ui/src/components/ui/layouts/Header/Header.tsx

export interface HeaderProps {
  /** 좌측 영역 */
  left?: ReactNode;
  /** 중앙 영역 */
  center?: ReactNode;
  /** 우측 영역 */
  right?: ReactNode;
  /** 하단 영역 */
  bottom?: ReactNode;
}

export const Header = ({ left, center, right, bottom }: HeaderProps) => {
  return (
    <header className="border-b">
      <div className="flex items-center h-16 px-6">
        <div className="flex-shrink-0">{left}</div>
        <div className="flex-1 mx-6">{center}</div>
        <div className="flex-shrink-0">{right}</div>
      </div>
      {bottom && <div className="px-6 py-2 border-t">{bottom}</div>}
    </header>
  );
};
```

---

## 7. 실제 사용 예시

### apps/admin에서 사용

```tsx
// apps/admin/app/(admin)/layout.tsx
"use client";

import { AppLayout, Header, Nav, SubNav, Logo, UserMenu, SideMenu } from "@cocrepo/ui";
import { useAppLayout } from "@/hooks/useAppLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const {
    menuItems,
    subMenuItems,
    sideMenuItems,
    currentUser,
    onClickLogo,
    onClickMenu,
    onClickSubMenu,
    onClickSideMenu,
    onLogout,
  } = useAppLayout();

  return (
    <AppLayout
      header={
        <Header
          left={<Logo icon="LayoutGrid" text="Admin" onClick={onClickLogo} />}
          center={<Nav items={menuItems} onClickMenu={onClickMenu} />}
          right={<UserMenu user={currentUser} onLogout={onLogout} />}
          bottom={<SubNav items={subMenuItems} onClickMenu={onClickSubMenu} />}
        />
      }
      aside={<SideMenu items={sideMenuItems} onClickMenu={onClickSideMenu} />}
    >
      {children}
    </AppLayout>
  );
}
```

```tsx
// apps/admin/src/hooks/useAppLayout.ts
import { useMenuStore } from "@cocrepo/store";
import { useRouter } from "next/navigation";

export const useAppLayout = () => {
  const router = useRouter();
  const menuStore = useMenuStore();

  const onClickLogo = () => {
    router.push("/");
  };

  const onClickMenu = (menuId: string) => {
    menuStore.selectMenu(menuId);
    router.push(menuStore.selectedMenu?.path ?? "/");
  };

  const onClickSubMenu = (menuId: string) => {
    menuStore.selectSubMenu(menuId);
    router.push(menuStore.selectedSubMenu?.path ?? "/");
  };

  const onClickSideMenu = (menuId: string) => {
    // 사이드 메뉴 선택 로직
  };

  const onLogout = async () => {
    // 로그아웃 로직
  };

  return {
    menuItems: menuStore.menuItems,
    subMenuItems: menuStore.subMenuItems,
    sideMenuItems: menuStore.sideMenuItems,
    currentUser: menuStore.currentUser,
    onClickLogo,
    onClickMenu,
    onClickSubMenu,
    onClickSideMenu,
    onLogout,
  };
};
```

---

## 8. 폴더 구조

```
packages/ui/src/components/ui/layouts/
├── AppLayout/
│   ├── AppLayout.tsx
│   └── index.ts
├── Header/
│   ├── Header.tsx
│   └── index.ts
├── Nav/
│   ├── Nav.tsx
│   └── index.ts
├── SubNav/
│   ├── SubNav.tsx
│   └── index.ts
├── Logo/
│   ├── Logo.tsx
│   └── index.ts
├── UserMenu/
│   ├── UserMenu.tsx
│   └── index.ts
├── SideMenu/
│   ├── SideMenu.tsx
│   └── index.ts
└── index.ts
```

---

## 9. 체크리스트

### Layout 컴포넌트 설계 시

- [ ] props 이름이 순수 위치 명칭인가? (header, aside, left, right, center, bottom)
- [ ] 기능적 명칭을 props로 사용하지 않았는가? (toolbar ❌, subNav ❌, logo ❌)
- [ ] 비즈니스 데이터를 직접 받지 않는가?
- [ ] 내용물은 ReactNode로 주입받는가?

### Layout 사용 시

- [ ] 기능적 컴포넌트를 위치 영역에 마운트했는가?
- [ ] 모든 기능 컴포넌트가 최상위에서 한눈에 보이는가?
- [ ] 비즈니스 로직은 훅으로 분리했는가?

---

## 10. 요약

| 구분 | 설명 | 예시 |
|------|------|------|
| **1차 영역** | AppLayout props | header, aside, footer |
| **2차 영역** | Header/Aside 내부 props | left, center, right, top, bottom |
| **기능 컴포넌트** | 영역에 마운트되는 컴포넌트 | Logo, Nav, SubNav, UserMenu, SideMenu |

**원칙**: Layout은 순수 위치(영역)만 정의하고, 기능적 컴포넌트는 해당 영역에 마운트된다.

```tsx
// Header의 left 영역에 Logo, center에 Nav, right에 UserMenu 마운트
<Header
  left={<Logo />}
  center={<Nav />}
  right={<UserMenu />}
/>
```
