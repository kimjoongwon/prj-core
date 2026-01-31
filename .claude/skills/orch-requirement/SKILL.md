---
name: orch-requirement
description: L0-L10 레이어별 기획 에이전트를 총괄 조율하는 오케스트레이터. 사용자가 "요구사항 기획", "L0-L10 기획", "기능 기획" 등을 요청할 때 사용합니다.
allowed-tools: Task, Read, Write, Grep, Bash
---

# 요구사항 기획 오케스트레이터

L0-L10 레이어별 기획 에이전트를 총괄 조율하는 오케스트레이터입니다.

---

## 사용 시점

| 상황 | 사용 여부 |
|------|----------|
| 새로운 기능 요구사항 정의 | ✅ |
| 기존 기획서 보완 | ✅ |
| 특정 레이어만 기획 | ❌ (개별 planner 사용) |

---

## 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| 기능명 | ✅ | 기획할 기능 이름 |
| 요구사항 | ✅ | 상세 요구사항 목록 |
| 출력 경로 | ❌ | 기획서 저장 경로 |

---

## 레이어 구조

| 레벨 | 타입 | 설명 | 담당 에이전트 |
|------|------|------|--------------|
| L0 | context | 시스템 컨텍스트 | req-L0L2-planner |
| L1 | actor | 사용자 유형 | req-L0L2-planner |
| L2 | goal | 사용자 목표 | req-L0L2-planner |
| L3 | feature | 기능 | req-L3L4-planner |
| L4 | screen | 화면 | req-L3L4-planner |
| L5 | action | 인터랙션 | req-L5L6-planner |
| L6 | api | API 엔드포인트 | req-L5L6-planner |
| L7 | entity | 데이터 모델 | req-L7L8-planner |
| L8 | component | UI 컴포넌트 | req-L7L8-planner |
| L9 | logic | 비즈니스 로직 | req-L9L10-planner |
| L10 | test | 테스트 케이스 | req-L9L10-planner |

---

## 실행 흐름

```
1. 요구사항 수집
   ↓
2. L0-L2 기획 (컨텍스트, Actor, Goal)
   ↓
3. L3-L4 기획 (Feature, Screen)
   ↓
4. L5-L6 기획 (Action, API)
   ↓
5. L7-L8 기획 (Entity, Component)
   ↓
6. L9-L10 기획 (Logic, Test)
   ↓
7. 기획서 통합 및 검증
```

---

## 출력

```
apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[feature]/
├── README.md
├── PROGRESS.md
├── 01-overview.md      ← L0-L2
├── 02-structure.md     ← L3-L4
├── 03-interactions.md  ← L5-L6
├── 04-ui-details.md    ← L7-L8
├── 05-technical-design.md ← L9-L10
└── requirement-graph.json
```

---

## 하위 에이전트

| 에이전트 | 역할 |
|----------|------|
| `/req-L0L2-planner` | 시스템 컨텍스트, 사용자, 목표 기획 |
| `/req-L3L4-planner` | 기능과 화면 기획 |
| `/req-L5L6-planner` | 인터랙션과 API 기획 |
| `/req-L7L8-planner` | 데이터 모델과 컴포넌트 기획 |
| `/req-L9L10-planner` | 비즈니스 로직과 테스트 기획 |

---

## 사용 예시

```
/orch-requirement

**기능명:** 회원 관리
**요구사항:**
- 관리자는 회원 목록을 조회할 수 있다
- 관리자는 회원 상세 정보를 확인할 수 있다
- 관리자는 회원을 등록/수정/삭제할 수 있다
- 검색 및 필터링 기능 필요
```
