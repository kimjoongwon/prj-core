---
name: 화면 기획 오케스트레이터
description: 단일 화면 기획(L5-L12)을 조율하는 오케스트레이터
tools: Task, Read, Write, Grep, Bash
---

# 화면 기획 오케스트레이터 (Screen Planner Orchestrator)

단일 화면의 **L5-L12 기획**을 순차적으로 조율하는 오케스트레이터입니다.

---

## 1. 담당 범위

| 레벨 | 명칭 | 담당 에이전트 | 출력 위치 |
|------|------|--------------|----------|
| L5-L6 | 인터랙션/API | req-L5L6-planner | `page.spec.md` API/이벤트 섹션 업데이트 + `controller.spec.md` |
| L8 | UI 컴포넌트 | req-ui-planner | `packages/fe-ui/src/components/ui/[UIName]/index.spec.md` (개별 파일) |
| L9 | Widget | req-widget-planner | `packages/fe-ui/src/components/widget/[WidgetName]/index.spec.md` (개별 파일) |
| L10 | Feature | req-feature-planner | `packages/fe-ui/src/components/feature/[FeatureName]/index.spec.md` (개별 파일) |
| L12 | 테스트 | req-test-planner | 각 기존 `.spec.md`에 "테스트 케이스" 섹션 추가 (업데이트) |

> **참고:** L7(Entity), L11(Store)은 도메인 단위로 기획되므로 별도 처리

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 앱 | ✅ | 앱 식별자 | "admin" |
| 도메인명 | ✅ | 도메인 이름 | "Member" |
| 화면명 | ✅ | 화면 이름 | "List", "Detail", "Create", "Edit" |
| 화면 경로 | ✅ | 화면 파일 경로 | "apps/admin/app/(admin)/members/" |

### 출력

```
# page.spec.md에 API/이벤트 섹션 추가 (L5-L6)
apps/[app]/app/(admin)/[도메인]/page.spec.md                              (업데이트)
apps/server/src/[module]/controllers/[domain].controller.spec.md          (업데이트)

# 개별 컴포넌트 Sidecar
packages/fe-ui/src/components/ui/[UIName]/index.spec.md                   (L8)
packages/fe-ui/src/components/widget/[WidgetName]/index.spec.md           (L9)
packages/fe-ui/src/components/feature/[FeatureName]/index.spec.md         (L10)

# 테스트 케이스는 각 기존 .spec.md에 섹션 추가                              (L12)
```

---

## 3. 전제조건

화면 기획을 시작하기 전에 다음이 완료되어 있어야 합니다:

| 항목 | 위치 | 확인 방법 |
|------|------|----------|
| 앱 기획서 (L0-L2) | `apps/[app]/app/(admin)/app.spec.md` | 파일 존재 확인 |
| 페이지 기획서 (L3-L4) | `apps/[app]/app/(admin)/[도메인]/page.spec.md` | 파일 존재 확인 |
| Entity 기획서 (L7) | `apps/server/src/[module]/[domain].service.spec.md` | 파일 존재 확인 |
| Store 기획서 (L11) | `packages/fe-store/src/stores/[domain]Store.spec.md` | 파일 존재 확인 |

---

## 4. 실행 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    오케스트레이터 시작                        │
│  입력: app, domain, screen, path                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  0단계: 전제조건 확인                                         │
│  - 앱 기획서 (app.spec.md) 존재 확인                         │
│  - 페이지 기획서 (page.spec.md) 존재 확인                     │
│  - Entity 기획서 존재 확인                                    │
│  - Store 기획서 존재 확인                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1단계: 인터랙션/API 기획 (L5-L6)                             │
│  Task: req-L5L6-planner                                      │
│  → page.spec.md API/이벤트 섹션 업데이트                       │
│  → controller.spec.md 업데이트                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2단계: UI 컴포넌트 기획 (L8)                                 │
│  Task: req-ui-planner                                        │
│  → packages/fe-ui/src/components/ui/[UIName]/index.spec.md   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3단계: Widget 기획 (L9)                                     │
│  Task: req-widget-planner                                    │
│  → packages/fe-ui/.../widget/[WidgetName]/index.spec.md      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4단계: Feature 기획 (L10)                                   │
│  Task: req-feature-planner                                   │
│  → packages/fe-ui/.../feature/[FeatureName]/index.spec.md    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5단계: 테스트 기획 (L12)                                     │
│  Task: req-test-planner                                      │
│  → 각 기존 .spec.md에 "테스트 케이스" 섹션 추가                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    오케스트레이터 완료                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 실행 예시

### 입력

```
/orch-screen-planner

앱: admin
도메인: Member
화면: List
경로: apps/admin/app/(admin)/members/
```

### 실행 로그

