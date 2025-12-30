# 📋 AdminLayout & MenuSystem 화면 기획서

**플랫폼:** Admin Web

## 1. 화면 개요

### 목적
엔터프라이즈급 멀티테넌트 어드민 시스템의 전체 레이아웃과 메뉴 시스템을 제공합니다. 상단에 주요 도메인 메뉴를 배치하고, 각 메뉴 클릭 시 하위 메뉴가 표시되는 2단계 네비게이션 구조를 구현합니다.

### 진입 조건
- Ground 선택 완료 (Space 컨텍스트 설정됨)
- 관리자 인증 완료
- 어드민 페이지 접근 시

### 이탈 조건
- 로그아웃
- Ground 재선택

---

## 2. 화면 구조

### 레이아웃 (Admin Web)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] 회원  예약  알림  문의  콘텐츠  설정    [Ground A ▼] [Admin▼]│
├─────────────────────────────────────────────────────────────────┤
│ 회원 목록 │ 회원 상세 │ 회원 등급 │ 탈퇴 회원                      │ ← 하위 메뉴 (2단계)
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                     페이지 콘텐츠 영역                            │
│                                                                 │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 컴포넌트 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| Top Header | AdminTopNav | 로고 + 주요 메뉴 (1단계) + Ground 선택 + 사용자 메뉴 |
| Sub Header | AdminSubNav | 선택된 주요 메뉴의 하위 메뉴 (2단계) |
| Main Content | Outlet (React Router) | 실제 페이지 콘텐츠 |

---

## 3. 데이터 요구사항

### 메뉴 구조 정의 (CASL 권한 시스템 적용)

```typescript
interface MenuItem {
  id: string;
  label: string;
  path?: string; // 하위 메뉴가 없는 경우
  icon?: React.ComponentType;
  children?: SubMenuItem[];
  subject: string; // CASL Subject (예: 'menu:members')
}

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType;
  subject: string; // CASL Subject (예: 'menu:members:list')
}
```

### CASL Subject 명명 규칙

| Subject 패턴 | 설명 | 예시 |
|-------------|------|------|
| `menu:{domain}` | 주요 메뉴 접근 | `menu:members` |
| `menu:{domain}:{sub}` | 하위 메뉴 접근 | `menu:members:grades` |
| `feature:{name}` | 특정 기능 접근 | `feature:export` |
| `{Entity}` | 엔티티 CRUD | `User`, `Reservation` |

### 메뉴 데이터 구조

