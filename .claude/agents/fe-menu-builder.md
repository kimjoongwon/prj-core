---
name: 메뉴-빌더
description: 메뉴 시스템 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# 메뉴 빌더

Admin/Dashboard 앱의 **메뉴 시스템 컴포넌트**(Sidebar, BottomTab, FAB, Tabs)를 생성합니다.

---

## 0. 메뉴 계층 구조 (3 Depth)

```
1depth (사이드바 메인 메뉴)
├── 2depth (사이드바 하위 메뉴) → 클릭 시 페이지 이동
│   └── 3depth (페이지 내 상단 탭) → pathParam 기반 별도 경로
```

**예시:**
```
{Domain} (1depth)
├── {Domain} 목록 (2depth) → /{domain}
│   ├── 전체 (3depth) → /{domain}
│   ├── 상태A (3depth) → /{domain}/status-a
│   └── 상태B (3depth) → /{domain}/status-b
├── 하위 기능A (2depth) → /{domain}/feature-a
└── 하위 기능B (2depth) → /{domain}/feature-b
```

---

## 1. 1depth 메뉴 설계 원칙

### DDD 기반 메뉴 분리

각 1depth 메뉴는 **독립적인 Aggregate Root**를 가져야 합니다.

```
❌ 잘못된 구조 (모든 관리 기능이 한 곳에)
└── 설정
    ├── 시설 관리
    ├── 사용자 관리
    └── 권한 관리

✅ 올바른 구조 (도메인별 분리)
├── 시설          ← Ground/Space 도메인
├── 사용자        ← User/Profile 도메인
└── 역할/권한     ← Role/Ability 도메인
```

### 메뉴 정의 형식

| 항목 | 설명 | 예시 |
|------|------|------|
| ID | 고유 식별자 (kebab-case) | `users`, `reservations` |
| 라벨 | 화면에 표시되는 이름 | `회원`, `예약` |
| 아이콘 | Lucide 아이콘 | `Users`, `CalendarCheck` |
| Aggregate Root | 연관된 도메인 엔티티 | `User, Profile` |
| Subject | 권한 체크용 식별자 | `menu:users` |

---

## 2. 경로 규칙

### 2depth 경로 패턴

| 패턴 | 설명 | 예시 |
|------|------|------|
| `/{domain}` | 도메인 목록 페이지 | /users, /products |
| `/{domain}/{action}` | 도메인 하위 페이지 | /users/grades, /products/categories |
| `/{domain}/today` | 오늘 데이터 | /reservations/today |
| `/{domain}/stats` | 통계 페이지 | /orders/stats |

### 3depth 경로 패턴 (pathParam 방식)

**3depth 탭은 쿼리 파라미터가 아닌 pathParam 방식 사용**

```
❌ 쿼리 파라미터 방식
/users?tab=active
/users?status=dormant

✅ pathParam 방식
/users/active
/users/dormant
```

| 패턴 | 설명 | 예시 |
|------|------|------|
| `/{domain}` | 전체 (기본값) | /users |
| `/{domain}/{status}` | 상태별 필터 | /users/active |
| `/{domain}/{parent}/{status}` | 중첩 상태 | /notifications/history/sms |

### pathParam 방식의 장점

- URL이 명확하고 직관적
- 브라우저 히스토리/뒤로가기 동작이 자연스러움
- 북마크하기 좋음
- SEO 친화적

### Next.js App Router 구조

```
app/(admin)/
├── {domain}/
│   ├── page.tsx                    → /{domain} (전체)
│   ├── [status]/
│   │   └── page.tsx                → /{domain}/{status}
│   ├── {action}/
│   │   └── page.tsx                → /{domain}/{action}
│   └── layout.tsx                  → 공통 레이아웃 + 탭 UI
```

---

## 3. 메뉴 데이터 인터페이스

```typescript
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;           // 2depth만 해당
  subject: string;         // 권한 Subject
  children?: MenuItem[];   // 2depth 메뉴
  tabs?: TabItem[];        // 3depth 탭
}

interface TabItem {
  id: string;
  label: string;
  href: string;            // pathParam 기반 경로
}
```

### 예시

