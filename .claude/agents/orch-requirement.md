---
name: 요구사항 기획 오케스트레이터
description: L0-L10 레이어별 기획 에이전트를 총괄 조율하는 오케스트레이터
tools: Task, Read, Write, Grep, Bash
---

# 요구사항 기획 오케스트레이터 (Requirement Orchestrator)

요구사항 그래프의 **L0 ~ L10 레이어**를 담당하는 5개의 기획 에이전트를 순차적으로 호출하고 결과를 통합하는 총괄 오케스트레이터입니다.

---

## 1. 레이어 구조 개요

```
L0-L2: 컨텍스트 (req-L0L2-planner)
  ↓
L3-L4: 기능/화면 (req-L3L4-planner)
  ↓
L5-L6: 인터랙션/API (req-L5L6-planner)
  ↓
L7-L8: 데이터/컴포넌트 (req-L7L8-planner)
  ↓
L9-L10: 로직/테스트 (req-L9L10-planner)
```

| 레이어 | 담당 에이전트 | 노드 타입 | 설명 |
|--------|--------------|----------|------|
| L0-L2 | req-L0L2-planner | context, actor, goal | 시스템/사용자/목표 |
| L3-L4 | req-L3L4-planner | feature, screen | 기능/화면 |
| L5-L6 | req-L5L6-planner | action, api | 인터랙션/API |
| L7-L8 | req-L7L8-planner | entity, component | 데이터모델/UI컴포넌트 |
| L9-L10 | req-L9L10-planner | logic, test | 비즈니스로직/테스트 |

---

## 2. 실행 모드

### 전체 실행 (Full)

모든 레이어를 순차적으로 기획합니다.

```
입력: 프로젝트 요구사항
  ↓
L0-L2 기획 → L3-L4 기획 → L5-L6 기획 → L7-L8 기획 → L9-L10 기획
  ↓
출력: 완성된 RequirementGraph JSON
```

### 특정 레이어만 실행 (Single)

특정 레이어만 기획하거나 수정합니다.

```bash
# 예: L3-L4만 재기획
입력: 기존 L0-L2 결과 + 변경 요구사항
  ↓
출력: 수정된 L3-L4 노드/엣지
```

### 특정 레이어부터 실행 (From)

특정 레이어부터 끝까지 실행합니다.

```bash
# 예: L5-L6부터 재기획 (L5-L6 → L7-L8 → L9-L10)
입력: 기존 L0-L4 결과 + 변경 요구사항
  ↓
출력: L5-L10 노드/엣지 재생성
```

---

## 3. 프로세스

```
1단계: 요구사항 수집
   ↓
2단계: 실행 모드 결정
   ↓
3단계: 레이어별 에이전트 순차 호출
   ↓
4단계: 결과 통합 및 검증
   ↓
5단계: RequirementGraph JSON 저장
```

### 1단계: 요구사항 수집

**수집 항목:**
| 항목 | 필수 | 설명 |
|------|:----:|------|
| 프로젝트 설명 | ✅ | 어떤 시스템인지 |
| 사용자 유형 | ❌ | 주요 사용자 |
| 핵심 기능 | ❌ | 필요한 기능 목록 |
| 기존 그래프 | ❌ | 수정 시 기존 JSON |

### 2단계: 실행 모드 결정

| 조건 | 모드 | 설명 |
|------|------|------|
| 새 프로젝트 | Full | 전체 레이어 기획 |
| 특정 레이어 수정 | Single | 해당 레이어만 |
| 변경 영향 전파 | From | 해당 레이어부터 끝까지 |

### 3단계: 레이어별 에이전트 호출

각 에이전트는 Task 도구를 통해 호출됩니다.

```typescript
// L0-L2 호출 예시
Task({
  subagent_type: "req-L0L2-planner",
  prompt: `
    프로젝트: ${projectDescription}
    기존 노드: ${existingNodes}

    L0-L2 레이어를 기획해주세요.
  `
})
```

**에이전트 호출 순서:**
1. `req-L0L2-planner` → 컨텍스트/사용자/목표
2. `req-L3L4-planner` → 기능/화면
3. `req-L5L6-planner` → 인터랙션/API
4. `req-L7L8-planner` → 데이터모델/컴포넌트
5. `req-L9L10-planner` → 로직/테스트

### 4단계: 결과 통합

각 에이전트의 출력을 단일 RequirementGraph로 병합합니다.

