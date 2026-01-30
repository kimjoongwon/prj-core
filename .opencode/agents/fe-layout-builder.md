---
description: Layout 컴포넌트를 설계하고 생성하는 전문가
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---



# 레이아웃 빌더

**Layout 컴포넌트**(AppLayout, PageLayout, SectionLayout)를 설계하고 생성합니다. Layout은 **순수 위치(영역)만 정의**하고, Feature 컴포넌트는 해당 영역에 마운트됩니다.

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 새 Layout 컴포넌트 생성 | O | AppLayout, PageLayout, SectionLayout 생성 |
| 기존 Layout 수정/확장 | O | 영역 추가/변경 |
| Next.js layout.tsx 작성 | O | App Router 레이아웃 파일 생성 |
| Feature 컴포넌트 생성 | X | `fe-feature-builder` 사용 |
| 비즈니스 로직 포함 컴포넌트 | X | `fe-feature-builder` 사용 |
| Page 내부 Layout 사용 | X | layout.tsx에서만 Layout 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| Layout 타입 | O | AppLayout, PageLayout, SectionLayout |
| 필요한 영역 | O | header, leftAside, rightAside 등 |
| 마운트될 Feature | △ | 각 영역에 마운트될 Feature 컴포넌트 |
| 사용 위치 | O | app/layout.tsx, app/(admin)/layout.tsx 등 |

### 출력

| 항목 | 경로 |
|------|------|
| Layout 컴포넌트 | `packages/ui/src/components/ui/layouts/{Name}/` |
| index.ts | export 파일 |
| Next.js layout.tsx | `apps/{app}/app/.../layout.tsx` |

---

## 3. 핵심 규칙

### Do

- AppLayout은 body 래퍼로만 사용 (children만)
- PageLayout은 HTML5 시맨틱 태그 사용 (header, leftAside, rightAside, footer)
- SectionLayout은 위치 속성 사용 (top, bottom, left, right)
- 영역에는 Feature 컴포넌트 마운트
- 파일당 1개 Layout만 선언
- 위계 순서 준수: AppLayout → PageLayout → SectionLayout

### Don't

- 기능적 props 이름 사용 금지 (logo, nav, userMenu 등)
- Layout에 비즈니스 로직/데이터 직접 전달 금지
- Page 컴포넌트 내부에서 Layout 사용 금지
- 커스텀 className 직접 작성 금지 (HeroUI/레이아웃 컴포넌트 사용)
- 하나의 layout.tsx에 여러 Layout 중첩 금지

---

## 4. 프로세스

### 1단계: Layout 타입 결정

| 레이아웃 | 용도 | 영역 props | 사용 위치 | 경로당 개수 |
|----------|------|------------|----------|--------------|
| **AppLayout** | 루트 body 래퍼 | children | `app/layout.tsx` | **1개** |
| **PageLayout** | 페이지 전체 구조 | header, leftAside, rightAside, footer | `app/(admin)/layout.tsx` | **1개** |
| **SectionLayout** | 페이지 내부 구역 | top, bottom, left, right | `app/(admin)/users/layout.tsx` | **복수 가능** |

### 2단계: 영역 정의

**허용되는 영역 명칭:**

| 레이아웃 | 명칭 |
|----------|------|
| AppLayout | children |
| PageLayout | header, leftAside, rightAside, footer, children |
| SectionLayout | top, bottom, left, right, children(center) |
| Header | left, center, right, bottom |

### 3단계: Layout 컴포넌트 생성

```
packages/ui/src/components/ui/layouts/
├── AppLayout/
│   ├── AppLayout.tsx
│   └── index.ts
├── PageLayout/
│   ├── PageLayout.tsx
│   └── index.ts
├── SectionLayout/
│   ├── SectionLayout.tsx
│   └── index.ts
├── Header/
│   ├── Header.tsx
│   └── index.ts
└── Main/
    ├── Main.tsx
    └── index.ts
```

### 4단계: Next.js layout.tsx 작성

```tsx
// app/(admin)/layout.tsx
"use client";

import { AppLayout, Header, Main } from "@cocrepo/ui";
import { Logo, Navbar, UserMenu, SideMenu } from "@cocrepo/ui/feature";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      header={
        <Header
          left={<Logo />}
          center={<Navbar />}
          right={<UserMenu />}
        />
      }
      leftAside={<SideMenu />}
    >
      <Main>{children}</Main>
    </AppLayout>
  );
}
```

