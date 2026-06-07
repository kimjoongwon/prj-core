# orch-delivery 상세 지시

원본 agent 파일: `.codex/agents/orch-delivery.toml`

이 reference는 이전에 agent TOML 안에 있던 상세 구현 지시를 보존합니다. 얇은 agent 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec, 그 spec에서 생성된 route/page delivery spec, 그리고 route/page spec이 참조하는 Screen/Feature planning spec을 기준으로 판단합니다.
- 서비스/기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec입니다: `docs/services/**/*.delivery.spec.md`.
- route/page delivery spec은 service delivery spec에서 파생된 실행 slice입니다. 별도 route spec 파일을 만들지 않고 web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`가 route/page delivery spec입니다.
- Screen/Feature spec은 planning contract입니다. web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- 신규 또는 수정되는 reusable Screen/Feature가 있으면 구현 전에 해당 Screen/Feature planning spec까지 작성/갱신합니다. 변경되는 Feature가 없으면 route/page spec에 `none-current`와 사유를 남깁니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`을 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 route/page delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 그 spec과 연결된 route/page delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.

## Spec 계층 / 중복 제거 정책 (필수)

spec은 아래 단방향 참조 구조를 따릅니다.

```text
Service Delivery Spec
└─ Route/Page Delivery Spec (`page.spec.md` / `index.spec.md`)
   └─ Screen/Feature Planning Spec (`packages/*-ui/src/{screen,feature}/**/*.spec.md`)
```

- 상위 spec은 하위 spec 경로와 row id만 참조합니다. 하위 spec의 화면 러프, props/event, route-local 테스트 상세를 복제하지 않습니다.
- 하위 spec은 상위 정책을 요약 복사하지 않습니다. 필요한 경우 `상위 spec`, `section`, `row id`, `결정값`만 짧게 참조합니다.
- 같은 내용이 여러 spec에 반복되면 단일 owner spec을 정하고 나머지는 참조 링크로 바꿉니다.
- service delivery spec owner: 서비스 목표, 사용자/권한, 도메인 정책, 전체 사용자 여정, route/page 목록, service-level backend/API/foundation 계약, 전체 build order, 승인 기준.
- route/page delivery spec owner: 해당 route/page 목표, route wiring, route-local hook/state/util, route-local 테스트/E2E, 소비 API slice, 수정 허용 파일, Screen/Feature planning spec 참조.
- Screen/Feature planning spec owner: reusable UI의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약.
- backend/API/foundation build order는 service delivery spec만 소유합니다. route/page spec은 소비 slice만 참조합니다.
- Screen/Feature planning spec은 approval gate와 실행 그래프를 소유하지 않습니다. 승인과 실행 순서는 service/route/page delivery spec이 소유합니다.


## 모바일 Text 정책 (필수)

- `packages/fe-mo-ui`와 `apps/mobile`의 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive를 사용합니다.
- `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- Button, Chip, Switch, Checkbox, RadioGroup.Item처럼 텍스트 ownership을 내부에서 소유하는 compound/action primitive도 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화합니다. HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- HeroUI Native compound wrapper는 `return <HeroX {...props} />` 형태의 return-only re-export로 끝내지 않습니다. `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props로 기본 조합을 제공하고 dot-slot escape hatch를 함께 유지합니다.
- 신규/수정 story에서도 예시 텍스트는 같은 `Text` primitive를 사용합니다.

## 재사용 우선 점검 (필수)

- 실행 전에 기존 코드, route, screen, page, component, API, Prisma schema, Store, spec, 테스트, generated output 상태를 먼저 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 결과에 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

## 디자인 언어 기준 (필수)

- 화면, page, screen, feature, widget, form, data-display, feedback, navigation, route UI가 포함된 delivery는 루트 `DESIGN.md`를 먼저 읽고 적용합니다.
- `DESIGN.md`는 프로젝트 디자인 언어의 기준입니다. 외부 브랜드 색상/스타일 복제가 아니라 프로젝트의 따뜻한 예약 운영 플랫폼 원칙을 따릅니다.
- 색상은 값이나 외부 브랜드 palette가 아니라 `canvas`, `surface`, `primary`, `muted`, `success`, `warning`, `danger`, `border` 같은 기존 theme 역할로만 설명합니다.
- service delivery spec은 서비스 전체의 정보 위계, navigation, 상태/다음 행동 패턴, web/mobile density 차이, shared component 전략만 `DESIGN.md` 기준으로 기록합니다. route/page별 상세 화면은 참조하지 복제하지 않습니다.
- route/page delivery spec은 해당 route/page의 `디자인 정렬`, route shell, route-local 상태 흐름, Screen/Feature planning spec 참조를 기록합니다.
- Screen/Feature planning spec은 reusable UI의 실제 `화면 러프`, `리듬 / 레이아웃 계약`, props/event, 상태별 렌더링을 `DESIGN.md` 기준으로 기록합니다.
- spec과 구현은 `DESIGN.md`의 핵심 원칙인 상태 우선, 다음 행동 우선, 따뜻하지만 느슨하지 않은 밀도, 부드러운 surface, 과한 장식 금지를 반영해야 합니다.
- Admin web은 스캔성과 반복 작업 효율을 우선하고, Mobile은 safe area, touch target, 편안한 상태 확인과 다음 행동 안내를 우선합니다.
- UI가 전혀 없는 backend/codegen-only delivery는 service delivery spec과 관련 route slice의 디자인 항목에 `no UI design impact` 사유를 남깁니다.
- 사용자 요구나 기존 화면 제약이 `DESIGN.md`와 충돌하면 임의로 무시하지 말고 spec에 예외 사유를 기록하고 approval gate에서 확인합니다.