```typescript
const adminMenuConfig: MenuItem[] = [
  {
    id: 'members',
    label: '회원',
    icon: UsersIcon,
    subject: 'menu:members',
    children: [
      {
        id: 'members-list',
        label: '회원 목록',
        path: '/admin/members',
        subject: 'menu:members:list',
      },
      {
        id: 'members-detail',
        label: '회원 상세',
        path: '/admin/members/:id',
        subject: 'menu:members:detail',
      },
      {
        id: 'members-grade',
        label: '회원 등급 관리',
        path: '/admin/members/grades',
        subject: 'menu:members:grades',
      },
      {
        id: 'members-withdrawn',
        label: '탈퇴 회원',
        path: '/admin/members/withdrawn',
        subject: 'menu:members:withdrawn',
      },
    ],
  },
  {
    id: 'reservations',
    label: '예약',
    icon: CalendarIcon,
    subject: 'menu:reservations',
    children: [
      {
        id: 'reservations-list',
        label: '예약 목록',
        path: '/admin/reservations',
        subject: 'menu:reservations:list',
      },
      {
        id: 'reservations-calendar',
        label: '예약 캘린더',
        path: '/admin/reservations/calendar',
        subject: 'menu:reservations:calendar',
      },
      {
        id: 'reservations-stats',
        label: '예약 통계',
        path: '/admin/reservations/statistics',
        subject: 'menu:reservations:statistics',
      },
      {
        id: 'reservations-cancel',
        label: '취소/환불 관리',
        path: '/admin/reservations/cancellations',
        subject: 'menu:reservations:cancellations',
      },
    ],
  },
  {
    id: 'notifications',
    label: '알림',
    icon: BellIcon,
    subject: 'menu:notifications',
    children: [
      {
        id: 'notifications-send',
        label: '알림 발송',
        path: '/admin/notifications/send',
        subject: 'menu:notifications:send',
      },
      {
        id: 'notifications-templates',
        label: '알림 템플릿',
        path: '/admin/notifications/templates',
        subject: 'menu:notifications:templates',
      },
      {
        id: 'notifications-history',
        label: '발송 이력',
        path: '/admin/notifications/history',
        subject: 'menu:notifications:history',
      },
      {
        id: 'notifications-settings',
        label: '푸시 설정',
        path: '/admin/notifications/settings',
        subject: 'menu:notifications:settings',
      },
    ],
  },
  {
    id: 'inquiries',
    label: '문의',
    icon: MessageIcon,
    subject: 'menu:inquiries',
    children: [
      {
        id: 'inquiries-list',
        label: '문의 목록',
        path: '/admin/inquiries',
        subject: 'menu:inquiries:list',
      },
      {
        id: 'inquiries-answer',
        label: '답변 관리',
        path: '/admin/inquiries/answers',
        subject: 'menu:inquiries:answers',
      },
      {
        id: 'inquiries-faq',
        label: 'FAQ 관리',
        path: '/admin/inquiries/faq',
        subject: 'menu:inquiries:faq',
      },
      {
        id: 'inquiries-1on1',
        label: '1:1 문의',
        path: '/admin/inquiries/1on1',
        subject: 'menu:inquiries:1on1',
      },
    ],
  },
  {
    id: 'contents',
    label: '콘텐츠',
    icon: FileTextIcon,
    subject: 'menu:contents',
    children: [
      {
        id: 'contents-notices',
        label: '공지사항',
        path: '/admin/contents/notices',
        subject: 'menu:contents:notices',
      },
      {
        id: 'contents-events',
        label: '이벤트',
        path: '/admin/contents/events',
        subject: 'menu:contents:events',
      },
      {
        id: 'contents-banners',
        label: '배너 관리',
        path: '/admin/contents/banners',
        subject: 'menu:contents:banners',
      },
      {
        id: 'contents-terms',
        label: '약관 관리',
        path: '/admin/contents/terms',
        subject: 'menu:contents:terms',
      },
    ],
  },
  {
    id: 'templates',
    label: '템플릿',
    icon: DocumentIcon,
    subject: 'menu:templates',
    children: [
      {
        id: 'templates-email',
        label: '이메일 템플릿',
        path: '/admin/templates/email',
        subject: 'menu:templates:email',
      },
      {
        id: 'templates-sms',
        label: 'SMS 템플릿',
        path: '/admin/templates/sms',
        subject: 'menu:templates:sms',
      },
      {
        id: 'templates-push',
        label: '푸시 템플릿',
        path: '/admin/templates/push',
        subject: 'menu:templates:push',
      },
      {
        id: 'templates-html',
        label: 'HTML 템플릿',
        path: '/admin/templates/html',
        subject: 'menu:templates:html',
      },
    ],
  },
  {
    id: 'settings',
    label: '설정',
    icon: SettingsIcon,
    subject: 'menu:settings',
    children: [
      {
        id: 'settings-ground',
        label: 'Ground 정보',
        path: '/admin/settings/ground',
        subject: 'menu:settings:ground',
      },
      {
        id: 'settings-admins',
        label: '관리자 계정',
        path: '/admin/settings/admins',
        subject: 'menu:settings:admins',
      },
      {
        id: 'settings-permissions',
        label: '권한 관리',
        path: '/admin/settings/permissions',
        subject: 'menu:settings:permissions',
      },
      {
        id: 'settings-system',
        label: '시스템 설정',
        path: '/admin/settings/system',
        subject: 'menu:settings:system',
      },
    ],
  },
];
```

### 필요한 상태

