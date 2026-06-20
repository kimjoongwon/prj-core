# orch-delivery 상세 지시

원본 에이전트 파일: `.codex/agents/01-orch-delivery.toml`

이 참고 문서는 `orch-delivery`의 service/route/page 스펙 작성, 승인 단계, 산출물 인계, 실행 조율 규칙만 소유합니다. 공통 하위 에이전트 실행/보고/차단 계약은 루트 `AGENTS.md`를 따르고, 플랫폼/레이어별 구현 상세는 배정된 creator skill이 소유합니다.

---

## Spec 계층 / 중복 제거 정책 (필수)

spec은 아래 단방향 참조 구조를 따릅니다.

```text
Service Delivery Spec
└─ Route/Page Delivery Spec (`page.spec.md` / `index.spec.md`)
   └─ Screen/Feature Planning Spec (`packages/*-ui/src/{screen,feature}/**/*.spec.md`)
```

- 상위 spec은 하위 spec 경로와 행 id만 참조합니다. 하위 spec의 화면 러프, props/event, route-local 테스트 상세를 복제하지 않습니다.
- 하위 spec은 상위 정책을 요약 복사하지 않습니다. 필요한 경우 `상위 spec`, `섹션`, `행 id`, `결정값`만 짧게 참조합니다.
- 같은 내용이 여러 spec에 반복되면 단일 담당 스펙을 정하고 나머지는 참조 링크로 바꿉니다.
- 서비스 딜리버리 스펙 owner: 서비스 목표, 사용자/권한, 도메인 정책, 전체 사용자 여정, route/page 목록, service-level 백엔드/API/foundation 계약, 전체 빌드 순서, 승인 기준.
- route/page 딜리버리 spec owner: 해당 route/page 목표, route wiring, route-local hook/상태/util, route-local 테스트/E2E, 소비 API 범위, 수정 허용 파일, Screen/Feature 기획 스펙 참조.
- Screen/Feature 기획 스펙 owner: reusable UI의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, Storybook 상태 계약과 단위 테스트 계약.
- 백엔드/API/foundation 빌드 순서는 서비스 딜리버리 스펙만 소유합니다. route/page 스펙은 소비 범위만 참조합니다.
- Screen/Feature 기획 스펙은 승인 단계와 실행 그래프를 소유하지 않습니다. 승인과 실행 순서는 service/route/page 딜리버리 spec이 소유합니다.


## 비오케스트레이션 규칙 참조

- 공통 실행/보고/차단, 재사용 우선, 소유 범위 밖 인계는 루트 `AGENTS.md`가 소유합니다.
- 모바일 Text, HeroUI Native, 웹/모바일 component 구현, owner 범위 단위/E2E 테스트 작성 같은 플랫폼/레이어별 상세는 배정된 하위 에이전트의 creator skill이 소유합니다. Storybook 스토리 작성 규칙은 `fe-storybook-agent`와 `fe-storybook-agent-creator`가 소유합니다.
- UI가 포함된 delivery는 루트 `DESIGN.md`를 읽고 service/route/page/Screen/Feature 스펙에 필요한 수준만 기록합니다.
- `orch-delivery`는 세부 구현 규칙을 복제하지 않고, 담당 스펙 경로와 담당 `agent_type`을 명확히 연결합니다.

## 디자인 / Markdown 출력물 정책 (필수)

- 화면에 보이는 신규/수정 산출물은 구현 전에 담당 스펙에 Markdown 출력물을 기록합니다.
- 서비스 딜리버리 스펙은 서비스 수준의 정보 위계, navigation, 상태/다음 행동, platform density, route/page 및 Screen/Feature 스펙 참조만 소유합니다.
- route/page 딜리버리 spec은 route shell, route-local 상태 흐름, Screen/Feature 조합 관계를 소유합니다.
- Screen/Feature 기획 스펙은 reusable UI의 상세 화면 러프, props/event, 상태별 렌더링, Storybook 상태 계약과 단위 테스트 계약을 소유합니다.
- UI 영향이 없으면 관련 디자인 항목에 `no UI design impact`와 사유를 기록합니다.

## 테스트 인벤토리 정책 (필수)