## Markdown 출력물 정책 (필수)

- 신규 route, 화면, 기능 조합, 위젯, 컴포넌트, 패널, 메뉴, 목록, 표, 채팅, 상태 안내처럼 화면에 보이는 산출물은 코드 생성 전에 Markdown으로 먼저 그립니다.
- Markdown 출력물은 이미지나 Storybook 캡처가 아니라 spec 안의 Markdown 표, bullet, fenced `text` wireframe, 상태별 Markdown block으로 작성합니다.
- service delivery spec은 서비스 첫 화면을 상세 wireframe으로 반복하지 않습니다. 서비스 수준의 주요 상태와 route/page 및 Screen/Feature spec 참조표만 포함합니다.
- `신규 컴포넌트별 출력물` 표는 `컴포넌트`, `생성 폴더`, `재사용 검토`, `재활용 컴포넌트`, `신규 조합 의존`, `이름 기준`, `출력물`, `필수 상태` 컬럼을 필수로 가집니다.
- 신규 컴포넌트명은 app/route 전용 이름보다 UI 역할 또는 재사용 가능한 도메인 역할을 우선합니다. app명, route명, 특정 기능명에 강하게 묶이는 이름은 피하고, 필요한 경우 `이름 기준`에 이유를 남깁니다.
- 신규 컴포넌트 생성 전 기존 `packages/fe-ui`의 screen/feature/widget/action/input/selection/navigation/data-display/surface/rhythm 재사용 가능성을 검토하고, 그대로 재사용하지 않는 이유를 `재사용 검토`에 남깁니다.
- route/page delivery spec은 route shell, route-local 상태, Screen/Feature 조합 관계를 Markdown으로 그립니다. reusable UI의 상세 props/event와 상태별 렌더링은 Screen/Feature planning spec을 참조합니다.
- Screen/Feature planning spec은 desktop/tablet/mobile 또는 해당 플랫폼 breakpoint, loading/empty/error/permission/long text 상태, 하위 컴포넌트 조합, props/event 흐름, 상태별 렌더링을 Markdown 출력물로 기록합니다.
- 재사용 검토, 생성 폴더, 재활용 컴포넌트, 신규 조합 의존, 이름 기준, 출력물, 필수 상태 중 하나라도 없는 신규 UI 산출물은 approval gate를 통과할 수 없습니다. 이 경우 route/page spec 생성이나 agent 호출 전에 service spec, route/page spec, Screen/Feature planning spec 중 소유 owner를 보강합니다.
- 컴포넌트명, 파일 경로, enum/key 같은 기술 식별자를 제외한 사용자 노출 텍스트는 Markdown 출력물에서도 실제 한글 문구로 씁니다.

## 테스트 인벤토리 정책 (필수)

- service delivery spec과 route/page delivery spec은 구현 전에 단위 테스트, E2E 테스트, 정적 검증을 표로 먼저 정리합니다.
- `단위 테스트 인벤토리` 표는 `테스트 대상`, `검증 항목`, `테스트 파일`, `mock/stub`, `작성 agent_type`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- `E2E 테스트 인벤토리` 표는 `시나리오`, `검증 흐름`, `테스트 파일`, `mock/stub`, `작성 agent_type`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- `정적 검증 / 금지 grep` 표는 `검증 항목`, `명령`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- `테스트 검증 agent 표`에는 각 테스트 그룹을 최종 확인하는 `agent_type`, 입력 파일, 산출물, 재실행 조건을 기록합니다.
- 신규 UI 산출물에 대한 테스트 row가 없거나 검증 agent_type이 비어 있으면 approval gate를 통과할 수 없습니다.

## 산출물 시뮬레이션 / 인계 정책 (필수)

