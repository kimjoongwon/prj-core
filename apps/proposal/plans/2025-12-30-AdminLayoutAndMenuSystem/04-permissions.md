# 권한 체계

> 상위 문서: [README.md](./README.md)
> 버전: 7.0

---

## v7.0 핵심 변경

### 1. QuickAction 권한 추가 (FAB)

모바일 FAB 액션에 대한 권한 체계:

| Subject | 설명 | 기본 허용 역할 |
|---------|------|---------------|
| quickAction:todayReservation | 오늘 예약 바로가기 | 트레이너, 예약데스크, 관리자 |
| quickAction:quickReservation | 빠른 예약 생성 | 예약데스크, 관리자 |
| quickAction:userSearch | 회원 검색 모달 | 트레이너, 예약데스크, 관리자 |

### 2. 신규 메뉴 권한 (DDD 분리)

설정에서 분리된 메뉴들:

| 기존 Subject | 신규 Subject |
|--------------|--------------|
| menu:settings:grounds | menu:grounds |
| menu:settings:admins | menu:admins |
| menu:settings:abilities | menu:roles |

---

## Subject 네이밍 규칙

| 패턴 | 설명 | 예시 |
|------|------|------|
| `menu:{domain}` | 1depth 메뉴 접근 | menu:users, menu:grounds |
| `menu:{domain}:{sub}` | 2depth 메뉴 접근 | menu:users:list, menu:grounds:info |
| `entity:{Entity}` | 엔티티 CRUD | entity:User, entity:Ground |
| `feature:{name}` | 특정 기능 | feature:export, feature:bulkAction |
| `quickAction:{name}` | 모바일 FAB 액션 | quickAction:todayReservation |

---

## 권한 액션

| 액션 | 설명 | 사용 예시 |
|------|------|----------|
| ACCESS | 메뉴/기능 접근 | ability.can('ACCESS', 'menu:users') |
| CREATE | 생성 | ability.can('CREATE', 'entity:User') |
| READ | 조회 | ability.can('READ', 'entity:User') |
| UPDATE | 수정 | ability.can('UPDATE', 'entity:User') |
| DELETE | 삭제 | ability.can('DELETE', 'entity:User') |
| MANAGE | 전체 관리 | ability.can('MANAGE', 'entity:Role') |
| EXPORT | 내보내기 | ability.can('EXPORT', 'feature:export') |
| IMPORT | 가져오기 | ability.can('IMPORT', 'feature:import') |

---

## 메뉴별 Subject 매핑

### 1depth 메뉴

| 메뉴 | Subject | 연관 Entity |
|------|---------|-------------|
| 대시보드 | menu:dashboard | - |
| 회원 | menu:users | User, Profile, Tenant |
| 예약 | menu:reservations | Timeline, Session |
| 알림 | menu:notifications | Notification |
| 문의 | menu:inquiries | Inquiry |
| 콘텐츠 | menu:contents | Content, Post |
| 템플릿 | menu:templates | MessageTemplate |
| 시설 | menu:grounds | Ground, Space |
| 관리자 | menu:admins | Admin |
| 역할/권한 | menu:roles | Role, Ability |

### 2depth 메뉴 (주요 예시)

**회원:**
| 메뉴 | Subject |
|------|---------|
| 회원 목록 | menu:users:list |
| 등급 관리 | menu:users:grades |
| 탈퇴 회원 | menu:users:withdrawn |

**예약:**
| 메뉴 | Subject |
|------|---------|
| 오늘 예약 | menu:reservations:today |
| 예약 목록 | menu:reservations:list |
| 캘린더 | menu:reservations:calendar |
| 통계 | menu:reservations:stats |

**시설 (v7.0 신규):**
| 메뉴 | Subject |
|------|---------|
| 시설 정보 | menu:grounds:info |
| 프로그램 | menu:grounds:programs |
| 장비/시설물 | menu:grounds:equipment |

**관리자 (v7.0 신규):**
| 메뉴 | Subject |
|------|---------|
| 관리자 목록 | menu:admins:list |
| 초대 관리 | menu:admins:invitations |

**역할/권한 (v7.0 신규):**
| 메뉴 | Subject |
|------|---------|
| 역할 목록 | menu:roles:list |
| 권한 설정 | menu:roles:abilities |

---

## QuickAction 권한 (FAB)

### Subject 정의

| Subject | 설명 | 관련 기능 |
|---------|------|----------|
| quickAction:todayReservation | 오늘 예약 목록 바로가기 | FAB → 오늘 예약 페이지 이동 |
| quickAction:quickReservation | 빠른 예약 생성 | FAB → 예약 생성 모달 |
| quickAction:userSearch | 회원 검색 | FAB → 회원 검색 모달 |

### 역할별 기본 권한