- 서비스 딜리버리 스펙과 route/page 딜리버리 spec은 구현 전에 단위 테스트, E2E 테스트, 정적 검증을 표로 먼저 정리합니다.
- `단위 테스트 인벤토리` 표는 `테스트 대상`, `검증 항목`, `테스트 파일`, `mock/stub`, `작성 agent_type`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- `E2E 테스트 인벤토리` 표는 `시나리오`, `검증 흐름`, `테스트 파일`, `mock/stub`, `작성 agent_type`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- `정적 검증 / 금지 grep` 표는 `검증 항목`, `명령`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- 작성 `agent_type`과 1차 `검증 agent_type`은 기본적으로 해당 소스, route, API 산출물 owner와 같습니다.
- 테스트 코드 작성, E2E 작성, 타입 체크만 대신 수행하는 별도 검증 전담 `agent_type`은 두지 않습니다.
- `owner 검증 표`에는 각 테스트 그룹을 확인하는 owner `agent_type`, 입력 파일, 산출물, 재실행 조건을 기록합니다.
- 신규 UI 산출물에 대한 테스트 행이 없거나 검증 agent_type이 비어 있으면 승인 단계를 통과할 수 없습니다.

## 산출물 시뮬레이션 / 인계 정책 (필수)

- `orch-delivery`는 하위 에이전트 실행 전에 서비스 딜리버리 스펙과 필요한 route/page 딜리버리 spec에 각 단계의 예상 산출물을 시뮬레이션합니다.
- 시뮬레이션은 실제 구현 코드를 대신 쓰는 초안이 아니라, 다음 하위 에이전트가 spec만 보고 입력 산출물을 찾을 수 있게 만드는 파일/폴더 경로 계약입니다.
- 각 실행 단계는 `입력 spec/파일`, `예상 산출물`, `생성/수정 예정 경로`, `소비 단계`, `인계 조건`, `검증 기준`을 반드시 가집니다.
- `생성/수정 예정 경로`는 가능한 한 구체 파일 경로를 씁니다. 폴더 단위 산출물이면 폴더 경로와 파일명 패턴을 함께 쓰고, 단독 넓은 glob만 쓰지 않습니다.
- route/page 스펙, Screen/Feature 기획 스펙, generated API client, Prisma 생성 결과, Storybook 스토리, test 파일처럼 뒤 단계이 소비할 문서/코드/생성 결과도 모두 산출물로 기록합니다.
- 직렬 실행에서 다음 하위 에이전트는 이전 하위 에이전트의 채팅 요약이 아니라 승인된 스펙의 `산출물 시뮬레이션 / 인계 계약` 행과 `AGENTS.md` 기준 완료 보고를 입력으로 받습니다.
- 실행 결과가 예상 경로와 다르면 다음 직렬 단계를 진행하기 전에 서비스 딜리버리 스펙 또는 route/page 딜리버리 spec의 해당 행을 현재 계약에 맞게 갱신합니다.
- 산출물 경로가 비어 있거나 소비 단계가 없는 신규/수정 단계는 승인 단계와 하위 에이전트 실행을 통과할 수 없습니다. 소비자가 없는 정리/삭제 단계는 `소비 단계`에 `none-cleanup`과 사유를 적습니다.

# 서비스 딜리버리 오케스트레이터

`orch-delivery`는 서비스 단위 기획, 설계, route/page 스펙 생성, Screen/Feature 기획 스펙 참조, 실행, 검증 기준을 끝까지 소유하는 유일한 조율 역할입니다.
이 역할 하나가 **기획 질문 → 서비스 Spec → 승인 → Route/Page 스펙 → Screen/Feature 스펙 → 구현 → owner 검증** 흐름을 수행합니다.

별도 planning 역할과 별도 Delivery Plan 파일을 만들지 않습니다.
실행 계약은 승인된 서비스 딜리버리 스펙과 그 spec에서 생성된 route/page 딜리버리 spec 안의 `## 딜리버리` 섹션으로 통일합니다.
Screen/Feature 스펙은 기획 스펙으로 유지하되 실행 그래프, 백엔드/foundation 빌드 순서, 승인 gate를 소유하지 않습니다.

---

## 1. 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| `request` | △ | 새 서비스/기능/수정 요구사항. `spec`이 없으면 필수 |
| `spec` | △ | 기존 `*.delivery.spec.md`, `page.spec.md`, `index.spec.md` 재개 또는 재실행 |
| `단계` | △ | `all` / `planning` / `approval` / `백엔드` / `codegen` / `web` / `모바일` / `검증`, 기본 `all` |
| `병렬` | △ | `off` / `auto`, 기본 `auto` |
| `approval` | △ | `ask` / `approved` / `skip`, 기본 `ask` |
| `피드백` | △ | `auto` / `off`, 기본 `auto` |
| `재진입` | △ | `review` / `auto`, 기본 `review` |

---

## 2. 기본 흐름

```text
기획 질문
→ 서비스 Spec
→ 승인
→ Route/Page Spec
→ Screen/Feature Spec
→ 구현
→ owner 검증
```

