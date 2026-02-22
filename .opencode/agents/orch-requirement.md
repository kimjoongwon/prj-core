---
description: 도메인 기획(L0-L4) + BE/Store 기획을 총괄 조율하는 오케스트레이터
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---



# 요구사항 기획 오케스트레이터 (Requirement Orchestrator)

도메인 기획 **L0-L4** 레이어와 **BE/Store 기획**을 순차적으로 조율하는 오케스트레이터입니다。

---

## 1. 담당 범위

### 도메인 기획 (L0-L4)

| 레벨 | 명칭 | 담당 에이전트 | 출력 위치 |
|------|------|--------------|----------|
| L0-L2 | 컨텍스트/사용자/목표 | req-L0L2-planner | `apps/[app]/app/(admin)/app.spec.md` 업데이트 |
| L3-L4 | 기능/화면 구조 | req-L3L4-planner | 각 `page.spec.md` 생성 |

### BE/Store 기획 (L7, L11)

| 레벨 | 명칭 | 담당 에이전트 | 출력 위치 |
|------|------|--------------|----------|
| L7 | Entity | req-entity-planner | `packages/be-entity/src/{entity}.entity.spec.md` |
| L11 | Store | req-store-planner | `packages/fe-store/src/stores/[domain]Store.spec.md` |
| BE 스펙 | Repository/Service/Controller | be-spec-planner | Sidecar spec (코드 옆 `.spec.md`) |

### 화면별 기획 (L5-L12) → 별도 오케스트레이터

화면별 상세 기획은 `orch-screen-planner`가 담당합니다。

---

## 2. 자연어 입력 처리

### 사용자 입력 예시

```
"이용자 리스트를 제공하는 화면을 기획해줘"
"회원 관리 기능 기획해줘"
"예약 시스템 만들고 싶어"
```

### 처리 플로우

```
자연어 입력
    ↓
┌─────────────────────────────────────────┐
│  1단계: 의도 분석                         │
│  - 도메인 추출 (User, Member, Order...)  │
│  - 화면 타입 추출 (List, Detail...)      │
│  - 앱 식별 (admin, coin...)              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  2단계: 케이스 분기                        │
│                                         │
│  app.spec.md에 해당 도메인 존재?          │
│  ├─ No → 새 도메인 기획 플로우            │
│  └─ Yes → 화면 추가 플로우                │
└─────────────────────────────────────────┘
```

### 케이스 분기

| 케이스 | 조건 | 실행 에이전트 |
|--------|------|--------------|
| 새 도메인 | `app.spec.md`에 해당 도메인 없음 | req-L0L2 → req-L3L4 → req-entity → req-store → be-spec |
| 화면 추가 | `app.spec.md`에 해당 도메인 존재 | orch-screen-planner |

---

## 3. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 앱 | ✅ | 앱 식별자 | "admin" |
| 도메인명 | ✅ | 기능 도메인 이름 | "Member", "Order" |
| 요구사항 | ✅ | 기능 설명 | "회원 목록/상세/등록/수정/삭제" |

### 출력

**새 도메인 생성 시:**

```
apps/[app]/app/(admin)/app.spec.md             # L0-L2 (도메인 엔트리 추가)

apps/[app]/app/(admin)/[도메인]/
├── page.spec.md                                # 목록 페이지 기획 (L3-L4)
├── [entityId]/
│   └── page.spec.md                            # 상세 페이지 기획
├── new/
│   └── page.spec.md                            # 등록 페이지 기획
└── [entityId]/edit/
    └── page.spec.md                            # 수정 페이지 기획

packages/fe-store/src/stores/
└── [domain]Store.spec.md                       # L11 Store 스펙

packages/be-entity/src/
└── [entity].entity.spec.md                     # Entity 스펙

apps/server/src/[module]/
├── [domain].service.spec.md                    # Service 스펙
├── repositories/
│   └── [domain].repository.spec.md             # Repository 스펙
└── controllers/
    └── [domain].controller.spec.md             # Controller 스펙
```

---

## 4. 실행 플로우

### 새 도메인 기획

```
┌─────────────────────────────────────────────────────────────┐
│                    오케스트레이터 시작                        │
│  입력: app, domain, requirements                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1단계: 기존 도메인 확인                                      │
│  - app.spec.md에 해당 도메인 존재 여부 확인                   │
│  - 존재 → 화면 추가 플로우로 전환                             │
│  - 없음 → 새 도메인 기획 진행                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2단계: 컨텍스트/사용자/목표 기획 (L0-L2)                      │
│  Task: req-L0L2-planner                                      │
│  → apps/[app]/app/(admin)/app.spec.md 업데이트               │
│    (도메인 목록 테이블에 엔트리 추가)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3단계: 기능/화면 구조 기획 (L3-L4)                           │
│  Task: req-L3L4-planner                                      │
│  → 각 page.spec.md 생성                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4단계: Entity 기획 (L7)                                     │
│  Task: req-entity-planner                                    │
│  → packages/be-entity/src/[entity].entity.spec.md           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5단계: Store 기획 (L11)                                     │
│  Task: req-store-planner                                     │
│  → packages/fe-store/src/stores/[domain]Store.spec.md       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  6단계: BE 스펙 기획                                          │
│  Task: be-spec-planner                                       │
│  → [domain].service.spec.md                                  │
│  → [domain].repository.spec.md                               │
│  → [domain].controller.spec.md                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    오케스트레이터 완료                         │
│                                                              │
│  📌 다음 단계:                                               │
│  - 화면별 기획: /orch-screen-planner app=[앱] domain=[도메인] screen=[화면] │
│  - 백엔드 구현: /orch-stage run stage=2 app=[앱] domain=[도메인] │
└─────────────────────────────────────────────────────────────┘
```

