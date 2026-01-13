# AdminLayout & MenuSystem v7.0 스키마 구현 결과

## 생성 일시
2026-01-13

## Stage 2 범위 분석

이 프로젝트는 **프론트엔드 레이아웃/메뉴 시스템**이므로:
- **Prisma 스키마 변경: 불필요** (DB 변경 없음)
- **타입/인터페이스 정의: 완료** (NavItem, FABStore 확장)
- **메뉴 설정 데이터: 완료** (admin-menu.ts v7.0 구조)

---

## 생성/수정된 파일

### 1. Store 타입 확장

#### `packages/store/src/stores/navItem.ts` (수정)

| 항목 | 내용 |
|------|------|
| TabConfig 인터페이스 | 3depth 탭 정보 정의 |
| NavItemConfig.tabs | 탭 배열 필드 추가 |
| NavItem.tabs | 탭 목록 속성 |
| NavItem.hasTabs | 탭 존재 여부 getter |
| NavItem.findTabByPath() | 경로로 탭 찾기 메서드 |

```typescript
// 추가된 인터페이스
export interface TabConfig {
  id: string;
  label: string;
  href: string;
}

// NavItemConfig 확장
export interface NavItemConfig {
  // ... 기존 필드
  tabs?: TabConfig[];  // v7.0 신규
}
```

#### `packages/store/src/stores/fabStore.ts` (신규)

| 항목 | 내용 |
|------|------|
| FABAction 인터페이스 | FAB 액션 정의 (id, label, icon, subject, href, modal) |
| FABConfig 인터페이스 | FAB 설정 |
| FABStore 클래스 | FAB 상태 관리 Store |

주요 메서드:
- `toggle()`, `open()`, `close()` - FAB 열림/닫힘
- `visibleActions` - 권한 필터링된 액션 목록
- `executeAction(actionId)` - 액션 실행 (페이지 이동 또는 모달 열기)

#### `packages/store/src/stores/bottomTabStore.ts` (신규)

| 항목 | 내용 |
|------|------|
| BottomTabItem 인터페이스 | 하단 탭 아이템 정의 |
| BottomTabConfig 인터페이스 | 하단 탭 설정 |
| BottomTabStore 클래스 | 모바일 하단 탭 상태 관리 |

주요 기능:
- `tabItems` - BottomTab 아이템 목록
- `moreMenuItems` - "더보기" 메뉴 아이템 목록
- `subMenuItems` - 서브메뉴 아이템 목록
- `selectTab(tabId)` - 탭 선택
- `selectSubMenuItem(id)` - 서브메뉴 아이템 선택

#### `packages/store/src/stores/rootStore.ts` (수정)

| 항목 | 내용 |
|------|------|
| fabStore | FABStore 참조 추가 |
| bottomTabStore | BottomTabStore 참조 추가 |

#### `packages/store/src/stores/index.ts` (수정)

| 항목 | 내용 |
|------|------|
| export | fabStore, bottomTabStore export 추가 |

---

### 2. 메뉴 설정 데이터 (v7.0)

#### `packages/constant/src/routing/admin-menu.ts` (수정)

**변경사항:**
- `@cocrepo/store`에서 타입 import로 변경
- tabs 필드 추가 (3depth 탭 지원)
- 세션 도메인 추가
- 설정 메뉴를 시설/관리자/역할권한으로 분리
- "사용자" → "회원"으로 명칭 변경
- FAB 액션 설정 추가
- BottomTab ID 목록 추가

**추가된 경로 (ADMIN_PATHS):**
```typescript
// 회원 탭 경로
USERS_ACTIVE, USERS_DORMANT, USERS_PENDING_WITHDRAWAL

// 예약 탭 경로
RESERVATIONS_TODAY, RESERVATIONS_PENDING, RESERVATIONS_CONFIRMED

// 세션 (v7.0 신규)
SESSIONS, SESSIONS_ONE_TIME, SESSIONS_RECURRING, ...
SESSIONS_TIMELINES, SESSIONS_PROGRAMS, SESSIONS_ROUTINES

// 시설 (설정에서 분리)
GROUNDS, GROUNDS_PROGRAMS, GROUNDS_EQUIPMENT

// 관리자 (설정에서 분리)
ADMINS, ADMINS_ACTIVE, ADMINS_INACTIVE, ADMINS_INVITATIONS

// 역할/권한 (설정에서 분리)
ROLES, ROLES_ABILITIES
```