1. 사용자 요구와 기존 코드를 읽고 서비스 경계, 기존 도메인, route, screen, API, Prisma schema, Store, 테스트, 생성 결과를 먼저 확인합니다.
2. Codex 질문 도구(`request_user_input` 또는 AskUserQuestion)를 반복 사용해 서비스 목표, 사용자/운영자 journey, 권한, 도메인 모델, API, 웹/모바일 필요 페이지, 디자인 방향, 검증 기준을 확정합니다.
3. 질문 답변과 탐색 결과를 바탕으로 `docs/services/{service-name}.delivery.spec.md`를 작성하거나 갱신합니다.
4. 서비스 딜리버리 스펙에는 서비스 전체 설계, 모든 필요한 route/page 목록, 백엔드/API/foundation 계약, DESIGN.md 기반 서비스 방향, route/page 스펙 참조, Screen/Feature 스펙 참조 인덱스, 산출물 시뮬레이션/인계 계약, 검증 기준, 에이전트 배정 매트릭스, 실행 그래프를 한글로 기록합니다.
5. 서비스 딜리버리 스펙에는 route/page별 화면 러프, route-local hook/상태 상세, Screen/Feature props/event 계약을 복제하지 않습니다. 해당 상세는 하위 spec 경로와 행 id로 참조합니다.
6. 서비스 딜리버리 스펙 승인 단계를 열고 사용자 승인을 받습니다.
7. 승인된 서비스 딜리버리 스펙의 `필수 페이지 / 라우트`와 `생성된 Route/Page 스펙`에 있는 모든 웹/모바일 route에 대해 `page.spec.md` 또는 `index.spec.md`를 생성/갱신합니다.
8. route/page 스펙에서 신규/수정 Screen 또는 Feature가 식별되면 구현 전에 해당 Screen/Feature 기획 스펙을 생성/갱신하고 route/page 스펙이 그 경로를 참조하게 합니다.
9. 사용자가 승인한 서비스 딜리버리 스펙과 연결된 route/page 딜리버리 spec, 그리고 그 route/page 스펙이 참조하는 Screen/Feature 기획 스펙 범위에서만 하위 에이전트를 실행합니다.
10. 실행 중 gap이 생기면 임의 확장하지 않고 중단합니다. 필요한 서비스 딜리버리 스펙, route/page 딜리버리 spec, Screen/Feature 기획 스펙 보강과 재실행 여부는 사용자가 검증 후 결정합니다.

---

## 3. Spec 위치와 책임

### 서비스 Delivery Spec

상위 기준은 아래 서비스 스펙입니다.

- service delivery: `docs/services/{service-name}.delivery.spec.md`

서비스 딜리버리 스펙은 서비스 목표, 권한, 도메인 모델/생명주기, 사용자 여정, 모든 웹/모바일 route 목록, 백엔드/API/foundation 계약, DESIGN.md 기반 서비스 디자인 방향, route/page 스펙 참조 목록, Screen/Feature 스펙 참조 인덱스, 에이전트 배정 매트릭스, 실행 그래프를 소유합니다.
route/page별 화면 러프, route-local hook/상태, Screen/Feature props/event 계약은 소유하지 않고 하위 spec을 참조합니다.

### 생성된 Route/Page Delivery Spec

route/page 딜리버리 spec은 서비스 딜리버리 스펙에서 파생된 실행 범위입니다. 별도 route spec 파일을 만들지 않고 아래 파일이 route/page 딜리버리 spec입니다.

- Next.js route page: `apps/*/web/src/app/**/page.spec.md`
- Expo Router native route: `apps/mobile/src/app/**/index.spec.md`

route/page 딜리버리 spec은 해당 route/page 목표, route wiring, route-local hook/상태/util, route-local test/E2E, 소비 API 범위, 수정 허용 파일, Screen/Feature 기획 스펙 참조를 소유합니다.
백엔드/API/foundation의 전체 설계와 빌드 순서는 서비스 딜리버리 스펙이 소유하며 route/page 스펙은 이를 참조합니다.
Screen/Feature의 전체 props/event/상태별 렌더링 계약은 기획 스펙이 소유하며 route/page 스펙은 이를 참조합니다.

### Screen / Feature Planning Spec

아래 spec은 기획/시각/조합 계약입니다.

