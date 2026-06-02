# Codex Agent Index

이 문서는 `.codex/agents/**/*.toml`의 active role 인덱스입니다.

원문 우선순위:

1. [.codex/config.toml](../config.toml)
2. 각 `**/*.toml`
3. 이 인덱스

`*.toml.guide.md` 보조 문서는 생성하지 않습니다.
role TOML은 얇은 실행 contract만 소유합니다. 상세 작업 지시는 repo-scoped skill인 `.agents/skills/*-creator/SKILL.md`와 해당 skill의 `references/agent-instructions.md`에 둡니다.

## Model Tier 운영

현재 로컬 Codex availability 기준으로 `gpt-5.5`, `gpt-5.4`, `gpt-5.3-codex-spark`를 함께 사용합니다. 되돌림 비용이 큰 판단은 `gpt-5.5`, 복합 구현은 `gpt-5.4`, leaf 구현과 반복 생성은 `gpt-5.3-codex-spark`가 담당합니다.

| Model | Effort | Role | 기준 |
|-------|--------|------|------|
| `gpt-5.5` | `xhigh` | `orch-delivery`, `be-prisma-builder`, `be-database-expert`, `be-usecase-builder`, `common-schema-builder`, `qa-type-checker` | 서비스 설계, 데이터 모델, workflow orchestration, 공통 검증 계약, 타입 실패 원인 분석 |
| `gpt-5.4` | `high` | `be-aggregate-builder`, `be-bootstrap-integrator`, `be-client-builder`, `be-controller-builder`, `be-module-builder`, `be-repository-builder`, `be-service-builder`, `common-toolkit-builder`, `common-type-builder`, `fe-data-grid-agent`, `fe-feature-agent`, `fe-form-agent`, `fe-menu-agent`, `fe-route-layout-agent`, `fe-screen-agent`, `fe-store-agent`, `qa-be-e2e-testing`, `qa-fe-e2e-testing`, `qa-mo-e2e-testing` | cross-layer 구현, 상태/화면 설계, E2E 검증처럼 되돌림 비용이 있는 작업 |
| `gpt-5.3-codex-spark` | `medium` | `be-command-builder`, `be-dmmf-parser-builder`, `be-dto-builder`, `be-entity-builder`, `be-event-builder`, `be-query-dto-builder`, `be-vo-builder`, `etc-jenkinsfile-builder`, `fe-control-agent`, `fe-display-agent`, `fe-hook-agent`, `fe-layout-agent`, `fe-route-agent`, `fe-widget-agent`, `qa-be-testing`, `qa-fe-testing`, `qa-mo-testing` | 계약/컴포넌트/단위 테스트처럼 범위가 비교적 명확한 일반 구현 |
| `gpt-5.3-codex-spark` | `low` | `be-prisma-annotator`, `be-seed-maker`, `dev-service-starter`, `fe-cell-agent`, `fe-columns-agent` | 주석, 시드, 서비스 시작, 셀/컬럼 같은 기계적이고 반복적인 작업 |

## 서비스 Delivery Spec 운영

모든 orchestration은 service delivery spec에서 시작합니다.

- 담당 role: [orch-delivery.toml](./orch-delivery.toml)
- service spec: `docs/services/**/*.delivery.spec.md`
- generated route spec: web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`

`orch-delivery` 하나가 **기획 질문 → 서비스 Spec → 승인 → 라우트 Spec → 구현 → QA**를 소유합니다.
별도 Delivery Plan 문서는 만들지 않고, 실행 계약은 승인된 service delivery spec과 여기서 생성된 route delivery spec 실행 slice에 둡니다.
service delivery spec은 서비스 목표, 사용자/권한, 도메인 모델, 모든 web/mobile route 목록, backend/API/foundation 계약, `DESIGN.md` 기반 디자인 방향, 담당 `agent_type`, 실행 순서, QA 기준을 소유합니다.
route delivery spec은 service spec에서 파생된 page/route 실행 slice이며 화면 계약, route wiring, component inventory, route-local hook/state, E2E, 해당 route가 소비하는 backend/API/foundation slice만 소유합니다.
`orch-delivery`는 승인된 service delivery spec과 연결된 route delivery spec에 없는 agent를 호출하지 않고, 허용 파일 범위 밖 파일을 수정하지 않습니다.

Screen/Feature spec은 planning spec입니다. 목표, 화면 러프, props/event, rendering/rhythm, 하위 조합, 상태별 렌더링, story/unit test 계약만 소유하고 실행 그래프나 backend/foundation build order를 소유하지 않습니다.

모든 source target은 단일 책임 파일 규칙을 따릅니다. class/function/type/interface/enum은 파일별 하나만 소유하고, class 파일 안에 top-level props/interface/type/helper/mapper를 함께 두지 않습니다. Props/Params/Input/Result/Options/helper/mapper/parser/normalizer/constant는 같은 owner 폴더의 별도 파일로 지정합니다.

service delivery spec 필수 섹션:

- `## 서비스 목표`
- `## 사용자 / 역할 / 권한`
- `## 도메인 모델 / 생명주기`
- `## 사용자 여정`
- `## 필수 페이지 / 라우트`
- `## 백엔드 / API / 기반 계약`
- `## DESIGN.md 기반 디자인 방향`
- `## 생성된 라우트 Spec`
- `## 에이전트 배정 매트릭스`
- `## 실행 그래프`
- `## QA / 승인 기준`
- `## 승인 / 실행 로그`

