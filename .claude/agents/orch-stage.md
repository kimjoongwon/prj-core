---
name: 단계-오케스트레이터
description: 5단계 분할 개발 플로우를 조율하는 메타 에이전트
tools: Task, Read, Write, Grep, Bash
---

# 단계 오케스트레이터 (Stage Orchestrator)

5단계 분할 개발 플로우를 조율하는 메타 에이전트입니다. 각 단계 완료 후 사용자 리뷰를 받고 다음 단계로 진행합니다.

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

## 2. 프로젝트/앱 구조

### 복수 프로젝트 + 복수 앱 지원

```
apps/proposal/plans/
│
├── _core/                              # 공통 시스템 기획 (프로젝트 무관)
│   ├── README.md                       # _core 구조 설명
│   ├── infrastructure/                 # 인프라 (CASL, 인증, 멀티테넌시)
│   ├── navigation/                     # 네비게이션 (메뉴 시스템)
│   ├── ui-system/                      # UI 시스템 (Surface, DataGrid)
│   └── shared-domain/                  # 공유 도메인 (Role, Tenant)
│
├── [project]/                          # 프로젝트 (수주 단위)
│   └── [app]/                          # 앱 (admin-web, admin-mobile 등)
│       ├── _app.md                     # 앱 메타 + 사용하는 공통 시스템 목록
│       └── YYYY-MM-DD-[feature]/       # 기능 (Member, Order 등)
│
└── prj-core/                           # 자체 서비스
    └── admin-web/
        ├── _app.md
        └── ...
```

### 예시 구조

```
apps/proposal/plans/
├── project-a/
│   ├── admin-web/
│   │   ├── 2026-01-30-Member/
│   │   └── 2026-02-01-Order/
│   ├── admin-mobile/
│   │   └── 2026-02-05-Member/
│   └── service-web/
│       └── 2026-02-10-Reservation/
└── project-b/
    └── admin-web/
        └── 2026-03-01-Product/
```

### 실행 시 질문

`/orch-stage full` 실행 시 **project**와 **app**을 질문합니다:

```
🚀 orch-stage 시작

📌 프로젝트를 선택하세요:
1. project-a
2. project-b
3. (새 프로젝트 생성)

📌 앱을 선택하세요:
1. admin-web
2. admin-mobile
3. service-web
4. (새 앱 생성)

📌 기능명을 입력하세요: Member
📌 요구사항을 입력하세요: ...
```

### 공통 시스템 기획 (core= 파라미터)

공통 시스템을 기획할 때는 `core=` 파라미터를 사용합니다:

```bash
# 공통 시스템 기획 시작
/orch-stage full core=infrastructure feature=RateLimiting

# 기존 공통 시스템 수정
/orch-stage run stage=2 plan=_core/infrastructure/2026-01-31-CASL
```

**core= 옵션:**
- `infrastructure` - 인프라 레이어 (CASL, 인증, 멀티테넌시)
- `navigation` - 네비게이션 레이어 (메뉴 시스템)
- `ui-system` - UI 시스템 레이어 (Surface, DataGrid)
- `shared-domain` - 공유 도메인 레이어 (Role, Tenant)

**공통 시스템 기획 시 특징:**
- `project`와 `app` 질문 생략
- 출력 위치: `apps/proposal/plans/_core/{core}/{YYYY-MM-DD-feature}/`
- 프로젝트 독립적이므로 프로젝트별 커스터마이징은 `_app.md`에서 관리

---

## 3. 기능 단위 기획 개념

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
| 4 | **페이지별** | 각 페이지의 컴포넌트를 개별 생성 |
| 5 | **페이지별** | 각 페이지를 개별 생성 |

---