| 상태 | 타입 | 설명 | 초기값 |
|------|------|------|--------|
| selectedMainMenu | string \| null | 선택된 주요 메뉴 ID | null |
| selectedSubMenu | string \| null | 선택된 하위 메뉴 ID | null |
| currentGround | AdminGround \| null | 현재 선택된 Ground | null |
| currentUser | AdminUser \| null | 현재 로그인한 관리자 정보 | null |
| isGroundSelectorOpen | boolean | Ground 선택 드롭다운 열림 상태 | false |
| isUserMenuOpen | boolean | 사용자 메뉴 드롭다운 열림 상태 | false |

### 저장소에서 가져올 데이터

```typescript
// localStorage
const currentGroundId = localStorage.getItem('currentGroundId');
const currentSpaceId = localStorage.getItem('currentSpaceId');

// sessionStorage
const adminRole = sessionStorage.getItem('adminRole');
```

---

## 4. 인터랙션 정의

### 사용자 액션

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 주요 메뉴 클릭 | 상단 메뉴 항목 클릭 | 하위 메뉴 표시, 첫 번째 하위 메뉴로 이동 |
| 하위 메뉴 클릭 | 하위 메뉴 항목 클릭 | 해당 페이지로 이동 |
| Ground 선택 버튼 클릭 | Ground 드롭다운 클릭 | Ground 목록 드롭다운 표시 |
| Ground 변경 | 드롭다운에서 다른 Ground 선택 | Space 선택 페이지로 이동 또는 즉시 변경 |
| 사용자 메뉴 클릭 | 우측 상단 사용자 아이콘 클릭 | 프로필, 로그아웃 메뉴 표시 |
| 로그아웃 | 로그아웃 메뉴 클릭 | 로그인 페이지로 이동 |

### 핸들러 정의

| 핸들러 | 파라미터 | 동작 |
|--------|----------|------|
| onClickMainMenu | menuId: string | selectedMainMenu 업데이트, 첫 번째 하위 메뉴로 navigate |
| onClickSubMenu | menuId: string, path: string | selectedSubMenu 업데이트, path로 navigate |
| onClickGroundSelector | - | isGroundSelectorOpen 토글 |
| onChangeGround | - | /admin/select-space로 navigate |
| onClickUserMenu | - | isUserMenuOpen 토글 |
| onClickLogout | - | 인증 정보 제거, 로그인 페이지로 navigate |

### 상태 변화 흐름

```
페이지 진입 (예: /admin/members)
    ↓
URL 기반으로 selectedMainMenu, selectedSubMenu 자동 설정
    ↓
localStorage에서 currentGroundId, currentSpaceId 로드
AbilityProvider에서 사용자 권한 로드
    ↓
메뉴 권한 필터링 (CASL ability 기반)
    ↓
사용자가 주요 메뉴 클릭 (예: "예약")
    ↓
selectedMainMenu = "reservations"
하위 메뉴 표시
첫 번째 하위 메뉴로 navigate (/admin/reservations)
    ↓
사용자가 하위 메뉴 클릭 (예: "예약 캘린더")
    ↓
selectedSubMenu = "reservations-calendar"
navigate to /admin/reservations/calendar
```

---

## 5. UI 상세

### Top Header (AdminTopNav)

**구성 요소:**
- 좌측: 로고 + 주요 메뉴 (가로 배치)
- 우측: Ground 선택 드롭다운 + 사용자 메뉴

**스타일:**
- 높이: 64px
- 배경: White
- Border Bottom: 1px solid gray-200
- 메뉴 항목 간격: 24px
- 선택된 메뉴: Primary color underline (2px)

### Sub Header (AdminSubNav)

**구성 요소:**
- 선택된 주요 메뉴의 하위 메뉴 항목 (가로 배치)

**스타일:**
- 높이: 48px
- 배경: gray-50
- Border Bottom: 1px solid gray-200
- 메뉴 항목 간격: 16px
- 선택된 메뉴: Primary color background + white text

### Ground 선택 드롭다운