**추가된 Subject (ADMIN_SUBJECTS):**
```typescript
// 세션
MENU_SESSIONS, MENU_SESSIONS_TIMELINES, MENU_SESSIONS_LIST, ...

// 시설
MENU_GROUNDS, MENU_GROUNDS_INFO, MENU_GROUNDS_PROGRAMS, ...

// 관리자
MENU_ADMINS, MENU_ADMINS_LIST, MENU_ADMINS_INVITATIONS

// 역할/권한
MENU_ROLES, MENU_ROLES_LIST, MENU_ROLES_ABILITIES

// FAB 액션
QUICK_ACTION_TODAY_RESERVATION, QUICK_ACTION_QUICK_RESERVATION, QUICK_ACTION_USER_SEARCH
```

**메뉴 구조 (ADMIN_NAV_ITEMS):**

| 순서 | ID | 이름 | 하위 메뉴 | tabs |
|------|-----|------|----------|------|
| 1 | dashboard | 대시보드 | - | - |
| 2 | users | 회원 | 회원 목록, 등급 관리, 탈퇴 회원 | 회원 목록에 4개 탭 |
| 3 | reservations | 예약 | 오늘 예약, 예약 목록, 캘린더, 통계 | 예약 목록에 4개 탭 |
| 4 | notifications | 알림 | 알림 발송, 발송 내역, 템플릿, 설정 | 발송 내역에 4개 탭 |
| 5 | inquiries | 문의 | 문의 목록, 1:1 문의, 답변 완료, FAQ | 문의 목록에 3개 탭 |
| 6 | contents | 콘텐츠 | 공지사항, 배너, 이벤트, 이용약관 | 이벤트에 4개 탭 |
| 7 | templates | 템플릿 | SMS, 이메일, 푸시, HTML | - |
| 8 | sessions | 세션 (신규) | 타임라인, 세션 목록, 프로그램 배정, 루틴 | 각각 탭 있음 |
| 9 | grounds | 시설 (신규) | 시설 정보, 프로그램 정의, 장비/시설물 | - |
| 10 | admins | 관리자 (신규) | 관리자 목록, 초대 관리 | 각각 탭 있음 |
| 11 | roles | 역할/권한 (신규) | 역할 목록, 권한 설정 | - |

**FAB 액션 (ADMIN_FAB_ACTIONS):**

| ID | 이름 | 동작 |
|----|------|------|
| todayReservation | 오늘 예약 | `/reservations/today`로 이동 |
| quickReservation | 빠른 예약 | `quickReservation` 모달 열기 |
| userSearch | 회원 검색 | `userSearch` 모달 열기 |

**BottomTab 설정 (BOTTOM_TAB_IDS):**
```typescript
['dashboard', 'reservations', 'users', 'notifications', 'more']
```

---

## 타입 의존성 구조

```
@cocrepo/store (타입 정의)
├── TabConfig
├── NavItemConfig (with tabs)
├── FABAction
├── BottomTabItem
├── BottomTabConfig
│
@cocrepo/constant (설정 데이터)
├── ADMIN_NAV_ITEMS (NavItemConfig[] with tabs)
├── ADMIN_FAB_ACTIONS (FABAction[])
├── BOTTOM_TAB_IDS
```

---

## 다음 단계

**Stage 3: 백엔드 로직** - 이 프로젝트는 프론트엔드 전용이므로 **스킵**

**Stage 4: 컴포넌트 구현**
1. AdminBottomTab.tsx 생성
2. AdminFAB.tsx 생성
3. AdminSubMenuList.tsx 생성
4. AdminSidebar.tsx 수정 (항상 펼침)
5. AdminLayout.tsx 수정 (반응형 통합)

---

## 파일 경로 요약

### 신규 파일
- `/Users/wallykim/dev/prj-core/packages/store/src/stores/fabStore.ts`
- `/Users/wallykim/dev/prj-core/packages/store/src/stores/bottomTabStore.ts`

### 수정 파일
- `/Users/wallykim/dev/prj-core/packages/store/src/stores/navItem.ts`
- `/Users/wallykim/dev/prj-core/packages/store/src/stores/rootStore.ts`
- `/Users/wallykim/dev/prj-core/packages/store/src/stores/index.ts`
- `/Users/wallykim/dev/prj-core/packages/constant/src/routing/admin-menu.ts`