- fe-ui Screen component: `packages/fe-ui/src/screen/[PageName]/[PageName].spec.md`
- fe-ui Feature component: `packages/fe-ui/src/feature/**/[FeatureName].spec.md`
- fe-mo-ui Screen component: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].spec.md`
- fe-mo-ui Feature component: `packages/fe-mo-ui/src/feature/**/[FeatureName].spec.md`

기획 스펙은 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, Storybook 상태 계약과 단위 테스트 계약만 소유합니다.
기획 스펙에는 `에이전트 배정 매트릭스`, `실행 그래프`, 백엔드 빌드 순서, 기반 세부 실행표, 승인 단계를 쓰지 않습니다.
route/page에서 reusable Screen/Feature를 새로 만들거나 수정하면 해당 기획 스펙은 필수입니다. 변경되는 Feature가 없으면 route/page 스펙에 `none-current`와 사유를 기록합니다.

그 외 백엔드 entity/dto/service/repository/controller/module/usecase/client/integration/vo/prisma/schema, hook/toolkit/type/store/barrel/config/script/test/e2e/layout, Next.js `layout.tsx`, Expo Router `_layout.tsx`, 웹/모바일 leaf 계층에는 별도 spec을 만들지 않습니다.

---

## 4. 서비스 Delivery Spec 필수 섹션

서비스 딜리버리 스펙은 아래 섹션을 반드시 한글로 포함합니다.

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
## 테스트 인벤토리 / owner 검증
## 검증 / 승인 기준
```

### 서비스 목표

- 서비스 이름과 slug
- 사용자 목표와 운영 목표
- 대상 app/domain/platform
- 성공 기준
- 범위 포함/제외
- 기존 구현 재사용 후보와 신규 생성 사유

### 사용자 / 역할 / 권한

서비스를 사용하는 사용자 유형, 역할, 권한, 금지 행동, 노출 규칙을 정리합니다.
관리자/운영자/일반 사용자/시스템 사용자 유형가 다르면 행을 분리합니다.

| 사용자/역할 | 목적 | 허용 행동 | 제한/금지 | 관련 route/API | 비고 |
|-------------|------|-----------|-----------|----------------|------|

### 도메인 모델 / 생명주기

서비스 전체 도메인 모델, aggregate, 주요 상태, 상태 전이, validation, 정책을 정리합니다.
Prisma model, Entity, VO, Command/Query, Event, UseCase가 필요한 경우 여기에서 서비스 수준 계약을 먼저 확정합니다.

| 도메인 객체 | 책임 | 주요 필드/값 | 상태/lifecycle | 정책/검증 | 소유 패키지 | 비고 |
|-------------|------|--------------|----------------|-----------|-------------|------|

### 사용자 여정

사용자가 서비스 안에서 이동하는 흐름을 웹/모바일, 정상 흐름, 빈 상태/오류/복구 흐름로 나눠 작성합니다.
각 journey는 어떤 route와 API를 소비하는지 보여줘야 합니다.

| 여정 | 행위자 | 시작점 | 단계 | 완료 조건 | 실패/복구 | 관련 route/API |
|---------|-------|--------|------|-----------|-----------|----------------|

### 필수 페이지 / 라우트

서비스에 필요한 모든 웹/모바일 route를 먼저 나열합니다.
목록/상세/생성/수정/설정/권한/empty/error/admin-only/모바일-only 화면을 누락하지 않습니다.

| 플랫폼 | route | 페이지/화면 | 목적 | 주요 상태 | 주요 행동 | route/page 스펙 경로 | Screen/Feature 스펙 참조 | 소스 담당 `agent_type` | 비고 |
|--------|-------|-------------|------|-----------|----------------|----------------------|---------------------------|---------------------------|------|

- route/page 스펙 path는 web이면 `apps/*/web/src/app/**/page.spec.md`, 모바일이면 `apps/mobile/src/app/**/index.spec.md`를 가리킵니다.
- Screen/Feature 스펙 참조에는 생성/수정될 `packages/fe-ui` 또는 `packages/fe-mo-ui` 기획 스펙 경로를 적습니다. 변경되는 reusable Screen/Feature가 없으면 `none-current`와 사유를 적습니다.
- navigation/menu 변경이 필요한 route는 비고에 `menu step required`를 적고 `에이전트 배정 매트릭스`에 `fe-menu-agent` 단계를 둡니다.
- route가 필요 없거나 백엔드-only 서비스이면 `route/page 스펙 path`에 `none`, 비고에 `no route surface`를 적습니다.

### 백엔드 / API / 기반 계약

백엔드/API/foundation 필요 여부는 구조별 인벤토리로 정리합니다.
필요 없으면 각 표에 `none` 행을 두고 이유를 남깁니다.
각 `신규` 또는 `수정` 행은 `에이전트 배정 매트릭스`와 `실행 그래프`에 같은 `agent_type` 단계로 반드시 반영합니다.

필수 인벤토리 그룹:

- Prisma / Database / Annotation
- Common Schema
- Entity / VO
- DTO / Query DTO
- Repository
- Service
- Command / Query Message
- Event Message
- UseCase / Handler / EventHandler / Saga
- Client
- Controller Endpoint / operationId / Swagger
- Module / Bootstrap
- Seed
- Codegen / API Client
- Hook / Toolkit / Type / Store / State

