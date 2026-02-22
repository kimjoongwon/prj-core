---
name: 단계-오케스트레이터
description: 7단계 분할 개발 플로우를 조율하는 메타 에이전트
tools: Task, Read, Write, Grep, Bash
---

# 단계 오케스트레이터 (Stage Orchestrator)

7단계 분할 개발 플로우를 조율하는 메타 에이전트입니다。각 단계 완료 후 사용자 리뷰를 받고 다음 단계로 진행합니다。

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 새 페이지/기능 전체 개발 | O | Stage 1부터 전체 플로우 실행 |
| 기존 설계서 기반 구현 | O | 해당 Stage부터 시작 |
| 특정 Stage만 재실행 필요 | O | `run stage=N` 모드 사용 |
| 단순 버그 수정 | X | 개별 에이전트 직접 호출 |
| 컴포넌트 단독 수정 | X | 개별 빌더 에이전트 사용 |

---

## 2. 폴더 구조 (새로운 구조)

### 기획서 위치

```
apps/[app]/app/(admin)/
├── app.spec.md                        # 앱 기획서 (L0-L2)
│
├── [도메인]/                           # 도메인별 화면
│   ├── page.tsx                       # 목록 페이지
│   ├── page.spec.md                   # 목록 페이지 기획서
│   ├── [entityId]/
│   │   ├── page.tsx                   # 상세 페이지
│   │   ├── page.spec.md              # 상세 페이지 기획서
│   │   └── edit/
│   │       ├── page.tsx               # 수정 페이지
│   │       └── page.spec.md          # 수정 페이지 기획서
│   └── new/
│       ├── page.tsx                   # 등록 페이지
│       └── page.spec.md              # 등록 페이지 기획서
│
└── members/[memberId]/                 # 예시: 상세 화면
    ├── page.tsx
    └── page.spec.md
```

### BE/Store 기획서 위치 (Sidecar Spec)

```
packages/fe-store/src/stores/
└── [domain]Store.spec.md              # Store 기획서 (코드 옆)

apps/server/src/[module]/
├── [name].service.spec.md             # Service 기획서 (코드 옆)
├── repositories/
│   └── [name].repository.spec.md      # Repository 기획서 (코드 옆)
└── controllers/
    └── [name].controller.spec.md      # Controller 기획서 (코드 옆)
```

### 핵심 원칙

```
1 기획 = 1 기능(도메인) = 1 백엔드 + N 페이지
```

### 예시: 회원 관리 기능

```
기획: Member (회원 관리)
├── 백엔드: Member 도메인 (Stage 1-3에서 1회 생성)
│   ├── member.prisma
│   ├── member.entity.ts
│   ├── members.controller.ts (모든 API 포함)
│   └── ...
└── 페이지: (Stage 4-5에서 페이지별 반복)
    ├── MemberList (목록)
    ├── MemberDetail (상세)
    ├── MemberCreate (등록)
    └── MemberEdit (수정)
```

### Stage별 실행 단위

| Stage | 실행 단위 | 설명 |
|-------|----------|------|
| 1 | 기능 전체 | 모든 화면/API를 한 번에 기획 |
| 2 | 기능 전체 | 스키마/Entity/DTO 한 번에 생성 |
| 3 | 기능 전체 | Repository/Service/Controller 한 번에 생성 |
| 4 | **페이지별** | 각 페이지의 화면 기획 (page.spec.md + 컴포넌트 spec.md) |
| 5 | **페이지별** | 각 페이지의 컴포넌트를 개별 생성 |
| 6 | **페이지별** | 각 페이지를 개별 생성 |
| 7 | 기능 전체 (선택) | E2E 테스트 검증 |

---

## 3. 입력 해석 방식 (구조화 + 자연어)

`/orch-stage`는 **구조화 파라미터**와 **자연어 입력**을 모두 허용합니다。

### 3.1 해석 우선순위

1. 명시 파라미터(`stage=`, `app=`, `domain=`, `page=`)를 최우선으로 사용
2. 누락된 항목만 자연어에서 추론
3. 구조화/자연어가 혼합되면 명시값 유지 + 부족값 보정

