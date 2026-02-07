# 03. 인터랙션 정의 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.
> 최종 수정일: 2026-02-07 (Role 이름 변경, Ability/Grant 분리 반영)

## 사용자 액션 (L5)

### 역할 관리 화면

| ID | 액션 | 트리거 | 결과 | 권한 |
|----|------|--------|------|------|
| L5-ACT-001 | 역할 목록 조회 | 페이지 진입 | 역할 목록 표시 | MANAGE |
| L5-ACT-002 | 역할 상세 조회 | 역할 행 클릭 | 상세 정보 표시 | MANAGE |
| L5-ACT-003 | 역할 등록 | 등록 버튼 클릭 → 폼 제출 | 새 역할 생성 | FULL_ACCESS |
| L5-ACT-004 | 역할 수정 | 수정 버튼 클릭 → 폼 제출 | 역할 정보 변경 | FULL_ACCESS |
| L5-ACT-005 | 역할 삭제 | 삭제 버튼 클릭 → 확인 | 역할 삭제 | FULL_ACCESS |

### Ability(권한 정의) 관리 화면

| ID | 액션 | 트리거 | 결과 | 권한 |
|----|------|--------|------|------|
| L5-ACT-006 | Ability 목록 조회 | 페이지 진입 | Ability 목록 표시 | MANAGE |
| L5-ACT-007 | Ability 생성 | 생성 폼 제출 | 새 Ability 정의 | FULL_ACCESS |
| L5-ACT-008 | Ability 수정 | 수정 폼 제출 | Ability 정보 변경 | FULL_ACCESS |
| L5-ACT-009 | Ability 삭제 | 삭제 버튼 클릭 | Ability 소프트 삭제 | FULL_ACCESS |

### Grant(권한 부여) 관리 화면

| ID | 액션 | 트리거 | 결과 | 권한 |
|----|------|--------|------|------|
| L5-ACT-010 | 내 권한(Grant) 조회 | 페이지 진입 | 본인에게 부여된 Grant 목록 표시 | VIEW |
| L5-ACT-011 | Role별 Grant 조회 | Role 선택 | 해당 Role에 부여된 Grant 목록 표시 | MANAGE |
| L5-ACT-012 | User별 Grant 조회 | User 선택 | 해당 User 예외 Grant 표시 | MANAGE |
| L5-ACT-013 | Role Grant 일괄 설정 | 저장 버튼 클릭 | 기존 Grant 삭제 + 새 Grant 생성 | FULL_ACCESS |
| L5-ACT-014 | User 예외 Grant 설정 | 저장 버튼 클릭 | 기존 Grant 삭제 + 새 Grant 생성 | FULL_ACCESS |

---

## API 엔드포인트 (L6)

### Roles API

| ID | Method | Endpoint | 설명 | 권한 | 소스 |
|----|--------|----------|------|------|------|
| L6-API-001 | GET | `/api/v1/roles` | 역할 목록 조회 | MANAGE, FULL_ACCESS | `roles.controller.ts` |
| L6-API-002 | GET | `/api/v1/roles/:roleId` | 역할 상세 조회 | MANAGE, FULL_ACCESS | `roles.controller.ts` |
| L6-API-003 | POST | `/api/v1/roles` | 역할 생성 | FULL_ACCESS | `roles.controller.ts` |
| L6-API-004 | PATCH | `/api/v1/roles/:roleId` | 역할 수정 | FULL_ACCESS | `roles.controller.ts` |
| L6-API-005 | DELETE | `/api/v1/roles/:roleId` | 역할 삭제 | FULL_ACCESS | `roles.controller.ts` |

### Abilities API (Ability 관리 + Grant 일괄 설정)

| ID | Method | Endpoint | 설명 | 권한 | 소스 |
|----|--------|----------|------|------|------|
| L6-API-006 | GET | `/api/v1/abilities/my` | 내 Grant 조회 (부여된 Ability 포함) | 로그인 필수 | `abilities.controller.ts` |
| L6-API-007 | GET | `/api/v1/abilities/roles/:roleId` | Role별 Grant 조회 | 로그인 필수 | `abilities.controller.ts` |
| L6-API-008 | GET | `/api/v1/abilities/users/:userId` | User별 예외 Grant 조회 | 로그인 필수 | `abilities.controller.ts` |
| L6-API-009 | GET | `/api/v1/abilities/:abilityId` | Ability 상세 조회 | 로그인 필수 | `abilities.controller.ts` |
| L6-API-010 | POST | `/api/v1/abilities` | Ability 생성 | 로그인 필수 | `abilities.controller.ts` |
| L6-API-011 | PATCH | `/api/v1/abilities/:abilityId` | Ability 수정 | 로그인 필수 | `abilities.controller.ts` |
| L6-API-012 | DELETE | `/api/v1/abilities/:abilityId` | Ability 삭제 | 로그인 필수 | `abilities.controller.ts` |
| L6-API-013 | PUT | `/api/v1/abilities/roles/:roleId` | Role Grant 일괄 설정 | 로그인 필수 | `abilities.controller.ts` |
| L6-API-014 | PUT | `/api/v1/abilities/users/:userId` | User 예외 Grant 일괄 설정 | 로그인 필수 | `abilities.controller.ts` |

