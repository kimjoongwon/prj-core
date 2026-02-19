---
name: orch-stage
description: 5단계 분할 개발 플로우를 조율하는 메타 에이전트. 사용자가 "기획 시작", "Stage 1", "전체 개발", "기능 개발" 등을 요청할 때 사용합니다.
allowed-tools: Task, Read, Write, Grep, Bash
---

# 단계 오케스트레이터 (Stage Orchestrator)

5단계 분할 개발 플로우를 조율하는 메타 에이전트입니다. 각 단계 완료 후 사용자 리뷰를 받고 다음 단계로 진행합니다.

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

**기능명:** Member
**요구사항:**
- 회원 목록 조회/검색/필터링
- 회원 상세 조회
- 회원 등록/수정/삭제
```

### 2. 특정 단계부터 시작 (start)

```
/orch-stage start stage=2 plan=YYYY-MM-DD-Member
```

### 3. 특정 단계만 실행 (run)

```
/orch-stage run stage=3 plan=YYYY-MM-DD-Member
```

### 4. 페이지별 Stage 4-5 실행

```
/orch-stage run stage=4 plan=YYYY-MM-DD-Member page=MemberList
/orch-stage run stage=5 plan=YYYY-MM-DD-Member page=MemberList
```

### 5. 공통 시스템 기획 (core=)

```
/orch-stage full core=infrastructure feature=RateLimiting
```

### 6. 상태 확인 (status)

```
/orch-stage status plan=YYYY-MM-DD-Member
```

---

## 5단계 플로우

```
Stage 1: 기획 (기능 전체)    → orch-requirement (L0~L10) → [리뷰]
Stage 2: 스키마 (기능 전체)  → schema → entity → dto → seed → [리뷰]
Stage 3: 백엔드 (기능 전체)  → repository → service → controller → [리뷰]
Stage 4: 컴포넌트 (페이지별) → page-spec → domain-spec → ui → widget → feature → [리뷰]
Stage 5: 페이지 (페이지별)   → fe-page-builder → [리뷰]
```

---

## 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| 모드 | ✅ | `full`, `start stage=N`, `run stage=N`, `status` |
| project | △ | 프로젝트명 (실행 시 질문) |
| app | △ | 앱명 (실행 시 질문) |
| core | △ | 공통 시스템 카테고리 |
| 기능명 | ✅ (full) | 생성할 기능/도메인 이름 |
| plan | ✅ (start/run) | 기획서 폴더 경로 |
| page | △ | Stage 4-5에서 특정 페이지 지정 |

---

## 출력 (폴더 구조)

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

---

## 핵심 규칙

### Do
- 각 Stage 완료 후 반드시 사용자 리뷰 대기
- Stage 실행 전 해당 에이전트 규칙 문서 읽기
- Stage 3 완료 후 Orval 실행 (Stage 4 진입 전)
- 변경 발생 시 영향받는 Stage부터 재시작

### Don't
- 사용자 승인 없이 다음 Stage로 진행 금지
- deprecated/하위호환 코드 작성 금지
- Stage 순서를 건너뛰기 금지

---

## 연관 에이전트

### Stage별 호출 에이전트

**Stage 1**
- `/orch-requirement` - L0-L10 기획
- `/design-analyze` - Figma 디자인 분석 (Figma 있을 때)

**Stage 2**
- `be-schema-builder` - Prisma 스키마 생성
- `be-entity-builder` - Entity 클래스 생성
- `be-dto-builder` - DTO 클래스 생성
- `be-seed-maker` - 시드 데이터 생성

**Stage 3**
- `be-repository-builder` - Repository 생성
- `be-service-builder` - Service 생성
- `be-controller-builder` - Controller 생성

**Stage 4**
- `orch-screen-planner` - 화면 기획 오케스트레이터 (L5-L12)
- `fe-ui-component-builder` - Pure UI 컴포넌트
- `fe-widget-builder` - Widget 컴포넌트
- `fe-feature-builder` - Feature 컴포넌트

**Stage 5**
- `fe-page-builder` - 페이지 컴포넌트
- `/fe-review` - 프론트엔드 규칙 검증
