---
name: fe-menu-builder
description: 메뉴 시스템 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep, Bash
---


## 재사용 우선 점검 (Mandatory)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# 메뉴 빌더

Admin/Dashboard 앱의 **메뉴 시스템 컴포넌트**(Sidebar, BottomTab, FAB, Tabs)를 생성합니다.

---

## 0. 메뉴 계층 구조

### 일반적인 패턴: 3 Depth 구조

많은 도메인에서 사용하는 일반적인 메뉴 구조입니다. 하지만 모든 도메인이 반드시 이 구조를 따를 필요는 없습니다.

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

### 도메인별로 다른 구조 가능

실제 도메인 특성에 따라 다음과 같은 구조도 가능합니다:
- **단일 메뉴 + 중첩 라우팅**: 역할/권한처럼 밀접하게 연결된 Aggregate
- **2depth만 존재**: 대시보드처럼 단일 페이지
- **엔티티 중심 경로**: 콘텐츠처럼 백엔드 엔티티와 직접 매핑

자세한 내용은 **섹션 2.1 도메인 기반 메뉴 설계 원칙**을 참고하세요.

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

## 2.1 도메인 기반 메뉴 설계 원칙

### 핵심: 도메인 특성을 반영한 메뉴 구조

**메뉴는 획일적인 패턴이 아니라, 각 도메인의 본질에 맞춰 설계합니다.**

모든 메뉴가 동일한 구조를 따를 필요는 없습니다. 도메인의 성격, 데이터 관계, 사용자 탐색 흐름에 따라 적합한 패턴을 선택하세요.

### 라우팅 패턴 선택 가이드

**라우팅 경로 설계 시 가장 먼저 구분할 것:**

| 유형 | 설명 | 라우팅 패턴 | UI 패턴 |
|------|------|------------|---------|
| **속성 (Attribute)** | 동일 엔티티의 필터링 조건 | `/{entity}/{value}` | 탭 |
| **관계 (Relation)** | 다른 엔티티로의 탐색 | `/{parent}/:id/{child}` | 중첩 라우팅 |

### 속성 기반 - 탭 사용

엔티티의 status, type, category 등 **속성값**으로 필터링:

```
/users                  → 전체 회원
/users/active           → status='active' 필터
/users/dormant          → status='dormant' 필터
/users/pending-withdrawal → status='pending-withdrawal' 필터
```

**특징:**
- 같은 테이블, 같은 컬럼의 WHERE 조건
- UI에서 탭으로 전환
- 목록 개수가 탭에 표시됨

### 관계 기반 - 중첩 라우팅 사용

엔티티 간 **1:N 또는 N:M 관계**를 따라 탐색:

```
/roles                              → 역할 목록
/roles/:roleId                      → 역할 상세
/roles/:roleId/abilities            → 해당 역할의 권한 목록
/roles/:roleId/abilities/:abilityId → 권한 상세
```

**특징:**
- 부모 → 자식 엔티티로 계층 탐색
- "리스트 → 상세 → 리스트 → 상세" 반복 가능
- 상세 페이지에서 연관 데이터 목록 표시

### 판단 플로우차트

```
경로 설계 시 질문:
│
├─ "같은 엔티티의 다른 상태/유형을 보여줄 건가?"
│   └─ YES → 탭 (/{entity}/{attribute-value})
│
└─ "연관된 다른 엔티티의 데이터를 보여줄 건가?"
    └─ YES → 중첩 라우팅 (/{parent}/:id/{child})
```

### 혼합 예시

복잡한 도메인에서 두 패턴이 함께 사용:

```
/orders                        → 주문 목록
/orders/pending                → 주문 (status=pending 필터) ← 탭
/orders/completed              → 주문 (status=completed 필터) ← 탭
/orders/:orderId               → 주문 상세
/orders/:orderId/items         → 주문 상품 목록 ← 중첩
/orders/:orderId/items/:itemId → 주문 상품 상세 ← 중첩
```

### Prisma 스키마 기반 판단

```prisma
model User {
  status  UserStatus   // ← enum → 탭
  role    Role @relation(...)  // ← relation → 중첩
}

// /users/active    ← status enum 값
// /users/:id/role  ← role relation 탐색
```

### 도메인별 메뉴 구조 예시

각 도메인의 특성에 따라 다른 메뉴 구조를 선택한 실제 예시:

| 도메인 | 메뉴 구조 | 이유 |
|--------|----------|------|
| **회원 (users)** | 2depth 메뉴 + 3depth 탭 | 회원 목록/등급/탈퇴 등 여러 하위 기능이 독립적 |
| **역할/권한 (roles)** | 단일 메뉴 + 중첩 라우팅 | Role-Ability가 밀접하게 연결된 단일 Aggregate |
| **예약 (reservations)** | 2depth 메뉴 + 3depth 탭 | 오늘/전체/캘린더/통계 등 다양한 뷰 필요 |
| **콘텐츠 (contents)** | 2depth 메뉴 (최상위 경로) | 공지/배너/이벤트/약관이 각각 독립적 엔티티 |