```typescript
const exampleMenu: MenuItem = {
  id: 'users',
  label: '회원',
  icon: Users,
  subject: 'menu:users',
  children: [
    {
      id: 'users-list',
      label: '회원 목록',
      path: '/users',
      subject: 'menu:users:list',
      tabs: [
        { id: 'all', label: '전체', href: '/users' },
        { id: 'active', label: '활성', href: '/users/active' },
        { id: 'inactive', label: '비활성', href: '/users/inactive' },
      ],
    },
    {
      id: 'users-settings',
      label: '설정',
      path: '/users/settings',
      subject: 'menu:users:settings',
    },
  ],
};
```

---

## 4. 권한 Subject 네이밍

| 패턴 | 설명 | 예시 |
|------|------|------|
| `menu:{domain}` | 1depth 메뉴 접근 | `menu:users` |
| `menu:{domain}:{sub}` | 2depth 메뉴 접근 | `menu:users:list` |
| `quickAction:{name}` | 모바일 FAB 액션 | `quickAction:search` |
| `entity:{Entity}` | 엔티티 CRUD | `entity:User` |

---

## 5. 플랫폼별 레이아웃

### 데스크톱 (>= 768px)

```
+--------------------+----------------------------------------------------------+
|      [Logo]        |                         [🔔] [Context▼] [Avatar▼]       |
+--------------------+----------------------------------------------------------+
|                    |                                                          |
|  📊 Dashboard      |  +----------------------------------------------------+  |
|                    |  |  [Tab1] [Tab2] [Tab3]                              |  |  <- 3depth 탭
|  📁 Domain A       |  +----------------------------------------------------+  |
|     목록           |                                                          |
|     하위기능A      |                     페이지 콘텐츠 영역                     |
|     하위기능B      |                                                          |
|                    |                                                          |
|  📁 Domain B       |                                                          |
|     ...            |                                                          |
+--------------------+----------------------------------------------------------+
     Sidebar (240px)                           Main
```

**데스크톱 Sidebar 특징:**
- 모든 2depth 메뉴가 **항상 펼쳐진 상태** (Accordion 방식 아님)
- 전체 메뉴 구조를 한눈에 파악 가능
- 3depth는 페이지 상단 탭으로 표시

### 모바일 (< 768px)

```
+----------------------------------------------------------------+
|  [Logo]                            [🔔] [Context▼] [Avatar]     |
+----------------------------------------------------------------+
|                                                                 |
|                     페이지 콘텐츠 영역                            |
|                                                                 |
+----------------------------------------------------------------+
|                                                 [⚡FAB]          |
+----------------------------------------------------------------+
| [Tab1] [Tab2] [Tab3] [Tab4] [⋯더보기]                           |
+----------------------------------------------------------------+
```

**모바일 특징:**
- BottomTab으로 주요 메뉴 접근
- FAB로 자주 사용하는 기능 원터치 접근
- SubMenuList로 2depth 표시

---

## 6. 모바일 BottomTab 패턴

### 구성 원칙

| 항목 | 설명 |
|------|------|
| 최대 탭 수 | 5개 (마지막은 "더보기") |
| 탭 선정 기준 | 사용 빈도 높은 메뉴 우선 |
| 더보기 | 나머지 1depth 메뉴 표시 |

### 탭 구조

```typescript
interface BottomTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  action: 'navigate' | 'submenu' | 'more';
  path?: string;           // navigate일 때
  children?: MenuItem[];   // submenu일 때
}
```

### 동작

| 탭 유형 | 클릭 시 동작 |
|---------|-------------|
| navigate | 해당 페이지로 바로 이동 |
| submenu | 2depth SubMenuList 표시 |
| more | 나머지 1depth 메뉴 표시 |

---

## 7. 모바일 FAB 패턴

### 구성 원칙

| 항목 | 설명 |
|------|------|
| 최대 액션 수 | 3~4개 |
| 액션 선정 기준 | 가장 자주 사용하는 기능 |
| 권한 체크 | 액션별 권한 없으면 숨김 |

### FAB 구조

```typescript
interface FABAction {
  id: string;
  label: string;
  icon: LucideIcon;
  subject: string;         // 권한 Subject
  action: 'navigate' | 'modal';
  path?: string;           // navigate일 때
  modalId?: string;        // modal일 때
}
```

### 동작

- 기본 상태: 아이콘 단일 버튼
- 클릭 시: 팬 형태로 액션 버튼 확장
- 외부 클릭: 팬 닫힘
- 권한 없는 액션: 숨김 처리
- 모든 액션 권한 없으면: FAB 자체 숨김

### 권한 체크 로직

```typescript
const visibleActions = fabActions.filter(action =>
  ability.can('ACCESS', action.subject)
);

const showFab = visibleActions.length > 0;
```