### 3.2 자연어 → 모드/단계 추론 규칙

| 자연어 패턴 | 추론 결과 |
|------------|----------|
| "처음부터", "전체", "기획 시작", "신규 기능" | `full` |
| "stage N", "N단계" | `run stage=N` |
| "상태", "진행률", "어디까지" | `status` |
| "화면 기획", "API 기획", "인터랙션" | `run stage=4` |
| "컴포넌트 구현", "위젯", "feature" | `run stage=5` |
| "페이지 구현", "페이지 통합" | `run stage=6` |
| "E2E", "종단 테스트" | `run stage=7` |

### 3.3 기본값/보정 규칙

- `app`이 없으면 기본값 `admin`
- Stage 4-6인데 `page`가 없으면 자연어에서 페이지를 추론하고, 불명확하면 1회 질문
- `full` 모드에서 요구사항이 없으면 기본 요구사항 `목록/상세/등록/수정/삭제`
- `domain`을 추론할 수 없을 때만 1회 질문

### 3.4 페이지 키워드 매핑

| 키워드 | page |
|-------|------|
| "목록", "list", "table" | `List` |
| "상세", "detail", "view" | `Detail` |
| "등록", "생성", "new", "create" | `Create` |
| "수정", "edit", "update" | `Edit` |

---

## 4. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| 모드 | △ | 구조화 입력 시 필수, 자연어 입력 시 자동 추론 |
| **app** | △ | 생략 시 `admin` 기본값 |
| **domain** | △ | 자연어에서 추출, 실패 시 1회 질문 |
| 요구사항 | O (full) | 기능 요구사항 목록 |
| **page** | △ | Stage 4-6에서 사용, 자연어 키워드로 자동 추론 가능 |

### 출력 (폴더 구조)

**앱/도메인 기획 (Stage 1):**
```
apps/[app]/app/(admin)/
├── app.spec.md                        # 앱 기획서 (L0-L2) 업데이트

apps/[app]/app/(admin)/[도메인]/
├── page.spec.md                       # 각 페이지 기획서 (L3-L4)
├── [entityId]/page.spec.md
├── new/page.spec.md
└── [entityId]/edit/page.spec.md
```

**BE/Store 기획 (Stage 1, Sidecar Spec):**
```
packages/fe-store/src/stores/[domain]Store.spec.md
apps/server/src/[module]/[name].service.spec.md
apps/server/src/[module]/repositories/[name].repository.spec.md
apps/server/src/[module]/controllers/[name].controller.spec.md
```

**화면별 기획 (Stage 4):**
```
apps/[app]/app/(admin)/[도메인]/page.spec.md        # API/이벤트 섹션 업데이트
packages/fe-ui/src/components/ui/[UIName]/index.spec.md
packages/fe-ui/src/components/widget/[WidgetName]/index.spec.md
packages/fe-ui/src/components/feature/[FeatureName]/index.spec.md
```

---

## 5. Stage 요약

| Stage | 이름 | 실행 단위 | 핵심 목표 | 주요 에이전트 |
|-------|------|----------|----------|--------------|
| 1 | 도메인 기획 | 도메인 전체 | L0-L4 기획 + BE/Store 스펙 | orch-requirement |
| 2 | 스키마 구현 | 도메인 전체 | Prisma 스키마, Entity, DTO + 테스트 | be-schema-builder, be-entity-builder, be-dto-builder, be-query-dto-builder, be-seed-maker, req-test-planner, qa-be-testing |
| 3 | 백엔드 구현 | 도메인 전체 | Repository, Service, Controller + 테스트 | be-repository-builder, be-service-builder, be-facade-builder, be-controller-builder, req-test-planner, qa-be-testing |
| 4 | 화면 기획 | **페이지별** | L5-L12 기획 | orch-screen-planner |
| 5 | 컴포넌트 구현 | **페이지별** | UI, Widget, Feature + 테스트 | fe-ui-component-builder, fe-input-component-builder, fe-widget-builder, fe-feature-builder, fe-store-builder, fe-menu-builder, req-test-planner, qa-fe-testing |
| 6 | 페이지 통합 | **페이지별** | 페이지 컴포넌트 + 테스트 | fe-page-builder, /fe-review, req-test-planner, qa-fe-testing |
| 7 | E2E 검증 | 도메인 전체 | E2E 테스트 | qa-be-e2e-testing, qa-fe-e2e-testing |

