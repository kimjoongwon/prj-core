---
name: orch-requirement
description: 도메인 기획(L0-L4)과 BE/Store 스펙 기획을 총괄 조율하는 오케스트레이터. 사용자가 "요구사항 기획", "기능 기획" 등을 요청할 때 사용합니다.
allowed-tools: Task, Read, Write, Grep, Bash
---

# 요구사항 기획 오케스트레이터

코드 옆 기획서(Sidecar Spec) 방식으로 기획서와 코드를 함께 관리하는 오케스트레이터입니다.

---

## 핵심 컨셉

```
모든 코드 파일 옆에 .spec.md가 존재
기획서와 코드가 같은 폴더에 있어 발견성/동기화 용이
이미 있으면 스킵, 개선 필요하면 업데이트 + 변경 이력 기록
```

---

## 사용 시점

| 상황 | 사용 여부 |
|------|----------|
| 새로운 기능 기획 | ✅ |
| 기존 기능 역설계 | ✅ |
| 기존 기획서 업데이트 | ✅ |

---

## 입력

| 항목 | 필수 | 설명 |
|------|------|------|
| 기능명 | ✅ | 기획할 기능 이름 (예: 회원 관리) |
| 앱명 | ✅ | 대상 앱 (예: admin) |
| 요구사항 | ✅ | 상세 요구사항 목록 |
| 모드 | ❌ | create(신규) / reverse(역설계) / update(업데이트) |

---

## 기획서 파일 구조

```
apps/[app]/app/(admin)/
├── app.spec.md                 # 앱 기획서 (L0-L2: 컨텍스트, Actor, Goal)

apps/[app]/app/(admin)/[도메인]/
├── page.tsx                    # 목록 페이지
├── page.spec.md                # 목록 페이지 기획서 ← 코드 옆에 위치
├── [entityId]/
│   ├── page.tsx                # 상세 페이지
│   └── page.spec.md            # 상세 페이지 기획서
├── new/
│   ├── page.tsx                # 등록 페이지
│   └── page.spec.md            # 등록 페이지 기획서
└── [entityId]/edit/
    ├── page.tsx                # 수정 페이지
    └── page.spec.md            # 수정 페이지 기획서

packages/fe-ui/src/components/
├── feature/[FeatureName]/
│   ├── index.tsx
│   └── index.spec.md           # Feature 기획서
├── widget/[WidgetName]/
│   ├── index.tsx
│   └── index.spec.md           # Widget 기획서
├── ui/[UIName]/
│   ├── index.tsx
│   └── index.spec.md           # UI 기획서

packages/fe-store/src/stores/
└── [StoreName].ts
└── [StoreName].spec.md         # Store 기획서

apps/server/src/[module]/
├── [name].service.ts
├── [name].service.spec.md      # Service 기획서
├── repositories/
│   ├── [name].repository.ts
│   └── [name].repository.spec.md
└── controllers/
    ├── [name].controller.ts
    └── [name].controller.spec.md
```

---

## 실행 흐름

```
1. 요구사항 분석
   - 도메인 식별
   - 필요한 페이지/컴포넌트 목록 도출
   ↓
2. 페이지 기획 (L0-L4)
   - 각 페이지별 page.spec.md 생성
   - 사용자 시나리오, 레이아웃, API 호출 정의
   ↓
3. 컴포넌트 기획 (L5-L8)
   - Feature/Widget/UI별 index.spec.md 생성
   - Props, Store 연결, 이벤트 정의
   ↓
4. 백엔드 기획 (L6, L9-L10)
   - Controller/Service/Repository별 .spec.md 생성
   - API 엔드포인트, 비즈니스 규칙 정의
   ↓
5. Store 기획 (L11)
   - Store별 .spec.md 생성
   - 상태, 액션, 비동기 흐름 정의
   ↓
6. 테스트 기획 (L12)
   - 테스트 케이스 정의
```

---

## 기획서 템플릿 위치

