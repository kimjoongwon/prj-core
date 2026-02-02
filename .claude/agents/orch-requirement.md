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

---

## 8. 에이전트 실수 방지 (Critical!)

**반복되는 실수를 방지하기 위한 필수 규칙입니다.**

### 8.1 JSON 필드명 규칙 (타입 일치 필수!)

proposal 앱의 타입 정의(`apps/proposal/src/components/requirements/types.ts`)와 **정확히 일치**해야 합니다.

#### ❌ 금지된 필드명 (자주 실수함)

```json
// ❌ 노드에서 잘못된 필드명
{
  "label": "회원 목록",        // ❌ label 사용 금지!
  "title": "회원 목록"         // ❌ title 사용 금지!
}

// ❌ 엣지에서 잘못된 필드명
{
  "from": "L3-FEA-001",       // ❌ from 사용 금지!
  "to": "L4-SCR-001"          // ❌ to 사용 금지!
}
```

#### ✅ 올바른 필드명 (타입 정의 기준)

```json
// ✅ RequirementNode - 올바른 필드명
{
  "id": "L4-SCR-001",
  "level": 4,
  "subLevel": "1",
  "type": "screen",
  "name": "회원 목록 화면",    // ✅ name 사용!
  "description": "회원 목록을 표시하는 화면",
  "path": "/users",
  "metadata": { ... }
}

// ✅ RequirementEdge - 올바른 필드명
{
  "id": "e-001",              // ✅ id 필수!
  "source": "L3-FEA-001",     // ✅ source 사용!
  "target": "L4-SCR-001",     // ✅ target 사용!
  "type": "implements",
  "label": "구현"
}
```

#### 필드명 매핑표

| 잘못된 필드명 | 올바른 필드명 | 위치 |
|---------------|--------------|------|
| `label` | `name` | Node |
| `title` | `name` | Node |
| `from` | `source` | Edge |
| `to` | `target` | Edge |

### 8.2 파일명 생성 규칙 (planSelectionStore 기준!)

proposal 앱의 `planSelectionStore.requirementGraphId` 로직과 **정확히 일치**해야 합니다.

#### 파일명 생성 공식

```typescript
// planSelectionStore.ts의 로직
const featureName = selectedFeatureId
  .replace(/^\d{4}-\d{2}-\d{2}-/, "")  // 날짜 제거
  .toLowerCase();                       // 소문자 변환

// 결과 파일명
if (isCore) {
  return `_core__${categoryId}__${featureName}.json`;
} else {
  return `${projectId}__${appId}__${featureName}.json`;
}
```

#### 예시 매핑

| 폴더 경로 | 생성되는 ID | 파일명 |
|-----------|-------------|--------|
| `_core/navigation/2026-01-31-Navigation-reverse/` | `_core__navigation__navigation-reverse` | `_core__navigation__navigation-reverse.json` |
| `_core/infrastructure/2026-01-31-CASL/` | `_core__infrastructure__casl` | `_core__infrastructure__casl.json` |
| `prj-core/admin-web/2026-02-02-User/` | `prj-core__admin-web__user` | `prj-core__admin-web__user.json` |

#### ❌ 흔한 실수

```
폴더: 2026-01-31-Navigation-reverse
❌ 잘못: _core__navigation__navigation.json      (reverse 누락!)
❌ 잘못: _core__navigation__Navigation-reverse.json  (대문자!)
✅ 올바름: _core__navigation__navigation-reverse.json
```

### 8.3 동기화 파일 구조 (루트 필드 필수!)

`data/requirements/` 폴더의 JSON 파일은 **RequirementGraph 타입**과 일치해야 합니다.

```json
{
  "id": "project__app__feature",      // ✅ 필수: 파일명과 동일
  "name": "기능 한글명",                // ✅ 필수
  "version": "1.0.0",                 // ✅ 필수
  "nodes": [...],                     // ✅ 필수
  "edges": [...],                     // ✅ 필수
  "metadata": {                       // ✅ 필수
    "createdAt": "2026-01-31T10:00:00Z",
    "updatedAt": "2026-01-31T10:00:00Z"
  }
}
```

### 8.4 동기화 체크리스트 (매 실행 시 확인!)

기획 완료 후 **반드시 아래 체크리스트를 수행**합니다:

```bash
# 1. plans 폴더에 requirement-graph.json 생성 확인
ls apps/proposal/plans/[project]/[app]/YYYY-MM-DD-[Domain]/requirement-graph.json

# 2. 파일명 계산 (정확히!)
# 예: 2026-02-02-User → user (날짜 제거, 소문자)
# 파일명: [project]__[app]__user.json

# 3. data/requirements/ 폴더에 동기화 파일 생성
ls apps/proposal/data/requirements/[project]__[app]__[domain].json

# 4. JSON 필드명 검증 (name, source, target 확인)
cat apps/proposal/data/requirements/[project]__[app]__[domain].json | grep -E '"(name|label|source|target|from|to)"'

# 5. 브라우저에서 테스트
# - PlansBreadcrumb에서 해당 기능 선택
# - 요구사항/화면설계/API설계 탭에서 데이터 표시 확인
```

### 8.5 화면(L4) 노드 screenDesign 필수 (Critical!)

**모든 screen(L4) 노드에는 반드시 `metadata.screenDesign`을 포함해야 합니다.**

이 필드가 없으면 화면 설계 상세 페이지(`/screens/:screenId`)에서 기획 내용이 표시되지 않습니다.

#### 필수 구조

```json
{
  "id": "USR-L4-SCR-001",
  "level": 4,
  "type": "screen",
  "name": "이용자 목록 화면",
  "description": "이용자 목록 조회 화면",
  "path": "/users",
  "metadata": {
    "screenDesign": {
      "markdown": "# 이용자 목록 화면\n\n## 목적\n...\n\n## 레이아웃\n...\n\n## 컴포넌트 구성\n...",
      "figmaUrl": "",
      "updatedAt": null
    }
  }
}
```

#### screenDesign.markdown 필수 섹션

| 섹션 | 설명 |
|------|------|
| `# 화면명` | 화면 제목 |
| `## 목적` | 화면의 목적과 사용자 가치 |
| `## 진입/이탈 조건` | 어디서 오고 어디로 가는지 |
| `## 레이아웃` | Desktop/Mobile ASCII 다이어그램 |
| `## 컴포넌트 구성` | 사용하는 컴포넌트 테이블 |
| `## 상태 및 데이터` | 화면 상태 정의 |
| `## 관련 API` | 호출하는 API 목록 |

#### req-L3L4-planner 에이전트 호출 시 확인

```bash
# L3L4 기획 완료 후 반드시 확인:
# 1. 모든 L4 노드에 metadata.screenDesign 존재 여부
# 2. markdown 필드에 레이아웃과 컴포넌트 구성 포함 여부

cat requirement-graph.json | grep -A 20 '"type": "screen"'
```

### 8.6 실수 발생 시 복구 절차

동기화 누락이나 필드명 오류 발견 시:

1. **plans 폴더의 requirement-graph.json 수정** (원본)
2. **data/requirements/ 파일 삭제** (잘못된 파일)
3. **올바른 파일명으로 재생성** (위 규칙 적용)
4. **브라우저에서 테스트** (모든 탭 확인)