## 4. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| 모드 | O | `full`, `start stage=N`, `run stage=N`, `status` |
| **project** | △ | 프로젝트명 (실행 시 질문, core= 사용 시 불필요) |
| **app** | △ | 앱명 (실행 시 질문, core= 사용 시 불필요) |
| **core** | △ | 공통 시스템 카테고리 (infrastructure/navigation/ui-system/shared-domain) |
| 기능명 | O (full) | 생성할 기능/도메인 이름 (예: Member) |
| 요구사항 | O (full) | 기능 요구사항 목록 |
| plan | O (start/run) | 기획서 폴더 경로 |
| **page** | △ | Stage 4-5에서 특정 페이지만 실행할 때 사용 |

### 출력 (폴더 구조)

**프로젝트 기능 기획:**
```
apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[feature]/
├── README.md
├── PROGRESS.md
├── 01-overview.md
├── 02-structure.md
├── 03-interactions.md
├── 04-ui-details.md
├── 05-technical-design.md
├── [feature]-schema.md           # Stage 2
├── [feature]-backend.md          # Stage 3
├── [feature]-[page]-components.md  # Stage 4 (페이지별)
└── [feature]-[page]-complete.md    # Stage 5 (페이지별)
```

**공통 시스템 기획 (core= 사용 시):**
```
apps/proposal/plans/_core/[core]/YYYY-MM-DD-[feature]/
├── README.md
├── PROGRESS.md
├── 01-overview.md
├── 02-structure.md
├── 03-interactions.md
├── 04-ui-details.md
└── 05-technical-design.md
```

---

## 5. Stage 요약

| Stage | 이름 | 핵심 목표 | 주요 에이전트 | 산출물 |
|-------|------|----------|--------------|--------|
| 1 | 데이터 설계 | 요구사항에서 기획서와 기술 설계서 작성 | planner, technical-designer | `-design.md` |
| 2 | 스키마 구현 | Prisma 스키마, Entity, DTO 구현 | schema-builder, entity-builder, dto-builder | `-schema.md` |
| 3 | 백엔드 로직 | Repository, Service, Controller 구현 | repository-builder, service-builder, controller-builder | `-backend.md` |
| 4 | 컴포넌트 구현 | UI, Widget, Feature 컴포넌트 구현 | ui-component-builder, widget-builder, feature-builder | `-components.md` |
| 5 | 페이지 통합 | 페이지 컴포넌트 구현 및 규칙 검증 | page-builder, /fe-review (Skill) | `-complete.md` |

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

### 5단계 플로우 개요

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: 기획 (기능 전체)                                    │
│ orch-requirement (L0~L10) → [사용자 리뷰] ✓                  │
│ 산출물: {기능명}/ 폴더 (01~05 문서)                           │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: 스키마 구현 (기능 전체)                              │
│ schema-builder → entity-builder → dto-builder → seed-maker  │
│ → [사용자 리뷰] ✓                                            │
│ 산출물: {기능명}-schema.md                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: 백엔드 로직 (기능 전체)                              │
│ repository-builder → service-builder → facade-builder       │
│ → controller-builder → [사용자 리뷰] ✓                       │
│ 산출물: {기능명}-backend.md                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인 + Orval 실행
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: 컴포넌트 구현 (페이지별 반복)                        │
│ ui-component → widget-builder → feature-builder             │
│ → [사용자 리뷰] ✓                                            │
│ 산출물: {기능명}-{페이지명}-components.md                     │
│                                                              │
│ ⚠️ page 파라미터로 특정 페이지 지정 필요                      │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 5: 페이지 통합 (페이지별 반복)                          │
│ page-builder → /fe-review (Skill) → [사용자 리뷰] ✓          │
│ 산출물: {기능명}-{페이지명}-complete.md                       │
│                                                              │
│ ⚠️ page 파라미터로 특정 페이지 지정 필요                      │
└─────────────────────────────────────────────────────────────┘
```

### 실행 모드

#### 1. 전체 실행 (Stage 1부터 - 기능 단위)

```
/orch-stage full