**표시 정보:**
- 현재 Ground 이름 + 아이콘
- 클릭 시 "Ground 변경하기" 옵션 표시

**동작:**
- "Ground 변경하기" 클릭 시 /admin/select-space로 이동

### 사용자 메뉴 드롭다운

**표시 정보:**
- 관리자 이름
- 권한 (예: "최고 관리자")
- 로그아웃 버튼

---

## 6. 기존 컴포넌트 활용 제안

### 사용 가능한 기존 컴포넌트

| 컴포넌트 | 용도 | 경로 |
|----------|------|------|
| HStack | 수평 정렬 | components/ui/surfaces/HStack |
| VStack | 수직 정렬 | components/ui/surfaces/VStack |
| Text | 텍스트 표시 | components/ui/data-display/Text |
| Button | 버튼 | components/ui/inputs/Button |
| Dropdown (HeroUI) | 드롭다운 | @heroui/react |
| Avatar (HeroUI) | 사용자 아바타 | @heroui/react |

### 신규 컴포넌트 필요 여부
- [x] 필요함 → 아래 명세 참고

### 신규 컴포넌트 명세

---
**AdminTopNav 컴포넌트를 만들어주세요.**

**Props:**
- menuItems: MenuItem[] (주요 메뉴 데이터)
- selectedMenuId: string | null (선택된 메뉴 ID)
- currentGround: AdminGround (현재 Ground)
- currentUser: AdminUser (현재 사용자)
- onClickMenu: (menuId: string) => void
- onChangeGround: () => void
- onLogout: () => void

**표시 내용:**
- 로고
- 주요 메뉴 (CASL ability 기반 권한 필터링 적용)
- Ground 선택 드롭다운
- 사용자 메뉴 드롭다운

**권한 처리:**
- `useFilteredMenuItems` 훅으로 접근 가능한 메뉴만 필터링
- 또는 `Can` 컴포넌트로 개별 메뉴 표시/숨김 처리

**카테고리:** admin
**Storybook:** 필요
**경로:** packages/ui/src/components/admin/AdminTopNav/AdminTopNav.tsx

---

---
**AdminSubNav 컴포넌트를 만들어주세요.**

**Props:**
- subMenuItems: SubMenuItem[] (하위 메뉴 데이터)
- selectedSubMenuId: string | null (선택된 하위 메뉴 ID)
- onClickSubMenu: (menuId: string, path: string) => void

**표시 내용:**
- 하위 메뉴 항목 (가로 배치)
- 선택된 메뉴 강조

**카테고리:** admin
**Storybook:** 필요
**경로:** packages/ui/src/components/admin/AdminSubNav/AdminSubNav.tsx

---

---
**AdminLayout 컴포넌트를 만들어주세요.**

**Props:**
- children: React.ReactNode

**구조:**
- AdminTopNav
- AdminSubNav
- Main Content (children)

**카테고리:** admin
**Storybook:** 불필요 (레이아웃)
**경로:** packages/ui/src/components/admin/AdminLayout/AdminLayout.tsx

---

---

## 7. 페이지 빌더 전달 내용

### 페이지-빌더에게 요청할 내용

---
**AdminLayout을 전체 어드민 페이지의 레이아웃으로 적용해주세요.**

**적용 위치:**
- /admin/* 경로의 모든 페이지 (단, /admin/select-space 제외)

**필요한 로직:**
- URL 기반 자동 메뉴 선택
- localStorage에서 currentGroundId, currentSpaceId 로드
- AbilityProvider에서 사용자 권한 로드
- CASL ability 기반 메뉴 필터링 (`useFilteredMenuItems` 훅 사용)
- 메뉴 클릭 시 라우팅
- 권한 없는 페이지 접근 시 403 처리

**라우터 구조 예시:**
```tsx
import { AbilityProvider } from '@packages/hook/casl';

// App.tsx
<AbilityProvider>
  <Routes>
    <Route path="/admin/select-space" element={<AdminSpaceSelectPage />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="members" element={<MembersListPage />} />
      <Route path="members/:id" element={<MemberDetailPage />} />
      {/* ... 기타 페이지 */}
    </Route>
  </Routes>