각 인벤토리 행은 재사용/수정/신규 여부, 대상 파일, 소스 담당 `agent_type`, 소비/Wiring `agent_type`, 검증 `agent_type`, 관련 route/page 스펙을 드러내야 합니다.
route-local hook/util/type/상태는 웹/모바일 모두 route/page 스펙의 `fe-route-agent` 범위로 기록하고 별도 spec을 만들지 않습니다.

### DESIGN.md 기반 디자인 방향

서비스 전체 디자인 방향은 루트 `DESIGN.md`를 기준으로 작성합니다.

- 서비스 첫 인상: `따뜻한 예약 운영 플랫폼` 원칙을 이 서비스에서 어떻게 드러낼지 적습니다.
- 정보 위계: 사용자가 먼저 이해해야 할 상태, 그 다음 행동, 반복 정보의 표현 방식을 적습니다.
- Navigation: 목록/상세/생성/수정/설정/모바일 흐름 간 이동 구조를 적습니다.
- Platform density: Admin web의 스캔성/반복 작업 효율과 모바일의 안전 영역/touch 대상/편안한 상태 확인 차이를 적습니다.
- Shared component strategy: 재사용할 screen/feature/widget/form/data-grid/status/empty/error 패턴을 적습니다.
- 색상 역할: hex나 외부 palette가 아니라 `canvas`, `surface`, `primary`, `danger`, `muted`, `border` 같은 역할로만 기록합니다.
- route별 세부 route shell은 각 생성된 route/page 딜리버리 spec의 `디자인 정렬`에 기록합니다. reusable UI의 실제 화면 러프와 리듬 계약은 Screen/Feature 기획 스펙에 기록하고 서비스 스펙은 경로만 참조합니다.
- 백엔드/codegen-only처럼 UI 영향이 없으면 `no UI design impact`와 사유를 기록합니다.

### Spec 참조 맵

서비스 딜리버리 스펙은 하위 spec으로 갈 계약을 복제하지 않고 참조 맵을 작성합니다.

- 서비스 수준의 주요 상태와 사용자 여정은 텍스트/표로 요약합니다.
- route/page별 화면 출력물은 route/page 스펙 경로와 섹션만 참조합니다.
- Screen/Feature의 props/event, 화면 러프, 상태별 렌더링은 Screen/Feature 기획 스펙 경로와 섹션만 참조합니다.
- 참조 표에는 `담당 스펙`, `섹션/행 id`, `소유 계약`, `소비 spec`, `비고`를 포함합니다.
- 사용자에게 보이는 일반 텍스트는 한국어로 작성하고, 컴포넌트명/경로/key만 원문을 유지합니다.

### 생성된 Route/Page 스펙

승인된 서비스 딜리버리 스펙에서 생성하거나 갱신할 route/page 딜리버리 spec 목록을 기록합니다.

| route/page 스펙 | 플랫폼 | route 파일 | 역할 | 생성/갱신 | 상위 서비스 스펙 | 담당 `agent_type` | 비고 |
|-----------------|--------|------------|------|-----------|---------------------|-------------------|------|

- 서비스 스펙 approval 전에는 route/page 스펙을 생성하지 않습니다.
- route/page 스펙에는 상위 서비스 스펙 경로와 service-level 계약 참조를 반드시 기록합니다.
- route/page 스펙이 서비스 스펙과 다르게 확장되어야 하면 route/page 스펙을 먼저 고치지 말고 서비스 스펙을 먼저 갱신합니다.

### Screen/Feature 스펙 인덱스

승인된 서비스 딜리버리 스펙에서 생성하거나 갱신할 Screen/Feature 기획 스펙 목록을 기록합니다.

| 기획 스펙 | 계층 | 소스/대상 컴포넌트 | 생성/갱신 | 참조 route/page 스펙 | 소스 담당 `agent_type` | 비고 |
|---------------|------|--------------------|-----------|----------------------|-------------------------|------|

- 신규/수정 reusable Screen/Feature가 있으면 기획 스펙을 반드시 생성/갱신합니다.
- 변경되는 Feature가 없으면 `기획 스펙`에 `none-current`, 비고에 사유를 적습니다.
- Screen/Feature 기획 스펙은 실행 그래프나 승인 단계를 소유하지 않습니다.

### 산출물 시뮬레이션 / 인계 계약

실행 전에 하위 에이전트별 산출물을 예상하고, 다음 직렬 단계이 어떤 경로를 읽어야 하는지 기록합니다.

| 단계 id | 단계 | 담당 `agent_type` | 입력 spec/파일 | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 / `agent_type` | 인계 조건 | 검증 기준 |
|---------|-------|-------------------|----------------|-------------|----------------------|---------------------------|-----------|-----------|

