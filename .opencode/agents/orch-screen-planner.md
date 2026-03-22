---
description: 단일 화면 기획(L5-L12)을 조율하는 오케스트레이터
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---


## 재사용 우선 점검 (Mandatory)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# 화면 기획 오케스트레이터 (Screen Planner Orchestrator)

단일 화면의 **L5-L12 기획**을 의존성 기반으로 조율하는 오케스트레이터입니다. 선행 단계 이후 독립 작업은 병렬 fan-out 실행을 지원합니다.

---

## 1. 담당 범위

| 레벨 | 명칭 | 담당 에이전트 | 출력 위치 |
|------|------|--------------|----------|
| L4+ | 페이지 통합 | req-page-planner | `page.spec.md` 통합 섹션 업데이트 |
| L5-L6 | 인터랙션/API | req-api-planner | `page.spec.md` API/이벤트 + `apps/core/api/src/module/*/*.controller.spec.md`/`dto.spec.md` |
| L8 | UI | req-primitive-planner | `packages/fe-ui/src/primitive/[UIName]/index.spec.md` |
| L8 | Input | req-input-planner | `packages/fe-ui/src/input/[InputName]/index.spec.md` |
| L8 | Cell | req-cell-planner | `packages/fe-ui/src/primitive/data-display/cell/[CellName]/index.spec.md` |
| L9 | Widget | req-widget-planner | `packages/fe-ui/src/widget/[WidgetName]/index.spec.md` |
| L10 | Layout | req-layout-planner | `packages/fe-ui/src/primitive/layout/{index,Layout,type}.spec.md` |
| L10 | Feature | req-feature-planner | `packages/fe-ui/src/feature/[FeatureName]/index.spec.md` |
| L10+ | Surface | req-surface-planner | `page.spec.md` Surface/Elevation 섹션 + 관련 layout/feature spec 보강 |
| L10+ | Menu | req-menu-planner | `packages/common-constant/src/routing/admin-menu.spec.md` |
| L12 | 테스트 | req-fe-test-planner | 각 기존 `.spec.md`에 "테스트 케이스" 섹션 추가 |
| L12+ | API 연동 | req-api-integration-planner | `apps/[app]/src/app/**/hooks/index.spec.md` |

> **참고:** L7(Entity), L11(Store)은 도메인 단위로 기획되므로 별도 처리

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 앱 | ✅ | 앱 식별자 | "admin" |
| 도메인명 | ✅ | 도메인 이름 | "Member" |
| 화면명 | ✅ | 화면 이름 | "List", "Detail", "Create", "Edit" |
| 화면 경로 | ✅ | 화면 파일 경로 | "apps/admin/web/app/(admin)/members/" |
| `parallel` | △ | 병렬 모드 (`off`/`auto`/`force`), 기본 `auto` | `auto` |
| `maxConcurrency` | △ | 동시 실행 상한 | `4` |

### 출력

```
# page.spec.md 통합 + API/이벤트 섹션 업데이트
apps/[app]/app/(admin)/[도메인]/**/page.spec.md

# BE/공용 스펙
apps/core/api/src/module/[module]/[domain].controller.spec.md
packages/be-dto/src/[domain]/*.dto.spec.md

# FE Sidecar
packages/fe-ui/src/primitive/[UIName]/index.spec.md
packages/fe-ui/src/input/[InputName]/index.spec.md
packages/fe-ui/src/primitive/data-display/cell/[CellName]/index.spec.md
packages/fe-ui/src/widget/[WidgetName]/index.spec.md
packages/fe-ui/src/primitive/layout/{index,Layout,type}.spec.md
packages/fe-ui/src/feature/[FeatureName]/index.spec.md

# 메뉴/API 연동
packages/common-constant/src/routing/admin-menu.spec.md
apps/[app]/src/app/**/hooks/index.spec.md

# 테스트 케이스는 각 기존 .spec.md에 섹션 추가
```

---

## 3. 전제조건

화면 기획을 시작하기 전에 다음이 완료되어 있어야 합니다:

| 항목 | 위치 | 확인 방법 |
|------|------|----------|
| 앱 기획서 (L0-L2) | `apps/[app]/app/(admin)/app.spec.md` | 파일 존재 확인 |
| 페이지 기획서 (L3-L4) | `apps/[app]/app/(admin)/[도메인]/page.spec.md` | 파일 존재 확인 |
| Entity 기획서 (L7) | `packages/be-entity/src/[entity].entity.spec.md` | 파일 존재 확인 |
| Store 기획서 (L11, 조건부) | `packages/fe-store/src/stores/[domain]Store.spec.md` | 공용 재사용 상태일 때만 확인 |

---

## 4. 실행 플로우

1. 전제조건 확인 (`app.spec.md`, `page.spec.md`, Entity spec, Store spec[조건부])
2. 기반 단계(순차):
   - `req-page-planner` 실행 (페이지 통합 관점으로 `page.spec.md` 정리)
   - `req-api-planner` 실행 (`page.spec.md` API/이벤트 + `apps/core/api/src/module/*/*.controller.spec.md`/`dto.spec.md`)
