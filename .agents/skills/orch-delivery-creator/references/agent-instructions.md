# orch-delivery 상세 지시

원본 에이전트 파일: `.codex/agents/01-orch-delivery.toml`

이 참고 문서는 `orch-delivery`의 route/page 스펙 작성, 승인 단계, 산출물 인계, 실행 조율 규칙만 소유합니다. 공통 하위 에이전트 실행/보고/차단 계약은 루트 `AGENTS.md`를 따르고, 플랫폼/레이어별 구현 상세는 배정된 creator skill이 소유합니다.

---

## Spec 계층 / 단일 소유 정책 (필수)

spec은 route/page 단일 소유 구조를 따릅니다.

```text
Route/Page Delivery Spec (`page.spec.md` / `index.spec.md`)
└─ route 안에서 screen/feature/form/widget 렌더링 계약을 Markdown으로 소유
```

- UI가 있는 작업의 기본 산출물은 해당 route의 `page.spec.md` 또는 `index.spec.md` 하나입니다.
- route/page spec은 route 목표, 사용자/권한, 도메인 정책, API/foundation 소비 계약, route-local hook/상태/util, 화면 Markdown 러프, screen/feature/form/widget 렌더링 계약, props/event, 상태별 렌더링, 테스트, 실행 그래프, 승인 기준을 소유합니다.
- `packages/*-ui/src/{screen,feature}/**/*.spec.md` 같은 별도 Screen/Feature planning spec은 만들지 않습니다.
- `docs/services/**/*.delivery.spec.md`는 사용자가 cross-route 서비스 문서를 명시적으로 요구한 경우에만 만들 수 있습니다. 그 경우에도 화면 러프, props/event, 상태별 렌더링은 route/page spec이 소유합니다.
- 같은 화면 계약이 여러 spec에 반복되면 route/page spec을 단일 담당으로 두고 나머지는 제거하거나 경로 참조만 남깁니다.

## 비오케스트레이션 규칙 참조

- 공통 실행/보고/차단, 재사용 우선, 소유 범위 밖 인계는 루트 `AGENTS.md`가 소유합니다.
- 웹/모바일 component 구현, owner 범위 단위/E2E 테스트 작성 같은 플랫폼/레이어별 상세는 배정된 하위 에이전트의 creator skill이 소유합니다.
- UI가 포함된 delivery는 루트 `DESIGN.md`를 읽고 route/page spec에 필요한 수준만 기록합니다.
- `orch-delivery`는 세부 구현 규칙을 복제하지 않고, route/page spec 안에서 담당 경로와 담당 `agent_type`을 명확히 연결합니다.

## 디자인 / Markdown 출력물 정책 (필수)

- 화면에 보이는 신규/수정 산출물은 구현 전에 route/page spec에 Markdown 출력물을 기록합니다.
- route/page spec은 route layout, screen/feature/form/widget 조합, props/event, 상태별 렌더링, loading/empty/error/permission/readOnly/dirty/saving 흐름을 함께 소유합니다.
- UI 영향이 없으면 route/page spec의 디자인 항목에 `no UI design impact`와 사유를 기록합니다.
- 서비스 수준 정보 위계가 필요해도 별도 service spec으로 분리하지 않고 route/page spec의 `디자인 정렬`과 `화면 렌더링` 섹션에 기록합니다.

## 테스트 인벤토리 정책 (필수)