</AbilityProvider>
```

**권한 체크 래퍼 컴포넌트:**
```tsx
// ProtectedRoute.tsx
import { useAbility } from '@packages/hook/casl';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  subject: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ subject, children }: ProtectedRouteProps) {
  const ability = useAbility();

  if (!ability.can('ACCESS', subject)) {
    return <Navigate to="/admin/403" replace />;
  }

  return <>{children}</>;
}

// 사용 예시
<Route
  path="settings/permissions"
  element={
    <ProtectedRoute subject="menu:settings:permissions">
      <PermissionsPage />
    </ProtectedRoute>
  }
/>
```

---

---

## 8. 메뉴 설정 파일

### 메뉴 설정 파일 생성 요청

---
**메뉴 설정 파일을 만들어주세요.**

**파일 경로:** `apps/web/src/config/adminMenuConfig.ts`

**내용:**
- MenuItem, SubMenuItem 타입 정의
- adminMenuConfig 상수 (위에 정의된 메뉴 구조)
- 권한 필터링 유틸 함수

**유틸 함수:**
```typescript
import { AppAbility } from '@packages/hook/casl';

// CASL ability 기반 메뉴 필터링
function filterMenuByAbility(
  menuItems: MenuItem[],
  ability: AppAbility
): MenuItem[] {
  return menuItems
    .filter((menu) => ability.can('ACCESS', menu.subject))
    .map((menu) => ({
      ...menu,
      children: menu.children?.filter((subMenu) =>
        ability.can('ACCESS', subMenu.subject)
      ),
    }))
    .filter((menu) => !menu.children || menu.children.length > 0);
}

// URL에서 현재 메뉴 ID 추출
function getCurrentMenuFromPath(
  path: string,
  menuItems: MenuItem[]
): { mainMenuId: string | null; subMenuId: string | null };
```

---

---

## 9. 추가 고려사항

### CASL 기반 권한 시스템

> **참조:** 상세 설계는 [CASL 권한 시스템 기획서](./2025-12-30-CASL-Permission-System.md) 참조

#### 권한 체계
```typescript
// Role별 기본 권한 템플릿
// SUPER_ADMIN: { action: 'MANAGE', subject: 'all' } - 모든 메뉴 접근
// ADMIN: 대부분의 메뉴 + 설정 일부 제한
// MANAGER: 조회 중심 권한
```

#### useMenuAccess 훅 활용

```typescript
// packages/hook/src/casl/useMenuAccess.ts

import { useAbility } from './AbilityContext';

export function useMenuAccess(menuSubject: string): boolean {
  const ability = useAbility();
  return ability.can('ACCESS', menuSubject);
}

export function useFilteredMenuItems(menuItems: MenuItem[]): MenuItem[] {
  const ability = useAbility();

  return useMemo(() => {
    return menuItems
      .filter((menu) => ability.can('ACCESS', menu.subject))
      .map((menu) => ({
        ...menu,
        children: menu.children?.filter((subMenu) =>
          ability.can('ACCESS', subMenu.subject)
        ),
      }))
      .filter((menu) => !menu.children || menu.children.length > 0);
  }, [menuItems, ability]);
}
```

#### Can 컴포넌트 활용

```tsx
// AdminTopNav에서 메뉴 렌더링
import { Can } from '@packages/hook/casl';

function AdminTopNav({ menuItems }: Props) {
  return (
    <nav>
      {menuItems.map((menu) => (
        <Can key={menu.id} I="ACCESS" a={menu.subject}>
          <MenuItem menu={menu} />
        </Can>
      ))}
    </nav>
  );
}

