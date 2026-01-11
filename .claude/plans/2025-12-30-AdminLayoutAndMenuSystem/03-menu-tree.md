# 메뉴 트리

> 상위 문서: [README.md](./README.md)
> 버전: 7.0

---

## v7.0 핵심 변경: DDD 기반 메뉴 재설계

### 기존 구조 (v6.0)

```
├── 대시보드
├── 사용자
├── 예약
├── 알림
├── 문의
├── 콘텐츠
├── 템플릿
└── 설정           <- 모든 관리 기능이 여기에 집중
    ├── 시설 정보
    ├── 관리자 관리
    ├── 권한 관리
    └── 시스템 설정
```

### 변경 구조 (v7.0)

```
├── 대시보드
├── 회원           <- 사용자 → 회원 (라벨 변경)
├── 예약
├── 알림
├── 문의
├── 콘텐츠
├── 템플릿
├── 시설           <- 설정에서 분리 (Ground/Space 도메인)
├── 관리자         <- 설정에서 분리 (Admin 도메인)
└── 역할/권한      <- 설정에서 분리 (Role/Ability 도메인)
```

**변경 이유:**
- 각 도메인이 독립적인 Aggregate Root를 가짐
- 권한 관리가 도메인 단위로 명확해짐
- 메뉴 깊이 감소 (설정 > 시설 정보 → 시설 > 시설 정보)

---

## 메뉴 계층 구조 (3 Depth)

```
1depth (사이드바 메인 메뉴)
├── 2depth (사이드바 하위 메뉴) → 클릭 시 페이지 이동
│   └── 3depth (페이지 내 상단 탭) → 같은 페이지 내 탭 전환
```

---

## 1depth 메뉴

| 순서 | ID | 라벨 | 아이콘 | Aggregate Root | Subject | 하위 메뉴 |
|------|-----|------|--------|----------------|---------|-----------|
| 1 | dashboard | 대시보드 | LayoutDashboard | - | menu:dashboard | 없음 |
| 2 | users | 회원 | Users | User, Profile, Tenant | menu:users | 있음 |
| 3 | reservations | 예약 | CalendarCheck | Reservation | menu:reservations | 있음 |
| 4 | notifications | 알림 | Bell | Notification | menu:notifications | 있음 |
| 5 | inquiries | 문의 | MessageSquare | Inquiry | menu:inquiries | 있음 |
| 6 | contents | 콘텐츠 | FileText | Content, Post | menu:contents | 있음 |
| 7 | templates | 템플릿 | LayoutTemplate | MessageTemplate | menu:templates | 있음 |
| 8 | sessions | 세션 | Clock | Timeline, Session, Program | menu:sessions | 있음 |
| 9 | grounds | 시설 | Building | Ground, Space | menu:grounds | 있음 |
| 10 | admins | 관리자 | UserCog | Admin | menu:admins | 있음 |
| 11 | roles | 역할/권한 | Shield | Role, Ability | menu:roles | 있음 |

---

## 2depth 메뉴 상세

### 회원 (users)

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| users-list | 회원 목록 | /users | menu:users:list |
| users-grades | 등급 관리 | /users/grades | menu:users:grades |
| users-withdrawn | 탈퇴 회원 | /users/withdrawn | menu:users:withdrawn |