| 역할 | todayReservation | quickReservation | userSearch |
|------|------------------|------------------|------------|
| 슈퍼관리자 | ✅ | ✅ | ✅ |
| 관리자 | ✅ | ✅ | ✅ |
| 예약데스크 | ✅ | ✅ | ✅ |
| 트레이너 | ✅ | ❌ | ✅ |
| 뷰어 | ✅ | ❌ | ❌ |

### FAB 표시 로직

```typescript
// FAB 액션 필터링
const fabActions = [
  {
    id: 'todayReservation',
    subject: 'quickAction:todayReservation',
    icon: CalendarCheck,
    label: '오늘 예약',
  },
  {
    id: 'quickReservation',
    subject: 'quickAction:quickReservation',
    icon: CalendarPlus,
    label: '빠른 예약',
  },
  {
    id: 'userSearch',
    subject: 'quickAction:userSearch',
    icon: Search,
    label: '회원 검색',
  },
];

// 권한 있는 액션만 표시
const visibleActions = fabActions.filter(action =>
  ability.can('ACCESS', action.subject)
);

// 표시할 액션이 없으면 FAB 자체를 숨김
const showFab = visibleActions.length > 0;
```

---

## 권한 체크 로직

### 메뉴 접근 권한

```typescript
// 1depth 메뉴 접근 권한
const canAccessUsers = ability.can('ACCESS', 'menu:users');
const canAccessGrounds = ability.can('ACCESS', 'menu:grounds');
const canAccessRoles = ability.can('ACCESS', 'menu:roles');

// 2depth 메뉴 접근 권한
const canAccessUserList = ability.can('ACCESS', 'menu:users:list');
const canAccessAdminsList = ability.can('ACCESS', 'menu:admins:list');
```

### 엔티티 CRUD 권한

```typescript
// User 엔티티 권한
const canCreateUser = ability.can('CREATE', 'entity:User');
const canReadUser = ability.can('READ', 'entity:User');
const canUpdateUser = ability.can('UPDATE', 'entity:User');
const canDeleteUser = ability.can('DELETE', 'entity:User');

// Ground 엔티티 권한 (v7.0)
const canUpdateGround = ability.can('UPDATE', 'entity:Ground');

// Role 엔티티 권한 (v7.0)
const canManageRole = ability.can('MANAGE', 'entity:Role');
```

### QuickAction 권한 (v7.0)

```typescript
// FAB 액션 권한
const canAccessTodayReservation = ability.can('ACCESS', 'quickAction:todayReservation');
const canAccessQuickReservation = ability.can('ACCESS', 'quickAction:quickReservation');
const canAccessUserSearch = ability.can('ACCESS', 'quickAction:userSearch');
```

### 특정 기능 권한

```typescript
// 내보내기/가져오기
const canExport = ability.can('EXPORT', 'feature:export');
const canImport = ability.can('IMPORT', 'feature:import');

// 대량 작업
const canBulkAction = ability.can('ACCESS', 'feature:bulkAction');
```

---

## 권한 계층 구조

### 메뉴 권한 상속

```
menu:users (1depth)
├── menu:users:list (2depth)
├── menu:users:grades (2depth)
└── menu:users:withdrawn (2depth)
```

**규칙:**
- 1depth 권한이 없으면 하위 2depth도 접근 불가
- 2depth 권한은 개별 설정 가능

### Entity 권한과 메뉴 권한 관계

```typescript
// 메뉴 접근과 엔티티 조회는 별개
// 메뉴 접근 권한이 있어도 엔티티 조회 권한이 없으면 데이터 못 봄

const canAccessUserList = ability.can('ACCESS', 'menu:users:list');  // 메뉴 접근
const canReadUser = ability.can('READ', 'entity:User');              // 데이터 조회

// 둘 다 있어야 회원 목록 페이지에서 데이터를 볼 수 있음
```

---

## 테스트 체크리스트

### 메뉴 권한 테스트

- [ ] 각 1depth 메뉴별 ACCESS 권한 체크 동작
- [ ] 각 2depth 메뉴별 ACCESS 권한 체크 동작
- [ ] 권한 없는 메뉴 숨김 처리
- [ ] 직접 URL 접근 시 권한 없으면 리다이렉트

### QuickAction 권한 테스트 (v7.0)

- [ ] FAB 액션별 ACCESS 권한 체크 동작
- [ ] 권한 없는 FAB 액션 숨김 처리
- [ ] 모든 FAB 액션 권한 없으면 FAB 자체 숨김
- [ ] 역할별 기본 권한 정상 적용

### 엔티티 권한 테스트

- [ ] CREATE/READ/UPDATE/DELETE 각각 동작
- [ ] MANAGE 권한으로 전체 제어 가능
- [ ] 메뉴 접근과 엔티티 권한 분리 동작

### 신규 도메인 권한 테스트 (v7.0)

- [ ] menu:grounds 권한 체크 동작
- [ ] menu:admins 권한 체크 동작
- [ ] menu:roles 권한 체크 동작
- [ ] entity:Ground/Admin/Role 권한 체크 동작