// AdminSubNav에서 하위 메뉴 렌더링
function AdminSubNav({ subMenuItems }: Props) {
  return (
    <nav>
      {subMenuItems.map((subMenu) => (
        <Can key={subMenu.id} I="ACCESS" a={subMenu.subject}>
          <SubMenuItem menu={subMenu} />
        </Can>
      ))}
    </nav>
  );
}
```

#### 페이지 내 버튼 권한 제어

```tsx
// 회원 상세 페이지에서 삭제 버튼
import { Can } from '@packages/hook/casl';

function MemberDetailPage() {
  return (
    <div>
      {/* 조회는 모두 가능 */}
      <MemberInfo />

      {/* 수정 권한이 있을 때만 표시 */}
      <Can I="UPDATE" a="User">
        <Button>수정</Button>
      </Can>

      {/* 삭제 권한이 있을 때만 표시 */}
      <Can I="DELETE" a="User">
        <Button color="danger">삭제</Button>
      </Can>

      {/* 내보내기 기능 권한 */}
      <Can I="ACCESS" a="feature:export">
        <Button>내보내기</Button>
      </Can>
    </div>
  );
}
```

### 메뉴 확장성

향후 도메인별 메뉴 추가 시:
```typescript
// 쉽게 추가 가능한 구조
{
  id: 'payments',
  label: '결제',
  icon: CreditCardIcon,
  subject: 'menu:payments',  // CASL Subject 추가
  children: [
    {
      id: 'payments-list',
      label: '결제 내역',
      path: '/admin/payments',
      subject: 'menu:payments:list',  // 하위 메뉴 Subject
    },
    // ...
  ],
}
```

**새 메뉴 추가 시 체크리스트:**
1. MenuItem에 subject 필드 추가
2. SubMenuItem에 subject 필드 추가
3. Subject DB에 해당 Subject 시드 데이터 추가
4. 역할별 Ability 규칙 추가

### 반응형 고려사항

- 태블릿 이하: 햄버거 메뉴로 전환
- 모바일: 현재 Admin은 Web 전용이므로 불필요 (향후 고려 가능)

---

## 10. 권한 관리 화면 기획 (설정 > 권한 관리)

> **경로:** `/admin/settings/permissions`
> **Subject:** `menu:settings:permissions`
> **접근 권한:** SUPER_ADMIN만 접근 가능

### 10.1 화면 목적

관리자가 역할(Role)별로 메뉴, 엔티티, 기능에 대한 권한을 시각적으로 설정할 수 있는 화면입니다.

### 10.2 화면 레이아웃

```
┌─────────────────────────────────────────────────────────────────────────┐
│  권한 관리                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  역할 선택: [ADMIN ▼]                              [초기화] [저장]       │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [메뉴 권한] [엔티티 권한] [기능 권한]  ← 탭                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  메뉴 권한 (ACCESS)                                               │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  메뉴                                              │ 접근 허용    │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │  📊 대시보드                                       │    [✓]      │ │
│  │  👥 회원                                           │    [✓]      │ │
│  │     ├─ 회원 목록                                   │    [✓]      │ │
│  │     ├─ 회원 상세                                   │    [✓]      │ │
│  │     ├─ 회원 등급 관리                              │    [✓]      │ │
│  │     └─ 탈퇴 회원                                   │    [ ]      │ │
│  │  📅 예약                                           │    [✓]      │ │
│  │     ├─ 예약 목록                                   │    [✓]      │ │
│  │     ├─ 예약 캘린더                                 │    [✓]      │ │
│  │     ├─ 예약 통계                                   │    [ ]      │ │
│  │     └─ 취소/환불 관리                              │    [✓]      │ │
│  │  ⚙️ 설정                                           │    [✓]      │ │
│  │     ├─ Ground 정보                                 │    [✓]      │ │
│  │     ├─ 관리자 계정                                 │    [ ]      │ │
│  │     ├─ 권한 관리                                   │    [ ]      │ │
│  │     └─ 시스템 설정                                 │    [ ]      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  💡 상위 메뉴를 해제하면 하위 메뉴도 자동으로 해제됩니다.                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10.3 탭별 화면