**기능명:** Member
**요구사항:**
- 회원 목록 조회/검색/필터링
- 회원 상세 조회
- 회원 등록/수정/삭제
```

#### 2. 특정 단계부터 시작 (Stage 1-3: 기능 전체)

```
/orch-stage start stage=2 plan=YYYY-MM-DD-Member
```

#### 3. 특정 단계만 실행 (Stage 1-3: 기능 전체)

```
/orch-stage run stage=3 plan=YYYY-MM-DD-Member
```

#### 4. 페이지별 Stage 4 실행 (컴포넌트)

```
/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberList
/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberDetail
/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberCreate
/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberEdit
```

#### 5. 페이지별 Stage 5 실행 (페이지 통합)

```
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberList
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberDetail
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberCreate
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberEdit
```

#### 6. 상태 확인

```
/orch-stage status plan=YYYY-MM-DD-Member
```

### 전체 워크플로우 예시 (회원 관리)

```bash
# 1. 기획 시작 (전체 기능)
/orch-stage full
**기능명:** Member
**요구사항:** 회원 목록/상세/등록/수정/삭제

# → Stage 1 완료 → [리뷰]
# → Stage 2 완료 → [리뷰]
# → Stage 3 완료 → [리뷰]

# 2. 페이지별 프론트엔드 개발
/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberList
# → [리뷰]
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberList
# → [리뷰]

/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberDetail
# → [리뷰]
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberDetail
# → [리뷰]

# ... MemberCreate, MemberEdit 반복
```

---

## 8. Stage별 상세 가이드

### Stage 1: 데이터 설계

**목표**: 요구사항에서 기획서와 기술 설계서 작성

**에이전트 호출 순서:**

1. **planner** (또는 /design-analyze Skill - Figma 있을 때)
   ```
   Task: etc-planner
   - 페이지명 전달
   - 요구사항 전달
   - 출력: YYYY-MM-DD-{기능명}.md
   ```

2. **technical-designer**
   ```
   Task: etc-technical-designer
   - 기획서 경로 전달
   - 출력: YYYY-MM-DD-{기능명}-design.md
   ```

**산출물:**
- `apps/proposal/plans/YYYY-MM-DD-{기능명}.md` - 기획서
- `apps/proposal/plans/YYYY-MM-DD-{기능명}-design.md` - 기술 설계서

**완료 후 출력:**
```
✅ Stage 1 완료: 데이터 설계

📁 생성된 문서:
- 기획서: apps/proposal/plans/2026-01-10-MemberListPage.md
- 설계서: apps/proposal/plans/2026-01-10-MemberListPage-design.md

📋 사용자 리뷰 포인트:
- [ ] Entity 설계가 요구사항에 맞는가?
- [ ] API 설계가 적절한가?
- [ ] 컴포넌트 분류가 올바른가?

→ 리뷰 완료 후 "Stage 2 진행" 또는 수정 요청을 해주세요.
```

---

### Stage 2: 스키마 구현

**목표**: Prisma 스키마, Entity, DTO 구현

**전제조건**: `-design.md` 파일의 Entity/API 설계 정보

**에이전트 호출 순서:**

1. **schema-builder**
   ```
   Task: be-schema-builder
   - 설계서에서 Entity 정보 추출
   - Prisma 스키마 생성
   ```

2. **entity-builder**
   ```
   Task: be-entity-builder
   - 생성된 스키마 기반 Entity 클래스 생성
   ```

3. **vo-builder** (필요시)
   ```
   Task: be-vo-builder
   - Value Object 필요시 생성
   ```

4. **dto-builder**
   ```
   Task: be-dto-builder
   - 설계서에서 API 정보 추출
   - Request/Response DTO 생성
   ```

5. **seed-maker** (필요시)
   ```
   Task: be-seed-maker
   - 시드 데이터 생성
   ```

**산출물 문서 생성:**

Stage 완료 후 `-schema.md` 파일 생성:

```markdown
# {기능명} 스키마 구현 결과

## 생성 일시
YYYY-MM-DD HH:mm

## 생성된 파일

### Prisma 스키마
| 파일 | 설명 |
|------|------|
| `packages/prisma/schema/{domain}.prisma` | ... |