generated route delivery spec의 `## 딜리버리` 필수 하위 섹션:

- `### 상위 서비스 Spec`
- `### 목표`
- `### 기획 Spec 참조`
- `### 디자인 정렬`
- `### 화면 러프`
- `### 리듬 / 레이아웃 계약`
- `### 컴포넌트 인벤토리`
- `### 기반 Slice`
  - `#### Hook 인벤토리`
  - `#### Toolkit 인벤토리`
  - `#### Type 인벤토리`
  - `#### Store / State 인벤토리`
- `### Storybook / 테스트 계약`
  - `#### Storybook 인벤토리`
  - `#### Unit Test 인벤토리`
- `### 백엔드 / API Slice`
  - `#### Prisma / Database 인벤토리`
  - `#### Prisma Annotation 인벤토리`
  - `#### Common Schema 인벤토리`
  - `#### Entity / VO 인벤토리`
  - `#### DTO / Query DTO 인벤토리`
  - `#### Repository 인벤토리`
  - `#### Service 인벤토리`
  - `#### UseCase 인벤토리` (`@cocrepo/command` message와 `@cocrepo/usecase` handler를 분리 기록하고, command/query/handler class당 하나의 source file을 target으로 지정)
  - `#### Client 인벤토리`
  - `#### 엔드포인트 인벤토리`
  - `#### Module / Bootstrap 인벤토리`
  - `#### Seed 인벤토리`
  - `#### Codegen / API Client 인벤토리`
- `### 필수 요소`
- `### 에이전트 배정 매트릭스`
- `### 실행 그래프`
  - `#### 시각 실행 흐름`
  - `#### 병렬 그룹 표`
  - `#### 단계 순서 표`
  - `#### 표준 Phase 순서`
- `### 공유 파일 잠금`
- `### QA / 승인 기준`
- `### 차단 / 재실행 규칙`
- `### 승인 / 실행 로그`

병렬 실행은 spec에서 `parallel: true`이고 파일 ownership이 겹치지 않는 leaf/component step에만 허용합니다.

구현 대상의 service delivery spec을 먼저 작성하거나 갱신한 뒤, Codex 질문 도구로 사용자의 진행 승인을 받습니다.
승인 전에는 route/page spec 생성, agent 실행, QA role 실행을 하지 않습니다.

Storybook/Test 소유권:

- PC/Web은 `packages/fe-ui/src/**` component source를 소유한 agent role이 story/test를 함께 작성합니다.
- Mobile은 `packages/fe-mo-ui/src/**` component source를 소유한 agent role이 story/test를 함께 작성합니다.
- Mobile agent role은 작업 전에 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- Mobile의 사용자 노출 텍스트는 `@cocrepo/mo-ui` `Text` primitive를 사용합니다. `react-native` `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- Mobile compound/action primitive가 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화합니다. `Switch`, `Checkbox`, `RadioGroup.Item`, `Button`, `Chip` 등이 HeroUI Native에 raw string children을 그대로 넘기면 안 됩니다.
- Mobile HeroUI Native compound wrapper는 return-only re-export로 끝내지 않습니다. field 계열은 upstream `TextField`, `Label`, `Description`, `FieldError`, `InputGroup` composition을 먼저 사용하고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot escape hatch를 함께 유지합니다.
- route `page.tsx`, Expo route file, `layout.tsx`, `_layout.tsx`, Store, backend-only step은 Storybook 대상이 아니며 필요한 unit/E2E 검증만 route delivery spec에 적습니다.
- QA role은 story/test 누락, 실패, contract drift를 검증합니다.

## Spec 범위

Service delivery spec:

- 서비스 전체 설계: `docs/services/{service-name}.delivery.spec.md`

Generated route delivery spec:

- Next.js route page: `apps/*/web/src/app/**/page.tsx` → 같은 route 폴더의 `page.spec.md`
- Expo Router native route screen: `apps/mobile/src/app/**/index.tsx` → 같은 route 폴더의 `index.spec.md`

Planning spec:

- fe-ui Screen component: `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` → 같은 폴더의 `[ScreenName].spec.md`
- fe-ui Feature component: `packages/fe-ui/src/feature/**/[FeatureName].tsx` → 같은 component owner 위치의 `[FeatureName].spec.md`
- fe-mo-ui Screen component: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx` → 같은 폴더의 `[ScreenName].spec.md`
- fe-mo-ui Feature component: `packages/fe-mo-ui/src/feature/**/[FeatureName].tsx` → 같은 component owner 위치의 `[FeatureName].spec.md`

그 외 backend entity/dto/service/repository/controller/module/app/facade/integration/vo/prisma/schema, store/hook/toolkit/type/barrel/config/script/test/e2e/layout, Next.js `layout.tsx`, Expo Router `_layout.tsx`, web/mobile leaf 계층에는 spec을 만들지 않습니다.

상세 정책은 별도 `*.toml.guide.md`로 분리하지 않습니다. 실행 guardrail은 이 README, `.codex/config.toml`, 각 role TOML에 두고, 구현 절차와 기술별 상세 규칙은 `.agents/skills/*-creator` skill에 유지합니다.

## 실행 결과 검증

- 실행 agent는 peer role을 직접 호출하거나 다른 role 책임 파일을 임의 수정하지 않습니다.
- `orch-delivery`는 승인된 spec 기준으로 직렬/병렬 실행 순서만 배정합니다.
- 실행 결과와 남은 이슈는 각 agent의 최종 보고, 변경 diff, 테스트 결과를 사람이 검증합니다.

## Planning / Orchestration

- [orch-delivery.toml](./orch-delivery.toml): spec 작성, 승인 질문, backend/frontend/mobile/QA 실행을 모두 소유하는 role

## Backend / Prisma

- [be-database-expert.toml](./be-database-expert.toml): PostgreSQL/Prisma 데이터베이스 설계 및 최적화 role
- [be-prisma-builder.toml](./be-prisma-builder.toml): Prisma 스키마 생성 role
- [be-prisma-annotator.toml](./be-prisma-annotator.toml): Prisma 스키마 `@displayName` 주석 role
- [be-dmmf-parser-builder.toml](./be-dmmf-parser-builder.toml): Prisma DMMF 파싱 유틸리티 role
- [common-schema-builder.toml](./common-schema-builder.toml): 프론트엔드/백엔드 공용 검증 스키마 role
- [common-toolkit-builder.toml](./common-toolkit-builder.toml): 공용 `@cocrepo/toolkit` utility role
- [common-type-builder.toml](./common-type-builder.toml): 공용 `@cocrepo/type` type contract role
- [be-entity-builder.toml](./be-entity-builder.toml): 도메인 Entity role
- [be-vo-builder.toml](./be-vo-builder.toml): Value Object role
- [be-dto-builder.toml](./be-dto-builder.toml): Request/Response DTO role
- [be-query-dto-builder.toml](./be-query-dto-builder.toml): PrismaQueryDto 기반 Query DTO role
- [be-repository-builder.toml](./be-repository-builder.toml): Prisma 기반 Repository role
- [be-aggregate-builder.toml](./be-aggregate-builder.toml): Aggregate root service provider role
- [be-service-builder.toml](./be-service-builder.toml): NestJS Service role
- [be-command-builder.toml](./be-command-builder.toml): Nest CQRS Command/Query message contract role
- [be-event-builder.toml](./be-event-builder.toml): Nest CQRS Event message contract role
- [be-usecase-builder.toml](./be-usecase-builder.toml): Nest CQRS UseCase handler role
- [be-client-builder.toml](./be-client-builder.toml): 외부 시스템 단일 연동 Client role
- [be-controller-builder.toml](./be-controller-builder.toml): NestJS REST Controller role
- [be-module-builder.toml](./be-module-builder.toml): NestJS Module/Router wiring role
- [be-bootstrap-integrator.toml](./be-bootstrap-integrator.toml): AppModule bootstrap role
- [be-seed-maker.toml](./be-seed-maker.toml): seed/reference-data role

