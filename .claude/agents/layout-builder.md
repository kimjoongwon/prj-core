---
name: 레이아웃-빌더
description: Layout 컴포넌트를 설계하고 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# 레이아웃 빌더

**Layout 컴포넌트**(AppLayout, PageLayout, SectionLayout)를 설계하고 생성합니다. Layout은 **순수 위치(영역)만 정의**하고, Feature 컴포넌트는 해당 영역에 마운트됩니다.

---

## 0. 레이아웃 계층 구조

### 3단계 Layout 계층

```
AppLayout (Next.js 최상위 layout.tsx)
    ↓ children (PageLayout이 여기에 마운트됨)
PageLayout (전체 페이지 구조: header, aside, footer)
    ↓ children (SectionLayout 또는 페이지 콘텐츠)
SectionLayout (페이지 내부 구역: top, left, right, bottom)
    ↓ children (페이지 콘텐츠)
```

**중요**: AppLayout의 children으로 **반드시 PageLayout**이 전달됩니다.

**개수 제약 및 위계 규칙**:
- **AppLayout**: 한 경로에 1개만 존재 (app/layout.tsx)
- **PageLayout**: 한 경로에 1개만 존재 (app/(admin)/layout.tsx)
- **SectionLayout**: 한 경로에 복수개 존재 가능 (중첩 가능)
- **위계 순서**: AppLayout → PageLayout → SectionLayout(들) 순서를 반드시 지켜야 함

| 레이아웃 | 설명 | 사용 위치 | children으로 받는 것 | 경로당 개수 |
|----------|------|------------|--------------------|--------------|
| **AppLayout** | 루트 body 래퍼, children만 포함 | `app/layout.tsx` (최상위) | **PageLayout** | **1개** |
| **PageLayout** | 페이지 전체 구조 (HTML5 시맨틱) | `app/(admin)/layout.tsx` | SectionLayout 또는 페이지 콘텐츠 | **1개** |
| **SectionLayout** | 페이지 내부 구역 | `app/(admin)/users/layout.tsx` | SectionLayout 또는 페이지 콘텐츠 | **복수 가능** |

### Widget → Feature → Layout 흐름

```
Widget (순수 UI 조합)
    ↓ 사용됨
Feature (비즈니스 로직 + Widget 조합)
    ↓ 마운트됨
Layout 영역 (PageLayout, SectionLayout)
```

| 분류 | 설명 | 경로 |
|------|------|------|
| **Widget** | 재사용 가능한 순수 UI 블록 | `packages/ui/src/components/widget/` |
| **Feature** | 비즈니스 로직을 포함, Widget 조합 | `packages/ui/src/components/feature/` |

**결과**: Layout 영역에는 항상 Feature가 마운트되며, Widget은 Feature 내부에서 사용됨

### 예시

```tsx
// 1. AppLayout - Next.js 최상위 layout.tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AppLayout>
          {children}  {/* ← PageLayout이 여기에 마운트됨 */}
        </AppLayout>
      </body>
    </html>
  );
}

// 2. PageLayout - 페이지 전체 구조 (AppLayout의 children으로 전달됨)
// app/(admin)/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <PageLayout
      header={
        <Header
          left={<Logo />}           // Feature
          center={<Nav />}          // Feature
          right={<UserMenu />}      // Feature
        />
      }
      leftAside={<SideMenu />}      // Feature
    >
      {children}  {/* ← SectionLayout 또는 페이지 콘텐츠 */}
    </PageLayout>
  );
}

// 3. SectionLayout - 페이지 내부 구역 (PageLayout의 children으로 전달됨)
// app/(admin)/users/layout.tsx
export default function UsersLayout({ children }) {
  return (
    <SectionLayout top={<Tabs />}>  {/* Feature */}
      {children}  {/* ← 페이지 콘텐츠 */}
    </SectionLayout>
  );
}

// 4. SectionLayout 중첩 예시 (복수개 가능)
// app/(admin)/users/[id]/layout.tsx
export default function UserDetailLayout({ children }) {
  return (
    <SectionLayout left={<UserSidebar />} right={<ActivityPanel />}>
      {children}  {/* ← 또 다른 SectionLayout 또는 콘텐츠 */}
    </SectionLayout>
  );
}
```

