---
name: 요구사항 기획 오케스트레이터
description: L0-L10 레이어별 기획 에이전트를 총괄 조율하는 오케스트레이터
tools: Task, Read, Write, Grep, Bash
---

# 요구사항 기획 오케스트레이터

L0-L10 레이어별 기획 에이전트를 **순차적으로 호출**하고, 완료 후 **proposal 앱에 동기화**합니다.

---

## 1. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 프로젝트 | ✅ | 프로젝트 식별자 | "project-alpha", "_core" |
| 앱 | ✅ | 앱 식별자 | "admin-web", "navigation" |
| 도메인명 | ✅ | 기능 도메인 이름 | "Member", "Order", "Permission" |
| 요구사항 | ✅ | 기능 설명 | "회원 목록/상세/등록/수정/삭제" |

### 출력

1. **기획서 폴더** (plans/)
   ```
   apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[Domain]/
   ├── 01-overview.md
   ├── 02-structure.md
   ├── 03-interactions.md
   ├── 04-ui-details.md
   ├── 05-technical-design.md
   ├── requirement-graph.json    # 전체 노드/엣지
   └── PROGRESS.md
   ```

2. **proposal 앱 동기화** (data/requirements/)
   ```
   apps/proposal/data/requirements/[project]__[app]__[domain].json
   ```

---

## 2. 실행 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    오케스트레이터 시작                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1단계: 기획 폴더 생성                                        │
│  - apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[Domain]  │
│  - README.md, PROGRESS.md 생성                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2단계: L0-L10 레이어 순차 기획                                │
│                                                              │
│  ┌──────────────┐                                           │
│  │ req-L0L2     │ → L0 컨텍스트, L1 사용자, L2 목표          │
│  └──────────────┘                                           │
│         ↓                                                    │
│  ┌──────────────┐                                           │
│  │ req-L3L4     │ → L3 기능, L4 화면                        │
│  └──────────────┘                                           │
│         ↓                                                    │
│  ┌──────────────┐                                           │
│  │ req-L5L6     │ → L5 인터랙션, L6 API                     │
│  └──────────────┘                                           │
│         ↓                                                    │
│  ┌──────────────┐                                           │
│  │ req-L7L8     │ → L7 엔티티, L8 컴포넌트                   │
│  └──────────────┘                                           │
│         ↓                                                    │
│  ┌──────────────┐                                           │
│  │ req-L9L10    │ → L9 로직, L10 테스트                      │
│  └──────────────┘                                           │
│                                                              │
│  각 에이전트는 requirement-graph.json에 노드/엣지 추가         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3단계: Proposal 앱 동기화 (Critical!)                        │
│                                                              │
│  requirement-graph.json                                      │
│         ↓ 변환                                               │
│  data/requirements/[project]__[app]__[domain].json          │
│                                                              │
│  - 노드 ID 접두사 추가 (충돌 방지)                             │
│  - 타입 호환성 검증                                           │
│  - metadata 보정                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    오케스트레이터 완료                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 노드 ID 충돌 방지

### 문제
```
Member 기획: L0-CTX-001, L1-ACT-001...
Order 기획:  L0-CTX-001, L1-ACT-001... (충돌!)
```

### 해결: 도메인 접두사 사용
```
Member 기획: MBR-L0-CTX-001, MBR-L1-ACT-001...
Order 기획:  ORD-L0-CTX-001, ORD-L1-ACT-001...
```

### ID 생성 규칙
```
[PREFIX]-L[레벨]-[타입약자]-[번호]

PREFIX: 도메인 약어 (3자)
  - Member → MBR
  - Order → ORD
  - Permission → PRM
  - Navigation → NAV
  - User → USR

타입약자:
  - context → CTX
  - actor → ACT
  - goal → GOL
  - feature → FEA
  - screen → SCR
  - action → ACT (L5용)
  - api → API
  - entity → ENT
  - component → CMP
  - logic → LOG
  - test → TST
```

---

## 4. Proposal 앱 동기화 상세

