# ResponsiveVisibility Component

특정 디바이스 타입에서 컴포넌트를 숨기거나 보여주는 래퍼 컴포넌트입니다.

## 기능

- **모바일/데스크톱 별 숨김/보이기**: `device` prop으로 어떤 디바이스에서 숨길지 설정
- **유연한 브레이크포인트**: `breakpoint` prop으로 반응형 기준점 조정 가능
- **편의 컴포넌트**: `DesktopOnly`, `MobileOnly` 별칭 컴포넌트 제공
- **Tailwind CSS 기반**: Tailwind의 반응형 유틸리티 클래스 사용
- **TypeScript 지원**: 완전한 타입 안전성 제공

## 컴포넌트

### ResponsiveVisibility

메인 컴포넌트로 세밀한 제어가 가능합니다.

### DesktopOnly

데스크톱에서만 표시되는 컴포넌트입니다 (모바일에서 숨김).

### MobileOnly

모바일에서만 표시되는 컴포넌트입니다 (데스크톱에서 숨김).

## Props

### ResponsiveVisibility Props

| Prop         | Type                                    | Default | Description            |
| ------------ | --------------------------------------- | ------- | ---------------------- |
| `children`   | `ReactNode`                             | -       | 숨기거나 보여줄 컨텐츠 |
| `device`     | `'mobile' \| 'pc'`                      | -       | 숨길 디바이스 타입     |
| `breakpoint` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'xl'`  | 반응형 기준점          |
| `className`  | `string`                                | `''`    | 추가 CSS 클래스        |

### DesktopOnly / MobileOnly Props

| Prop         | Type                                    | Default | Description            |
| ------------ | --------------------------------------- | ------- | ---------------------- |
| `children`   | `ReactNode`                             | -       | 숨기거나 보여줄 컨텐츠 |
| `breakpoint` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'xl'`  | 반응형 기준점          |
| `className`  | `string`                                | `''`    | 추가 CSS 클래스        |

## 사용법

### 기본 사용법

```tsx
import { ResponsiveVisibility, DesktopOnly, MobileOnly } from '@shared/frontend';

// 방법 1: ResponsiveVisibility 사용
<ResponsiveVisibility device="mobile">
  <div>데스크톱 전용 네비게이션</div>
</ResponsiveVisibility>

<ResponsiveVisibility device="pc">
  <div>모바일 전용 햄버거 메뉴</div>
</ResponsiveVisibility>

// 방법 2: 편의 컴포넌트 사용 (추천)
<DesktopOnly>
  <div>데스크톱 전용 네비게이션</div>
</DesktopOnly>

<MobileOnly>
  <div>모바일 전용 햄버거 메뉴</div>
</MobileOnly>
```

### 커스텀 브레이크포인트

```tsx
// lg 브레이크포인트(1024px) 사용
<DesktopOnly breakpoint="lg">
  <div>1024px 이상에서만 표시</div>
</DesktopOnly>

<MobileOnly breakpoint="md">
  <div>768px 미만에서만 표시</div>
</MobileOnly>
```

### 반응형 레이아웃 구성

```tsx
function ResponsiveHeader() {
  return (
    <header>
      {/* 데스크톱 네비게이션 */}
      <DesktopOnly>
        <nav className="flex space-x-4">
          <a href="/home">홈</a>
          <a href="/about">소개</a>
          <a href="/contact">연락처</a>
        </nav>
      </DesktopOnly>

      {/* 모바일 햄버거 메뉴 */}
      <MobileOnly>
        <button className="hamburger-menu">☰</button>
      </MobileOnly>
    </header>
  );
}
```

## 브레이크포인트 참고

| Breakpoint | Min-width | Description                  |
| ---------- | --------- | ---------------------------- |
| `sm`       | 640px     | Small screens                |
| `md`       | 768px     | Medium screens               |
| `lg`       | 1024px    | Large screens                |
| `xl`       | 1280px    | Extra large screens (기본값) |
| `2xl`      | 1536px    | 2X large screens             |

## device prop 동작 (ResponsiveVisibility만 해당)

- `device="mobile"`: 모바일에서 숨기고 설정된 브레이크포인트 이상에서 표시
- `device="pc"`: 모바일에서 표시하고 설정된 브레이크포인트 이상에서 숨김

## 실제 사용 예제

### Header 컴포넌트와 함께 사용

```tsx
import { Header, DesktopOnly, MobileOnly } from '@shared/frontend';

function App() {
  return (
    <Header
      leftComponent={
        <MobileOnly>
          <HamburgerMenu />
        </MobileOnly>
      }
      centerComponent={<Logo />}
      rightComponent={
        <DesktopOnly>
          <DesktopNavigation />
        </DesktopOnly>
      }
    />
  );
}
```

### DashboardLayout과 함께 사용

```tsx
import { DashboardLayout, DesktopOnly, MobileOnly } from '@shared/frontend';

function Dashboard() {
  return (
    <DashboardLayout
      headerComponent={<Header />}
      leftSidebarComponent={
        <DesktopOnly>
          <Sidebar />
        </DesktopOnly>
      }
      bottomComponent={
        <MobileOnly>
          <MobileBottomNavigation />
        </MobileOnly>
      }
    >
      <MainContent />
    </DashboardLayout>
  );
}
```

### 복잡한 반응형 UI 패턴

```tsx
function ResponsiveNavigation() {
  return (
    <div className="navigation">
      {/* 데스크톱: 전체 메뉴 */}
      <DesktopOnly>
        <nav className="horizontal-menu">
          <MenuItem href="/dashboard">대시보드</MenuItem>
          <MenuItem href="/users">사용자</MenuItem>
          <MenuItem href="/settings">설정</MenuItem>
          <MenuItem href="/reports">리포트</MenuItem>
        </nav>
      </DesktopOnly>

      {/* 모바일: 축약된 메뉴 */}
      <MobileOnly>
        <nav className="mobile-menu">
          <DropdownMenu>
            <MenuItem href="/dashboard">대시보드</MenuItem>
            <MenuItem href="/users">사용자</MenuItem>
            <MenuItem href="/settings">설정</MenuItem>
            <MenuItem href="/reports">리포트</MenuItem>
          </DropdownMenu>
        </nav>
      </MobileOnly>
    </div>
  );
}
```