**3depth (회원 목록 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /users | 전체 | 기본값 |
| /users/active | 활성 | 활성 회원만 |
| /users/dormant | 휴면 | 휴면 회원만 |
| /users/pending-withdrawal | 탈퇴대기 | 탈퇴 신청 회원 |

### 예약 (reservations)

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| reservations-today | 오늘 예약 | /reservations/today | menu:reservations:today |
| reservations-list | 예약 목록 | /reservations | menu:reservations:list |
| reservations-calendar | 캘린더 | /reservations/calendar | menu:reservations:calendar |
| reservations-stats | 통계 | /reservations/stats | menu:reservations:stats |

**3depth (예약 목록 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /reservations | 전체 | 기본값 |
| /reservations/pending | 대기중 | 승인 대기 |
| /reservations/confirmed | 확정 | 확정된 예약 |
| /reservations/cancelled | 취소 | 취소된 예약 |

### 알림 (notifications)

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| notifications-send | 알림 발송 | /notifications/send | menu:notifications:send |
| notifications-history | 발송 내역 | /notifications/history | menu:notifications:history |
| notifications-templates | 알림 템플릿 | /notifications/templates | menu:notifications:templates |
| notifications-settings | 알림 설정 | /notifications/settings | menu:notifications:settings |

**3depth (발송 내역 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /notifications/history | 전체 | 기본값 |
| /notifications/history/sms | SMS | SMS만 |
| /notifications/history/email | 이메일 | 이메일만 |
| /notifications/history/push | 푸시 | 푸시만 |

### 문의 (inquiries)

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| inquiries-list | 문의 목록 | /inquiries | menu:inquiries:list |
| inquiries-direct | 1:1 문의 | /inquiries/direct | menu:inquiries:direct |
| inquiries-answered | 답변 완료 | /inquiries/answered | menu:inquiries:answered |
| inquiries-faq | FAQ | /inquiries/faq | menu:inquiries:faq |

**3depth (문의 목록 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /inquiries | 전체 | 기본값 |
| /inquiries/pending | 대기중 | 답변 대기 |
| /inquiries/completed | 답변완료 | 답변 완료 |

### 콘텐츠 (contents)

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| contents-notices | 공지사항 | /notices | menu:contents:notices |
| contents-banners | 배너 | /banners | menu:contents:banners |
| contents-events | 이벤트 | /events | menu:contents:events |
| contents-terms | 이용약관 | /terms | menu:contents:terms |

**3depth (이벤트 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /events | 전체 | 기본값 |
| /events/ongoing | 진행중 | 진행 중인 이벤트 |
| /events/upcoming | 예정 | 예정된 이벤트 |
| /events/ended | 종료 | 종료된 이벤트 |

### 템플릿 (templates)

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| templates-sms | SMS | /templates/sms | menu:templates:sms |
| templates-email | 이메일 | /templates/email | menu:templates:email |
| templates-push | 푸시 | /templates/push | menu:templates:push |
| templates-html | HTML | /templates/html | menu:templates:html |

### 세션 (sessions) - v7.0 신규

> 타임라인, 세션, 프로그램 배정, 루틴을 관리하는 시간 기반 이벤트 도메인

| ID | 라벨 | 경로 | Subject | 설명 |
|----|------|------|---------|------|
| sessions-timelines | 타임라인 | /sessions/timelines | menu:sessions:timelines | 세션 그룹 관리 |
| sessions-list | 세션 목록 | /sessions | menu:sessions:list | 전체 세션 조회 |
| sessions-programs | 프로그램 배정 | /sessions/programs | menu:sessions:programs | 세션별 프로그램 관리 |
| sessions-routines | 루틴 | /sessions/routines | menu:sessions:routines | 루틴 구성 관리 |

**3depth (타임라인 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /sessions/timelines | 전체 | 기본값 |
| /sessions/timelines/active | 활성 | 진행 중인 타임라인 |
| /sessions/timelines/archived | 보관됨 | 종료된 타임라인 |

**3depth (세션 목록 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /sessions | 전체 | 기본값 |
| /sessions/one-time | 일회성 | ONE_TIME 유형 |
| /sessions/recurring | 반복 | RECURRING 유형 |
| /sessions/upcoming | 예정 | 시작 전 세션 |
| /sessions/past | 지난 | 종료된 세션 |

**3depth (프로그램 배정 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /sessions/programs | 전체 | 기본값 |
| /sessions/programs/active | 진행중 | 활성 프로그램 |
| /sessions/programs/full | 정원마감 | 정원 초과 프로그램 |
| /sessions/programs/available | 예약가능 | 예약 가능한 프로그램 |

**3depth (루틴 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /sessions/routines | 전체 | 기본값 |
| /sessions/routines/exercise | 운동 | 운동 기반 루틴 |

**도메인 관계:**
- Timeline → Session → Program → Routine → Activity → Task → Exercise
- 예약(Reservation)과 연계: 예약 생성 시 Session/Program 선택
- 시설(Ground/Space)과 연계: 타임라인은 Space에 종속

### 시설 (grounds) - v7.0 신규

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| grounds-info | 시설 정보 | /grounds | menu:grounds:info |
| grounds-programs | 프로그램 정의 | /grounds/programs | menu:grounds:programs |
| grounds-equipment | 장비/시설물 | /grounds/equipment | menu:grounds:equipment |

### 관리자 (admins) - v7.0 신규

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| admins-list | 관리자 목록 | /admins | menu:admins:list |
| admins-invitations | 초대 관리 | /admins/invitations | menu:admins:invitations |

**3depth (관리자 목록 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /admins | 전체 | 기본값 |
| /admins/active | 활성 | 활성 관리자 |
| /admins/inactive | 비활성 | 비활성 관리자 |

**3depth (초대 관리 하위):**
| 경로 | 라벨 | 설명 |
|------|------|------|
| /admins/invitations | 전체 | 기본값 |
| /admins/invitations/pending | 대기중 | 수락 대기 |
| /admins/invitations/expired | 만료됨 | 만료된 초대 |

### 역할/권한 (roles) - v7.0 신규

| ID | 라벨 | 경로 | Subject |
|----|------|------|---------|
| roles-list | 역할 목록 | /roles | menu:roles:list |
| roles-abilities | 권한 설정 | /roles/abilities | menu:roles:abilities |

---

## BottomTab 메뉴 (모바일)

### 기본 탭 (5개)

| 순서 | ID | 라벨 | 아이콘 | 동작 |
|------|-----|------|--------|------|
| 1 | dashboard | 대시보드 | LayoutDashboard | 바로 이동 |
| 2 | reservations | 예약 | CalendarCheck | SubMenuList 표시 |
| 3 | users | 회원 | Users | SubMenuList 표시 |
| 4 | notifications | 알림 | Bell | SubMenuList 표시 |
| 5 | more | 더보기 | MoreHorizontal | 나머지 1depth 표시 |

### 더보기 메뉴

| 순서 | ID | 라벨 | 아이콘 |
|------|-----|------|--------|
| 1 | inquiries | 문의 | MessageSquare |
| 2 | contents | 콘텐츠 | FileText |
| 3 | templates | 템플릿 | LayoutTemplate |
| 4 | sessions | 세션 | Clock |
| 5 | grounds | 시설 | Building |
| 6 | admins | 관리자 | UserCog |
| 7 | roles | 역할/권한 | Shield |

---

## 경로 규칙

### 2depth 경로 패턴

| 패턴 | 설명 | 예시 |
|------|------|------|
| `/{domain}` | 도메인 목록 페이지 (기본) | /users, /reservations |
| `/{domain}/{action}` | 도메인 하위 페이지 | /users/grades, /reservations/calendar |
| `/{domain}/today` | 오늘 데이터 | /reservations/today |
| `/{domain}/stats` | 통계 페이지 | /reservations/stats |

### 3depth 경로 패턴 (pathParam)

| 패턴 | 설명 | 예시 |
|------|------|------|
| `/{domain}` | 전체 (기본값) | /users → 전체 회원 |
| `/{domain}/{status}` | 상태별 필터 | /users/active → 활성 회원 |
| `/{domain}/{parent}/{status}` | 중첩 상태 | /notifications/history/sms → SMS 발송 내역 |

### Next.js App Router 구조

```
app/(admin)/
├── users/
│   ├── page.tsx                    → /users (전체)
│   ├── [status]/
│   │   └── page.tsx                → /users/active, /users/dormant 등
│   ├── grades/
│   │   └── page.tsx                → /users/grades
│   └── layout.tsx                  → 공통 레이아웃 + 탭 UI
├── reservations/
│   ├── page.tsx                    → /reservations (전체)
│   ├── [status]/
│   │   └── page.tsx                → /reservations/pending 등
│   ├── today/
│   │   └── page.tsx                → /reservations/today
│   └── layout.tsx
```

### 3depth 탭 활성 상태 판단

```typescript
// layout.tsx에서 현재 경로로 활성 탭 결정
const pathname = usePathname();
const activeTab = pathname.split('/').pop() || 'all';

// 탭 정의
const tabs = [
  { id: 'all', label: '전체', href: '/users' },
  { id: 'active', label: '활성', href: '/users/active' },
  { id: 'dormant', label: '휴면', href: '/users/dormant' },
  { id: 'pending-withdrawal', label: '탈퇴대기', href: '/users/pending-withdrawal' },
];
```

---

## 메뉴 데이터 구조

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

// 예시
const usersMenu: MenuItem = {
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
        { id: 'dormant', label: '휴면', href: '/users/dormant' },
        { id: 'pending-withdrawal', label: '탈퇴대기', href: '/users/pending-withdrawal' },
      ],
    },
    {
      id: 'users-grades',
      label: '등급 관리',
      path: '/users/grades',
      subject: 'menu:users:grades',
    },
  ],
};
```

---

## 테스트 체크리스트

### 메뉴 구조 테스트

- [ ] 1depth 메뉴 11개 정상 표시 (settings 제거, sessions/grounds/admins/roles 추가)
- [ ] 각 1depth별 2depth 메뉴 정상 표시
- [ ] 2depth 클릭 시 올바른 경로로 이동
- [ ] 3depth 탭 클릭 시 쿼리 파라미터 정상 반영

### 권한 테스트

- [ ] 각 메뉴별 Subject로 권한 체크 동작
- [ ] 권한 없는 메뉴 숨김 처리
- [ ] 직접 URL 접근 시 권한 없으면 리다이렉트

### 모바일 테스트

- [ ] BottomTab 5개 탭 정상 표시
- [ ] "더보기" 탭에서 나머지 7개 메뉴 표시 (sessions 포함)
- [ ] SubMenuList에서 2depth 메뉴 정상 표시