#### 메뉴 권한 탭
- 메뉴 트리 구조로 표시
- 체크박스로 ACCESS 권한 설정
- 상위 메뉴 해제 시 하위 메뉴 자동 해제

#### 엔티티 권한 탭
```
┌───────────────────────────────────────────────────────────────────┐
│  엔티티 권한 (CRUD)                                               │
├───────────────────────────────────────────────────────────────────┤
│  엔티티        │ 생성(C) │ 조회(R) │ 수정(U) │ 삭제(D) │ 전체(M) │
├───────────────────────────────────────────────────────────────────┤
│  User          │   [✓]   │   [✓]   │   [✓]   │   [ ]   │   [ ]   │
│  Ground        │   [ ]   │   [✓]   │   [✓]   │   [ ]   │   [ ]   │
│  Space         │   [ ]   │   [✓]   │   [ ]   │   [ ]   │   [ ]   │
│  Reservation   │   [✓]   │   [✓]   │   [✓]   │   [✓]   │   [ ]   │
│  Content       │   [✓]   │   [✓]   │   [✓]   │   [ ]   │   [ ]   │
│  Notification  │   [✓]   │   [✓]   │   [ ]   │   [ ]   │   [ ]   │
└───────────────────────────────────────────────────────────────────┘
💡 전체(MANAGE) 선택 시 모든 CRUD 권한이 부여됩니다.
```

#### 기능 권한 탭
```
┌───────────────────────────────────────────────────────────────────┐
│  기능 권한 (특수 기능)                                            │
├───────────────────────────────────────────────────────────────────┤
│  기능                              │ 설명              │ 허용    │
├───────────────────────────────────────────────────────────────────┤
│  📤 데이터 내보내기 (Export)       │ Excel/CSV 다운로드 │   [✓]  │
│  📥 데이터 가져오기 (Import)       │ 일괄 업로드        │   [ ]  │
│  🗑️ 일괄 삭제 (Bulk Delete)        │ 여러 건 동시 삭제  │   [ ]  │
│  📧 알림 발송 (Send Notification)  │ 푸시/이메일 발송   │   [✓]  │
│  ✅ 승인 (Approve)                 │ 요청 승인 처리     │   [✓]  │
│  ❌ 거절 (Reject)                  │ 요청 거절 처리     │   [✓]  │
└───────────────────────────────────────────────────────────────────┘
```

### 10.4 인터랙션 정의

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 역할 선택 | 드롭다운에서 역할 선택 | 해당 역할의 현재 권한 로드 |
| 권한 토글 | 체크박스 클릭 | 권한 상태 변경 (저장 전까지 임시) |
| 상위 메뉴 해제 | 상위 체크박스 해제 | 하위 메뉴 모두 자동 해제 |
| MANAGE 선택 | MANAGE 체크박스 선택 | CRUD 모두 자동 선택 |
| 저장 | 저장 버튼 클릭 | API 호출하여 권한 일괄 저장 |
| 초기화 | 초기화 버튼 클릭 | 저장 전 상태로 되돌리기 |

### 10.5 핸들러 정의

```typescript
interface PermissionsPageHandlers {
  onChangeRole: (roleId: string) => void;           // 역할 변경
  onToggleMenuAccess: (subject: string) => void;    // 메뉴 권한 토글
  onToggleEntityAction: (entity: string, action: AbilityActions) => void;  // 엔티티 권한 토글
  onToggleFeature: (feature: string) => void;       // 기능 권한 토글
  onClickSave: () => void;                          // 저장
  onClickReset: () => void;                         // 초기화
}
```

### 10.6 필요한 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/roles` | 역할 목록 조회 |
| GET | `/api/v1/subjects` | Subject 목록 조회 (트리 구조) |
| GET | `/api/v1/abilities/roles/:roleId` | 역할별 권한 목록 조회 |
| PUT | `/api/v1/abilities/roles/:roleId` | 역할 권한 일괄 업데이트 |

### 10.7 상태 관리