### Entity
| 파일 | 설명 |
|------|------|
| `packages/entity/src/{entity}.entity.ts` | ... |

### DTO
| 파일 | 설명 |
|------|------|
| `packages/dto/src/{domain}/create-{entity}.dto.ts` | 생성 요청 |
| `packages/dto/src/{domain}/{entity}-response.dto.ts` | 응답 |

### 시드 데이터
- `packages/prisma/seed-data.ts` (수정됨)

## 실행된 명령
- `pnpm --filter=@cocrepo/prisma generate`
- `pnpm --filter=@cocrepo/prisma migrate dev --name {name}`

## 다음 단계
Stage 3: 백엔드 로직
```

**완료 후 출력:**
```
✅ Stage 2 완료: 스키마 구현

📁 생성된 파일:
- Prisma: packages/prisma/schema/member.prisma
- Entity: packages/entity/src/member.entity.ts
- DTO: packages/dto/src/members/*.dto.ts (4개)
- Seed: packages/prisma/seed-data.ts (수정)

📄 결과 문서: apps/proposal/plans/2026-01-10-MemberListPage-schema.md

📋 사용자 리뷰 포인트:
- [ ] Prisma 스키마가 설계와 일치하는가?
- [ ] Entity 클래스가 올바른가?
- [ ] DTO가 API 명세와 맞는가?

→ 리뷰 완료 후 "Stage 3 진행" 또는 수정 요청을 해주세요.
```

---

### Stage 3: 백엔드 로직

**목표**: Repository, Service, Controller 구현

**전제조건**: Stage 2 완료 (Entity, DTO 존재)

**에이전트 호출 순서:**

1. **repository-builder**
   ```
   Task: be-repository-builder
   - 설계서에서 Repository 메서드 정보 추출
   - Prisma 기반 Repository 생성
   ```

2. **service-builder**
   ```
   Task: be-service-builder
   - 설계서에서 Service 메서드 정보 추출
   - 비즈니스 로직 구현
   ```

3. **facade-builder** (필요시)
   ```
   Task: be-facade-builder
   - 여러 Service 조합이 필요한 경우 생성
   ```

4. **controller-builder**
   ```
   Task: be-controller-builder
   - 설계서에서 API 엔드포인트 정보 추출
   - REST Controller 생성
   ```

**산출물 문서 생성:**

Stage 완료 후 `-backend.md` 파일 생성:

```markdown
# {기능명} 백엔드 구현 결과

## 생성 일시
YYYY-MM-DD HH:mm

## 생성된 파일

### Repository
| 파일 | 메서드 |
|------|--------|
| `packages/repository/src/{entity}s.repository.ts` | findById, findMany, create, updateById, removeById |

### Service
| 파일 | 메서드 |
|------|--------|
| `packages/service/src/{entity}s.service.ts` | get{Entity}s, get{Entity}ById, create{Entity}, update{Entity}, delete{Entity} |

### Controller
| 파일 | 엔드포인트 |
|------|-----------|
| `apps/server/src/module/{domain}/{entity}s.controller.ts` | GET /api/v1/{entities}, POST /api/v1/{entities}, ... |

## API 요약
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/v1/members | 목록 조회 |
| GET | /api/v1/members/:id | 상세 조회 |
| POST | /api/v1/members | 생성 |
| PATCH | /api/v1/members/:id | 수정 |
| DELETE | /api/v1/members/:id | 삭제 |

## 다음 단계
1. Orval 실행: `pnpm --filter=@cocrepo/api generate`
2. Stage 4: 컴포넌트 구현
```

**완료 후 출력:**
```
✅ Stage 3 완료: 백엔드 로직

📁 생성된 파일:
- Repository: packages/repository/src/members.repository.ts
- Service: packages/service/src/members.service.ts
- Controller: apps/server/src/module/members/members.controller.ts
- Module: apps/server/src/module/members/members.module.ts

📄 결과 문서: apps/proposal/plans/2026-01-10-MemberListPage-backend.md

🔧 후속 작업 필요:
- Orval API 클라이언트 생성: pnpm --filter=@cocrepo/api generate

📋 사용자 리뷰 포인트:
- [ ] API 엔드포인트가 설계와 일치하는가?
- [ ] 비즈니스 로직이 올바른가?

→ 리뷰 완료 후 "Stage 4 진행" 또는 수정 요청을 해주세요.
→ (Orval 실행은 Stage 4 시작 전에 자동으로 수행됩니다)
```

---

### Stage 4: 컴포넌트 구현 (페이지별)

**목표**: 특정 페이지에 필요한 UI, Widget, Feature 컴포넌트 구현

**⚠️ 페이지별 실행**: 이 Stage는 `page` 파라미터로 특정 페이지를 지정해야 합니다.

```bash
/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberList
```

**전제조건**:
- Stage 3 완료
- Orval 실행 완료 (API 클라이언트 존재)
- 기획서의 02-structure.md에서 해당 페이지 정보 확인

**사전 작업 (첫 페이지 실행 시만):**
```bash
# Orval API 클라이언트 생성
pnpm --filter=@cocrepo/api generate
```

**에이전트 호출 순서 (병렬 가능):**

1. **ui-component-builder** (병렬)
   ```
   Task: fe-ui-component-builder
   - 해당 페이지에 필요한 신규 UI 컴포넌트 생성
   - 이미 존재하는 컴포넌트는 재사용
   ```

2. **input-component-builder** (병렬)
   ```
   Task: fe-input-component-builder
   - 해당 페이지에 필요한 신규 Input 컴포넌트 생성
   ```

3. **widget-builder** (병렬)
   ```
   Task: fe-widget-builder
   - 해당 페이지에 필요한 신규 Widget 컴포넌트 생성
   ```

4. **feature-builder** (순차 - UI/Widget 완료 후)
   ```
   Task: fe-feature-builder
   - 해당 페이지의 Feature 컴포넌트 생성
   - 비즈니스 로직 + Store 연동
   ```

5. **store-builder** (순차 - Feature와 함께)
   ```
   Task: fe-store-builder
   - 해당 페이지에 필요한 Store 생성
   ```

**산출물 문서 생성:**

페이지별로 `-{페이지명}-components.md` 파일 생성:

```markdown
# {기능명} - {페이지명} 컴포넌트 구현 결과

## 페이지 정보
- 기능: Member (회원 관리)
- 페이지: MemberList (목록)

## 생성 일시
YYYY-MM-DD HH:mm

## 생성된 컴포넌트

### UI (Pure)
| 컴포넌트 | 경로 | 설명 | 신규/재사용 |
|---------|------|------|-----------|
| MemberStatusBadge | `components/ui/MemberStatusBadge/` | 회원 상태 뱃지 | 신규 |

### Widget
| 컴포넌트 | 경로 | 설명 | 신규/재사용 |
|---------|------|------|-----------|
| MemberCard | `components/widget/MemberCard/` | 회원 정보 카드 | 신규 |

### Feature
| 컴포넌트 | 경로 | 연동 Store | 신규/재사용 |
|---------|------|-----------|-----------|
| MemberFilterPanel | `components/feature/MemberFilterPanel/` | MemberListStore | 신규 |

## 컴포넌트 계층
```
MemberListPage
├── MemberFilterPanel (feature)
│   ├── Select (inputs)
│   └── TextInput (inputs)
├── DataTable (ui)
│   ├── MemberStatusBadge (ui)
│   └── Button (ui)
└── Pagination (ui)
```

## 다음 단계
Stage 5: 페이지 통합 (page=MemberList)
```

**완료 후 출력:**
```
✅ Stage 4 완료: MemberList 컴포넌트 구현

📁 생성된 컴포넌트:
- UI: MemberStatusBadge (신규)
- Widget: MemberCard (신규)
- Feature: MemberFilterPanel (신규)

📄 결과 문서: apps/proposal/plans/YYYY-MM-DD-Member/Member-MemberList-components.md

📋 사용자 리뷰 포인트:
- [ ] 컴포넌트 계층이 올바른가? (ui → widget → feature)
- [ ] 재사용성이 적절한가?
- [ ] 다른 페이지에서 재사용할 컴포넌트가 있는가?

→ 리뷰 완료 후 "Stage 5 진행 page=MemberList" 또는 수정 요청을 해주세요.
```

---

### Stage 5: 페이지 통합 (페이지별)

**목표**: 특정 페이지 컴포넌트 구현 및 규칙 검증

**⚠️ 페이지별 실행**: 이 Stage는 `page` 파라미터로 특정 페이지를 지정해야 합니다.

```bash
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberList
```

**전제조건**: 해당 페이지의 Stage 4 완료 (컴포넌트 존재)

**에이전트 호출 순서:**

1. **page-builder**
   ```
   Task: fe-page-builder
   - 해당 페이지 정보 추출
   - Pure UI Page 컴포넌트 생성
   - 통합 훅 생성
   - Route Page 생성
   ```

2. **/fe-review (Skill)**
   ```
   Skill: /fe-review
   - 생성된 페이지 규칙 검증
   - 위반 사항 리포트 생성
   ```

