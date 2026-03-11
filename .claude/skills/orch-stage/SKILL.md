---
name: orch-stage
description: 7단계 분할 개발 플로우를 조율하는 메타 에이전트. 사용자가 "기획 시작", "Stage 1", "전체 개발", "기능 개발" 등을 요청할 때 사용합니다.
allowed-tools: Task, Read, Write, Grep, Bash
---

# 단계 오케스트레이터 (Stage Orchestrator)

7단계 분할 개발 플로우를 조율하는 메타 에이전트입니다. 각 단계 완료 후 사용자 리뷰를 받고 다음 단계로 진행하며, 단계 내부는 의존성 기반 병렬 fan-out을 지원합니다.

---

## 사용 시점

| 상황 | 사용 여부 |
|------|----------|
| 새 페이지/기능 전체 개발 | ✅ |
| 기존 설계서 기반 구현 | ✅ |
| 특정 Stage만 재실행 필요 | ✅ |
| 단순 버그 수정 | ❌ |
| 컴포넌트 단독 수정 | ❌ |

---

## 실행 모드

### 1. 전체 실행 (full)

```
/orch-stage full

앱: admin
도메인: Member
요구사항:
- 회원 목록 조회/검색/필터링
- 회원 상세 조회
- 회원 등록/수정/삭제
```

### 2. 특정 단계부터 시작 (start)

```
/orch-stage start stage=2 app=admin domain=Member
```

### 3. 특정 단계만 실행 (run)

```
/orch-stage run stage=3 app=admin domain=Member
```

### 4. 페이지별 실행 (Stage 4-6)

```
/orch-stage run stage=4 app=admin domain=Member page=List
/orch-stage run stage=5 app=admin domain=Member page=List
/orch-stage run stage=6 app=admin domain=Member page=List
```

### 5. 상태 확인 (status)

```
/orch-stage status app=admin domain=Member
```

### 6. 자연어 실행 (권장)

```
/orch-stage admin 회원 관리 기능 처음부터 진행해줘
/orch-stage 회원 관리 3단계 실행해줘
/orch-stage 회원 목록 화면 기획해줘
/orch-stage 회원 목록 컴포넌트 구현해줘
/orch-stage 회원 목록 페이지 통합해줘
/orch-stage 회원 관리 진행률 보여줘
```

### 7. 계획 미리보기 (plan)

```
/orch-stage plan stage=3 app=admin domain=Member targets=User,Post
```

자연어 입력 시 해석 규칙:

- 명시 파라미터(`stage=`, `app=`, `domain=`, `page=`, `targets=`, `pages=`, `parallel=`)가 있으면 최우선 적용
- 모드 미지정 시 키워드 기반 추론 (`처음부터/전체`→`full`, `N단계`→`run stage=N`, `진행률/상태`→`status`, `계획/미리보기`→`plan`)
- Stage 4-6에서 page 미지정 시 자연어에서 페이지를 추론하고, 불명확하면 1회 확인
- app 미지정 시 기본값 `admin`
- domain 추론 실패 시에만 사용자에게 1회 질문

병렬 실행 파라미터:

- `parallel`: `off` | `auto` | `force` (기본 `auto`)
- `maxConcurrency`: 동시 실행 상한 (기본 `3`)
- `targets`: Stage 2-3 다중 타깃 (`User,Post`)
- `pages`: Stage 4-6 다중 페이지 (`List,Detail`)
- `failPolicy`: `fail-fast` | `continue` (기본 `fail-fast`)

병렬 실행 예시:

```bash
/orch-stage run stage=3 app=admin domain=Member targets=User,Post parallel=auto maxConcurrency=2
/orch-stage run stage=5 app=admin domain=Member pages=List,Detail parallel=auto maxConcurrency=2
/orch-stage plan stage=3 app=admin domain=Member targets=User,Post
```

---

## 7단계 플로우