**위계 예시**:
```
AppLayout (app/layout.tsx) - 1개
  ↓
PageLayout (app/(admin)/layout.tsx) - 1개
  ↓
SectionLayout (app/(admin)/users/layout.tsx) - 복수 가능
  ↓
SectionLayout (app/(admin)/users/[id]/layout.tsx) - 중첩 가능
  ↓
페이지 콘텐츠
```

---

## 1. 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **AppLayout은 body 래퍼** | children만 받으며 Next.js 최상위에서만 사용, **children은 항상 PageLayout** |
| **PageLayout은 HTML5 시맨틱** | header, leftAside, rightAside, footer 사용, AppLayout의 children으로 전달됨 |
| **SectionLayout은 위치 속성** | top, bottom, left, right, center 사용, PageLayout의 children으로 전달됨 |
| **개수 제약** | AppLayout 1개, PageLayout 1개, SectionLayout 복수 가능 (한 경로당) |
| **위계 순서** | AppLayout → PageLayout → SectionLayout(들) 순서를 반드시 준수 |
| **파일당 1개 Layout** | 하나의 layout.tsx에 하나의 Layout만 선언 (중첩 금지) |
| **Feature가 마운트됨** | Layout 영역에는 Feature 컴포넌트가 마운트됨 |
| **비즈니스 데이터 금지** | menuItems, currentUser 등을 Layout에 직접 전달 금지 |

### ⚠️ 파일당 1개 Layout 규칙 (중요!)

**하나의 layout.tsx 파일에는 하나의 Layout 컴포넌트만 선언해야 합니다.**

```tsx
// ❌ 금지 - 하나의 파일에 여러 Layout 중첩
// app/auth/layout.tsx
export default function AuthLayoutRoute({ children }) {
  return (
    <PageLayout>
      <SectionLayout left={...} right={...} />  {/* ← 같은 파일에 중첩 금지! */}
    </PageLayout>
  );
}

// ✅ 올바른 패턴 - 파일 분리
// app/auth/layout.tsx
export default function AuthLayoutRoute({ children }) {
  return <PageLayout>{children}</PageLayout>;
}

// app/auth/login/layout.tsx
export default function LoginLayoutRoute({ children }) {
  return (
    <SectionLayout left={...} right={...}>
      {children}
    </SectionLayout>
  );
}
```

**이유:**
- Next.js의 중첩 레이아웃 패턴을 올바르게 활용
- 각 경로별 레이아웃 책임 분리
- 레이아웃 변경 시 영향 범위 최소화

---

## 2. 영역 명칭 규칙

### 허용되는 영역 명칭 (순수 위치)

**AppLayout** - children만
```
children  // 자식 컴포넌트
```

**PageLayout** - HTML5 시맨틱 태그 + 위치
```
header, leftAside, rightAside, footer, children
```

**SectionLayout** - 위치 속성 기반
```
top, bottom, left, right, center(children)
```

### 명칭 선택 원칙

| 레이아웃 | 명칭 기준 | 예시 |
|----------|----------|------|
| **AppLayout** | children만 | children |
| **PageLayout** | HTML5 시맨틱 + 위치 | header, leftAside, rightAside, footer |
| **SectionLayout** | 위치 속성 | top, bottom, left, right, center |
| **Header** | 위치 속성 | left, center, right, bottom |

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
// AppLayout - 최상위 (루트)
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

// PageLayout - 페이지 전체 구조 (HTML5 시맨틱)
export default function AdminLayout({ children }) {
  return (
    <PageLayout
      header={...}       // 상단
      leftAside={...}    // 좌측
      rightAside={...}   // 우측
      footer={...}       // 하단
    >
      {children}         // 메인 콘텐츠
    </PageLayout>
  );
}