**설계 질문:**
- 하위 기능들이 독립적인가? → 2depth 메뉴로 분리
- 데이터가 계층적으로 연결되어 있는가? → 중첩 라우팅
- 동일 엔티티의 다른 상태를 보여주는가? → 3depth 탭
- URL이 백엔드 엔티티와 직접 매핑되는가? → 최상위 경로 고려

### 도메인 특성을 반영한 경로 패턴

#### 콘텐츠 메뉴: 엔티티 중심 경로

콘텐츠 메뉴는 백엔드 엔티티와 직접 매핑되는 최상위 경로를 사용합니다:

| 메뉴 | 경로 | 이유 |
|------|------|------|
| 공지사항 | /notices | 백엔드 Notice 엔티티와 직접 매핑, URL 간결성 |
| 배너 | /banners | 백엔드 Banner 엔티티와 직접 매핑 |
| 이벤트 | /events | 백엔드 Event 엔티티와 직접 매핑 |
| 이용약관 | /terms | 백엔드 Term 엔티티와 직접 매핑 |

**Subject는 여전히 계층 구조 유지:**
- 1depth: `menu:contents`
- 2depth: `menu:contents:notices`, `menu:contents:banners` 등

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
  children: React.ReactNode;
}

export default function TabLayout({ tabs, children }: Props) {
  const pathname = usePathname();

  // 현재 경로로 활성 탭 판단
  const activeTab = tabs.find(tab => pathname === tab.href)?.id
    || tabs[0]?.id;

  return (
    <div>
      <Tabs selectedKey={activeTab}>
        {tabs.map(tab => (
          <Tab key={tab.id}>
            <Link href={tab.href}>{tab.label}</Link>
          </Tab>
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
    <TabLayout tabs={userTabs}>
      {children}
    </TabLayout>
  );
}
```

---

## 8.1 Layout vs Page 책임 분리

### 탭 렌더링 위치

**3depth 탭은 layout.tsx에서 렌더링합니다.**

```typescript
// ✅ 올바른 패턴 - layout.tsx
export default function UsersLayout({ children }) {
  const tabs = [
    { id: 'all', label: '전체', href: '/users' },
    { id: 'active', label: '활성', href: '/users/active' },
  ];

  return (
    <div>
      <PageTabs tabs={tabs} />
      {children}
    </div>
  );
}

// page.tsx (또는 _client.tsx)
export default function UsersPage() {
  return (
    <Page top={<PageTitleBar title="회원 목록" description="..." />}>
      <Section>
        {/* 페이지 콘텐츠 */}
      </Section>
    </Page>
  );
}
```

### 왜 Layout에서 탭을 렌더링하는가?

1. **공유 UI 요소**: 탭은 하위 경로 간 공유되는 네비게이션
2. **항상 표시**: `/users`, `/users/active` 등 모든 탭 페이지에서 동일한 탭 UI 유지
3. **Layout의 역할**: 구조적 네비게이션 요소 제공

### PageTitleBar와의 차이

| 요소 | 위치 | 이유 |
|------|------|------|
| **PageTabs** | Layout | 하위 경로 간 공유되는 네비게이션 |
| **PageTitleBar** | Page | 페이지별 고유한 title, description, actions |

### CLAUDE.md 원칙과의 관계

**"PageTitleBar는 Page에서만 사용"** 원칙은 여전히 유효합니다:
- ❌ Layout에서 PageTitleBar 사용 금지 (타이틀 중복 방지)
- ✅ Layout에서 PageTabs 사용 가능 (공유 네비게이션)

---

## 9. 컴포넌트 분류

### Widget (순수 UI) → Feature (비즈니스 로직)

| Widget | Feature | 연결 |
|--------|---------|------|
| NavTreePanel | SideNav | NavigationStore |
| TabBar | BottomTab | NavigationStore |
| MenuList | SubMenuList | NavigationStore |
| FABPanel | QuickActionFAB | NavigationStore + AbilityStore |
| TabBar | PageTabs | NavigationStore + usePathname |

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

---

## 12. Admin 메뉴 트리 (전체)

### 1depth 메뉴 목록

| 순서 | ID | 라벨 | 아이콘 | Aggregate Root | 설명 |
|------|-----|------|--------|----------------|------|
| 1 | dashboard | 대시보드 | LayoutDashboard | - | 주요 지표 및 현황 요약 |
| 2 | users | 회원 | Users | User, Profile, Tenant | 회원 정보, 등급, 탈퇴 관리 |
| 3 | reservations | 예약 | CalendarCheck | Reservation | 예약 조회, 캘린더, 통계 |
| 4 | notifications | 알림 | Bell | Notification | 알림 발송 및 내역 관리 |
| 5 | inquiries | 문의 | MessageSquare | Inquiry | 고객 문의 및 FAQ 관리 |
| 6 | contents | 콘텐츠 | FileText | Content, Post | 공지, 배너, 이벤트, 약관 |
| 7 | templates | 템플릿 | LayoutTemplate | MessageTemplate | SMS/이메일/푸시 템플릿 |
| 8 | timelines | 타임라인 | Calendar | Timeline | 세션 그룹 관리 |
| 9 | sessions | 세션 | Clock | Session | 세션 관리 |
| 10 | programs | 프로그램 | ListTodo | Program | 프로그램 관리 |
| 11 | routines | 루틴 | Repeat | Routine | 루틴 구성 관리 |
| 12 | grounds | 시설 | Building | Ground, Space | 시설 정보, 프로그램 정의, 장비 |
| 13 | admins | 관리자 | UserCog | Admin | 관리자 목록 및 초대 관리 |
| 14 | roles | 역할/권한 | Shield | Role, Ability | 역할 목록 및 권한 설정 |

---

### 대시보드 (dashboard)

> 주요 지표 및 현황 요약 화면

- 하위 메뉴 없음 (단일 페이지)
- 경로: `/dashboard`

---

### 회원 (users)

> 회원 정보 조회, 등급 관리, 탈퇴 처리

| 2depth | 경로 | 설명 |
|--------|------|------|
| 회원 목록 | /users | 전체 회원 조회 |
| 등급 관리 | /users/grades | 회원 등급 설정 |
| 탈퇴 회원 | /users/withdrawn | 탈퇴 처리된 회원 |

**3depth (회원 목록):**
- `/users` - 전체
- `/users/active` - 활성 회원
- `/users/dormant` - 휴면 회원
- `/users/pending-withdrawal` - 탈퇴대기

---

### 예약 (reservations)

> 예약 조회, 캘린더 뷰, 예약 통계

| 2depth | 경로 | 설명 |
|--------|------|------|
| 오늘 예약 | /reservations/today | 금일 예약 현황 |
| 예약 목록 | /reservations | 전체 예약 조회 |
| 캘린더 | /reservations/calendar | 캘린더 뷰 |
| 통계 | /reservations/stats | 예약 통계 |

**3depth (예약 목록):**
- `/reservations` - 전체
- `/reservations/pending` - 대기중
- `/reservations/confirmed` - 확정
- `/reservations/cancelled` - 취소

---

### 알림 (notifications)

> 알림 발송 및 발송 내역 관리

| 2depth | 경로 | 설명 |
|--------|------|------|
| 알림 발송 | /notifications/send | 새 알림 발송 |
| 발송 내역 | /notifications/history | 발송 기록 조회 |
| 알림 템플릿 | /notifications/templates | 알림용 템플릿 |
| 알림 설정 | /notifications/settings | 발송 설정 |

**3depth (발송 내역):**
- `/notifications/history` - 전체
- `/notifications/history/sms` - SMS
- `/notifications/history/email` - 이메일
- `/notifications/history/push` - 푸시

---

### 문의 (inquiries)

> 고객 문의 접수 및 답변 관리

| 2depth | 경로 | 설명 |
|--------|------|------|
| 문의 목록 | /inquiries | 전체 문의 조회 |
| 1:1 문의 | /inquiries/direct | 1:1 문의 |
| 답변 완료 | /inquiries/answered | 답변 완료된 문의 |
| FAQ | /inquiries/faq | 자주 묻는 질문 관리 |

**3depth (문의 목록):**
- `/inquiries` - 전체
- `/inquiries/pending` - 대기중
- `/inquiries/completed` - 답변완료

---

### 콘텐츠 (contents)

> 공지사항, 배너, 이벤트, 이용약관 관리

| 2depth | 경로 | 설명 |
|--------|------|------|
| 공지사항 | /notices | 공지사항 관리 |
| 배너 | /banners | 배너 관리 |
| 이벤트 | /events | 이벤트 관리 |
| 이용약관 | /terms | 약관 관리 |

**3depth (이벤트):**
- `/events` - 전체
- `/events/ongoing` - 진행중
- `/events/upcoming` - 예정
- `/events/ended` - 종료

---

### 템플릿 (templates)

> SMS, 이메일, 푸시, HTML 메시지 템플릿 관리

| 2depth | 경로 | 설명 |
|--------|------|------|
| SMS | /templates/sms | SMS 템플릿 |
| 이메일 | /templates/email | 이메일 템플릿 |
| 푸시 | /templates/push | 푸시 템플릿 |
| HTML | /templates/html | HTML 템플릿 |

---

### 타임라인 (timelines)

> 세션 그룹 관리

**엔티티 관계:** Timeline (1:N) → Session

| 2depth | 경로 | 설명 |
|--------|------|------|
| 타임라인 | /timelines | 타임라인 목록 |

**3depth:**
- `/timelines` - 전체
- `/timelines/active` - 활성
- `/timelines/archived` - 보관됨
- **중첩:** `/timelines/:id/sessions` - 해당 타임라인의 세션 목록

---

### 세션 (sessions)

> 세션 관리

**엔티티 관계:** Session (N:1) → Timeline, Session (1:N) → Program

| 2depth | 경로 | 설명 |
|--------|------|------|
| 세션 목록 | /sessions | 전체 세션 조회 |

**3depth:**
- `/sessions` - 전체
- `/sessions/one-time` - 일회성
- `/sessions/recurring` - 반복
- `/sessions/upcoming` - 예정
- `/sessions/past` - 지난
- **중첩:** `/sessions/:id/programs` - 해당 세션의 프로그램 목록

---

### 프로그램 (programs)

> 프로그램 관리

**엔티티 관계:** Program (N:1) → Session, Program (N:1) → Routine

| 2depth | 경로 | 설명 |
|--------|------|------|
| 프로그램 | /programs | 전체 프로그램 조회 |

**3depth:**
- `/programs` - 전체
- `/programs/active` - 진행중
- `/programs/full` - 정원마감
- `/programs/available` - 예약가능

---

### 루틴 (routines)

> 루틴 구성 관리

**엔티티 관계:** Routine (1:N) → Activity

| 2depth | 경로 | 설명 |
|--------|------|------|
| 루틴 | /routines | 루틴 목록 |

**3depth:**
- `/routines` - 전체
- `/routines/exercise` - 운동
- **중첩:** `/routines/:id/activities` - 해당 루틴의 활동 목록

---

### 시설 (grounds)

> 시설 정보, 프로그램 정의, 장비/시설물 관리

| 2depth | 경로 | 설명 |
|--------|------|------|
| 시설 정보 | /grounds | 시설 기본 정보 |
| 프로그램 정의 | /grounds/programs | 프로그램 템플릿 |
| 장비/시설물 | /grounds/equipment | 장비 관리 |

---

### 관리자 (admins)

> 관리자 계정 및 초대 관리

| 2depth | 경로 | 설명 |
|--------|------|------|
| 관리자 목록 | /admins | 전체 관리자 |
| 초대 관리 | /admins/invitations | 초대 현황 |

**3depth (관리자 목록):**
- `/admins` - 전체
- `/admins/active` - 활성
- `/admins/inactive` - 비활성

**3depth (초대 관리):**
- `/admins/invitations` - 전체
- `/admins/invitations/pending` - 대기중
- `/admins/invitations/expired` - 만료됨

---

### 역할/권한 (roles)

> 역할 목록 및 권한 설정 - 중첩 라우팅

**하위 메뉴 없음** (중첩 라우팅으로 탐색)

| 경로 | 설명 |
|------|------|
| /roles | 역할 목록 |
| /roles/:roleId | 역할 상세 |
| /roles/:roleId/abilities/:abilityId | 권한 상세 |

---

## 13. BottomTab 구성

### 기본 탭 (5개)

| 순서 | ID | 라벨 | 동작 |
|------|-----|------|------|
| 1 | dashboard | 대시보드 | 바로 이동 |
| 2 | reservations | 예약 | SubMenuList |
| 3 | users | 회원 | SubMenuList |
| 4 | notifications | 알림 | SubMenuList |
| 5 | more | 더보기 | 나머지 표시 |

### 더보기 메뉴

| 순서 | ID | 라벨 |
|------|-----|------|
| 1 | inquiries | 문의 |
| 2 | contents | 콘텐츠 |
| 3 | templates | 템플릿 |
| 4 | timelines | 타임라인 |
| 5 | sessions | 세션 |
| 6 | programs | 프로그램 |
| 7 | routines | 루틴 |
| 8 | grounds | 시설 |
| 9 | admins | 관리자 |
| 10 | roles | 역할/권한 |

---

## 14. FAB 구성

### 기본 액션 (3개)

| ID | 라벨 | 아이콘 | 동작 |
|----|------|--------|------|
| today-reservations | 오늘 예약 | CalendarCheck | `/reservations/today` 이동 |
| quick-reservation | 빠른 예약 | Plus | 예약 모달 |
| search-member | 회원 검색 | Search | 검색 모달 |

---

## 15. 연관 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| req-menu-planner | 선행 | 메뉴 경로/권한 기획서 기반 구현 |
| req-page-planner | 선행 | 화면 경로 구조 참조 |
| fe-feature-builder | 관련 | 메뉴에 연결되는 Feature 컴포넌트 참조 |