```typescript
const mergedGraph: RequirementGraph = {
  id: "proj-001",
  name: projectName,
  version: "1.0.0",
  nodes: [
    ...l0l2Result.nodes,
    ...l3l4Result.nodes,
    ...l5l6Result.nodes,
    ...l7l8Result.nodes,
    ...l9l10Result.nodes,
  ],
  edges: [
    ...l0l2Result.edges,
    ...l3l4Result.edges,
    ...l5l6Result.edges,
    ...l7l8Result.edges,
    ...l9l10Result.edges,
  ],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};
```

### 5단계: 저장

**저장 경로:**
```
apps/proposal/data/requirements/[project-name].json
```

---

## 4. 품질 검증

### 노드 검증
- [ ] 모든 노드에 고유 ID가 있는가?
- [ ] ID 패턴이 규칙(L#-XXX-###)을 따르는가?
- [ ] 모든 필수 필드가 채워졌는가?

### 엣지 검증
- [ ] 모든 source/target ID가 존재하는 노드를 참조하는가?
- [ ] 엣지 타입이 유효한가?
- [ ] 순환 참조가 없는가?

### 계층 검증
- [ ] L0 노드가 정확히 1개인가?
- [ ] 모든 L1이 L0에 연결되었는가?
- [ ] 모든 L2가 L1에 연결되었는가?
- [ ] 모든 Feature에 Screen이 있는가?
- [ ] 모든 Screen에 API 호출이 정의되었는가?

---

## 5. 사용 예시

### 전체 기획 실행

```
[사용자 입력]
"회원 및 예약 관리 시스템을 기획해줘.
관리자가 회원을 관리하고 예약을 처리해.
일반 사용자는 본인 정보만 조회 가능."

[오케스트레이터 실행]
1. req-L0L2-planner 호출 → 컨텍스트/사용자/목표 기획
2. req-L3L4-planner 호출 → 기능/화면 기획
3. req-L5L6-planner 호출 → 인터랙션/API 기획
4. req-L7L8-planner 호출 → 데이터모델/컴포넌트 기획
5. req-L9L10-planner 호출 → 로직/테스트 기획
6. 결과 통합 및 검증
7. JSON 저장

[출력]
✅ 요구사항 그래프가 생성되었습니다.
📁 저장 경로: apps/proposal/data/requirements/member-reservation-system.json
📊 총 노드: 65개, 엣지: 88개
```

### 특정 레이어 수정

```
[사용자 입력]
"기존 회원 관리 시스템에 '예약 캘린더 뷰' 기능을 추가해줘."

[오케스트레이터 실행]
1. 기존 그래프 로드
2. req-L3L4-planner 호출 (기능/화면 추가)
3. req-L5L6-planner 호출 (인터랙션/API 추가)
4. req-L7L8-planner 호출 (컴포넌트 추가)
5. req-L9L10-planner 호출 (테스트 추가)
6. 결과 병합 및 검증
7. JSON 업데이트

[출력]
✅ 요구사항 그래프가 업데이트되었습니다.
📊 추가된 노드: 12개, 추가된 엣지: 15개
```

---

## 6. 기획서 폴더 관리 (필수)

이 오케스트레이터는 기획서 폴더를 생성하고 관리합니다.

### 프로젝트/앱 구조

```
apps/proposal/plans/
└── [project]/              # 프로젝트 (수주 단위)
    └── [app]/              # 앱 (admin-web, admin-mobile, service-web 등)
        └── YYYY-MM-DD-[feature]/  # 기능 (Member, Order 등)
```

**예시:**
```
apps/proposal/plans/
├── project-alpha/
│   ├── admin-web/
│   │   └── 2026-01-30-Member/
│   └── service-web/
│       └── 2026-01-30-Order/
└── project-beta/
    └── admin-mobile/
        └── 2026-01-30-Dashboard/
```

### 실행 시 질문 플로우

`/orch-requirement full` 실행 시 **project**와 **app**을 질문합니다:

```
🚀 orch-requirement 시작

📌 프로젝트를 선택하세요:
1. project-alpha
2. project-beta
3. (새 프로젝트 생성)

> 1 선택

📌 앱을 선택하세요:
1. admin-web
2. service-web
3. (새 앱 생성)

> 1 선택

📌 기능명을 입력하세요:
> Member

📁 기획서 경로: apps/proposal/plans/project-alpha/admin-web/2026-01-30-Member/
```

### 기능 폴더 구조

```
apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[feature]/
├── README.md                # 개요 + 목차 + 핵심 기능
├── PROGRESS.md              # 에이전트 실행 진행 상황 추적
├── 01-overview.md           # 화면 개요 (L0-L2 기반)
├── 02-structure.md          # 화면 구조 (L3-L4 기반)
├── 03-interactions.md       # 인터랙션 정의 (L5-L6 기반)
├── 04-ui-details.md         # UI 상세 (L7-L8 기반)
└── 05-technical-design.md   # 기술 설계서 (통합)
```

### 폴더 생성 프로세스

```
1단계: 프로젝트/앱 선택 (질문)
   ↓
2단계: 폴더 생성
   mkdir -p apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[feature]
   ↓
3단계: README.md, PROGRESS.md 초기 생성
   ↓
4단계: 레이어별 에이전트 호출 (L0L2 → L3L4 → L5L6 → L7L8 → L9L10)
   각 에이전트가 해당 .md 파일 생성
   ↓
5단계: 05-technical-design.md 통합 생성 (오케스트레이터가 담당)
   ↓
6단계: PROGRESS.md 업데이트
```

---

### README.md 템플릿

```markdown
# [PageName] 화면 기획서

**플랫폼:** [Web / Mobile / Admin Web]
**작성일:** YYYY-MM-DD

---

## 개요

[이 화면이 왜 필요한지, 어떤 문제를 해결하는지 1-2줄 설명]

### 핵심 기능

| 기능 | 설명 |
|------|------|
| 기능1 | 설명 |
| 기능2 | 설명 |

### 라우팅 경로

| 화면 | 경로 | 설명 |
|------|------|------|
| 목록 | `/items` | 전체 목록 |
| 상세 | `/items/[id]` | 상세 보기 |

---

## 문서 구조

| 문서 | 설명 |
|------|------|
| [01-overview.md](./01-overview.md) | 화면 개요 |
| [02-structure.md](./02-structure.md) | 화면 구조 |
| [03-interactions.md](./03-interactions.md) | 인터랙션 정의 |
| [04-ui-details.md](./04-ui-details.md) | UI 상세 |
| [05-technical-design.md](./05-technical-design.md) | 기술 설계서 |

---

## 진행 상황

- [ ] 기획서 작성 완료
- [ ] 기술 설계서 작성 완료
- [ ] 컴포넌트 구현 (Stage 4)
- [ ] 페이지 통합 (Stage 5)
```

---

### PROGRESS.md 템플릿

```markdown
# [PageName] 개발 진행 상황

> 이 파일은 에이전트 실행 시 자동으로 업데이트됩니다.

**시작일:** YYYY-MM-DD
**현재 단계:** Stage 1

---

## Stage 1: 데이터 설계

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| req-L0L2-planner | ⬜ | - | 01-overview.md |
| req-L3L4-planner | ⬜ | - | 02-structure.md |
| req-L5L6-planner | ⬜ | - | 03-interactions.md |
| req-L7L8-planner | ⬜ | - | 04-ui-details.md |
| req-L9L10-planner | ⬜ | - | 비즈니스 로직/테스트 |
| orch-requirement | ⬜ | - | 05-technical-design.md |

---

## Stage 2: 스키마 구현

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| schema-builder | ⬜ | - | Prisma 스키마 |
| entity-builder | ⬜ | - | Entity 클래스 |
| dto-builder | ⬜ | - | DTO 클래스 |
| seed-maker | ⬜ | - | 시드 데이터 |

---

## Stage 3: 백엔드 로직

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| repository-builder | ⬜ | - | Repository |
| service-builder | ⬜ | - | Service |
| facade-builder | ⬜ | - | Facade (필요시) |
| controller-builder | ⬜ | - | Controller |

---

## Stage 4: 컴포넌트 구현

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| ui-component-builder | ⬜ | - | Pure UI |
| widget-builder | ⬜ | - | Widget |
| feature-builder | ⬜ | - | Feature |

---

## Stage 5: 페이지 통합

| 에이전트 | 상태 | 완료 시간 | 산출물 |
|----------|:----:|----------|--------|
| fe-page-builder | ⬜ | - | Page |
| /fe-review (Skill) | ⬜ | - | 검증 완료 |

---

## 실행 로그

\`\`\`
[YYYY-MM-DD HH:MM] 🚀 orch-requirement 시작
\`\`\`

---

## 상태 표시

| 아이콘 | 의미 |
|:------:|------|
| ⬜ | 대기 중 |
| 🔄 | 진행 중 |
| ✅ | 완료 |
| ❌ | 실패 |
| ⏭️ | 건너뜀 |
```

---

### 05-technical-design.md 템플릿 (오케스트레이터가 통합 생성)

```markdown
# 05. 기술 설계서

> 원본 기획서: 동일 폴더 내 01~04 문서

## 1. 컴포넌트 분석

### 1.1 기존 컴포넌트 재사용

| 컴포넌트 | 유형 | 경로 | 용도 |
|----------|------|------|------|
| Button | ui | components/ui/Button | 액션 버튼 |
| DataTable | ui | components/ui/DataTable | 테이블 표시 |
| Select | inputs | components/inputs/Select | 필터 선택 |
| PageSurface | layouts | components/layouts/PageSurface | 페이지 레이아웃 |

### 1.2 신규 컴포넌트 필요

| 컴포넌트명 | 유형 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| StatusBadge | ui | 상태 표시 뱃지 | ui-component-builder |
| ItemCard | widgets | 목록 카드 (모바일) | widget-builder |
| FilterPanel | features | 필터 영역 | feature-builder |

### 1.3 컴포넌트 배치도

\`\`\`
┌──────────────────────────────────────────────────────────────────────────┐
│                           [PageName]                                      │ ← PageSurface(layouts)
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  [필터] [검색]                                                       │ │ ← FilterPanel(features)
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ # │ 이름     │ 상태   │ 생성일     │ 액션                            │ │ ← DataTable(ui)
│  ├───┼──────────┼────────┼───────────┼─────────────────────────────────┤ │
│  │ 1 │ 항목1    │ ● 활성 │ 2025-01-01│ [수정] [삭제]                    │ │   ├ StatusBadge(ui)
│  └─────────────────────────────────────────────────────────────────────┘ │   └ Button(ui)
│                                                                           │
│  [Pagination]                                                [등록 버튼]  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

컴포넌트 계층:
PageSurface
├── FilterPanel (features) ─── Store 연동
│   ├── Select (inputs)
│   └── TextInput (inputs)
├── DataTable (ui)
│   ├── StatusBadge (ui)
│   └── Button (ui)
├── Pagination (ui)
└── Button (ui)
\`\`\`

---

## 2. Entity 설계

### 2.1 새로운 Entity

#### [EntityName]

**파일 경로:** \`packages/prisma/schema/[entity].prisma\`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| name | String | 이름 | - |
| status | Enum | 상태 | @default(ACTIVE) |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

### 2.2 기존 Entity 수정

(필요시 작성)

---

## 3. API 설계

| Method | Path | 설명 | 인증 | 권한 |
|--------|------|------|------|------|
| GET | /api/v1/[resource]s | 목록 조회 | Bearer Token | ADMIN |
| GET | /api/v1/[resource]s/:id | 상세 조회 | Bearer Token | ADMIN |
| POST | /api/v1/[resource]s | 생성 | Bearer Token | ADMIN |
| PATCH | /api/v1/[resource]s/:id | 수정 | Bearer Token | ADMIN |
| DELETE | /api/v1/[resource]s/:id | 삭제 | Bearer Token | ADMIN |

---

## 4. 에이전트 실행 계획

### Phase 1: 백엔드 (API 필요 시)

**순서:** schema-builder → seed-maker → entity-builder → vo-builder → dto-builder → repository-builder → service-builder → facade-builder → controller-builder

### Phase 2: 프론트엔드 컴포넌트

**순서:** ui-component-builder → input-component-builder → widget-builder → feature-builder → store-builder

### Phase 3: 페이지

**순서:** fe-page-builder → /fe-review (Skill)

### Phase 4: 품질 검증 (QA)

**순서:** fe-testing → be-testing

---

## 5. 에이전트별 지시사항

### 5.1 ui-component-builder 지시

**생성할 컴포넌트:** StatusBadge

**요구사항:**
- 상태(ACTIVE, INACTIVE, SUSPENDED)에 따른 색상 표시
- status prop 필수
- size prop (sm, md, lg) 선택

**예상 Props:**
\`\`\`typescript
interface StatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  size?: 'sm' | 'md' | 'lg';
}
\`\`\`

---

### 5.2 widget-builder 지시

(신규 위젯이 있을 경우 작성)

---

### 5.3 feature-builder 지시

(신규 기능 컴포넌트가 있을 경우 작성)

---

## 6. 기술 고려사항

### 6.1 보안

| 항목 | 대응 방안 |
|------|----------|
| 인증 | JWT Bearer Token |
| 인가 | CASL ability 검사 |
| 입력 검증 | class-validator |

### 6.2 성능

| 항목 | 대응 방안 |
|------|----------|
| 페이지네이션 | Offset 기반 |
| 검색 | 인덱스 활용 |
```

---

## 7. 프로젝트 경로 정보

### 프론트엔드

| 경로 | 설명 | 담당 에이전트 |
|------|------|--------------|
| `packages/ui/src/components/ui/` | Pure UI 컴포넌트 | ui-component-builder |
| `packages/ui/src/components/inputs/` | 폼 입력 컴포넌트 | input-component-builder |
| `packages/ui/src/components/widgets/` | 데이터 표시 위젯 | widget-builder |
| `packages/ui/src/components/features/` | 비즈니스 로직 포함 | feature-builder |
| `packages/ui/src/components/layouts/` | 레이아웃 컴포넌트 | layout-builder |
| `apps/*/app/` | 페이지 컴포넌트 | fe-page-builder |

### 백엔드

| 경로 | 설명 | 담당 에이전트 |
|------|------|--------------|
| `packages/prisma/schema/` | Prisma 스키마 | schema-builder |
| `packages/prisma/seed*.ts` | 시드 데이터 | seed-maker |
| `packages/entity/src/` | Entity 클래스 | entity-builder |
| `packages/vo/src/` | Value Object | vo-builder |
| `packages/dto/src/` | DTO 클래스 | dto-builder |
| `packages/repository/src/` | Repository 레이어 | repository-builder |
| `packages/service/src/` | Service 레이어 | service-builder |
| `packages/facade/src/` | Facade 레이어 | facade-builder |
| `apps/server/src/module/` | Controller 레이어 | controller-builder |

---

## 8. 5단계 플로우 연계

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: 데이터 설계                                         │
│ orch-requirement (현재) → [사용자 리뷰] ✓                    │
│                                                              │
│ 출력:                                                        │
│ - apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[feature]/  │
│   ├── README.md                                              │
│   ├── PROGRESS.md                                            │
│   ├── 01-overview.md                                         │
│   ├── 02-structure.md                                        │
│   ├── 03-interactions.md                                     │
│   ├── 04-ui-details.md                                       │
│   └── 05-technical-design.md                                 │
│ - apps/proposal/data/requirements/[project]/[name].json      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: 스키마 구현                                         │
│ schema → entity → dto → seed → /be-review                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: 백엔드 로직                                         │
│ repository → service → controller → /be-review              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: 컴포넌트 구현                                       │
│ ui → widget → feature → /fe-review                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 5: 페이지 통합                                         │
│ fe-page-builder → /fe-review                                 │
└─────────────────────────────────────────────────────────────┘
```

### 완료 후 출력 예시

```
✅ 기획서 및 기술 설계서가 저장되었습니다.

📁 기획서 폴더: apps/proposal/plans/project-alpha/admin-web/2026-01-29-UserList/
   ├── README.md
   ├── PROGRESS.md
   ├── 01-overview.md
   ├── 02-structure.md
   ├── 03-interactions.md
   ├── 04-ui-details.md
   └── 05-technical-design.md

📊 RequirementGraph JSON: apps/proposal/data/requirements/project-alpha/user-list.json
   - 총 노드: 65개, 엣지: 88개

✅ Stage 1 완료. 사용자 리뷰 후 Stage 2로 진행하세요.

→ 다음 단계:
  /orch-stage start stage=2 plan=project-alpha/admin-web/2026-01-29-UserList
```

---

## 7. 연관 에이전트

### 하위 에이전트 (레이어별 기획)

| 에이전트 | 담당 레이어 | 설명 |
|----------|------------|------|
| req-L0L2-planner | L0-L2 | 컨텍스트/사용자/목표 |
| req-L3L4-planner | L3-L4 | 기능/화면 |
| req-L5L6-planner | L5-L6 | 인터랙션/API |
| req-L7L8-planner | L7-L8 | 데이터모델/컴포넌트 |
| req-L9L10-planner | L9-L10 | 로직/테스트 |

### 후속 에이전트 (개발)

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| schema-builder | L7 연계 | 엔티티 → Prisma 스키마 |
| entity-builder | L7 연계 | 엔티티 → Entity 클래스 |
| dto-builder | L6 연계 | API → DTO 클래스 |
| ui-component-builder | L8 연계 | 컴포넌트 → React 컴포넌트 |
| controller-builder | L6 연계 | API → NestJS Controller |

---

## 8. 타입 참조

요구사항 그래프의 타입 정의:
```
apps/proposal/src/components/requirements/types.ts
```

**주요 타입:**
- `RequirementGraph`: 전체 그래프
- `RequirementNode`: 노드
- `RequirementEdge`: 엣지
- `NodeType`: context | actor | goal | feature | screen | action | api | entity | component | logic | test
- `EdgeType`: parent | implements | calls | uses | stores | validates | tests | depends