**산출물 문서 생성:**

페이지별로 `-{페이지명}-complete.md` 파일 생성:

```markdown
# {기능명} - {페이지명} 구현 완료 보고서

## 페이지 정보
- 기능: Member (회원 관리)
- 페이지: MemberList (목록)

## 생성 일시
YYYY-MM-DD HH:mm

## 생성된 파일

### Page 컴포넌트
- `packages/ui/src/components/page/MemberListPage/`
- `apps/admin/app/(admin)/members/page.tsx`
- `apps/admin/app/(admin)/members/_client.tsx`
- `apps/admin/app/(admin)/members/_prefetch.ts`

### 사용된 컴포넌트 (Stage 4에서 생성)
- MemberStatusBadge (ui)
- MemberCard (widget)
- MemberFilterPanel (feature)

## 규칙 검증 결과
- [ ] useCallback/useMemo 금지: ✅ 통과
- [ ] 핸들러 네이밍 (on[Event][UI]): ✅ 통과
- [ ] API 사용 (@cocrepo/api): ✅ 통과
- [ ] MobX observer: ✅ 통과
- [ ] SSR Prefetch 패턴: ✅ 통과

## 다음 단계
- 다른 페이지 개발: MemberDetail, MemberCreate, MemberEdit
- 또는 테스트 코드 작성
```