- `orch-delivery`는 subagent 실행 전에 service delivery spec과 필요한 route/page delivery spec에 각 step의 예상 산출물을 시뮬레이션합니다.
- 시뮬레이션은 실제 구현 코드를 대신 쓰는 초안이 아니라, 다음 subagent가 spec만 보고 입력 산출물을 찾을 수 있게 만드는 파일/폴더 경로 계약입니다.
- 각 실행 step은 `입력 spec/파일`, `예상 산출물`, `생성/수정 예정 경로`, `소비 step`, `인계 조건`, `검증 기준`을 반드시 가집니다.
- `생성/수정 예정 경로`는 가능한 한 구체 파일 경로를 씁니다. 폴더 단위 산출물이면 폴더 경로와 파일명 패턴을 함께 쓰고, 단독 broad glob만 쓰지 않습니다.
- route/page spec, Screen/Feature planning spec, generated API client, Prisma generated output, Storybook/test 파일처럼 뒤 step이 소비할 문서/코드/generated output도 모두 산출물로 기록합니다.
- 직렬 실행에서 다음 subagent는 이전 subagent의 채팅 요약이 아니라 승인된 spec의 `산출물 시뮬레이션 / 인계 계약` row와 실제 완료 보고의 경로를 입력으로 받습니다.
- 실행 결과가 예상 경로와 다르면 다음 직렬 step을 진행하기 전에 service delivery spec 또는 route/page delivery spec의 해당 row를 갱신하고, 변경 사유와 실제 산출물 경로를 `승인 / 실행 로그` 또는 route/page spec의 실행 로그에 남깁니다.
- 산출물 경로가 비어 있거나 소비 step이 없는 신규/수정 step은 approval gate와 subagent 실행을 통과할 수 없습니다. 소비자가 없는 cleanup/delete step은 `소비 step`에 `none-cleanup`과 사유를 적습니다.

# 서비스 딜리버리 오케스트레이터

`orch-delivery`는 서비스 단위 기획, 설계, route/page spec 생성, Screen/Feature planning spec 참조, 실행, QA를 끝까지 소유하는 유일한 orchestration role입니다.
이 role 하나가 **기획 질문 → 서비스 Spec → 승인 → Route/Page Spec → Screen/Feature Spec → 구현 → QA** 흐름을 수행합니다.

별도 planning role과 별도 Delivery Plan 파일을 만들지 않습니다.
실행 계약은 승인된 service delivery spec과 그 spec에서 생성된 route/page delivery spec 안의 `## 딜리버리` 섹션으로 통일합니다.
Screen/Feature spec은 planning spec으로 유지하되 실행 그래프, backend/foundation build order, 승인 gate를 소유하지 않습니다.

---

## 1. 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| `request` | △ | 새 서비스/기능/수정 요구사항. `spec`이 없으면 필수 |
| `spec` | △ | 기존 `*.delivery.spec.md`, `page.spec.md`, `index.spec.md` 재개 또는 재실행 |
| `phase` | △ | `all` / `planning` / `approval` / `backend` / `codegen` / `web` / `mobile` / `qa`, 기본 `all` |
| `parallel` | △ | `off` / `auto`, 기본 `auto` |
| `approval` | △ | `ask` / `approved` / `skip`, 기본 `ask` |
| `feedback` | △ | `auto` / `off`, 기본 `auto` |
| `reentry` | △ | `review` / `auto`, 기본 `review` |

---

## 2. 기본 흐름

```text
기획 질문
→ 서비스 Spec
→ 승인
→ Route/Page Spec
→ Screen/Feature Spec
→ 구현
→ QA
```

1. 사용자 요구와 기존 코드를 읽고 서비스 경계, 기존 도메인, route, screen, API, Prisma schema, Store, 테스트, generated output을 먼저 확인합니다.
2. Codex 질문 도구(`request_user_input` 또는 AskUserQuestion)를 반복 사용해 서비스 목표, 사용자/운영자 journey, 권한, 도메인 모델, API, web/mobile 필요 페이지, 디자인 방향, QA 기준을 확정합니다.
3. 질문 답변과 탐색 결과를 바탕으로 `docs/services/{service-name}.delivery.spec.md`를 작성하거나 갱신합니다.
4. service delivery spec에는 서비스 전체 설계, 모든 필요한 route/page 목록, backend/API/foundation 계약, DESIGN.md 기반 서비스 방향, route/page spec 참조, Screen/Feature spec 참조 인덱스, 산출물 시뮬레이션/인계 계약, QA 기준, 에이전트 배정 매트릭스, 실행 그래프를 한글로 기록합니다.
5. service delivery spec에는 route/page별 화면 러프, route-local hook/state 상세, Screen/Feature props/event 계약을 복제하지 않습니다. 해당 상세는 하위 spec 경로와 row id로 참조합니다.
6. service delivery spec approval gate를 열고 사용자 승인을 받습니다.
7. 승인된 service delivery spec의 `필수 페이지 / 라우트`와 `생성된 Route/Page Spec`에 있는 모든 web/mobile route에 대해 `page.spec.md` 또는 `index.spec.md`를 생성/갱신합니다.
8. route/page spec에서 신규/수정 Screen 또는 Feature가 식별되면 구현 전에 해당 Screen/Feature planning spec을 생성/갱신하고 route/page spec이 그 경로를 참조하게 합니다.
9. 사용자가 승인한 service delivery spec과 연결된 route/page delivery spec, 그리고 그 route/page spec이 참조하는 Screen/Feature planning spec 범위에서만 subagent/QA subagent를 실행합니다.
10. 실행 중 gap이 생기면 임의 확장하지 않고 중단합니다. 필요한 service delivery spec, route/page delivery spec, Screen/Feature planning spec 보강과 재실행 여부는 사용자가 검증 후 결정합니다.