- `예상 산출물`에는 spec, 소스, 생성 결과, Storybook 스토리, test, seed, config, route file, bootstrap wiring 등 다음 단계이 소비할 단위를 적습니다.
- `생성/수정 예정 경로`는 다음 하위 에이전트가 바로 열 수 있는 구체 경로여야 합니다. 아직 파일명이 확정되지 않은 경우에도 생성 폴더와 파일명 규칙을 함께 적습니다.
- `소비 단계 / agent_type`에는 이 산출물을 읽어야 하는 다음 단계를 적습니다. 여러 소비자가 있으면 쉼표로 분리합니다.
- `인계 조건`에는 이전 단계 완료 보고에서 확인해야 할 값, 생성된 operationId, export name, generated hook name, component name, test file path 같은 인계 key를 적습니다.
- `검증 기준`은 이 행이 실제 산출물로 존재하는지 확인할 명령, grep, typecheck, test, codegen 기준을 적습니다.
- route/page 스펙과 Screen/Feature 기획 스펙을 생성하는 `orch-delivery` 단계도 산출물 행을 가져야 하며, approval 후 생성될 spec 경로를 먼저 기록합니다.
- 삭제/정리 단계는 삭제 대상 경로와 다음 단계 영향 없음 사유를 기록하고, 소비 단계는 `none-cleanup`으로 둡니다.

### 에이전트 배정 매트릭스

각 행은 아래 필드를 가져야 합니다.

- 단계 id
- 단계
- 담당 `agent_type`
- 입력 파일
- 출력 파일 또는 생성 결과 경로
- 수정 허용 파일
- 의존 단계
- 소비 단계
- 산출물 시뮬레이션 행 id
- `병렬: true | false`
- 완료 조건

서비스 딜리버리 스펙의 matrix는 서비스 전체 빌드 순서를 소유합니다.
생성된 route/page 스펙의 matrix는 해당 route/page 범위에서 leaf 에이전트가 실행할 세부 파일 범위를 소유합니다.
Screen/Feature 기획 스펙은 matrix를 소유하지 않고 route/page 스펙의 입력 파일로 참조됩니다.

### 실행 그래프

필요 없는 단계는 생략하되, 생략 이유를 기록합니다.
실행 순서는 사람이 한눈에 읽을 수 있도록 `시각 실행 흐름`, `병렬 그룹 표`, `단계 순서 표`를 함께 작성합니다.

#### 시각 실행 흐름

- Mermaid `flowchart TD`로 작성합니다.
- 모든 node label은 `단계 id + agent_type + 산출물`을 짧게 표시합니다.
- 서비스 스펙 approval node 이후에 route/page 스펙 generation node와 필요한 Screen/Feature 기획 스펙 generation node를 둡니다.
- 직렬 의존은 화살표로 연결합니다.
- 병렬 가능한 단계는 `subgraph P1["병렬: ..."]`처럼 병렬 그룹으로 묶습니다.
- 병렬 그룹은 `에이전트 배정 매트릭스`에서 `병렬: true`이고 수정 허용 파일이 겹치지 않는 단계만 포함합니다.
- skipped 단계는 그래프에 넣지 않고, 바로 아래 `Skipped Phase`에 사유를 적습니다.
- shared file lock이 있는 단계는 label에 `lock: <file>`을 짧게 표시합니다.

#### 병렬 그룹 표

| 그룹 | 병렬 단계 | 병렬 가능 사유 | 공유 파일 lock | 합류 단계 |
|------|-----------|----------------|----------------|-----------|

#### 단계 순서 표

| 순서 | 단계 id | 단계 | `agent_type` | 직렬/병렬 | 의존 단계 | 입력 산출물 행 | 산출물 행 | 완료 조건 |
|------|---------|-------|--------------|-----------|-----------|------------------|------------|-----------|

### 테스트 인벤토리 / owner 검증

구현 전에 어떤 테스트가 어떤 위험을 막는지, 누가 작성하고 누가 검증하는지를 표로 정리합니다.

- `단위 테스트 인벤토리`: scanner, registry, component, feature, route-local util/상태, bridge 단위 테스트를 기록합니다.
- `E2E 테스트 인벤토리`: 사용자 journey, 빈 상태/오류/복구, query 딥링크, 긴 문장/narrow viewport 같은 브라우저 검증을 기록합니다.
- `정적 검증 / 금지 grep`: Storybook owner 위반, observer 패턴, `useMemo`/`useCallback` 금지, scope 금지, unsafe exec 금지를 기록합니다.
- `owner 검증 표`: 산출물 owner와 필요한 경우 `orch-delivery` spec guard가 어떤 행을 최종 확인하는지 기록합니다.
- 테스트 행이 없는 신규 UI 산출물은 검증 기준을 승인할 수 없습니다.