**완료 후 출력:**
```
✅ Stage 5 완료: MemberList 페이지 통합

📁 생성된 파일:
- Pure UI Page: packages/ui/src/components/page/MemberListPage/
- Route Page: apps/admin/app/(admin)/members/page.tsx
- Client: apps/admin/app/(admin)/members/_client.tsx
- Prefetch: apps/admin/app/(admin)/members/_prefetch.ts

📄 결과 문서: apps/proposal/plans/YYYY-MM-DD-Member/Member-MemberList-complete.md

✅ 규칙 검증: 모두 통과

📋 사용자 리뷰 포인트:
- [ ] 페이지가 기획과 일치하는가?
- [ ] 모든 기능이 정상 동작하는가?

🎉 MemberList 페이지 완료!

📌 남은 페이지:
- [ ] MemberDetail
- [ ] MemberCreate
- [ ] MemberEdit

→ 다음 페이지 진행: /orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberDetail
```

---

## 9. 체크리스트

### 실행 전 확인
- [ ] 요구사항이 명확한가?
- [ ] Figma 디자인이 있는가? (있으면 /design-analyze Skill 사용)

### Stage별 완료 조건

**Stage 1**
- [ ] 기획서 생성됨
- [ ] 설계서 생성됨
- [ ] Entity 설계가 명확함
- [ ] API 설계가 명확함