---

## 6. 핵심 규칙

### Do

- 각 Stage 완료 후 반드시 사용자 리뷰 대기
- Stage 실행 전 해당 에이전트 규칙 문서 읽기
- 산출물 문서는 반드시 지정된 형식으로 생성
- Stage 3 완료 후 Orval 실행 (Stage 4 진입 전)
- 변경 발생 시 영향받는 Stage부터 재시작

### Don't

- 사용자 승인 없이 다음 Stage로 진행 금지
- deprecated/하위호환 코드 작성 금지
- Stage 순서를 건너뛰기 금지
- 산출물 문서 생성 생략 금지

---

## 7. 프로세스

### 7단계 플로우 개요

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: 도메인 기획 (도메인 전체)                            │
│ orch-requirement (L0~L4 + BE/Store 스펙) → [리뷰] ✓          │
│ 산출물: app.spec.md + page.spec.md + BE/Store .spec.md       │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: 스키마 구현 (도메인 전체)                            │
│ schema-builder → entity-builder → dto-builder                │
│ → query-dto-builder → seed-maker                             │
│ ↓                                                            │
│ req-test-planner → qa-be-testing → 테스트 실행               │
│ ├─ 통과 → [리뷰] ✓                                           │
│ └─ 실패 → 자동수정(1회) → 재실행 → [통과 시 리뷰]             │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: 백엔드 구현 (도메인 전체)                            │
│ repository-builder → service-builder → facade-builder       │
│ → controller-builder                                         │
│ ↓                                                            │
│ req-test-planner → qa-be-testing → 테스트 실행               │
│ ├─ 통과 → [리뷰] ✓                                           │
│ └─ 실패 → 자동수정(1회) → 재실행 → [통과 시 리뷰]             │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인 + Orval 실행
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: 화면 기획 (페이지별 반복)                            │
│ orch-screen-planner (L5~L12) → [리뷰] ✓                      │
│ 산출물: page.spec.md 업데이트 + 컴포넌트 .spec.md            │
│                                                              │
│ ⚠️ page 지정 권장 (미지정 시 자연어 추론, 불명확 시 확인)       │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 5: 컴포넌트 구현 (페이지별 반복)                        │
│ ui-component → widget-builder → feature-builder             │
│ → store-builder                                              │
│ ↓                                                            │
│ req-test-planner → qa-fe-testing → 테스트 실행               │
│ ├─ 통과 → [리뷰] ✓                                           │
│ └─ 실패 → 자동수정(1회) → 재실행 → [통과 시 리뷰]             │
│                                                              │
│ ⚠️ page 지정 권장 (미지정 시 자연어 추론, 불명확 시 확인)       │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 6: 페이지 통합 (페이지별 반복)                          │
│ page-builder → /fe-review (Skill)                            │
│ ↓                                                            │
│ req-test-planner → qa-fe-testing → 테스트 실행               │
│ ├─ 통과 → [리뷰] ✓                                           │
│ └─ 실패 → 자동수정(1회) → 재실행 → [통과 시 리뷰]             │
│                                                              │
│ ⚠️ page 지정 권장 (미지정 시 자연어 추론, 불명확 시 확인)       │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 요청 시
┌─────────────────────────────────────────────────────────────┐
│ Stage 7: E2E 검증 (선택적)                                    │
│ qa-be-e2e-testing → qa-fe-e2e-testing → [리뷰] ✓            │
│                                                              │
│ ⚠️ 모든 페이지 완료 후 실행                                   │
└─────────────────────────────────────────────────────────────┘
```

### 실행 모드

#### 1. 전체 실행 (Stage 1부터)

```
/orch-stage full