```
Stage 1: 도메인 기획        → orch-requirement (L0~L4 + BE/Store 스펙) → [리뷰]
Stage 2: 스키마 구현        → prisma → entity → dto → query-dto → seed → [리뷰]
Stage 3: 백엔드 구현        → repository → service → application-service → controller → [리뷰]
Stage 4: 화면 기획 (페이지별) → orch-screen-planner (L5~L12) → [리뷰]
Stage 5: 컴포넌트 (페이지별) → primitive → input → cell → widget → layout → feature → store → menu → [리뷰]
Stage 6: 페이지 (페이지별)   → fe-page-builder → fe-api-integrator → [리뷰]
Stage 7: E2E 검증 (선택)    → qa-be-e2e-testing → qa-fe-e2e-testing → [리뷰]
```

> 화살표는 의존성 순서를 의미합니다. 같은 단계의 독립 단위는 `parallel=auto`에서 병렬 실행할 수 있습니다.

---

## 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| 모드 | △ | 구조화 입력 시 권장, 자연어 입력 시 자동 추론 |
| app | △ | 생략 시 기본값 `admin` |
| domain | △ | 자연어에서 추론, 실패 시 1회 질문 |
| 요구사항 | ✅ (full) | 기능 요구사항 목록 |
| page | △ | Stage 4-6에서 특정 페이지 지정 (`List`, `Detail`, `Create`, `Edit`) |
| targets | △ | Stage 2-3 다중 타깃 (`User,Post`) |
| pages | △ | Stage 4-6 다중 페이지 (`List,Detail`) |
| parallel | △ | 병렬 모드 (`off`/`auto`/`force`), 기본 `auto` |
| maxConcurrency | △ | 동시 실행 상한 (기본 `3`) |
| failPolicy | △ | 실패 정책 (`fail-fast`/`continue`) |

---

## 출력 요약

```
apps/[app]/app/(admin)/app.spec.md
apps/[app]/app/(admin)/[도메인]/**/page.spec.md
packages/fe-store/src/stores/[domain]Store.spec.md
packages/be-entity/src/[entity].entity.spec.md
apps/server/src/[module]/**/*.spec.md
packages/fe-ui/src/components/{ui,widget,feature}/**/index.spec.md
```

---

## 핵심 규칙

### Do
- 각 Stage 완료 후 반드시 사용자 리뷰 대기
- Stage 3 완료 후 Orval 실행 (Stage 4 진입 전)
- 변경 발생 시 영향받는 Stage부터 재시작
- `parallel=auto`를 기본으로 사용하고 fan-out 단위(`targets`/`pages`)를 명시
- 공유 파일은 lock 후 단일 writer로 최종 머지

### Don't
- 사용자 승인 없이 다음 Stage로 진행 금지
- deprecated/하위호환 코드 작성 금지
- Stage 순서를 건너뛰기 금지
- 공유 파일을 여러 subagent가 동시에 수정 금지

공유 파일 lock 대상:

- `apps/*/app/(admin)/app.spec.md`
- `packages/*/src/index.ts`
- `packages/common-constant/src/routing/admin-menu.ts`
- `packages/common-constant/src/routing/admin-menu.spec.md`
- `**/PROGRESS.md`

---

## 연관 에이전트

| Stage | 호출 에이전트 |
|------|---------------|
| 1 | orch-requirement |
| 2 | be-prisma-builder, be-entity-builder, be-dto-builder, be-query-dto-builder, be-seed-maker |
| 3 | be-repository-builder, be-service-builder, be-app-builder, be-controller-builder |
| 4 | orch-screen-planner |
| 5 | fe-primitive-component-builder, fe-input-component-builder, fe-cell-builder, fe-widget-builder, fe-layout-builder, fe-feature-builder, fe-store-builder, fe-menu-builder |
| 6 | fe-page-builder, fe-api-integrator, /fe-review |
| 7 | qa-be-e2e-testing, qa-fe-e2e-testing |