---

## 상태 변화 흐름

### 역할 목록 → 상세 → Grant 설정

```
페이지 진입 (/roles)
    │
    ▼
[로딩 상태]
    │
    ▼
GET /api/v1/roles (X-Space-ID 헤더 포함)
    │
    ├─── 성공 ──→ [역할 목록 표시]
    │                  │
    │                  ├─── 행 클릭 ──→ GET /api/v1/roles/:roleId
    │                  │                      │
    │                  │                      ▼
    │                  │              [역할 상세 표시]
    │                  │                      │
    │                  │                      └─── 권한 관리 클릭
    │                  │                                │
    │                  │                                ▼
    │                  │              GET /api/v1/abilities/roles/:roleId
    │                  │                                │
    │                  │                                ▼
    │                  │                      [Role의 Grant 목록 표시]
    │                  │                      (부여된 Ability + priority)
    │                  │                                │
    │                  │                      Grant 수정 후 저장
    │                  │                                │
    │                  │                                ▼
    │                  │              PUT /api/v1/abilities/roles/:roleId
    │                  │              (기존 Grant 삭제 + 새 Grant 생성)
    │                  │                                │
    │                  │                                ▼
    │                  │                      [성공 토스트 + 새로고침]
    │                  │
    │                  ├─── 등록 버튼 ──→ [역할 등록 폼]
    │                  │                      │
    │                  │                      ▼
    │                  │              POST /api/v1/roles
    │                  │                      │
    │                  │                      └─── 성공 ──→ [목록으로 이동]
    │                  │
    │                  ├─── 수정 버튼 ──→ [역할 수정 폼]
    │                  │                      │
    │                  │                      ▼
    │                  │              PATCH /api/v1/roles/:roleId
    │                  │
    │                  └─── 삭제 버튼 ──→ [삭제 확인 모달]
    │                                          │
    │                                          ▼
    │                                  DELETE /api/v1/roles/:roleId
    │
    └─── 실패 ──→ [에러 상태] ──→ 재시도 버튼
```

---

## 에러 처리

### API 에러 응답

| 상태 코드 | 상황 | 메시지 |
|----------|------|--------|
| 400 | 잘못된 요청 | "이 역할에 N명의 사용자가 연결되어 있습니다" |
| 400 | X-Space-ID 누락 | "X-Space-ID 헤더가 필요합니다. Space를 선택해주세요." |
| 401 | 미인증 | "인증된 사용자가 필요합니다" |
| 403 | 권한 없음 | "이 작업을 수행하려면 다음 역할 중 하나가 필요합니다: MANAGE, FULL_ACCESS" |
| 403 | 시스템 역할 수정 시도 | "시스템 역할은 수정할 수 없습니다" |
| 403 | Space 접근 불가 | "해당 Space에 대한 접근 권한이 없습니다." |
| 404 | 리소스 없음 | "역할을 찾을 수 없습니다" |
| 409 | 중복 | "이미 존재하는 역할 이름입니다" |

### 피드백 메시지

| 상황 | 유형 | 메시지 |
|------|------|--------|
| 역할 생성 성공 | success | "역할 생성 성공" |
| 역할 수정 성공 | success | "역할 수정 성공" |
| 역할 삭제 성공 | success | "역할 삭제 성공" |
| Grant 설정 성공 | success | "Role 권한 설정 성공" |
| 연결된 사용자 있음 | warning | "먼저 사용자의 역할을 변경해주세요" |

---

## 모달 정의

### 삭제 확인 모달

```
┌──────────────────────────────────────────┐
│              역할 삭제 확인                 │
├──────────────────────────────────────────┤
│                                           │
│  '{역할명}' 역할을 삭제하시겠습니까?        │
│                                           │
│  ⚠ 이 작업은 되돌릴 수 없습니다.           │
│                                           │
├──────────────────────────────────────────┤
│       [취소]              [삭제]          │
└──────────────────────────────────────────┘
```

### Grant 설정 모달 (Ability 선택 + priority 설정)

```
┌──────────────────────────────────────────────────────┐
│                   Grant 추가 (Ability 부여)            │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Ability:     [User 이메일 조회 (마스킹)     ▼]       │
│               Subject: User / Action: read:masked:email│
│                                                       │
│  우선순위:    [0                             ]        │
│              (Role: 0-9, User 예외: 10+)              │
│                                                       │
│  □ 활성화                                             │
│                                                       │
├──────────────────────────────────────────────────────┤
│         [취소]                    [저장]              │
└──────────────────────────────────────────────────────┘
```