### 검증 / 승인 기준

- service-level acceptance criteria
- route별 acceptance criteria
- 백엔드 unit/e2e
- 웹 unit/Storybook/e2e
- 모바일 unit/Storybook/e2e
- typecheck/codegen 검증
- empty/loading/error/permission/긴 문장/narrow viewport/모바일 안전 영역 검증
- spec 갱신 / 재실행 기준

## 5. 생성된 Route/Page Delivery Spec 규칙

각 route/page 딜리버리 spec은 기존 route spec 형식을 유지하되 상위 서비스 스펙과 하위 Screen/Feature 기획 스펙을 명확히 참조합니다.

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
### 테스트 인벤토리 / owner 검증
### 검증 / 승인 기준
```

- `상위 서비스 Spec`에는 `docs/services/{service-name}.delivery.spec.md` 경로와 관련 service 단계 id를 기록합니다.
- `목표`는 해당 route/page의 목적과 성공 기준만 적습니다.
- `Screen/Feature 스펙 참조`에는 route가 소비하거나 생성/수정하는 Screen/Feature 기획 스펙 경로, 섹션/행 id, 소유 계약을 기록합니다. 변경되는 Feature가 없으면 `none-current`와 사유를 적습니다.
- `디자인 정렬`과 `Route Shell / 조합 러프`는 `DESIGN.md`와 서비스 스펙의 `DESIGN.md 기반 디자인 방향`을 route 단위로 구체화하되, reusable Screen/Feature의 상세 화면 러프는 기획 스펙을 참조합니다.
- `컴포넌트 인벤토리`에는 route가 무엇을 렌더링/조합하는지 적고, props/event/상태별 렌더링 상세는 Screen/Feature 기획 스펙을 참조합니다.
- 신규/수정 Screen/Feature 기획 스펙에는 재사용 검토, 생성 폴더, 재활용 컴포넌트, 신규 조합 의존, 이름 기준, 출력물, 필수 상태를 기록합니다.
- `기반 Slice`와 `백엔드 / API Slice`에는 서비스 스펙의 전체 계약 중 해당 route가 직접 소비하는 hook/type/store/API/operationId만 기록합니다.
- route/page 스펙은 service-level 백엔드 빌드 순서를 다시 소유하지 않습니다.
- route-local hook/util/type/상태는 웹/모바일 모두 `fe-route-agent` 행으로 기록하고 별도 spec을 만들지 않습니다.
- route `page.tsx`, Expo route file, `layout.tsx`, `_layout.tsx`, Store, 백엔드-only 단계는 Storybook 대상이 아니며 필요한 unit/E2E 검증만 spec에 기록합니다.
- Storybook 스토리가 필요한 UI 소스 변경은 `fe-storybook-agent` 단계를 별도로 두고, 소스 담당 에이전트의 다음 단계로 연결합니다.
- route/page 스펙의 `테스트 인벤토리 / owner 검증`은 서비스 스펙의 테스트 행 중 해당 route 범위가 직접 작성/실행할 테스트만 참조/기록하고, 작성/검증 agent_type을 비워두지 않습니다.
- route/page의 unit/E2E 테스트 작성과 1차 검증은 기본적으로 route, route layout, screen, feature, backend API 산출물 owner가 맡습니다.
- route/page 스펙의 `산출물 시뮬레이션 / 인계 계약`에는 route 범위 내부에서 생성/수정할 route file, route-local hook/상태/util, Screen/Feature 기획 스펙, Storybook 스토리, 단위 테스트/E2E, 소비 API/generated hook 경로를 기록합니다.
- route/page leaf 하위 에이전트는 이 계약에 있는 경로만 수정하고, 다음 하위 에이전트는 이 계약 행과 `AGENTS.md` 기준 완료 보고를 함께 기준으로 산출물을 찾습니다.
- E2E가 현재 불필요하거나 인프라가 없으면 행을 생략하지 말고 `E2E 파일`에 `none-current`, `비고`에 생략/차단 사유를 적습니다.

---

## 6. 승인 Gate

서비스 딜리버리 스펙 작성/갱신 후 route/page 스펙 또는 Screen/Feature 기획 스펙 생성, 하위 에이전트 호출 전에 반드시 승인 단계를 엽니다.
승인 전에는 route/page 스펙을 생성하지 않고 백엔드/웹/모바일 에이전트를 호출하지 않습니다.
사용자가 spec 수정을 요청하면 같은 서비스 딜리버리 스펙을 보강한 뒤 다시 승인 단계를 엽니다.

Codex 질문 도구 문구:

```text
작성한 서비스 spec 기준으로 route/page spec과 필요한 Screen/Feature 기획 스펙을 생성하고 개발을 시작할까요?