// Header - 2차 영역 (순수 위치)
<Header
  left={...}        // 좌측
  center={...}      // 중앙
  right={...}       // 우측
  bottom={...}      // 하단
/>

// SectionLayout - 페이지 내부 구역
export default function UsersLayout({ children }) {
  return (
    <SectionLayout
      top={...}       // 상단
      left={...}      // 좌측
      right={...}     // 우측
      bottom={...}    // 하단
    >
      {children}
    </SectionLayout>
  );
}
```

### 결과: Feature 컴포넌트가 최상위로 올라옴

```tsx
<PageLayout
  header={
    <Header
      left={<Logo />}
      center={<Nav />}
      right={<UserMenu />}
      bottom={<SubNav />}
    />
  }
  leftAside={<SideMenu />}
>
  {children}
</PageLayout>
```

**장점**:
- 모든 Feature 컴포넌트가 **한눈에 보임**
- 각 Feature 컴포넌트가 **자체적으로 비즈니스 로직 처리** (내부에서 store, router 등 사용)

---

## 4. Next.js 중첩 레이아웃 패턴

Next.js App Router에서 `layout.tsx`는 중첩됩니다. 각 레이아웃도 동일한 "순수 위치만 정의" 원칙을 따릅니다.

### 레이아웃 계층 구조

```
app/layout.tsx (Root)                    → AppLayout (children만)
    ↓ children (PageLayout이 여기로 전달됨)
app/(admin)/layout.tsx                   → PageLayout (header, aside, footer)
    ↓ children (SectionLayout 또는 페이지 콘텐츠)
app/(admin)/users/layout.tsx             → SectionLayout (top, left, right, bottom)
    ↓ children (페이지 콘텐츠)
app/(admin)/users/page.tsx               → 페이지 콘텐츠
```

### 레이아웃 컴포넌트 분류

| 레이아웃 | 용도 | 영역 props | 사용 위치 |
|----------|------|------------|----------|
| **AppLayout** | 루트 body 래퍼 | children | `app/layout.tsx` |
| **PageLayout** | 페이지 전체 구조 | header, leftAside, rightAside, footer | `app/(admin)/layout.tsx` |
| **SectionLayout** | 페이지 내부 구역 | top, bottom, left, right | `app/(admin)/users/layout.tsx` |

### 레이아웃 계층도

```
┌──────────────────────────────────────────────────────────────────┐
│ PageLayout                                                        │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │                           header                              │ │
│ ├──────────┬────────────────────────────────────────┬──────────┤ │
│ │          │ SectionLayout (children에 마운트)       │          │ │
│ │          │ ┌────────────────────────────────────┐ │          │ │
│ │          │ │                top                 │ │          │ │
│ │          │ │              (Tabs)                │ │          │ │
│ │leftAside │ ├──────┬─────────────────┬───────────┤ │rightAside│ │
│ │          │ │ left │                 │   right   │ │          │ │
│ │(SideMenu)│ │      │    children     │ (Detail)  │ │(Optional)│ │
│ │          │ │      │   (page.tsx)    │           │ │          │ │
│ │          │ ├──────┴─────────────────┴───────────┤ │          │ │
│ │          │ │              bottom                │ │          │ │
│ │          │ │           (Pagination)             │ │          │ │
│ │          │ └────────────────────────────────────┘ │          │ │
│ ├──────────┴────────────────────────────────────────┴──────────┤ │
│ │                           footer                              │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### 폴더 구조 예시

```
app/(admin)/
├── layout.tsx                    # AppLayout 사용
├── page.tsx                      # 대시보드
│
├── users/
│   ├── layout.tsx                # PageLayout 사용 (Tabs 포함)
│   ├── page.tsx                  # 사용자 목록 (기본 탭)
│   ├── roles/
│   │   └── page.tsx              # 권한 관리 탭
│   └── settings/
│       └── page.tsx              # 설정 탭
│
└── products/
    ├── layout.tsx                # PageLayout 사용
    └── page.tsx
```

