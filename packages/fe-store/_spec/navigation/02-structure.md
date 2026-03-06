# 02. 구조 (역기획)

> 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.

## 기능 (L3 Feature)

| ID | 기능명 | 설명 | 관련 Goal |
|----|--------|------|----------|
| L3-FEA-001 | 메뉴 구조 관리 | 2depth + 3depth 탭 형태의 메뉴 트리 구조 관리 | L2-GOL-001 |
| L3-FEA-002 | 현재 경로 동기화 | URL 경로와 메뉴 활성 상태 자동 동기화 | L2-GOL-002 |
| L3-FEA-003 | 권한 기반 필터링 | AbilityChecker를 통한 메뉴 접근 권한 필터링 | L2-GOL-003 |
| L3-FEA-004 | 데스크톱 사이드바 | 항상 펼쳐진 사이드바 네비게이션 | L2-GOL-001, L2-GOL-002 |
| L3-FEA-005 | 모바일 하단 탭 | 모바일용 하단 고정 탭 네비게이션 | L2-GOL-004 |
| L3-FEA-006 | 모바일 서브메뉴 | 2depth 메뉴를 전체 화면으로 표시 | L2-GOL-004 |
| L3-FEA-007 | FAB 빠른 액션 | 모바일용 플로팅 액션 버튼 | L2-GOL-005 |
| L3-FEA-008 | 메뉴 펼침/접힘 | Accordion 형태의 메뉴 펼침/접힘 | L2-GOL-001 |

---

## 화면 (L4 Screen)

### 데스크톱 레이아웃

```
+------------------------------------------------------------------+
|                         AdminLayout                               |
+------------------------------------------------------------------+
|  +--------------+  +-------------------------------------------+ |
|  |   Sidebar    |  |                Header                      | |
|  |   (SideNav)  |  +-------------------------------------------+ |
|  |              |  |                                           | |
|  |  [Dashboard] |  |              Main Content                 | |
|  |  [회원 v]    |  |              (children)                   | |
|  |   - 목록     |  |                                           | |
|  |   - 등급     |  |                                           | |
|  |   - 탈퇴     |  |                                           | |
|  |  [예약 v]    |  |                                           | |
|  |   ...        |  |                                           | |
|  +--------------+  +-------------------------------------------+ |
+------------------------------------------------------------------+
```

### 모바일 레이아웃

```
+----------------------------------+
|            Header                |
|        (Logo + UserMenu)         |
+----------------------------------+
|                                  |
|         Main Content             |
|         (children)               |
|                                  |
|                                  |
|              +------+            |
|              | FAB  |            |
|              +------+            |
+----------------------------------+
| [Dashboard] [예약] [회원] [알림] [더보기] |
|            BottomTab             |
+----------------------------------+

// SubMenuList 열렸을 때
+----------------------------------+
|            Header                |
+----------------------------------+
|     SubMenuList (Full Screen)    |
|   +----------------------------+ |
|   | [회원 목록]                | |
|   | [등급 관리]                | |
|   | [탈퇴 회원]                | |
|   +----------------------------+ |
+----------------------------------+
```

---

## 화면 목록

| ID | 화면명 | 경로 | 컴포넌트 | 디바이스 |
|----|--------|------|----------|----------|
| L4-SCR-001 | 레이아웃 | - | AdminLayout | All |
| L4-SCR-002 | 사이드바 | - | AdminSidebar | Desktop |
| L4-SCR-003 | 헤더 | - | AdminHeader | All |
| L4-SCR-004 | 하단 탭 | - | AdminBottomTab | Mobile |
| L4-SCR-005 | 서브메뉴 리스트 | - | AdminSubMenuList | Mobile |
| L4-SCR-006 | FAB | - | AdminFAB | Mobile |

---

## 메뉴 구조 (L4 Route)

### 1depth 메뉴 (11개)