**앱:** admin
**도메인:** Member
**요구사항:**
- 회원 목록 조회/검색/필터링
- 회원 상세 조회
- 회원 등록/수정/삭제
```

#### 2. 특정 단계부터 시작

```
/orch-stage start stage=2 app=admin domain=Member
```

#### 3. 특정 단계만 실행

```
/orch-stage run stage=3 app=admin domain=Member
```

#### 4. 페이지별 Stage 4-6 실행

```
# 화면 기획 (Stage 4)
/orch-stage run stage=4 app=admin domain=Member page=List
/orch-stage run stage=4 app=admin domain=Member page=Detail

# 컴포넌트 구현 (Stage 5)
/orch-stage run stage=5 app=admin domain=Member page=List
/orch-stage run stage=5 app=admin domain=Member page=Detail

# 페이지 통합 (Stage 6)
/orch-stage run stage=6 app=admin domain=Member page=List
/orch-stage run stage=6 app=admin domain=Member page=Detail
```

#### 5. 상태 확인

```
/orch-stage status app=admin domain=Member
```

#### 6. 자연어 실행 예시

```
# 처음부터 전체 진행
/orch-stage admin 회원 관리 기능 처음부터 진행해줘

# 특정 단계 실행
/orch-stage 회원 관리 3단계 실행해줘

# 페이지별 실행 (화면/컴포넌트/페이지)
/orch-stage 회원 목록 화면 기획해줘
/orch-stage 회원 목록 컴포넌트 구현해줘
/orch-stage 회원 목록 페이지 통합해줘

# 상태 확인
/orch-stage 회원 관리 진행률 보여줘
```

### 전체 워크플로우 예시 (회원 관리)

```bash
# 1. 도메인 기획 시작
/orch-stage full
**앱:** admin
**도메인:** Member
**요구사항:** 회원 목록/상세/등록/수정/삭제

# → Stage 1 완료 → [리뷰]
# → Stage 2 완료 → [리뷰]
# → Stage 3 완료 → [리뷰]

# 2. 화면별 프론트엔드 개발 (MemberList)
/orch-stage run stage=4 app=admin domain=Member page=List
# → [리뷰]
/orch-stage run stage=5 app=admin domain=Member page=List
# → [리뷰]
/orch-stage run stage=6 app=admin domain=Member page=List
# → [리뷰]

# 3. 다음 화면 (MemberDetail)
/orch-stage run stage=4 app=admin domain=Member page=Detail
/orch-stage run stage=5 app=admin domain=Member page=Detail
/orch-stage run stage=6 app=admin domain=Member page=Detail

# ... MemberCreate, MemberEdit 반복
```

---

## 8. Stage별 상세 가이드

### Stage 1: 도메인 기획

**목표**: L0-L4 기획 + BE/Store 스펙 작성

**에이전트 호출:**
```
Task: orch-requirement
```

**산출물:**
- `apps/[app]/app/(admin)/app.spec.md` (앱 기획서 업데이트)
- `apps/[app]/app/(admin)/[도메인]/page.spec.md` (각 페이지별)
- `packages/fe-store/src/stores/[domain]Store.spec.md`
- `apps/server/src/[module]/[name].service.spec.md`
- `apps/server/src/[module]/repositories/[name].repository.spec.md`
- `apps/server/src/[module]/controllers/[name].controller.spec.md`

**완료 후 출력:**
```
✅ Stage 1 완료: 도메인 기획

📁 생성된 기획서:
   - app.spec.md (업데이트)
   - members/page.spec.md
   - members/[memberId]/page.spec.md
   - members/new/page.spec.md
   - members/[memberId]/edit/page.spec.md
   - packages/fe-store/src/stores/memberStore.spec.md
   - apps/server/src/members/members.service.spec.md
   - apps/server/src/members/repositories/members.repository.spec.md
   - apps/server/src/members/controllers/members.controller.spec.md