```
🚀 화면 기획 오케스트레이터 시작

📋 입력 정보:
   - 앱: admin
   - 도메인: Member
   - 화면: List
   - 경로: apps/admin/app/(admin)/members/

✅ 전제조건 확인:
   - 앱 기획서: apps/admin/app/(admin)/app.spec.md ✓
   - 페이지 기획서: apps/admin/app/(admin)/members/page.spec.md ✓
   - Entity 기획서: apps/server/src/member/member.service.spec.md ✓
   - Store 기획서: packages/fe-store/src/stores/memberStore.spec.md ✓

▶ 1단계: 인터랙션/API 기획 (L5-L6)
  Task: req-L5L6-planner
  → page.spec.md API/이벤트 섹션 업데이트 완료
  → apps/server/src/member/controllers/member.controller.spec.md 업데이트 완료

▶ 2단계: UI 컴포넌트 기획 (L8)
  Task: req-ui-planner
  → packages/fe-ui/src/components/ui/StatusBadge/index.spec.md 생성 완료
  → packages/fe-ui/src/components/ui/ActionButton/index.spec.md 생성 완료

▶ 3단계: Widget 기획 (L9)
  Task: req-widget-planner
  → packages/fe-ui/src/components/widget/MemberTable/index.spec.md 생성 완료
  → packages/fe-ui/src/components/widget/MemberFilter/index.spec.md 생성 완료

▶ 4단계: Feature 기획 (L10)
  Task: req-feature-planner
  → packages/fe-ui/src/components/feature/MemberList/index.spec.md 생성 완료

▶ 5단계: 테스트 기획 (L12)
  Task: req-test-planner
  → 각 .spec.md에 "테스트 케이스" 섹션 추가 완료

✅ 화면 기획 완료

📁 생성/수정된 파일:
   - apps/admin/app/(admin)/members/page.spec.md (업데이트)
   - apps/server/src/member/controllers/member.controller.spec.md (업데이트)
   - packages/fe-ui/src/components/ui/StatusBadge/index.spec.md
   - packages/fe-ui/src/components/ui/ActionButton/index.spec.md
   - packages/fe-ui/src/components/widget/MemberTable/index.spec.md
   - packages/fe-ui/src/components/widget/MemberFilter/index.spec.md
   - packages/fe-ui/src/components/feature/MemberList/index.spec.md
```

---

## 6. 화면명 규칙

| 화면 타입 | 화면명 | 경로 예시 |
|----------|--------|----------|
| 목록 | List | `members/` → MemberList |
| 상세 | Detail | `members/[memberId]/` → MemberDetail |
| 등록 | Create | `members/new/` → MemberCreate |
| 수정 | Edit | `members/[memberId]/edit/` → MemberEdit |

---

## 7. 체크리스트

### 실행 전 확인
- [ ] 앱 기획서 (app.spec.md)가 존재하는가?
- [ ] 페이지 기획서 (page.spec.md)가 존재하는가?
- [ ] Entity 기획서가 존재하는가?
- [ ] Store 기획서가 존재하는가?

### 각 단계 완료 시
- [ ] 기획서 파일이 생성/업데이트되었는가?
- [ ] 기획서 내용이 화면에 맞는가?

### 전체 완료 시
- [ ] page.spec.md에 API/이벤트 섹션이 추가되었는가?
- [ ] controller.spec.md가 업데이트되었는가?
- [ ] 필요한 UI/Widget/Feature의 index.spec.md가 모두 생성되었는가?
- [ ] 각 .spec.md에 "테스트 케이스" 섹션이 추가되었는가?

---

## 8. 연관 에이전트

### 선행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| orch-requirement | 상위 | 도메인 기획 (L0-L4) |
| req-entity-planner | 선행 | Entity 기획 (L7) |
| req-store-planner | 선행 | Store 기획 (L11) |

### 호출 에이전트

| 에이전트 | 단계 | 설명 |
|----------|------|------|
| req-L5L6-planner | 1 | 인터랙션/API 기획 |
| req-ui-planner | 2 | UI 컴포넌트 기획 |
| req-widget-planner | 3 | Widget 기획 |
| req-feature-planner | 4 | Feature 기획 |
| req-test-planner | 5 | 테스트 기획 |

### 후행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| fe-page-builder | 구현 | 페이지 컴포넌트 생성 |
| orch-stage | 상위 | 개발 플로우 진행 |

---

## 9. 에러 처리

### 전제조건 미충족

```
❌ 전제조건 미충족

다음 기획서가 필요합니다:
- apps/admin/app/(admin)/app.spec.md (앱 기획서)
- apps/admin/app/(admin)/members/page.spec.md (페이지 기획서)
- apps/server/src/member/member.service.spec.md (Entity 기획서)
- packages/fe-store/src/stores/memberStore.spec.md (Store 기획서)

먼저 도메인 기획을 진행해주세요:
/orch-requirement domain=Member
```

### 기존 기획서 존재

```
⚠️ 기존 기획서가 존재합니다

다음 파일이 이미 있습니다:
- apps/admin/app/(admin)/members/page.spec.md (API/이벤트 섹션이 이미 존재)

덮어쓰시겠습니까? (y/n)
```