| 순서 | ID | 라벨 | 아이콘 | Subject |
|------|-----|------|--------|---------|
| 1 | dashboard | 대시보드 | LayoutDashboard | menu:dashboard |
| 2 | users | 회원 | Users | menu:users |
| 3 | reservations | 예약 | CalendarCheck | menu:reservations |
| 4 | notifications | 알림 | Bell | menu:notifications |
| 5 | inquiries | 문의 | MessageSquare | menu:inquiries |
| 6 | contents | 콘텐츠 | FileText | menu:contents |
| 7 | templates | 템플릿 | LayoutTemplate | menu:templates |
| 8 | sessions | 세션 | Clock | menu:sessions |
| 9 | grounds | 시설 | Building | menu:grounds |
| 10 | admins | 관리자 | UserCog | menu:admins |
| 11 | roles | 역할/권한 | Shield | menu:roles |

### 2depth 메뉴 구조 (예시: 회원)

```
회원 (users)
├── 회원 목록 (/users)
│   └── 탭: 전체 / 활성 / 휴면 / 탈퇴대기
├── 등급 관리 (/users/grades)
└── 탈퇴 회원 (/users/withdrawn)
```

### 3depth 탭 (v7.0 신규)

| 2depth 메뉴 | 탭 목록 |
|-------------|--------|
| 회원 목록 | 전체, 활성, 휴면, 탈퇴대기 |
| 예약 목록 | 전체, 대기중, 확정, 취소 |
| 발송 내역 | 전체, SMS, 이메일, 푸시 |
| 문의 목록 | 전체, 대기중, 답변완료 |
| 이벤트 | 전체, 진행중, 예정, 종료 |
| 타임라인 | 전체, 활성, 보관됨 |
| 세션 목록 | 전체, 일회성, 반복, 예정, 지난 |
| 프로그램 배정 | 전체, 진행중, 정원마감, 예약가능 |
| 루틴 | 전체, 운동 |
| 관리자 목록 | 전체, 활성, 비활성 |
| 초대 관리 | 전체, 대기중, 만료됨 |

---

## 컴포넌트 계층 구조

```
AdminLayout (Layout)
├── AdminSidebar (Pure UI)
│   └── SideNav (Feature) → NavTreePanel (Widget)
│
├── AdminHeader (Pure UI)
│   ├── Logo (Feature)
│   └── UserMenu (Feature)
│
├── Main Content
│
├── AdminBottomTab (Pure UI) [Mobile]
│   └── BottomTab (Feature)
│
├── AdminSubMenuList (Pure UI) [Mobile]
│   └── SubMenuList (Feature)
│
└── AdminFAB (Pure UI) [Mobile]
```

### 컴포넌트 분류

| 유형 | 컴포넌트 | 위치 | 역할 |
|------|----------|------|------|
| Layout | AdminLayout | ui/layouts/Admin/ | 전체 레이아웃 구성 |
| Pure UI | AdminSidebar | ui/layouts/Admin/ | 사이드바 UI |
| Pure UI | AdminHeader | ui/layouts/Admin/ | 헤더 UI |
| Pure UI | AdminBottomTab | ui/layouts/Admin/ | 하단 탭 UI |
| Pure UI | AdminSubMenuList | ui/layouts/Admin/ | 서브메뉴 UI |
| Pure UI | AdminFAB | ui/layouts/Admin/ | FAB UI |
| Widget | NavTreePanel | widgets/NavTreePanel/ | 트리 형태 네비게이션 |
| Feature | SideNav | feature/SideNav/ | Store 연결 사이드바 |
| Feature | Nav | feature/Nav/ | Header용 네비게이션 |
| Feature | SubNav | feature/SubNav/ | 2depth 네비게이션 |
| Feature | BottomTab | feature/BottomTab/ | Store 연결 하단 탭 |
| Feature | SubMenuList | feature/SubMenuList/ | Store 연결 서브메뉴 |
| Feature | UserMenu | feature/UserMenu/ | 사용자 메뉴 |
| Feature | Logo | feature/Logo/ | 로고 |