**Stage 2**
- [ ] Prisma 스키마 생성됨
- [ ] Entity 클래스 생성됨
- [ ] DTO 클래스 생성됨
- [ ] `pnpm prisma generate` 성공
- [ ] `pnpm prisma migrate dev` 성공

**Stage 3**
- [ ] Repository 생성됨
- [ ] Service 생성됨
- [ ] Controller 생성됨
- [ ] 서버 시작 성공
- [ ] Swagger 확인 가능

**Stage 4**
- [ ] Orval 실행 완료
- [ ] UI 컴포넌트 생성됨
- [ ] Widget 컴포넌트 생성됨
- [ ] Feature 컴포넌트 생성됨

**Stage 5**
- [ ] 페이지 컴포넌트 생성됨
- [ ] 규칙 검증 통과
- [ ] 페이지 렌더링 성공

---

## 10. 재시작/롤백 가이드

### 변경 발생 시 영향 범위

| 변경 단계 | 영향 범위 | 재작업 범위 |
|----------|----------|------------|
| Stage 1 | Stage 1만 | 설계 문서만 수정 |
| Stage 2 | Stage 2~5 | 스키마부터 재생성 |
| Stage 3 | Stage 3~5 | 백엔드부터 재생성 |
| Stage 4 | Stage 4~5 | 컴포넌트부터 재생성 |
| Stage 5 | Stage 5만 | 페이지만 수정 |

### 재시작 명령 예시

```bash
# Stage 1 기획 변경 후 Stage 2부터 재시작
/orch-stage start stage=2 plan=2026-01-10-MemberListPage

# Stage 3 API 변경 후 Stage 3부터 재시작
/orch-stage start stage=3 plan=2026-01-10-MemberListPage

# 특정 Stage만 다시 실행
/orch-stage run stage=4 plan=2026-01-10-MemberListPage
```

---

## 11. 핵심 원칙

### 하위호환성 미고려 (Critical)

**모든 기획/설계 변경은 전체 마이그레이션 방식으로 진행합니다.**

| 원칙 | 설명 |
|------|------|
| **하위호환성 금지** | 기존 코드와의 호환성을 고려하지 않음 |
| **전체 마이그레이션** | 변경 시 관련된 모든 코드를 한 번에 수정 |
| **deprecated 금지** | deprecated, fallback, 이전 버전 지원 코드 작성 금지 |
| **깔끔한 전환** | 변경 전 코드 흔적을 남기지 않음 |

---

## 12. 연관 에이전트

### 선행 에이전트
없음 (최상위 오케스트레이터)

### 후행 에이전트
| 에이전트 | 용도 |
|---------|------|
| `qa-fe-testing` | 프론트엔드 테스트 작성 |
| `qa-be-testing` | 백엔드 테스트 작성 |
| `code-reviewer` | 코드 리뷰 |

### Stage별 호출 에이전트

**Stage 1**
- `etc-planner` - 기획서 작성
- `/design-analyze (Skill)` - Figma 디자인 분석 (Figma 있을 때)
- `etc-technical-designer` - 기술 설계서 작성

**Stage 2**
- `be-schema-builder` - Prisma 스키마 생성
- `be-entity-builder` - Entity 클래스 생성
- `be-vo-builder` - Value Object 생성
- `be-dto-builder` - DTO 클래스 생성
- `be-seed-maker` - 시드 데이터 생성

**Stage 3**
- `be-repository-builder` - Repository 생성
- `be-service-builder` - Service 생성
- `be-facade-builder` - Facade 생성
- `be-controller-builder` - Controller 생성

**Stage 4**
- `fe-ui-component-builder` - Pure UI 컴포넌트
- `fe-input-component-builder` - Input 컴포넌트
- `fe-widget-builder` - Widget 컴포넌트
- `fe-feature-builder` - Feature 컴포넌트
- `fe-store-builder` - MobX Store

**Stage 5**
- `fe-page-builder` - 페이지 컴포넌트
- `/fe-review` (Skill) - 프론트엔드 규칙 검증