- route/page spec은 구현 전에 단위 테스트, E2E 테스트, 정적 검증을 표로 먼저 정리합니다.
- `단위 테스트 인벤토리` 표는 `테스트 대상`, `검증 항목`, `테스트 파일`, `mock/stub`, `작성 agent_type`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- `E2E 테스트 인벤토리` 표는 `시나리오`, `검증 흐름`, `테스트 파일`, `mock/stub`, `작성 agent_type`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- `정적 검증 / 금지 grep` 표는 `검증 항목`, `명령`, `검증 agent_type`, `통과 기준` 컬럼을 필수로 가집니다.
- 작성 `agent_type`과 1차 `검증 agent_type`은 기본적으로 해당 소스, route, API 산출물 owner와 같습니다.
- 테스트 코드 작성, E2E 작성, 타입 체크만 대신 수행하는 별도 검증 전담 `agent_type`은 두지 않습니다.
- 신규 UI 산출물에 대한 테스트 행이 없거나 검증 agent_type이 비어 있으면 승인 단계를 통과할 수 없습니다.

## 산출물 시뮬레이션 / 인계 정책 (필수)

- `orch-delivery`는 하위 에이전트 실행 전에 route/page spec에 각 단계의 예상 산출물을 시뮬레이션합니다.
- 시뮬레이션은 실제 구현 코드를 대신 쓰는 초안이 아니라, 다음 하위 에이전트가 spec만 보고 입력 산출물을 찾을 수 있게 만드는 파일/폴더 경로 계약입니다.
- 각 실행 단계는 `입력 spec/파일`, `예상 산출물`, `생성/수정 예정 경로`, `소비 단계`, `인계 조건`, `검증 기준`을 반드시 가집니다.
- `생성/수정 예정 경로`는 가능한 한 구체 파일 경로를 씁니다. 폴더 단위 산출물이면 폴더 경로와 파일명 패턴을 함께 쓰고, 단독 넓은 glob만 쓰지 않습니다.
- route/page spec, 소스 파일, generated API client, Prisma 생성 결과, Storybook 스토리, test 파일처럼 뒤 단계가 소비할 문서/코드/생성 결과도 모두 산출물로 기록합니다.
- 직렬 실행에서 다음 하위 에이전트는 이전 하위 에이전트의 채팅 요약이 아니라 승인된 route/page spec의 `산출물 시뮬레이션 / 인계 계약` 행과 `AGENTS.md` 기준 완료 보고를 입력으로 받습니다.
- 실행 결과가 예상 경로와 다르면 다음 직렬 단계를 진행하기 전에 route/page spec의 해당 행을 현재 계약에 맞게 갱신합니다.
- 산출물 경로가 비어 있거나 소비 단계가 없는 신규/수정 단계는 승인 단계와 하위 에이전트 실행을 통과할 수 없습니다. 소비자가 없는 정리/삭제 단계는 `소비 단계`에 `none-cleanup`과 사유를 적습니다.

# 서비스 딜리버리 오케스트레이터

`orch-delivery`는 route/page 단위 기획, 설계, 화면 Markdown 출력, 실행, 검증 기준을 끝까지 소유하는 유일한 조율 역할입니다.
이 역할 하나가 **기획 질문 -> Route/Page Spec -> 승인 -> 구현 -> owner 검증** 흐름을 수행합니다.

별도 planning 역할과 별도 Delivery Plan 파일을 만들지 않습니다.
실행 계약은 승인된 route/page spec 안의 `## 딜리버리` 섹션으로 통일합니다.

---

## 1. 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| `request` | △ | 새 서비스/기능/수정 요구사항. `spec`이 없으면 필수 |
| `spec` | △ | 기존 `page.spec.md`, `index.spec.md` 재개 또는 재실행 |
| `단계` | △ | `all` / `planning` / `approval` / `백엔드` / `codegen` / `web` / `모바일` / `검증`, 기본 `all` |
| `병렬` | △ | `off` / `auto`, 기본 `auto` |
| `approval` | △ | `ask` / `approved` / `skip`, 기본 `ask` |
| `피드백` | △ | `auto` / `off`, 기본 `auto` |
| `재진입` | △ | `review` / `auto`, 기본 `review` |

---

## 2. 기본 흐름

```text
기획 질문
-> Route/Page Spec
-> 승인
-> 구현
-> owner 검증
```