### 화면 추가 플로우

기존 도메인이 존재하면 `orch-screen-planner`를 호출합니다。

```
기존 도메인 확인 → orch-screen-planner 호출
```

---

## 5. 실행 예시

### 입력

```
/orch-requirement

앱: admin
도메인: Member
요구사항: 회원 목록/상세/등록/수정/삭제
```

### 실행 로그

```
🚀 요구사항 기획 오케스트레이터 시작

📋 입력 정보:
   - 앱: admin
   - 도메인: Member
   - 요구사항: 회원 목록/상세/등록/수정/삭제

✅ 기존 도메인 확인: 새 도메인입니다

▶ 1단계: 컨텍스트/사용자/목표 기획 (L0-L2)
  Task: req-L0L2-planner
  → app.spec.md 업데이트 완료 (Member 도메인 엔트리 추가)

▶ 2단계: 기능/화면 구조 기획 (L3-L4)
  Task: req-L3L4-planner
  → 각 page.spec.md 생성 완료

▶ 3단계: Entity 기획 (L7)
  Task: req-entity-planner
  → packages/be-entity/src/member.entity.spec.md 생성 완료

▶ 4단계: Store 기획 (L11)
  Task: req-store-planner
  → packages/fe-store/src/stores/memberStore.spec.md 생성 완료

▶ 5단계: BE 스펙 기획
  Task: be-spec-planner
  → Service/Repository/Controller 스펙 생성 완료

✅ 도메인 기획 완료

📁 생성/수정된 파일:
   - apps/admin/app/(admin)/app.spec.md (업데이트)
   - apps/admin/app/(admin)/members/page.spec.md
   - apps/admin/app/(admin)/members/[memberId]/page.spec.md
   - apps/admin/app/(admin)/members/new/page.spec.md
   - apps/admin/app/(admin)/members/[memberId]/edit/page.spec.md
   - packages/fe-store/src/stores/memberStore.spec.md
   - packages/be-entity/src/member.entity.spec.md
   - apps/server/src/member/member.service.spec.md
   - apps/server/src/member/repositories/member.repository.spec.md
   - apps/server/src/member/controllers/member.controller.spec.md

📌 다음 단계:
   1. 화면별 기획:
      /orch-screen-planner app=admin domain=Member screen=List
   2. 또는 개발 착수:
      /orch-stage run stage=2 app=admin domain=Member
```

---

## 6. 폴더 구조

```
apps/admin/app/(admin)/
│
├── app.spec.md                           # 앱 기획서 (L0-L2, 도메인 목록)
│
├── members/                              # MemberList 화면
│   ├── page.tsx
│   ├── page.spec.md                      # 목록 페이지 기획 (L3-L4)
│   ├── _client.tsx
│   ├── [memberId]/                       # MemberDetail 화면
│   │   ├── page.tsx
│   │   ├── page.spec.md                  # 상세 페이지 기획
│   │   └── edit/
│   │       ├── page.tsx
│   │       └── page.spec.md              # 수정 페이지 기획
│   └── new/
│       ├── page.tsx
│       └── page.spec.md                  # 등록 페이지 기획
│
├── reservations/
│   └── ...
└── orders/
    └── ...

packages/fe-store/src/stores/
├── memberStore.ts
└── memberStore.spec.md                   # L11 Store 스펙

apps/server/src/member/
├── member.service.ts
├── member.service.spec.md                # Service 스펙
├── repositories/
│   ├── member.repository.ts
│   └── member.repository.spec.md         # Repository 스펙
└── controllers/
    ├── member.controller.ts
    └── member.controller.spec.md         # Controller 스펙
```

---

## 7. 체크리스트

### 실행 전 확인
- [ ] 앱이 존재하는가?
- [ ] 도메인명이 명확한가?
- [ ] 요구사항이 구체적인가?

### 각 단계 완료 시
- [ ] 기획서 파일이 생성되었는가?
- [ ] 내용이 일관성 있는가?

### 전체 완료 시
- [ ] app.spec.md에 도메인 엔트리 추가
- [ ] 각 page.spec.md 생성
- [ ] Entity 기획서 생성 (`packages/be-entity/src/*.entity.spec.md`)
- [ ] Store 기획서 생성 (Sidecar)
- [ ] BE 스펙 기획서 생성 (Sidecar)

---

## 8. 연관 에이전트

### 호출 에이전트

| 에이전트 | 단계 | 출력 | 설명 |
|----------|------|------|------|
| req-L0L2-planner | 1 | `app.spec.md` 업데이트 | 컨텍스트/사용자/목표 기획 |
| req-L3L4-planner | 2 | 각 `page.spec.md` | 기능/화면 구조 기획 |
| req-entity-planner | 3 | `[entity].entity.spec.md` | Entity 기획 |
| req-store-planner | 4 | `[domain]Store.spec.md` | Store 기획 |
| be-spec-planner | 5 | `*.service.spec.md`, `*.repository.spec.md`, `*.controller.spec.md` | BE 스펙 기획 |

### 후행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| orch-screen-planner | 화면 기획 | 화면별 상세 기획 (L5-L12) |
| orch-stage | 개발 플로우 | 실제 개발 진행 |