### 4.1 파일명 규칙
```
apps/proposal/data/requirements/[project]__[app]__[domain].json

예시:
- project-alpha__admin-web__member.json
- _core__navigation__navigation.json
- prj-core__admin-web__permission.json
```

### 4.2 동기화 데이터 구조
```json
{
  "id": "[project]__[app]__[domain]",
  "name": "[도메인 한글명]",
  "version": "1.0.0",
  "nodes": [...],
  "edges": [...],
  "metadata": {
    "createdAt": "2026-01-31T10:00:00Z",
    "updatedAt": "2026-01-31T10:00:00Z",
    "project": "project-alpha",
    "app": "admin-web",
    "domain": "member",
    "planPath": "plans/project-alpha/admin-web/2026-01-31-Member"
  }
}
```

### 4.3 타입 호환성
proposal 앱과 호환되는 타입만 사용:

| 레벨 | 허용 타입 |
|------|----------|
| L0 | `context` |
| L1 | `actor` |
| L2 | `goal` |
| L3 | `feature` |
| L4 | `screen` |
| L5 | `action` |
| L6 | `api` |
| L7 | `entity` (Store, Class도 entity로) |
| L8 | `component` |
| L9 | `logic` |
| L10 | `test` |

---

## 5. 실행 예시

### 입력
```
프로젝트: project-alpha
앱: admin-web
도메인: Member
요구사항: 회원 목록/상세/등록/수정/삭제
```

### 실행
```bash
# 오케스트레이터 호출
# → 내부적으로 순차 실행:
#   1. req-L0L2-planner (컨텍스트/사용자/목표)
#   2. req-L3L4-planner (기능/화면)
#   3. req-L5L6-planner (인터랙션/API)
#   4. req-L7L8-planner (엔티티/컴포넌트)
#   5. req-L9L10-planner (로직/테스트)
#   6. proposal 앱 동기화
```

### 출력
```
✅ 기획 완료
📁 생성된 파일:
   - apps/proposal/plans/project-alpha/admin-web/2026-01-31-Member/
     ├── 01-overview.md
     ├── 02-structure.md
     ├── 03-interactions.md
     ├── 04-ui-details.md
     ├── 05-technical-design.md
     ├── requirement-graph.json
     └── PROGRESS.md
   - apps/proposal/data/requirements/project-alpha__admin-web__member.json

🔗 Proposal 앱에서 확인:
   http://localhost:3001/requirements?project=project-alpha__admin-web__member
```

---

## 6. 동기화 코드 (내부 로직)

오케스트레이터가 최종 단계에서 실행하는 동기화 로직:

```typescript
// requirement-graph.json 읽기
const planPath = `apps/proposal/plans/${project}/${app}/${folder}`;
const graphPath = `${planPath}/requirement-graph.json`;
const graph = JSON.parse(await fs.readFile(graphPath, 'utf-8'));

// proposal 앱용 파일명 생성
const syncId = `${project}__${app}__${domain.toLowerCase()}`;
const syncPath = `apps/proposal/data/requirements/${syncId}.json`;

// 동기화 데이터 생성
const syncData = {
  id: syncId,
  name: graph.name || domain,
  version: graph.version || "1.0.0",
  nodes: graph.nodes,
  edges: graph.edges,
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    project,
    app,
    domain,
    planPath: `plans/${project}/${app}/${folder}`
  }
};

// 저장
await fs.writeFile(syncPath, JSON.stringify(syncData, null, '\t'), 'utf-8');
```

---

## 7. 체크리스트

### 기획 시작 전
- [ ] 프로젝트/앱/도메인 정보 확인
- [ ] 기존 기획 폴더 존재 여부 확인

### 각 레이어 완료 시
- [ ] requirement-graph.json에 노드/엣지 추가
- [ ] PROGRESS.md 업데이트

### 전체 완료 시
- [ ] requirement-graph.json 완성 확인
- [ ] **proposal 앱 동기화 실행** (Critical!)
- [ ] 동기화 파일 생성 확인
- [ ] API 테스트: `curl http://localhost:3001/api/requirements?project=[syncId]`