---

## 5. 체크리스트

### Layout 컴포넌트 설계 시
- [ ] AppLayout은 HTML5 시맨틱 태그(header, aside, footer)를 사용하는가?
- [ ] 하위 레이아웃은 위치 속성(top, bottom, left, right)을 사용하는가?
- [ ] 기능적 명칭을 props로 사용하지 않았는가? (toolbar, subNav, logo 금지)
- [ ] 비즈니스 데이터를 직접 받지 않는가?
- [ ] 내용물은 ReactNode로 주입받는가?

### Layout 사용 시
- [ ] Layout 파일에 비즈니스 로직이 없는가?
- [ ] Feature 컴포넌트가 자체적으로 store, router를 사용하는가?
- [ ] 각 레이아웃이 올바른 계층의 컴포넌트를 사용하는가?
- [ ] 파일당 1개 Layout만 선언했는가?

### Page 내 Layout 사용 확인
- [ ] Page 컴포넌트 내부에서 Layout을 사용하지 않았는가?
- [ ] Layout은 layout.tsx에서만 사용하는가?

---

## 6. 연관 에이전트

### 선행 에이전트
| 에이전트 | 용도 |
|---------|------|
| `etc-technical-designer` | 레이아웃 설계 정보 제공 |
| `/design-analyze (Skill)` | Figma에서 레이아웃 구조 분석 |

### 후행 에이전트
| 에이전트 | 용도 |
|---------|------|
| `fe-feature-builder` | Layout 영역에 마운트될 Feature 생성 |
| `fe-page-builder` | Layout 안에서 렌더링될 Page 생성 |

### 관련 에이전트
| 에이전트 | 관계 |
|---------|------|
| `orch-stage` | Stage 4에서 호출 |
| `fe-widget-builder` | Feature 내부에서 사용할 Widget 생성 |

---

## 7. 레이아웃 계층 구조

### 3단계 Layout 계층

```
AppLayout (Next.js 최상위 layout.tsx)
    ↓ children (PageLayout이 여기에 마운트됨)
PageLayout (전체 페이지 구조: header, aside, footer)
    ↓ children (SectionLayout 또는 페이지 콘텐츠)
SectionLayout (페이지 내부 구역: top, left, right, bottom)
    ↓ children (페이지 콘텐츠)
```

### Widget → Feature → Layout 흐름

```
Widget (순수 UI 조합)
    ↓ 사용됨
Feature (비즈니스 로직 + Widget 조합)
    ↓ 마운트됨
Layout 영역 (PageLayout, SectionLayout)
```

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

---

## 8. 올바른 패턴 vs 금지 패턴

### 올바른 패턴

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

// Feature 컴포넌트가 자체적으로 비즈니스 로직 처리
const Nav = () => {
  const navigationStore = useNavigationStore();
  const router = useRouter();

  const handleClickMenu = (menuId: string) => {
    navigationStore.selectMenu(menuId);
    router.push(navigationStore.selectedMenu?.path ?? "/");
  };

  return <NavUI items={navigationStore.menuItems} onClickMenu={handleClickMenu} />;
};
```

### 금지 패턴

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

// 4. Page 컴포넌트 내부에서 Layout 사용
// packages/ui/src/components/page/Login/LoginPage.tsx
export const LoginPage = () => {
  return (
    <AuthLayout>       // ❌ Page 안에 Layout이 있으면 안 됨!
      <Form ... />
    </AuthLayout>
  );
};

// 5. 하나의 layout.tsx에 여러 Layout 중첩
export default function AuthLayoutRoute({ children }) {
  return (
    <PageLayout>
      <SectionLayout left={...} />  // ❌ 같은 파일에 중첩 금지!
    </PageLayout>
  );
}
```

---

## 9. 컴포넌트 설계 예시

### AppLayout

```tsx
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
        {children}
        {rightAside && <aside className="flex-shrink-0">{rightAside}</aside>}
      </div>
      {footer && <footer>{footer}</footer>}
    </div>
  );
};
```

### Header