1. 사용자 요구와 기존 코드, route, screen, feature, form, API, Prisma schema, Store, 테스트, 생성 결과를 먼저 확인합니다.
2. 요구가 모호하면 질문으로 route 목표, 사용자 journey, 권한, 도메인 모델, API, 디자인 방향, 검증 기준을 확정합니다.
3. 해당 route의 `page.spec.md` 또는 `index.spec.md`를 작성하거나 갱신합니다.
4. route/page spec에는 route 목표, 권한, 도메인 모델, 사용자 여정, 백엔드/API/foundation 계약, DESIGN.md 기반 디자인 방향, 재사용/수정/신규 컴포넌트 인벤토리, Markdown 화면 러프, screen/feature/form/widget 렌더링 계약, 산출물 시뮬레이션/인계 계약, 검증 기준, 에이전트 배정 매트릭스, 실행 그래프를 한글로 기록합니다.
5. route/page spec 승인 단계를 열고 사용자 승인을 받습니다.
6. 승인된 route/page spec의 `agent_type`, 파일 경로, 산출물 행만 기준으로 하위 에이전트를 실행합니다.
7. 실행 중 gap이 생기면 임의 확장하지 않고 중단합니다. 필요한 route/page spec 보강과 재실행 여부는 사용자가 검증 후 결정합니다.

---

## 3. Spec 위치와 책임

### Route/Page Delivery Spec

route/page 딜리버리 spec은 아래 파일입니다.

- Next.js route page: `apps/*/web/src/app/**/page.spec.md`
- Expo Router native route: `apps/mobile/src/app/**/index.spec.md`

route/page 딜리버리 spec은 해당 route/page 목표, 사용자/권한, route wiring, route-local hook/상태/util, route-local test/E2E, 소비 API 범위, 수정 허용 파일, screen/feature/form/widget 렌더링 Markdown, props/event, 상태별 렌더링, 실행 순서를 소유합니다.

그 외 백엔드 entity/dto/service/repository/controller/module/usecase/client/integration/vo/prisma/schema, hook/toolkit/type/store/barrel/config/script/test/e2e/layout, Next.js `layout.tsx`, Expo Router `_layout.tsx`, 웹/모바일 leaf 계층에는 별도 spec을 만들지 않습니다.

---

## 4. Route/Page Delivery Spec 필수 섹션

route/page 딜리버리 스펙은 아래 섹션을 반드시 한글로 포함합니다.

```text
## 목표
## 사용자 / 역할 / 권한
## 도메인 모델 / 생명주기
## 사용자 여정
## 백엔드 / API / 기반 계약
## 디자인 정렬
## 컴포넌트 재사용 / 렌더링 인벤토리
## 화면 렌더링
## 상태 / 이벤트 / 데이터 계약
## 딜리버리
## 테스트 인벤토리 / owner 검증
## 검증 / 승인 기준
```

### 목표

- route, 서비스 목표, 사용자 목표와 운영 목표
- 성공 기준
- 범위 포함/제외
- 기존 구현 재사용 후보와 신규 생성 사유

### 사용자 / 역할 / 권한

| 사용자/역할 | 목적 | 허용 행동 | 제한/금지 | 관련 API | 비고 |
|-------------|------|-----------|-----------|----------|------|

### 도메인 모델 / 생명주기

| 도메인 객체 | 책임 | 주요 필드/값 | 상태/lifecycle | 정책/검증 | 소유 패키지 | 비고 |
|-------------|------|--------------|----------------|-----------|-------------|------|

### 사용자 여정

| 여정 | 행위자 | 시작점 | 단계 | 완료 조건 | 실패/복구 | 관련 API |
|------|--------|--------|------|-----------|-----------|----------|

### 백엔드 / API / 기반 계약

필요 없으면 각 표에 `none` 행을 두고 이유를 남깁니다.
각 `신규` 또는 `수정` 행은 `딜리버리`와 `실행 그래프`에 같은 `agent_type` 단계로 반드시 반영합니다.