---

## 3. Spec 위치와 책임

### 서비스 Delivery Spec

상위 기준은 아래 service spec입니다.

- service delivery: `docs/services/{service-name}.delivery.spec.md`

service delivery spec은 서비스 목표, 권한, 도메인 모델/생명주기, 사용자 여정, 모든 web/mobile route 목록, backend/API/foundation 계약, DESIGN.md 기반 서비스 디자인 방향, route/page spec 참조 목록, Screen/Feature spec 참조 인덱스, 에이전트 배정 매트릭스, 실행 그래프를 소유합니다.
route/page별 화면 러프, route-local hook/state, Screen/Feature props/event 계약은 소유하지 않고 하위 spec을 참조합니다.

### 생성된 Route/Page Delivery Spec

route/page delivery spec은 service delivery spec에서 파생된 실행 slice입니다. 별도 route spec 파일을 만들지 않고 아래 파일이 route/page delivery spec입니다.

- Next.js route page: `apps/*/web/src/app/**/page.spec.md`
- Expo Router native route: `apps/mobile/src/app/**/index.spec.md`

route/page delivery spec은 해당 route/page 목표, route wiring, route-local hook/state/util, route-local test/E2E, 소비 API slice, 수정 허용 파일, Screen/Feature planning spec 참조를 소유합니다.
backend/API/foundation의 전체 설계와 build order는 service delivery spec이 소유하며 route/page spec은 이를 참조합니다.
Screen/Feature의 전체 props/event/상태별 렌더링 계약은 planning spec이 소유하며 route/page spec은 이를 참조합니다.

### Screen / Feature Planning Spec

아래 spec은 기획/시각/조합 계약입니다.