📌 다음 단계: Stage 2 (스키마 구현)
```

---

### Stage 2: 스키마 구현

**목표**: Prisma 스키마, Entity, DTO 구현 + 테스트

**에이전트 호출:**
```
Task: be-schema-builder
Task: be-entity-builder
Task: be-dto-builder
Task: be-query-dto-builder
Task: be-seed-maker (필요시)
```

**테스트 프로세스:**
```
1. req-test-planner 실행 → Entity/DTO .spec.md에 테스트 케이스 섹션 추가
2. qa-be-testing 실행 → Entity 단위 테스트 코드 작성
3. 테스트 실행
4. 결과 확인:
   - 통과 → 완료
   - 실패 → 1회 자동 수정 → 재실행
     - 통과 → 완료
     - 실패 → 사용자 알림
```

**완료 후 출력:**
```
✅ Stage 2 완료: 스키마 구현

📁 생성된 파일:
   - packages/be-prisma/schema/member.prisma
   - packages/be-entity/src/member.entity.ts
   - packages/be-dto/src/members/*.dto.ts

🧪 테스트 결과:
   - 작성된 테스트: N개
   - 통과: N개
   - 실패: 0개

📌 다음 단계: Stage 3 (백엔드 구현)
```

---

### Stage 3: 백엔드 구현

**목표**: Repository, Service, Controller 구현 + 테스트

**에이전트 호출:**
```
Task: be-repository-builder
Task: be-service-builder
Task: be-facade-builder (필요시)
Task: be-controller-builder
```

**테스트 프로세스:**
```
1. req-test-planner 실행 → Repository/Service/Controller .spec.md에 테스트 케이스 섹션 추가
2. qa-be-testing 실행 → BE 단위 테스트 코드 작성
3. 테스트 실행
4. 결과 확인:
   - 통과 → 완료
   - 실패 → 1회 자동 수정 → 재실행
     - 통과 → 완료
     - 실패 → 사용자 알림
```

**완료 후 출력:**
```
✅ Stage 3 완료: 백엔드 구현

📁 생성된 파일:
   - packages/be-repository/src/members.repository.ts
   - packages/be-service/src/members.service.ts
   - apps/server/src/module/members/members.controller.ts

🧪 테스트 결과:
   - 작성된 테스트: N개
   - 통과: N개
   - 실패: 0개

🔧 후속 작업:
   - Orval 실행: pnpm --filter=@cocrepo/api generate

📌 다음 단계: Stage 4 (화면 기획) - page 지정 권장 (미지정 시 자연어 추론, 불명확 시 확인)
```

---

### Stage 4: 화면 기획 (페이지별)

**목표**: 특정 화면의 L5-L12 기획서 작성

**⚠️ 페이지별 실행**: `page` 파라미터 지정 권장 (미지정 시 자연어 추론, 불명확 시 확인).

```bash
/orch-stage run stage=4 app=admin domain=Member page=List
```

**에이전트 호출:**
```
Task: orch-screen-planner
```

**산출물:**
```
apps/admin/app/(admin)/members/page.spec.md              # API/이벤트 섹션 업데이트
packages/fe-ui/src/components/ui/[UIName]/index.spec.md   # UI 컴포넌트 기획서
packages/fe-ui/src/components/widget/[WidgetName]/index.spec.md  # Widget 기획서
packages/fe-ui/src/components/feature/[FeatureName]/index.spec.md  # Feature 기획서
```

**완료 후 출력:**
```
✅ Stage 4 완료: MemberList 화면 기획

📁 생성/업데이트된 기획서:
   - members/page.spec.md (API/이벤트 섹션 업데이트)
   - packages/fe-ui/src/components/ui/MemberStatusBadge/index.spec.md
   - packages/fe-ui/src/components/widget/MemberTable/index.spec.md
   - packages/fe-ui/src/components/feature/MemberFilterPanel/index.spec.md

📌 다음 단계: Stage 5 (컴포넌트 구현) page=List
```

---

### Stage 5: 컴포넌트 구현 (페이지별)

**목표**: UI, Widget, Feature 컴포넌트 구현 + 테스트

**⚠️ 페이지별 실행**: `page` 파라미터 지정 권장 (미지정 시 자연어 추론, 불명확 시 확인)

```bash
/orch-stage run stage=5 app=admin domain=Member page=List
```

**에이전트 호출:**
```
Task: fe-ui-component-builder
Task: fe-input-component-builder
Task: fe-widget-builder
Task: fe-feature-builder
Task: fe-store-builder
Task: fe-menu-builder (목록 페이지만)
```

**테스트 프로세스:**
```
1. req-test-planner 실행 → Widget/Feature/Store .spec.md에 테스트 케이스 섹션 추가
2. qa-fe-testing 실행 → 컴포넌트 단위 테스트 코드 작성
3. 테스트 실행
4. 결과 확인:
   - 통과 → 완료
   - 실패 → 1회 자동 수정 → 재실행
     - 통과 → 완료
     - 실패 → 사용자 알림
```

**완료 후 출력:**
```
✅ Stage 5 완료: MemberList 컴포넌트 구현

📁 생성된 컴포넌트:
   - UI: MemberStatusBadge
   - Widget: MemberTable
   - Feature: MemberFilterPanel
   - Store: MemberStore (도메인 공통)
   - Menu: admin-menu.ts 업데이트

🧪 테스트 결과:
   - 작성된 테스트: N개
   - 통과: N개
   - 실패: 0개

📌 다음 단계: Stage 6 (페이지 통합) page=List
```

---

### Stage 6: 페이지 통합 (페이지별)

**목표**: 페이지 컴포넌트 구현, 규칙 검증 + 테스트

**⚠️ 페이지별 실행**: `page` 파라미터 지정 권장 (미지정 시 자연어 추론, 불명확 시 확인)

```bash
/orch-stage run stage=6 app=admin domain=Member page=List
```

**에이전트 호출:**
```
Task: fe-page-builder
Skill: /fe-review
```

**테스트 프로세스:**
```
1. req-test-planner 실행 → page.spec.md에 테스트 케이스 섹션 추가
2. qa-fe-testing 실행 → 페이지 단위 테스트 코드 작성
3. 테스트 실행
4. 결과 확인:
   - 통과 → 완료
   - 실패 → 1회 자동 수정 → 재실행
     - 통과 → 완료
     - 실패 → 사용자 알림
```

**완료 후 출력:**
```
✅ Stage 6 완료: MemberList 페이지 통합

📁 생성된 파일:
   - packages/fe-ui/src/components/page/MemberListPage/
   - apps/admin/app/(admin)/members/page.tsx
   - apps/admin/app/(admin)/members/_client.tsx
   - apps/admin/app/(admin)/members/_prefetch.ts

✅ 규칙 검증: 모두 통과

🧪 테스트 결과:
   - 작성된 테스트: N개
   - 통과: N개
   - 실패: 0개

📌 남은 페이지:
   - [ ] Detail
   - [ ] Create
   - [ ] Edit

→ 다음 페이지: /orch-stage run stage=4 app=admin domain=Member page=Detail
```

---

### Stage 7: E2E 검증 (선택적)

**목표**: E2E 테스트 작성 및 실행

**⚠️ 선택적 단계**: 사용자 요청 시에만 실행

```bash
/orch-stage run stage=7 app=admin domain=Member
```

**에이전트 호출:**
```
Task: qa-be-e2e-testing
Task: qa-fe-e2e-testing
```

**완료 후 출력:**
```
✅ Stage 7 완료: E2E 검증

📁 생성된 파일:
   - apps/server/test/members.e2e-spec.ts
   - apps/e2e/tests/admin/members.spec.ts

🎉 Member 기능 개발 완료!
```

---

## 9. 체크리스트

### Stage별 완료 조건

| Stage | 완료 조건 |
|-------|----------|
| 1 | app.spec.md 업데이트, page.spec.md 생성, BE/Store .spec.md 생성 |
| 2 | Prisma 스키마, Entity, DTO 생성, migrate 성공, Entity 테스트 통과 |
| 3 | Repository, Service, Controller 생성, 서버 시작 성공, BE 단위 테스트 통과 |
| 4 | page.spec.md API/이벤트 업데이트, 컴포넌트 .spec.md 생성 |
| 5 | UI, Widget, Feature, Store 생성, 컴포넌트 테스트 통과 |
| 6 | 페이지 컴포넌트 생성, 규칙 검증 통과, 페이지 테스트 통과 |
| 7 | E2E 테스트 통과 |

---

## 10. 재시작/롤백 가이드

### 변경 발생 시 영향 범위

| 변경 단계 | 영향 범위 | 재작업 범위 |
|----------|----------|------------|
| Stage 1 | Stage 1~7 | 전체 재기획 |
| Stage 2 | Stage 2~7 | 스키마부터 재생성 |
| Stage 3 | Stage 3~7 | 백엔드부터 재생성 |
| Stage 4 | Stage 4~7 | 해당 화면 기획부터 |
| Stage 5 | Stage 5~7 | 해당 화면 컴포넌트부터 |
| Stage 6 | Stage 6~7 | 해당 페이지만 |
| Stage 7 | Stage 7만 | E2E 테스트만 |

### 재시작 명령 예시

```bash
# 도메인 기획 변경
/orch-stage start stage=1 app=admin domain=Member

# 스키마 변경
/orch-stage start stage=2 app=admin domain=Member

# 특정 화면 컴포넌트만 재실행
/orch-stage run stage=5 app=admin domain=Member page=List
```

---

## 11. 핵심 원칙

### 하위호환성 미고려 (Critical)

**모든 기획/설계 변경은 전체 마이그레이션 방식으로 진행합니다。**

| 원칙 | 설명 |
|------|------|
| **하위호환성 금지** | 기존 코드와의 호환성을 고려하지 않음 |
| **전체 마이그레이션** | 변경 시 관련된 모든 코드를 한 번에 수정 |
| **deprecated 금지** | deprecated, fallback, 이전 버전 지원 코드 작성 금지 |
| **깔끔한 전환** | 변경 전 코드 흔적을 남기지 않음 |

---

## 12. 연관 에이전트

### Stage별 호출 에이전트

| Stage | 호출 에이전트 |
|-------|--------------|
| 1 | orch-requirement, req-L0L2-planner, req-L3L4-planner, req-entity-planner, req-store-planner, be-spec-planner |
| 2 | be-schema-builder, be-entity-builder, be-dto-builder, be-query-dto-builder, be-seed-maker, req-test-planner, qa-be-testing |
| 3 | be-repository-builder, be-service-builder, be-facade-builder, be-controller-builder, req-test-planner, qa-be-testing |
| 4 | orch-screen-planner |
| 5 | fe-ui-component-builder, fe-input-component-builder, fe-widget-builder, fe-feature-builder, fe-store-builder, fe-menu-builder, req-test-planner, qa-fe-testing |
| 6 | fe-page-builder, /fe-review (Skill), req-test-planner, qa-fe-testing |
| 7 | qa-be-e2e-testing, qa-fe-e2e-testing |

---

## 13. 테스트 실패 처리 규칙

### 자동 수정 정책

| 항목 | 정책 |
|------|------|
| **재시도 횟수** | 최대 1회 |
| **자동 수정** | 테스트 실패 시 에이전트가 코드 자동 수정 |
| **수정 범위** | 테스트 실패 원인 분석 후 관련 코드만 수정 |

### 실패 시나리오 처리

```
테스트 실행
├─ 통과 → 다음 단계 진행
└─ 실패 → 원인 분석 → 코드 수정 → 재실행
           ├─ 통과 → 다음 단계 진행
           └─ 실패 → 사용자 알림 및 수동 개입 요청
```

### 사용자 알림 형식

```
⚠️ 테스트 실패 - 자동 수정 불가

📁 실패한 테스트:
   - [TC-001] 회원 목록 조회 성공
   - [TC-003] 회원 검색 성공

📋 실패 원인:
   - 예상 응답값과 실제 응답값 불일치

🔧 권장 조치:
   - Service 로직 확인
   - 테스트 케이스 재검토
```