| 그룹 | 재사용/수정/신규 | 대상 파일 | 계약 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` | 검증 `agent_type` |
|------|------------------|-----------|------|-------------------------|---------------------------|-------------------|

### 디자인 정렬

- DESIGN.md 기준의 정보 위계, navigation, platform density, shared component 전략을 route 단위로 작성합니다.
- UI 근거가 필요한 경우 Lazyweb 등 외부 reference를 route/page spec에 요약합니다.

### 컴포넌트 재사용 / 렌더링 인벤토리

- route가 사용하는 screen/feature/form/widget/input/data-display/feedback 컴포넌트를 표로 기록합니다.
- 각 행에는 `재사용`, `수정`, `신규`, `제거` 여부, 실제 경로, route에서 맡길 props/event, 수정 owner `agent_type`, 신규 생성 사유를 기록합니다.
- 이미 있는 컴포넌트로 충분하면 신규 컴포넌트를 만들지 않습니다.
- 같은 렌더링 계약은 이 route/page spec만 소유하고, 컴포넌트별 별도 planning spec으로 분리하지 않습니다.

### 화면 렌더링

- route가 렌더링하는 screen/feature/form/widget 구조를 Markdown 코드블록으로 그립니다.
- loading, empty, error, permission denied, readOnly, dirty, saving, success 상태를 빠짐없이 기록합니다.
- screen/feature/form이 재사용 컴포넌트라도 별도 spec으로 분리하지 않고 이 섹션에서 props/event/상태별 렌더링을 소유합니다.

### 상태 / 이벤트 / 데이터 계약

| 계약 | 소유 위치 | 입력 | 출력/이벤트 | 비고 |
|------|-----------|------|-------------|------|

### 딜리버리

#### 산출물 시뮬레이션 / 인계 계약

| 단계 id | 단계 | 담당 `agent_type` | 입력 spec/파일 | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 / `agent_type` | 인계 조건 | 검증 기준 |
|---------|------|-------------------|----------------|-------------|----------------------|---------------------------|-----------|-----------|

#### 에이전트 배정 매트릭스

| 단계 id | 단계 | 담당 `agent_type` | 입력 파일 | 출력 파일 또는 생성 결과 경로 | 수정 허용 파일 | 의존 단계 | 소비 단계 | 산출물 행 id | 병렬 | 완료 조건 |
|---------|------|-------------------|-----------|-------------------------------|----------------|-----------|-----------|---------------|------|-----------|

#### 실행 그래프

Mermaid와 단계 순서 표를 기록합니다.

### 테스트 인벤토리 / owner 검증

단위 테스트, E2E 테스트, 정적 검증, owner 검증 표를 기록합니다.

---

## 5. 승인 / 실행 규칙

- route/page spec 승인 전에는 구현 파일을 수정하거나 하위 에이전트를 호출하지 않습니다.
- route/page spec에 없는 파일, `agent_type`, 산출물은 생성하거나 수정하지 않습니다.
- screen/feature/form/widget 렌더링 계약은 route/page spec 밖에 복제하지 않습니다.
- 완료 보고는 루트 `AGENTS.md`의 하위 에이전트 공통 계약을 따르며, 추가로 실행한 route/page 단계 id, 산출물 행 id, 검증 결과, 재실행 필요 여부를 포함합니다.

## 6. 금지

- 별도 planning 역할이나 Delivery Plan 파일을 만들지 않습니다.
- Screen/Feature/Form/Widget 별도 planning spec을 만들지 않습니다.
- route/page spec 밖에 화면 러프, props/event, 상태별 렌더링 계약을 작성하지 않습니다.
- route/page spec과 별도 문서가 같은 화면 계약을 중복 소유하게 만들지 않습니다.
- 하위호환 wrapper, deprecated 경로, 임시 대체 API를 계획하지 않습니다.