### PageLayout 컴포넌트 설계

```tsx
// packages/ui/src/components/ui/layouts/PageLayout/PageLayout.tsx

export interface PageLayoutProps {
  /** 상단 영역 */
  top?: ReactNode;
  /** 하단 영역 */
  bottom?: ReactNode;
  /** 좌측 영역 */
  left?: ReactNode;
  /** 우측 영역 */
  right?: ReactNode;
  /** 메인 콘텐츠 */
  children: ReactNode;
}

export const PageLayout = ({ top, bottom, left, right, children }: PageLayoutProps) => {
  return (
    <div className="flex flex-col h-full">
      {top && <div className="flex-shrink-0">{top}</div>}
      <div className="flex flex-1 overflow-hidden">
        {left && <div className="flex-shrink-0">{left}</div>}
        <div className="flex-1 overflow-auto">{children}</div>
        {right && <div className="flex-shrink-0">{right}</div>}
      </div>
      {bottom && <div className="flex-shrink-0">{bottom}</div>}
    </div>
  );
};
```

### 중첩 레이아웃 사용 예시

```tsx
// app/(admin)/layout.tsx - 루트 레이아웃
"use client";

import { AppLayout, Header, Logo, Nav, UserMenu } from "@cocrepo/ui";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      header={
        <Header
          left={<Logo />}
          center={<Nav />}
          right={<UserMenu />}
        />
      }
    >
      {children}
    </AppLayout>
  );
}
```

```tsx
// app/(admin)/users/layout.tsx - 중첩 레이아웃
"use client";

import { PageLayout, Tabs } from "@cocrepo/ui";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout top={<Tabs />}>
      {children}
    </PageLayout>
  );
}
```

```tsx
// packages/ui/src/components/feature/Tabs/Tabs.tsx - Feature 컴포넌트
"use client";

import { observer } from "mobx-react-lite";
import { useMenuStore } from "@cocrepo/store";
import { useRouter, usePathname } from "next/navigation";

export const Tabs = observer(() => {
  const menuStore = useMenuStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleClickTab = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex gap-2 border-b">
      {menuStore.subMenuItems.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClickTab(tab.path)}
          className={pathname === tab.path ? "border-b-2 border-blue-500" : ""}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});
```

```tsx
// app/(admin)/users/page.tsx - 페이지 콘텐츠
export default function UsersPage() {
  return (
    <div>
      {/* 사용자 목록 */}
    </div>
  );
}
```

### 중첩 레이아웃 원칙

| 원칙 | 설명 |
|------|------|
| **Layout은 순수 영역** | Layout 파일에 비즈니스 로직 없음 |
| **기능 컴포넌트가 로직 담당** | Nav, Tabs, UserMenu 등이 자체적으로 store, router 사용 |
| **각 레이아웃은 독립적** | 상위 레이아웃을 알 필요 없음 |
| **children으로 연결** | 하위 레이아웃은 상위의 children에 마운트 |

---

## 5. 올바른 패턴 vs 금지 패턴

### ✅ 올바른 패턴

```tsx
// Layout은 순수하게 영역만 정의
<AppLayout
  header={
    <Header
      left={<Logo />}
      center={<Nav />}
      right={<UserMenu />}
      bottom={<SubNav />}
    />
  }
  leftAside={<SideMenu />}
>
  {children}
</AppLayout>

// 기능 컴포넌트가 자체적으로 비즈니스 로직 처리
const Nav = () => {
  const menuStore = useMenuStore();
  const router = useRouter();

  const handleClickMenu = (menuId: string) => {
    menuStore.selectMenu(menuId);
    router.push(menuStore.selectedMenu?.path ?? "/");
  };

  return <NavUI items={menuStore.menuItems} onClickMenu={handleClickMenu} />;
};
```

### ❌ 금지 패턴