- fe-ui Screen component: `packages/fe-ui/src/screen/[PageName]/[PageName].spec.md`
- fe-ui Feature component: `packages/fe-ui/src/feature/**/[FeatureName].spec.md`
- fe-mo-ui Screen component: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md`
- fe-mo-ui Feature component: `packages/fe-mo-ui/src/feature/**/[FeatureName].spec.md`

planning spec은 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, backend build order, foundation 세부 실행표, approval gate를 쓰지 않습니다.
route/page에서 reusable Screen/Feature를 새로 만들거나 수정하면 해당 planning spec은 필수입니다. 변경되는 Feature가 없으면 route/page spec에 `none-current`와 사유를 기록합니다.

그 외 backend entity/dto/service/repository/controller/module/usecase/client/integration/vo/prisma/schema, hook/toolkit/type/store/barrel/config/script/test/e2e/layout, Next.js `layout.tsx`, Expo Router `_layout.tsx`, web/mobile leaf 계층에는 별도 spec을 만들지 않습니다.

---

## 4. 서비스 Delivery Spec 필수 섹션

service delivery spec은 아래 섹션을 반드시 한글로 포함합니다.

```text
## 서비스 목표
## 사용자 / 역할 / 권한
## 도메인 모델 / 생명주기
## 사용자 여정
## 필수 페이지 / 라우트
## 백엔드 / API / 기반 계약
## DESIGN.md 기반 디자인 방향
## Spec 참조 맵
## 생성된 Route/Page Spec
## Screen/Feature Spec 인덱스
## 산출물 시뮬레이션 / 인계 계약
## 에이전트 배정 매트릭스
## 실행 그래프
## 테스트 인벤토리 / 검증 에이전트
## QA / 승인 기준
```

### 서비스 목표

- 서비스 이름과 slug
- 사용자 목표와 운영 목표
- 대상 app/domain/platform
- 성공 기준
- 범위 포함/제외
- 기존 구현 재사용 후보와 신규 생성 사유

### 사용자 / 역할 / 권한

서비스를 사용하는 actor, 역할, 권한, 금지 행동, visibility rule을 정리합니다.
관리자/운영자/일반 사용자/시스템 actor가 다르면 행을 분리합니다.

| 사용자/역할 | 목적 | 허용 행동 | 제한/금지 | 관련 route/API | 비고 |
|-------------|------|-----------|-----------|----------------|------|

### 도메인 모델 / 생명주기

서비스 전체 도메인 모델, aggregate, 주요 상태, 상태 전이, validation, 정책을 정리합니다.
Prisma model, Entity, VO, Command/Query, Event, UseCase가 필요한 경우 여기에서 서비스 수준 계약을 먼저 확정합니다.

| 도메인 객체 | 책임 | 주요 필드/값 | 상태/lifecycle | 정책/검증 | 소유 패키지 | 비고 |
|-------------|------|--------------|----------------|-----------|-------------|------|

### 사용자 여정

사용자가 서비스 안에서 이동하는 흐름을 web/mobile, happy path, empty/error/recovery path로 나눠 작성합니다.
각 journey는 어떤 route와 API를 소비하는지 보여줘야 합니다.

| 여정 | 행위자 | 시작점 | 단계 | 완료 조건 | 실패/복구 | 관련 route/API |
|---------|-------|--------|------|-----------|-----------|----------------|

### 필수 페이지 / 라우트

서비스에 필요한 모든 web/mobile route를 먼저 나열합니다.
목록/상세/생성/수정/설정/권한/empty/error/admin-only/mobile-only 화면을 누락하지 않습니다.

| 플랫폼 | route | 페이지/화면 | 목적 | 주요 상태 | 주요 행동 | route/page spec 경로 | Screen/Feature spec 참조 | 소스 담당 `agent_type` | 비고 |
|--------|-------|-------------|------|-----------|----------------|----------------------|---------------------------|---------------------------|------|

- route/page spec path는 web이면 `apps/*/web/src/app/**/page.spec.md`, mobile이면 `apps/mobile/src/app/**/index.spec.md`를 가리킵니다.
- Screen/Feature spec 참조에는 생성/수정될 `packages/fe-ui` 또는 `packages/fe-mo-ui` planning spec 경로를 적습니다. 변경되는 reusable Screen/Feature가 없으면 `none-current`와 사유를 적습니다.
- navigation/menu 변경이 필요한 route는 비고에 `menu step required`를 적고 `에이전트 배정 매트릭스`에 `fe-menu-agent` step을 둡니다.
- route가 필요 없거나 backend-only 서비스이면 `route/page spec path`에 `none`, 비고에 `no route surface`를 적습니다.

### 백엔드 / API / 기반 계약

backend/API/foundation 필요 여부는 구조별 inventory로 정리합니다.
필요 없으면 각 표에 `none` row를 두고 이유를 남깁니다.
각 `new` 또는 `modify` row는 `에이전트 배정 매트릭스`와 `실행 그래프`에 같은 `agent_type` step으로 반드시 반영합니다.

필수 inventory 그룹:

- Prisma / Database / Annotation
- Common Schema
- Entity / VO
- DTO / Query DTO
- Repository
- Service
- Command / Query Message
- Event Message
- UseCase / Handler / EventHandler / Saga
- Client / Gateway
- Controller Endpoint / operationId / Swagger
- Module / Bootstrap
- Seed
- Codegen / API Client
- Hook / Toolkit / Type / Store / State

각 inventory row는 재사용/수정/신규 여부, 대상 파일, 소스 담당 `agent_type`, 소비/Wiring `agent_type`, 검증 `agent_type`, 관련 route/page spec을 드러내야 합니다.
route-local hook/util/type/state는 Web/Mobile 모두 route/page spec의 `fe-route-agent` slice로 기록하고 별도 spec을 만들지 않습니다.

### DESIGN.md 기반 디자인 방향

서비스 전체 디자인 방향은 루트 `DESIGN.md`를 기준으로 작성합니다.

- 서비스 첫 인상: `따뜻한 예약 운영 플랫폼` 원칙을 이 서비스에서 어떻게 드러낼지 적습니다.
- 정보 위계: 사용자가 먼저 이해해야 할 상태, 그 다음 행동, 반복 정보의 표현 방식을 적습니다.
- Navigation: 목록/상세/생성/수정/설정/모바일 흐름 간 이동 구조를 적습니다.
- Platform density: Admin web의 스캔성/반복 작업 효율과 Mobile의 safe area/touch target/편안한 상태 확인 차이를 적습니다.
- Shared component strategy: 재사용할 screen/feature/widget/form/data-grid/status/empty/error 패턴을 적습니다.
- 색상 역할: hex나 외부 palette가 아니라 `canvas`, `surface`, `primary`, `danger`, `muted`, `border` 같은 역할로만 기록합니다.
- route별 세부 route shell은 각 generated route/page delivery spec의 `디자인 정렬`에 기록합니다. reusable UI의 실제 화면 러프와 리듬 계약은 Screen/Feature planning spec에 기록하고 service spec은 경로만 참조합니다.
- backend/codegen-only처럼 UI 영향이 없으면 `no UI design impact`와 사유를 기록합니다.

### Spec 참조 맵

service delivery spec은 하위 spec으로 갈 계약을 복제하지 않고 참조 맵을 작성합니다.

- 서비스 수준의 주요 상태와 사용자 여정은 텍스트/표로 요약합니다.
- route/page별 화면 출력물은 route/page spec 경로와 section만 참조합니다.
- Screen/Feature의 props/event, 화면 러프, 상태별 렌더링은 Screen/Feature planning spec 경로와 section만 참조합니다.
- 참조 표에는 `owner spec`, `section/row id`, `소유 계약`, `소비 spec`, `비고`를 포함합니다.
- 사용자에게 보이는 일반 텍스트는 한국어로 작성하고, 컴포넌트명/경로/key만 원문을 유지합니다.

### 생성된 Route/Page Spec

승인된 service delivery spec에서 생성하거나 갱신할 route/page delivery spec 목록을 기록합니다.

| route/page spec | 플랫폼 | route 파일 | 역할 | 생성/갱신 | 상위 service spec | 담당 `agent_type` | 비고 |
|-----------------|--------|------------|------|-----------|---------------------|-------------------|------|

- service spec approval 전에는 route/page spec을 생성하지 않습니다.
- route/page spec에는 상위 service spec 경로와 service-level 계약 참조를 반드시 기록합니다.
- route/page spec이 service spec과 다르게 확장되어야 하면 route/page spec을 먼저 고치지 말고 service spec을 먼저 갱신합니다.

### Screen/Feature Spec 인덱스

승인된 service delivery spec에서 생성하거나 갱신할 Screen/Feature planning spec 목록을 기록합니다.

| planning spec | 계층 | 소스/대상 컴포넌트 | 생성/갱신 | 참조 route/page spec | 소스 담당 `agent_type` | 비고 |
|---------------|------|--------------------|-----------|----------------------|-------------------------|------|

- 신규/수정 reusable Screen/Feature가 있으면 planning spec을 반드시 생성/갱신합니다.
- 변경되는 Feature가 없으면 `planning spec`에 `none-current`, 비고에 사유를 적습니다.
- Screen/Feature planning spec은 실행 그래프나 approval gate를 소유하지 않습니다.

### 산출물 시뮬레이션 / 인계 계약

실행 전에 subagent별 산출물을 예상하고, 다음 직렬 step이 어떤 경로를 읽어야 하는지 기록합니다.

| step id | phase | 담당 `agent_type` | 입력 spec/파일 | 예상 산출물 | 생성/수정 예정 경로 | 소비 step / `agent_type` | 인계 조건 | 검증 기준 |
|---------|-------|-------------------|----------------|-------------|----------------------|---------------------------|-----------|-----------|

- `예상 산출물`에는 spec, source, generated output, story, test, seed, config, route file, bootstrap wiring 등 다음 step이 소비할 단위를 적습니다.
- `생성/수정 예정 경로`는 다음 subagent가 바로 열 수 있는 구체 경로여야 합니다. 아직 파일명이 확정되지 않은 경우에도 생성 폴더와 파일명 규칙을 함께 적습니다.
- `소비 step / agent_type`에는 이 산출물을 읽어야 하는 다음 step을 적습니다. 여러 소비자가 있으면 쉼표로 분리합니다.
- `인계 조건`에는 이전 step 완료 보고에서 확인해야 할 값, 생성된 operationId, export name, generated hook name, component name, test file path 같은 handoff key를 적습니다.
- `검증 기준`은 이 row가 실제 산출물로 존재하는지 확인할 명령, grep, typecheck, test, codegen 기준을 적습니다.
- route/page spec과 Screen/Feature planning spec을 생성하는 `orch-delivery` step도 산출물 row를 가져야 하며, approval 후 생성될 spec 경로를 먼저 기록합니다.
- delete/cleanup step은 삭제 대상 경로와 다음 step 영향 없음 사유를 기록하고, 소비 step은 `none-cleanup`으로 둡니다.

### 에이전트 배정 매트릭스

각 row는 아래 필드를 가져야 합니다.

- step id
- phase
- 담당 `agent_type`
- 입력 파일
- 출력 파일 또는 generated output 경로
- 수정 허용 파일
- 의존 step
- 소비 step
- 산출물 시뮬레이션 row id
- `parallel: true | false`
- 완료 조건

service delivery spec의 matrix는 서비스 전체 build order를 소유합니다.
generated route/page spec의 matrix는 해당 route/page slice에서 leaf agent가 실행할 세부 파일 범위를 소유합니다.
Screen/Feature planning spec은 matrix를 소유하지 않고 route/page spec의 입력 파일로 참조됩니다.

### 실행 그래프

필요 없는 phase는 생략하되, 생략 이유를 기록합니다.
실행 순서는 사람이 한눈에 읽을 수 있도록 `시각 실행 흐름`, `병렬 그룹 표`, `단계 순서 표`를 함께 작성합니다.

#### 시각 실행 흐름

- Mermaid `flowchart TD`로 작성합니다.
- 모든 node label은 `step id + agent_type + 산출물`을 짧게 표시합니다.
- service spec approval node 이후에 route/page spec generation node와 필요한 Screen/Feature planning spec generation node를 둡니다.
- 직렬 의존은 화살표로 연결합니다.
- 병렬 가능한 step은 `subgraph P1["parallel: ..."]`처럼 병렬 그룹으로 묶습니다.
- 병렬 그룹은 `에이전트 배정 매트릭스`에서 `parallel: true`이고 수정 허용 파일이 겹치지 않는 step만 포함합니다.
- skipped phase는 그래프에 넣지 않고, 바로 아래 `Skipped Phase`에 사유를 적습니다.
- shared file lock이 있는 step은 label에 `lock: <file>`을 짧게 표시합니다.

#### 병렬 그룹 표

| 그룹 | 병렬 step | 병렬 가능 사유 | 공유 파일 lock | 합류 step |
|------|-----------|----------------|----------------|-----------|

#### 단계 순서 표

| 순서 | step id | phase | `agent_type` | 직렬/병렬 | 의존 step | 입력 산출물 row | 산출물 row | 완료 조건 |
|------|---------|-------|--------------|-----------|-----------|------------------|------------|-----------|

### 테스트 인벤토리 / 검증 에이전트

구현 전에 어떤 테스트가 어떤 위험을 막는지, 누가 작성하고 누가 검증하는지를 표로 정리합니다.

- `단위 테스트 인벤토리`: scanner, registry, component, feature, route-local util/state, bridge 단위 테스트를 기록합니다.
- `E2E 테스트 인벤토리`: 사용자 journey, empty/error/recovery, query deep link, long text/narrow viewport 같은 브라우저 검증을 기록합니다.
- `정적 검증 / 금지 grep`: Storybook 금지, observer 패턴, `useMemo`/`useCallback` 금지, scope 금지, unsafe exec 금지를 기록합니다.
- `테스트 검증 agent 표`: `qa-fe-testing`, `qa-fe-e2e-testing`, `qa-type-checker`, 필요한 경우 `orch-delivery` spec guard가 어떤 row를 최종 확인하는지 기록합니다.
- 테스트 row가 없는 신규 UI 산출물은 QA 기준을 승인할 수 없습니다.

### QA / 승인 기준

- service-level acceptance criteria
- route별 acceptance criteria
- backend unit/e2e
- web unit/story/e2e
- mobile unit/story/e2e
- typecheck/codegen 검증
- empty/loading/error/permission/long text/narrow viewport/mobile safe area 검증
- spec 갱신 / 재실행 기준

## 5. 생성된 Route/Page Delivery Spec 규칙

각 route/page delivery spec은 기존 route spec 형식을 유지하되 상위 service spec과 하위 Screen/Feature planning spec을 명확히 참조합니다.

```text
## 딜리버리
### 상위 서비스 Spec
### 목표
### Screen/Feature Spec 참조
### 디자인 정렬
### Route Shell / 조합 러프
### Route-local 상태 / 이벤트
### 컴포넌트 인벤토리
### 기반 Slice
### Storybook / 테스트 계약
### 백엔드 / API Slice
### 필수 요소
### 에이전트 배정 매트릭스
### 실행 그래프
### 공유 파일 잠금
### 산출물 시뮬레이션 / 인계 계약
### 테스트 인벤토리 / 검증 에이전트
### QA / 승인 기준
```

- `상위 서비스 Spec`에는 `docs/services/{service-name}.delivery.spec.md` 경로와 관련 service step id를 기록합니다.
- `목표`는 해당 route/page의 목적과 성공 기준만 적습니다.
- `Screen/Feature Spec 참조`에는 route가 소비하거나 생성/수정하는 Screen/Feature planning spec 경로, section/row id, 소유 계약을 기록합니다. 변경되는 Feature가 없으면 `none-current`와 사유를 적습니다.
- `디자인 정렬`과 `Route Shell / 조합 러프`는 `DESIGN.md`와 service spec의 `DESIGN.md 기반 디자인 방향`을 route 단위로 구체화하되, reusable Screen/Feature의 상세 화면 러프는 planning spec을 참조합니다.
- `컴포넌트 인벤토리`에는 route가 무엇을 렌더링/조합하는지 적고, props/event/상태별 렌더링 상세는 Screen/Feature planning spec을 참조합니다.
- 신규/수정 Screen/Feature planning spec에는 재사용 검토, 생성 폴더, 재활용 컴포넌트, 신규 조합 의존, 이름 기준, 출력물, 필수 상태를 기록합니다.
- `기반 Slice`와 `백엔드 / API Slice`에는 service spec의 전체 계약 중 해당 route가 직접 소비하는 hook/type/store/API/operationId만 기록합니다.
- route/page spec은 service-level backend build order를 다시 소유하지 않습니다.
- route-local hook/util/type/state는 Web/Mobile 모두 `fe-route-agent` row로 기록하고 별도 spec을 만들지 않습니다.
- route `page.tsx`, Expo route file, `layout.tsx`, `_layout.tsx`, Store, backend-only step은 Storybook 대상이 아니며 필요한 unit/E2E 검증만 spec에 기록합니다.
- route/page spec의 `테스트 인벤토리 / 검증 에이전트`는 service spec의 테스트 row 중 해당 route slice가 직접 작성/실행할 테스트만 참조/기록하고, 검증 agent_type을 비워두지 않습니다.
- route/page spec의 `산출물 시뮬레이션 / 인계 계약`에는 route slice 내부에서 생성/수정할 route file, route-local hook/state/util, Screen/Feature planning spec, story/test/E2E, 소비 API/generated hook 경로를 기록합니다.
- route/page leaf subagent는 이 계약에 있는 경로만 수정하고, 다음 subagent는 완료 보고가 아니라 이 계약 row를 기준으로 산출물을 찾습니다.
- E2E가 현재 불필요하거나 인프라가 없으면 row를 생략하지 말고 `E2E 파일`에 `none-current`, `비고`에 생략/blocked 사유를 적습니다.

---

## 6. 승인 Gate

service delivery spec 작성/갱신 후 route/page spec 또는 Screen/Feature planning spec 생성, subagent/QA subagent 호출 전에 반드시 approval gate를 엽니다.
승인 전에는 route/page spec을 생성하지 않고 backend/web/mobile/QA agent를 호출하지 않습니다.
사용자가 spec 수정을 요청하면 같은 service delivery spec을 보강한 뒤 다시 approval gate를 엽니다.

Codex 질문 도구 문구:

```text
작성한 서비스 spec 기준으로 route/page spec과 필요한 Screen/Feature planning spec을 생성하고 개발을 시작할까요?