```
.claude/templates/spec/
├── page.spec.md        # 페이지 기획서 템플릿
├── feature.spec.md     # Feature 기획서 템플릿
├── widget.spec.md      # Widget 기획서 템플릿
├── ui.spec.md          # UI 기획서 템플릿
├── store.spec.md       # Store 기획서 템플릿
├── service.spec.md     # Service 기획서 템플릿
├── repository.spec.md  # Repository 기획서 템플릿
└── controller.spec.md  # Controller 기획서 템플릿
```

---

## 하위 에이전트

| 에이전트 | 역할 | 출력 |
|----------|------|------|
| `/req-context-planner` | 컨텍스트/사용자/목표 | app.spec.md 업데이트 |
| `/req-screen-planner` | 기능/화면 | page.spec.md |
| `/req-page-planner` | 페이지 통합 | page.spec.md 통합 섹션 |
| `/req-api-planner` | 인터랙션/API | controller.spec.md, dto.spec.md |
| `/req-entity-planner` | Entity/Enum/VO 설계 | entity.spec.md, enum.spec.md, vo.spec.md |
| `/req-store-planner` | Store 설계 | [domain]Store.spec.md |
| `/req-ui-planner` | UI 컴포넌트 기획 | ui/index.spec.md |
| `/req-input-planner` | Input 컴포넌트 기획 | inputs/index.spec.md |
| `/req-cell-planner` | Cell 컴포넌트 기획 | cells/index.spec.md |
| `/req-widget-planner` | Widget 기획 | widget/index.spec.md |
| `/req-layout-planner` | Layout 기획 | layout/index.spec.md |
| `/req-feature-planner` | Feature 기획 | feature/index.spec.md |
| `/req-menu-planner` | 메뉴 기획 | admin-menu.spec.md |
| `/req-logic-planner` | 로직/테스트 | service/repository.spec.md, 테스트 케이스 |
| `/req-test-planner` | 테스트 케이스 기획 | 각 spec 테스트 섹션 |
| `/req-api-integration-planner` | API 연동 기획 | hooks/index.spec.md |

---

## 워크플로우 상세

### 1단계: 요구사항 분석

```
입력: "회원 관리 기능 기획해줘"

분석 결과:
- 도메인: Member
- 페이지: List, Detail, Create, Edit
- 필요 Feature: MemberList, MemberForm, MemberDetail
- 필요 Widget: MemberCard, MemberTable, SearchFilter
- 필요 Store: MemberStore
- 필요 API: GET/POST/PUT/DELETE /members
```

### 2단계: 기존 파일 확인

```bash
# 각 경로별 .spec.md 존재 여부 확인
apps/admin/web/app/(admin)/users/page.spec.md
packages/fe-ui/src/components/feature/MemberList/index.spec.md
...
```

### 3단계: 기획서 생성/업데이트

```
존재하지 않음 → 템플릿으로 새로 생성
존재함 + 개선 필요 → 업데이트 + 변경 이력 기록
존재함 + 개선 불필요 → 스킵
```

---

## 사용 예시

### 신규 기능 기획

```
/orch-requirement

**기능명:** 회원 관리
**앱명:** admin
**요구사항:**
- 관리자는 회원 목록을 조회할 수 있다
- 관리자는 회원 상세 정보를 확인할 수 있다
- 관리자는 회원을 등록/수정/삭제할 수 있다
- 검색 및 필터링 기능 필요
```

### 역설계 (기존 코드 → 기획서)

```
/orch-requirement

**모드:** reverse
**대상:** apps/admin/web/app/(admin)/users/
**설명:** 기존 회원 관리 코드 분석하여 기획서 생성
```

---

## 기획서 변경 이력 관리

각 기획서 하단에 변경 이력을 기록합니다:

```markdown
## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
| 2026-02-19 | 검색 기능 추가 | orch-requirement |
| 2026-02-20 | 필터링 로직 개선 | orch-requirement |
```

---

## 장점

| 항목 | 설명 |
|------|------|
| **발견성** | 코드 파일만 보면 기획서도 바로 옆에 있음 |
| **동기화** | 기획서와 코드가 같은 폴더에 있어 버전 관리 용이 |
| **점진적** | 한 번에 다 만들지 않고, 필요한 것부터 |
| **역설계 호환** | 기존 코드 분석 → .spec.md만 생성하면 됨 |