```typescript
interface PermissionsPageState {
  selectedRoleId: string | null;
  roles: Role[];
  subjects: Subject[];  // 트리 구조
  abilities: Ability[]; // 현재 역할의 권한 목록
  pendingChanges: Map<string, AbilityChange>;  // 저장 전 변경사항
  activeTab: 'menu' | 'entity' | 'feature';
  isLoading: boolean;
  isSaving: boolean;
}

interface AbilityChange {
  subjectId: string;
  action: AbilityActions;
  type: 'CAN' | 'CAN_NOT' | 'REMOVE';
}
```

### 10.8 신규 컴포넌트 명세

---
**PermissionMatrix 컴포넌트를 만들어주세요.**

**Props:**
- subjects: Subject[] (Subject 트리)
- abilities: Ability[] (현재 권한)
- type: 'menu' | 'entity' | 'feature'
- onChange: (subjectId: string, action: AbilityActions, enabled: boolean) => void

**표시 내용:**
- 메뉴: 트리 구조 + ACCESS 체크박스
- 엔티티: 테이블 + CRUD 체크박스
- 기능: 리스트 + ACCESS 체크박스

**카테고리:** admin
**경로:** packages/ui/src/components/admin/PermissionMatrix/PermissionMatrix.tsx

---

---
**RoleSelector 컴포넌트를 만들어주세요.**

**Props:**
- roles: Role[]
- selectedRoleId: string | null
- onChange: (roleId: string) => void
- disabled?: boolean

**표시 내용:**
- 역할 드롭다운 (ADMIN, MANAGER 등)

**카테고리:** admin
**경로:** packages/ui/src/components/admin/RoleSelector/RoleSelector.tsx

---

### 10.9 권한 변경 저장 흐름

```
사용자가 체크박스 토글
    ↓
pendingChanges에 변경사항 추가
    ↓
저장 버튼 클릭
    ↓
PUT /api/v1/abilities/roles/:roleId 호출
    ↓
{
  "changes": [
    { "subjectId": "uuid-1", "action": "ACCESS", "type": "CAN" },
    { "subjectId": "uuid-2", "action": "DELETE", "type": "CAN_NOT" },
    { "subjectId": "uuid-3", "action": "ACCESS", "type": "REMOVE" }
  ]
}
    ↓
성공 시 abilities 상태 갱신, pendingChanges 초기화
```

### 10.10 주의사항

1. **SUPER_ADMIN 권한은 수정 불가** - 모든 권한이 항상 허용
2. **자기 자신의 역할은 수정 불가** - 실수로 권한 잠김 방지
3. **하위 메뉴 자동 처리** - 상위 해제 시 하위 자동 해제
4. **변경사항 미저장 경고** - 페이지 이탈 시 확인 다이얼로그

---

## 11. 공통 도메인 메뉴 요약

엔터프라이즈 서비스에서 반드시 필요한 공통 메뉴:

1. **회원 관리** - 사용자 정보, 등급, 탈퇴 처리
2. **예약 관리** - 예약 조회, 캘린더, 통계, 취소/환불
3. **알림 관리** - 발송, 템플릿, 이력, 설정
4. **문의 관리** - 문의 목록, 답변, FAQ, 1:1
5. **콘텐츠 관리** - 공지사항, 이벤트, 배너, 약관
6. **템플릿 관리** - 이메일, SMS, 푸시, HTML 템플릿 (이메일 인증, 회원 탈퇴 등)
7. **설정** - Ground 정보, 관리자, 권한, 시스템

각 도메인별 하위 메뉴는 확장 가능하며, CASL ability 기반으로 표시 여부를 제어합니다.

---

## 12. 관련 문서

| 문서 | 설명 |
|------|------|
| [CASL 권한 시스템 기획서](./2025-12-30-CASL-Permission-System.md) | CASL 기반 권한 체계 상세 설계 |
| [CASL 공식 문서](https://casl.js.org/v6/en/) | CASL 라이브러리 공식 가이드 |
| [CASL React](https://casl.js.org/v6/en/package/casl-react) | React용 CASL 패키지 |