## Frontend

Web과 Mobile 구현 role은 `fe-*agent` 하나로 통합합니다. 각 dual-platform role TOML은 플랫폼 판별 guardrail만 유지하고, 상세 `Common`, `React Web`, `React Native` 섹션은 대응 `.agents/skills/*-creator/references/agent-instructions.md`에 유지합니다.

- 대상 파일이 `packages/fe-ui/**`, `apps/*/web/**`이면 agent는 `Common`과 `React Web` 섹션만 실행 규칙으로 적용합니다.
- 대상 파일이 `packages/fe-mo-ui/**`, `apps/mobile/**`이면 agent는 `Common`과 `React Native` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고 금지/허용/출력 규칙을 적용하지 않습니다.
- React Web only role은 `Platform Routing`에 명시하고 React Native target을 범위 밖으로 둡니다.
- Shared role은 공용 hook/store 계약만 다루며 UI runtime별 세부 규칙은 소비 owner agent의 플랫폼 섹션을 따릅니다.

- [fe-display-agent.toml](./fe-display-agent.toml): Web display와 RN data-display/feedback/surface/layout primitive role
- [fe-control-agent.toml](./fe-control-agent.toml): Web control과 RN action/input/selection/navigation role
- [fe-cell-agent.toml](./fe-cell-agent.toml): DataGrid/Table Cell role
- [fe-columns-agent.toml](./fe-columns-agent.toml): columns/DataGrid boundary role
- [fe-widget-agent.toml](./fe-widget-agent.toml): Web/Mobile Widget role
- [fe-layout-agent.toml](./fe-layout-agent.toml): reusable Web Layout role
- [fe-feature-agent.toml](./fe-feature-agent.toml): Web/Mobile Feature role
- [fe-data-grid-agent.toml](./fe-data-grid-agent.toml): DataGrid renderer/input/state contract role
- [fe-form-agent.toml](./fe-form-agent.toml): create/update form layer role
- [fe-hook-agent.toml](./fe-hook-agent.toml): web/mobile 공통 React hook role
- [fe-menu-agent.toml](./fe-menu-agent.toml): Web/Mobile menu, tab, navigation composition role
- [fe-store-agent.toml](./fe-store-agent.toml): shared MobX Store role
- [fe-screen-agent.toml](./fe-screen-agent.toml): Web/Mobile screen visual owner role
- [fe-route-layout-agent.toml](./fe-route-layout-agent.toml): Next.js layout and Expo Router `_layout.tsx` shell role
- [fe-route-agent.toml](./fe-route-agent.toml): Next.js/Expo route API/state/navigation thin container role

## QA / 검증

- [qa-type-checker.toml](./qa-type-checker.toml): TypeScript type error 해결 role
- [qa-be-testing.toml](./qa-be-testing.toml): Jest backend/common unit test role
- [qa-be-e2e-testing.toml](./qa-be-e2e-testing.toml): Jest + Supertest backend E2E role
- [qa-fe-testing.toml](./qa-fe-testing.toml): Vitest frontend unit test role
- [qa-fe-e2e-testing.toml](./qa-fe-e2e-testing.toml): Playwright frontend E2E role
- [qa-mo-testing.toml](./qa-mo-testing.toml): Jest + React Native Testing Library mobile unit test role
- [qa-mo-e2e-testing.toml](./qa-mo-e2e-testing.toml): Detox mobile E2E role

## 공용 / 운영 보조

- [dev-service-starter.toml](./dev-service-starter.toml): 개발 서비스 시작 role
- [etc-jenkinsfile-builder.toml](./etc-jenkinsfile-builder.toml): Jenkins pipeline role