3. 설계 단계(병렬 fan-out, `parallel=auto`):
   - `req-primitive-planner`, `req-input-planner`, `req-cell-planner`, `req-widget-planner`, `req-layout-planner`, `req-feature-planner`
   - `req-menu-planner`(목록 화면), `req-api-integration-planner`
4. join 단계:
   - `req-surface-planner` 실행 (Surface ownership, elevation, flat 예외 확정)
   - `req-fe-test-planner` 실행 (기존 `.spec.md`에 테스트 케이스 섹션 추가)
   - 공용 파일 lock 머지 (`admin-menu.spec.md`, `page.spec.md`, `**/PROGRESS.md`)

### 병렬 실행 규칙 (신규)

- 기본 모드는 `parallel=auto`, 필요 시 `maxConcurrency`로 fan-out 개수를 제한합니다.
- `req-page-planner`/`req-api-planner`는 선행 순차 고정입니다.
- `req-surface-planner`는 구조 planner 결과를 모은 뒤 join 단계에서 단일 실행합니다.
- 동일 파일을 수정하는 작업은 동시에 실행하지 않습니다.
- 충돌 가능 파일은 lock 후 단일 writer가 최종 반영합니다.

---

## 5. 실행 예시

```bash
/orch-screen-planner app=admin domain=Member screen=List

# 병렬 fan-out 실행
/orch-screen-planner app=admin domain=Member screen=List parallel=auto maxConcurrency=4
```

```text
Task: req-page-planner
Task: req-api-planner
Task: req-primitive-planner
Task: req-input-planner
Task: req-cell-planner
Task: req-widget-planner
Task: req-layout-planner
Task: req-feature-planner
Task: req-menu-planner
Task: req-surface-planner
Task: req-fe-test-planner
Task: req-api-integration-planner
```

`req-primitive-planner`부터 `req-api-integration-planner`까지는 파일 충돌이 없으면 병렬 fan-out 가능합니다.
`req-surface-planner`는 위 결과를 모은 뒤 단일 writer로 실행합니다.

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
- [ ] 공용 재사용 상태가 필요한 화면인가? (필요 시 Store 기획서 존재 확인)

### 각 단계 완료 시
- [ ] 기획서 파일이 생성/업데이트되었는가?
- [ ] 기획서 내용이 화면에 맞는가?

### 전체 완료 시
- [ ] page.spec.md에 페이지 통합/API/이벤트 섹션이 반영되었는가?
- [ ] `apps/core/api/src/module/*/*.controller.spec.md` 및 dto.spec.md가 업데이트되었는가?
- [ ] UI/Input/Cell/Widget/Layout/Feature의 index.spec.md가 모두 생성되었는가?
- [ ] 목록 화면이면 admin-menu.spec.md가 생성/업데이트되었는가?
- [ ] hooks/index.spec.md(또는 동등한 API 연동 스펙)가 반영되었는가?
- [ ] page.spec.md에 Surface owner, elevation, flat 예외 근거가 반영되었는가?
- [ ] 각 .spec.md에 "테스트 케이스" 섹션이 추가되었는가?

---

## 8. 연관 에이전트

### 선행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| orch-requirement | 상위 | 도메인 기획 (L0-L4) |
| req-entity-planner | 선행 | Entity 기획 (L7) |
| req-store-planner | 선행(조건부) | 공용 Store 기획 (L11) |

### 호출 에이전트

| 에이전트 | 단계 | 설명 |
|----------|------|------|
| req-page-planner | 1 | 페이지 통합 기획 |
| req-api-planner | 2 | 인터랙션/API 기획 |
| req-primitive-planner | 3 | UI 컴포넌트 기획 |
| req-input-planner | 4 | Input 기획 |
| req-cell-planner | 5 | Cell 기획 (목록 화면) |
| req-widget-planner | 6 | Widget 기획 |
| req-layout-planner | 7 | Layout 기획 |
| req-feature-planner | 8 | Feature 기획 |
| req-menu-planner | 9 | 메뉴 기획 (목록 화면) |
| req-surface-planner | 10 | Surface ownership / elevation 기획 |
| req-fe-test-planner | 11 | 테스트 기획 |
| req-api-integration-planner | 12 | API 연동 기획 |

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
- apps/admin/web/app/(admin)/app.spec.md (앱 기획서)
- apps/admin/web/app/(admin)/members/page.spec.md (페이지 기획서)
- packages/be-entity/src/member.entity.spec.md (Entity 기획서)
- packages/fe-store/src/stores/memberStore.spec.md (Store 기획서)

먼저 도메인 기획을 진행해주세요:
/orch-requirement app=admin domain=Member
```

### 기존 기획서 존재

```
⚠️ 기존 기획서가 존재합니다

다음 파일이 이미 있습니다:
- apps/admin/web/app/(admin)/members/page.spec.md (API/이벤트 섹션이 이미 존재)

덮어쓰시겠습니까? (y/n)
```