```tsx
// 1. 기능적 props 이름 사용
<Header
  logo={...}           // ❌ logo는 기능
  nav={...}            // ❌ nav는 기능
  userMenu={...}       // ❌ userMenu는 기능
/>

// 2. Layout에서 비즈니스 로직 핸들러 관리
const { onClickMenu, onLogout } = useAppLayout();  // ❌
<Nav onClickMenu={onClickMenu} />                  // ❌

// 3. Layout에 비즈니스 데이터 직접 전달
<Header
  menuItems={menuItems}        // ❌
  currentUser={currentUser}    // ❌
/>

// 4. 기능적 영역 이름
<AppLayout
  toolbar={...}        // ❌ toolbar는 기능
  subNav={...}         // ❌ subNav는 기능
/>

// 5. Page 컴포넌트 내부에서 Layout 사용 (매우 중요!)
// packages/ui/src/components/page/Login/LoginPage.tsx
export const LoginPage = () => {
  return (
    <AuthLayout>       // ❌ Page 안에 Layout이 있으면 안 됨!
      <Form ... />
    </AuthLayout>
  );
};
```

### ⚠️ Page 내 Layout 사용 발견 시 수정 방법

**Layout 빌더가 기존 코드를 분석할 때 Page 컴포넌트 내부에서 Layout이 사용되는 것을 발견하면 반드시 수정해야 합니다.**

1. Page 컴포넌트에서 Layout 제거
2. Next.js layout.tsx에서 Layout 사용

```tsx
// Before (잘못된 패턴)
// packages/ui/.../LoginPage.tsx
export const LoginPage = () => {
  return <AuthLayout><Form /></AuthLayout>;  // ❌
};

// apps/admin/app/auth/layout.tsx
export default function Layout({ children }) {
  return <>{children}</>;  // Layout 없음
}

// After (올바른 패턴)
// packages/ui/.../LoginPage.tsx
export const LoginPage = () => {
  return <Form />;  // ✅ 순수 UI만
};

// apps/admin/app/auth/layout.tsx
export default function Layout({ children }) {
  return <AuthLayout>{children}</AuthLayout>;  // ✅ Layout은 여기서만
}
```

---

## 6. 레이아웃 구조도 (AppLayout)

```
┌──────────────────────────────────────────────────────────────┐
│                           header                              │
│  ┌──────────┬───────────────────────────────┬──────────┐     │
│  │   left   │            center             │   right  │     │
│  │  (Logo)  │            (Nav)              │(UserMenu)│     │
│  └──────────┴───────────────────────────────┴──────────┘     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                        bottom                          │  │
│  │                       (SubNav)                         │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────┬────────────────────────────────────┬──────────────┤
│          │                                    │              │
│leftAside │               Main                 │  rightAside  │
│(SideMenu)│          (<Main>{children}</Main>) │  (Optional)  │
│          │                                    │              │
├──────────┴────────────────────────────────────┴──────────────┤
│                           footer                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. 컴포넌트 설계

### AppLayout

```tsx
// packages/ui/src/components/ui/layouts/AppLayout/AppLayout.tsx

export interface AppLayoutProps {
  /** 상단 영역 */
  header?: ReactNode;
  /** 좌측 영역 */
  leftAside?: ReactNode;
  /** 우측 영역 */
  rightAside?: ReactNode;
  /** 하단 영역 */
  footer?: ReactNode;
  /** 메인 콘텐츠 */
  children: ReactNode;
}