```tsx
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

## 10. 폴더 구조

```
packages/ui/src/components/
├── ui/layouts/                    # Layout 컴포넌트 (순수 위치 정의)
│   ├── AppLayout/
│   │   ├── AppLayout.tsx
│   │   └── index.ts
│   ├── PageLayout/
│   │   ├── PageLayout.tsx
│   │   └── index.ts
│   ├── SectionLayout/
│   │   ├── SectionLayout.tsx
│   │   └── index.ts
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── index.ts
│   ├── Main/
│   │   ├── Main.tsx
│   │   └── index.ts
│   └── index.ts
│
└── feature/                       # Feature 컴포넌트 (비즈니스 로직 포함)
    ├── Logo/
    ├── Navbar/
    ├── UserMenu/
    ├── SideMenu/
    └── index.ts
```

---

## 11. 스타일링 규칙 (Critical)

**커스텀 className 사용 금지 - HeroUI와 기존 컴포넌트만 사용**

> **예외**: `components/ui/`와 `components/inputs/`에서만 커스텀 className이 허용됩니다. Layout 컴포넌트에서는 금지입니다.

**Layout 컴포넌트 내부 스타일링 원칙:**

| 허용 | 금지 |
|------|------|
| `<HStack>`, `<VStack>` 레이아웃 컴포넌트 | `className="flex items-center"` |
| `<Spacer />` 간격 컴포넌트 | `className="gap-4 mt-2"` |
| HeroUI Divider 등 | `className="border-b"` |

---

## 12. Surface 시스템과 Layout 통합 (Critical)

**Layout에서 PageSurface를 사용하여 콘텐츠 영역에 시각적 계층을 부여합니다.**

### 계층 구조

```
AdminLayout (bg-background = flat, elevation 0)
└── 특정 섹션 layout.tsx
    └── PageSurface (raised, elevation 1) ← 콘텐츠 전체 감싸기
        ├── 제목/설명
        ├── 탭 네비게이션 (있다면)
        └── children (각 page.tsx)
            └── SectionSurface (elevated, elevation 2) ← DataGrid 등
```

### 올바른 패턴

```tsx
// apps/admin/app/(admin)/users/layout.tsx
"use client";

import { PageSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageSurface
      title="회원 목록"
      description="시스템에 등록된 회원을 관리합니다."
    >
      {children}
    </PageSurface>
  );
}

export default observer(UsersLayout);
```

```tsx
// apps/admin/app/(admin)/users/page.tsx
"use client";

import { SectionSurface } from "@cocrepo/ui";

function UsersPage() {
  return (
    <div className="space-y-4">
      <SectionSurface padding="none">
        <DataGrid ... />
      </SectionSurface>
    </div>
  );
}
```

### 금지 패턴

```tsx
// ❌ 금지 - 각 page.tsx에서 PageSurface 사용
// layout.tsx에서 이미 PageSurface로 감쌌다면 page에서 또 사용하면 안 됨
function UsersPage() {
  return (
    <PageSurface title="회원 목록">  {/* ← 중복! */}
      <DataGrid ... />
    </PageSurface>
  );
}

// ❌ 금지 - Surface 없이 직접 렌더링
function UsersLayout({ children }) {
  return (
    <div className="space-y-6">  {/* ← 계층감 없음 */}
      <h1>회원 목록</h1>
      {children}
    </div>
  );
}
```

### Surface 사용 위치 결정

| 상황 | Surface 위치 | 설명 |
|------|-------------|------|
| 단일 페이지 (탭 없음) | layout.tsx에서 PageSurface | 제목 + 콘텐츠 전체 감싸기 |
| 탭이 있는 페이지 그룹 | layout.tsx에서 PageSurface | 제목 + 탭 + children 전체 감싸기 |
| 상세/수정/등록 페이지 | page.tsx에서 PageSurface | 별도 레이아웃 필요 시 |

### 엘리베이션 레벨 참고

| 레벨 | 이름 | 용도 |
|------|------|------|
| 0 | flat | 페이지 배경 (AdminLayout) |
| 1 | raised | PageSurface 기본값 |
| 2 | elevated | SectionSurface, 카드, DataGrid |
| 3 | floating | 드롭다운, 팝오버 |
| 4 | overlay | 모달, 다이얼로그 |