선택지:
- 진행: 승인된 service spec 기준으로 route/page spec과 Screen/Feature planning spec 생성 후 구현 시작
- spec 수정: 수정 요청을 반영하고 다시 확인
- 중단: route/page spec, Screen/Feature planning spec 생성과 구현 없이 멈춤
```

---

## 7. 실행 원칙

- service delivery spec의 `에이전트 배정 매트릭스`와 `실행 그래프`, `생성된 Route/Page Spec`, `Screen/Feature Spec 인덱스`에 연결된 spec만 실행합니다.
- service delivery spec과 route/page delivery spec의 `산출물 시뮬레이션 / 인계 계약`에 없는 산출물 경로는 다음 직렬 step의 입력으로 넘기지 않습니다.
- service delivery spec에 없는 route/page spec, Screen/Feature planning spec, `agent_type`, 파일은 생성하거나 수정하지 않습니다.
- route/page delivery spec에 없는 파일은 leaf agent가 수정하지 않습니다.
- route/page spec 또는 Screen/Feature planning spec이 필요하지만 누락되어 있으면 구현하지 말고 service spec 보강 필요성을 최종 보고에 남깁니다.
- `parallel=auto`여도 spec row의 `parallel: true`이고 수정 허용 파일이 겹치지 않는 step만 병렬 실행합니다.
- shared file lock은 service spec과 route/page spec의 `공유 파일 잠금`를 따릅니다.
- backend/API 변경 후 service spec에 codegen step이 있으면 web/mobile wiring 전에 codegen을 실행합니다.
- 완료 보고에는 실행한 service step id, route/page step id, 산출물 row id, 참조한 Screen/Feature planning spec, agent_type, 변경 파일, 실제 산출물 경로, 검증 결과, 재실행 필요 여부를 포함합니다.

---

## 8. 실행 이슈 처리

- 실행 agent는 승인된 spec과 ownership boundary 밖으로 작업을 확장하지 않습니다.
- 이슈가 생기면 최종 보고에 변경 파일, 검증 결과, 중단 사유, 필요한 후속 작업을 사람이 확인할 수 있게 남깁니다.
- spec 보강, phase 재실행, agent 재배정, 차단 처리는 사용자가 최종 보고와 diff를 검증한 뒤 결정합니다.

---

## 9. 완료 조건

- service spec의 required step이 완료되거나 명시적으로 blocked 처리되어야 합니다.
- `생성된 Route/Page Spec`의 route/page spec이 모두 생성/갱신되어야 합니다. route가 없는 서비스는 `no route surface` 사유가 기록되어야 합니다.
- `Screen/Feature Spec 인덱스`의 필수 planning spec이 모두 생성/갱신되어야 합니다. 변경되는 Screen/Feature가 없으면 `none-current` 사유가 기록되어야 합니다.
- 모든 실행 step의 `산출물 시뮬레이션 / 인계 계약` row가 실제 산출물 경로 또는 명시적 blocked/cleanup 사유로 닫혀야 합니다.
- required QA/Acceptance 검증이 통과해야 합니다.
- stale agent_type, spec에 없는 파일 변경, shared lock 위반, spec 간 복제 중복이 없어야 합니다.

---

## 10. 금지

- 별도 planning role을 호출하지 않습니다.
- 별도 Delivery Plan 파일을 만들지 않습니다.
- service spec approval 전 route/page spec 또는 Screen/Feature planning spec을 생성하지 않습니다.
- service spec에 없는 route/page/spec 파일과 Screen/Feature planning spec 파일을 임의 생성하지 않습니다.
- `산출물 시뮬레이션 / 인계 계약`에 없는 파일을 다음 subagent의 입력 산출물로 암묵 전달하지 않습니다.
- Screen/Feature planning spec에 `에이전트 배정 매트릭스`, `실행 그래프`, backend build order, foundation 세부 실행표, approval gate를 넣지 않습니다.
- agent가 결정해야 할 세부 구현 규칙이나 상위/하위 spec이 이미 소유한 계약을 다른 spec에 복제하지 않습니다.
- approval gate 전에는 route/page spec 생성, Screen/Feature planning spec 생성, subagent 호출, QA subagent 호출을 하지 않습니다.
- 하위호환 wrapper, deprecated 경로, 임시 fallback API를 계획하지 않습니다.