export const AppLayout = ({
  header,
  leftAside,
  rightAside,
  footer,
  children
}: AppLayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      {header && <header>{header}</header>}
      <div className="flex flex-1 overflow-hidden">
        {leftAside && <aside className="flex-shrink-0">{leftAside}</aside>}
        {children}  {/* <Main>{content}</Main> 형태로 사용 */}
        {rightAside && <aside className="flex-shrink-0">{rightAside}</aside>}
      </div>
      {footer && <footer>{footer}</footer>}
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

### Main

```tsx
// packages/ui/src/components/ui/layouts/Main/Main.tsx

export interface MainProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main 컴포넌트
 * SEO를 위한 시맨틱 main 태그를 제공하는 컴포넌트
 */
export const Main = ({ children, className }: MainProps) => {
  return (
    <main className={`flex flex-1 flex-col overflow-hidden ${className ?? ""}`}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </div>
    </main>
  );
};
```

---

## 8. 실제 사용 예시

### Layout 파일 (순수 영역 정의)

```tsx
// apps/admin/app/(admin)/layout.tsx
"use client";

import { AppLayout, Header, Main } from "@cocrepo/ui";
import { Logo, Navbar, UserMenu, SubNav, SideMenu } from "@cocrepo/ui/feature";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      header={
        <Header
          left={<Logo />}
          center={<Navbar />}
          right={<UserMenu />}
          bottom={<SubNav />}
        />
      }
      leftAside={<SideMenu />}
    >
      <Main>{children}</Main>
    </AppLayout>
  );
}
```

### Feature 컴포넌트 (자체 비즈니스 로직 처리)

```tsx
// packages/ui/src/components/feature/Navbar/Navbar.tsx
"use client";

import { observer } from "mobx-react-lite";
import { useMenuStore } from "@cocrepo/store";
import { useRouter } from "next/navigation";

export const Navbar = observer(() => {
  const menuStore = useMenuStore();
  const router = useRouter();

  const handleClickMenu = (menuId: string) => {
    menuStore.selectMenu(menuId);
    router.push(menuStore.selectedMenu?.path ?? "/");
  };

  return (
    <nav className="flex gap-4">
      {menuStore.menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClickMenu(item.id)}
          className={menuStore.selectedMenuId === item.id ? "font-bold" : ""}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
});
```

```tsx
// packages/ui/src/components/feature/UserMenu/UserMenu.tsx
"use client";

import { observer } from "mobx-react-lite";
import { useAuthStore } from "@cocrepo/store";
import { useRouter } from "next/navigation";

export const UserMenu = observer(() => {
  const authStore = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await authStore.logout();
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-2">
      <span>{authStore.currentUser?.name}</span>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
});
```

---

## 9. 폴더 구조

```
packages/ui/src/components/
├── ui/layouts/                    # Layout 컴포넌트 (순수 위치 정의)
│   ├── AppLayout/
│   │   ├── AppLayout.tsx
│   │   └── index.ts
│   ├── PageLayout/
│   │   ├── PageLayout.tsx
│   │   └── index.ts
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── index.ts
│   ├── Main/
│   │   ├── Main.tsx               # SEO용 main 태그 제공
│   │   └── index.ts
│   ├── Modal/
│   │   └── Modal.tsx
│   └── index.ts
│
└── feature/                       # Feature 컴포넌트 (비즈니스 로직 포함)
    ├── Logo/
    ├── Navbar/
    ├── UserMenu/
    ├── SubNav/
    ├── TopNav/
    ├── Auth/
    ├── CollapsibleSidebar/
    ├── ContextSelector/
    ├── NavbarItem/
    └── index.ts
```

---

## 10. 스타일링 규칙 (Critical)

**커스텀 className 사용 금지 - HeroUI와 기존 컴포넌트만 사용**

> **예외**: `components/ui/`와 `components/inputs/`에서만 커스텀 className이 허용됩니다. Layout 컴포넌트에서는 금지입니다.

Layout 컴포넌트 내부에서도 직접 Tailwind className을 작성하지 않습니다.

```tsx
// ❌ 금지 - 커스텀 className 직접 사용
export const Header = ({ left, center, right }: HeaderProps) => {
  return (
    <header className="border-b">
      <div className="flex items-center h-16 px-6">
        <div className="flex-shrink-0">{left}</div>
        <div className="flex-1 mx-6">{center}</div>
        <div className="flex-shrink-0">{right}</div>
      </div>
    </header>
  );
};

// ✅ 올바른 패턴 - 레이아웃 컴포넌트와 HeroUI 조합
export const Header = ({ left, center, right }: HeaderProps) => {
  return (
    <header>
      <HStack align="center" className="h-16 px-6 border-b">
        <div>{left}</div>
        <Spacer />
        <div>{center}</div>
        <Spacer />
        <div>{right}</div>
      </HStack>
    </header>
  );
};
```

**Layout 컴포넌트 내부 스타일링 원칙:**

| 허용 | 금지 |
|------|------|
| `<HStack>`, `<VStack>` 레이아웃 컴포넌트 | `className="flex items-center"` |
| `<Spacer />` 간격 컴포넌트 | `className="gap-4 mt-2"` |
| HeroUI Divider 등 | `className="border-b"` |

**자주 사용되는 레이아웃 패턴 발견 시:**
1. 기존 레이아웃 컴포넌트(HStack, VStack, Spacer)로 해결 가능한지 확인
2. 해결 불가능하면 **UI 컴포넌트 빌더**에게 새 레이아웃 컴포넌트 생성 요청
3. 생성된 컴포넌트를 Layout에서 활용

---

## 11. 체크리스트

### Layout 컴포넌트 설계 시

- [ ] AppLayout은 HTML5 시맨틱 태그(header, aside, footer)를 사용하는가?
- [ ] 하위 레이아웃은 위치 속성(top, bottom, left, right, center)을 사용하는가?
- [ ] 기능적 명칭을 props로 사용하지 않았는가? (toolbar ❌, subNav ❌, logo ❌)
- [ ] 비즈니스 데이터를 직접 받지 않는가?
- [ ] 내용물은 ReactNode로 주입받는가?

### Layout 사용 시

- [ ] Layout 파일에 비즈니스 로직이 없는가? (핸들러, 데이터 조회 등)
- [ ] 기능 컴포넌트가 자체적으로 store, router를 사용하는가?
- [ ] 기능적 컴포넌트를 위치 영역에 마운트했는가?
- [ ] 모든 기능 컴포넌트가 최상위에서 한눈에 보이는가?

### 중첩 레이아웃 사용 시

- [ ] 각 레이아웃이 올바른 계층의 컴포넌트를 사용하는가? (AppLayout → PageLayout)
- [ ] 하위 레이아웃은 상위 레이아웃의 children에 마운트되는가?

---

## 11. 요약

### 레이아웃 계층

| 레이아웃 | 용도 | 영역 props | 사용 위치 |
|----------|------|------------|-----------|
| **AppLayout** | 앱 전체 구조 | header, leftAside, rightAside, footer | `app/(admin)/layout.tsx` |
| **PageLayout** | 페이지 내부 구조 | top, bottom, left, right | `app/(admin)/users/layout.tsx` |

### 영역 명칭

| 구분 | 명칭 기준 | 예시 |
|------|----------|------|
| **AppLayout** | HTML5 시맨틱 + 위치 | header, leftAside, rightAside, footer |
| **하위 레이아웃** | 위치 속성 | top, bottom, left, right, center(children) |
| **Feature 컴포넌트** | 영역에 마운트 | Logo, Navbar, Tabs, UserMenu, SideMenu |

### 핵심 원칙

1. **Layout은 순수 영역만 정의** - 비즈니스 로직 없음
2. **Feature 컴포넌트가 로직 담당** - 자체적으로 store, router 사용
3. **Main 컴포넌트로 SEO 지원** - 시맨틱 main 태그 제공

```tsx
// Layout 파일 - 순수 영역 정의
import { AppLayout, Header, Main } from "@cocrepo/ui";
import { Logo, Navbar, UserMenu, SideMenu } from "@cocrepo/ui/feature";

<AppLayout
  header={<Header left={<Logo />} center={<Navbar />} right={<UserMenu />} />}
  leftAside={<SideMenu />}
>
  <Main>{children}</Main>
</AppLayout>

// Feature 컴포넌트 - 자체 비즈니스 로직
const Navbar = observer(() => {
  const menuStore = useMenuStore();
  const router = useRouter();
  // 자체적으로 store, router 사용
});
```