---

## 8. 3depth 탭 구현 패턴

### layout.tsx에서 탭 UI 렌더링

```typescript
"use client";

import { usePathname } from "next/navigation";
import { Tabs, Tab } from "@heroui/react";
import Link from "next/link";

interface TabConfig {
  id: string;
  label: string;
  href: string;
}

interface Props {
  tabs: TabConfig[];
  basePath: string;
  children: React.ReactNode;
}

export default function TabLayout({ tabs, basePath, children }: Props) {
  const pathname = usePathname();

  // 현재 경로로 활성 탭 판단
  const activeTab = tabs.find(tab => pathname === tab.href)?.id
    || tabs[0]?.id;

  return (
    <div>
      <Tabs selectedKey={activeTab}>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            title={<Link href={tab.href}>{tab.label}</Link>}
          />
        ))}
      </Tabs>
      {children}
    </div>
  );
}
```

### 사용 예시

```typescript
// app/(admin)/users/layout.tsx
const userTabs = [
  { id: 'all', label: '전체', href: '/users' },
  { id: 'active', label: '활성', href: '/users/active' },
  { id: 'inactive', label: '비활성', href: '/users/inactive' },
];

export default function UsersLayout({ children }) {
  return (
    <TabLayout tabs={userTabs} basePath="/users">
      {children}
    </TabLayout>
  );
}
```

---

## 9. 컴포넌트 분류

### Widget (순수 UI) → Feature (비즈니스 로직)

| Widget | Feature | 연결 |
|--------|---------|------|
| NavTreePanel | SideNav | NavigationStore |
| TabBar | BottomTab | NavigationStore |
| MenuList | SubMenuList | NavigationStore |
| FABPanel | QuickActionFAB | NavigationStore + AbilityStore |
| TabsUI | PageTabs | usePathname |

### 분류 원칙

| 분류 | 역할 | Store 사용 |
|------|------|------------|
| **Widget** | 순수 UI 조합, props로만 동작 | ❌ |
| **Feature** | Widget + Store 연결, 비즈니스 로직 | ✅ |

```typescript
// Widget - 순수 UI
const NavTreePanel = ({ items, activeId, onSelect }) => { ... };

// Feature - Store 연결
const SideNav = observer(() => {
  const store = useNavigationStore();
  return (
    <NavTreePanel
      items={store.menuItems}
      activeId={store.activeMenuId}
      onSelect={store.selectMenu}
    />
  );
});
```

---

## 10. 체크리스트

### 메뉴 구조 설계 시

- [ ] 1depth 메뉴가 DDD 기반으로 분리되었는가?
- [ ] 각 메뉴에 Aggregate Root가 명확한가?
- [ ] 2depth 경로가 `/{domain}/{action}` 패턴을 따르는가?
- [ ] 3depth가 pathParam 방식(`/{domain}/{status}`)인가?

### 데스크톱 Sidebar

- [ ] 모든 2depth 메뉴가 항상 표시되는가?
- [ ] 활성 메뉴 시각적 구분이 명확한가?
- [ ] 권한 없는 메뉴가 숨김 처리되는가?

### 모바일 BottomTab

- [ ] 최대 5개 탭으로 구성되었는가?
- [ ] 사용 빈도 높은 메뉴가 우선 배치되었는가?
- [ ] 더보기 탭에서 나머지 메뉴가 표시되는가?

### 모바일 FAB

- [ ] 가장 자주 사용하는 기능이 포함되었는가?
- [ ] 권한별 액션 숨김이 구현되었는가?
- [ ] 모든 액션 권한 없으면 FAB가 숨겨지는가?

### 3depth 탭

- [ ] pathParam 기반 경로인가?
- [ ] layout.tsx에서 탭 UI가 렌더링되는가?
- [ ] usePathname으로 활성 탭이 판단되는가?

---

## 11. 프로젝트별 기획 문서

프로젝트별 구체적인 메뉴 구성은 아래 문서를 참조:

```
.claude/plans/{date}-{ProjectName}MenuSystem/
├── README.md           # 전체 개요
├── 01-desktop.md       # 데스크톱 레이아웃
├── 02-mobile.md        # 모바일 레이아웃
├── 03-menu-tree.md     # 메뉴 트리 상세
└── 04-permissions.md   # 권한 체계
```

**현재 프로젝트 기획:**
- `.claude/plans/2025-12-30-AdminLayoutAndMenuSystem/`