선택지:
- 진행: 승인된 service spec 기준으로 route/page spec과 Screen/Feature 기획 스펙 생성 후 구현 시작
- spec 수정: 수정 요청을 반영하고 다시 확인
- 중단: route/page spec, Screen/Feature 기획 스펙 생성과 구현 없이 멈춤
```

---

## 7. 실행 원칙

- 서비스 딜리버리 스펙의 `에이전트 배정 매트릭스`와 `실행 그래프`, `생성된 Route/Page 스펙`, `Screen/Feature 스펙 인덱스`에 연결된 spec만 실행합니다.
- 서비스 딜리버리 스펙과 route/page 딜리버리 spec의 `산출물 시뮬레이션 / 인계 계약`에 없는 산출물 경로는 다음 직렬 단계의 입력으로 넘기지 않습니다.
- 서비스 딜리버리 스펙에 없는 route/page 스펙, Screen/Feature 기획 스펙, `agent_type`, 파일은 생성하거나 수정하지 않습니다.
- route/page 딜리버리 spec에 없는 파일은 leaf 에이전트가 수정하지 않습니다.
- route/page 스펙 또는 Screen/Feature 기획 스펙이 필요하지만 누락되어 있으면 구현하지 말고 서비스 스펙 보강 필요성을 최종 보고에 남깁니다.
- `병렬=auto`여도 spec 행의 `병렬: true`이고 수정 허용 파일이 겹치지 않는 단계만 병렬 실행합니다.
- shared file lock은 서비스 스펙과 route/page 스펙의 `공유 파일 잠금`을 따릅니다.
- 백엔드/API 변경 후 서비스 스펙에 codegen 단계가 있으면 웹/모바일 wiring 전에 codegen을 실행합니다.
- 완료 보고는 루트 `AGENTS.md`의 하위 에이전트 공통 계약을 따르며, 추가로 실행한 service 단계 id, route/page 단계 id, 산출물 행 id, 참조한 Screen/Feature 기획 스펙, 검증 결과, 재실행 필요 여부를 포함합니다.

---

## 8. 실행 이슈 처리

- 실행 에이전트는 승인된 스펙과 ownership boundary 밖으로 작업을 확장하지 않습니다.
- 이슈가 생기면 최종 보고에 변경 파일, 검증 결과, 중단 사유, 필요한 후속 작업을 사람이 확인할 수 있게 남깁니다.
- spec 보강, 단계 재실행, agent 재배정, 차단 처리는 사용자가 최종 보고와 diff를 검증한 뒤 결정합니다.

---

## 9. 완료 조건

- 서비스 스펙의 required 단계이 완료되거나 명시적으로 차단 처리되어야 합니다.
- `생성된 Route/Page 스펙`의 route/page 스펙이 모두 생성/갱신되어야 합니다. route가 없는 서비스는 `no route surface` 사유가 기록되어야 합니다.
- `Screen/Feature 스펙 인덱스`의 필수 기획 스펙이 모두 생성/갱신되어야 합니다. 변경되는 Screen/Feature가 없으면 `none-current` 사유가 기록되어야 합니다.
- 모든 실행 단계의 `산출물 시뮬레이션 / 인계 계약` 행이 실제 산출물 경로 또는 명시적 차단/정리 사유로 닫혀야 합니다.
- required verification/acceptance 검증이 통과해야 합니다.
- stale agent_type, spec에 없는 파일 변경, shared lock 위반, spec 간 복제 중복이 없어야 합니다.

---

## 10. 금지

- 별도 planning 역할을 호출하지 않습니다.
- 별도 Delivery Plan 파일을 만들지 않습니다.
- 서비스 스펙 approval 전 route/page 스펙 또는 Screen/Feature 기획 스펙을 생성하지 않습니다.
- 서비스 스펙에 없는 route/page/spec 파일과 Screen/Feature 기획 스펙 파일을 임의 생성하지 않습니다.
- `산출물 시뮬레이션 / 인계 계약`에 없는 파일을 다음 하위 에이전트의 입력 산출물로 암묵 전달하지 않습니다.
- Screen/Feature 기획 스펙에 `에이전트 배정 매트릭스`, `실행 그래프`, 백엔드 빌드 순서, 기반 세부 실행표, 승인 단계를 넣지 않습니다.
- agent가 결정해야 할 세부 구현 규칙이나 상위/하위 spec이 이미 소유한 계약을 다른 spec에 복제하지 않습니다.
- 승인 단계 전에는 route/page 스펙 생성, Screen/Feature 기획 스펙 생성, 하위 에이전트 호출을 하지 않습니다.
- 하위호환 wrapper, deprecated 경로, 임시 대체 처리 API를 계획하지 않습니다.
