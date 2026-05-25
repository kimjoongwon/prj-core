# Codex Agent Index

이 문서는 `.codex/agents/**/*.toml`의 active role 인덱스입니다.

원문 우선순위:

1. [.codex/config.toml](../config.toml)
2. 각 `**/*.toml`
3. 이 인덱스

`*.toml.guide.md` 보조 문서는 생성하지 않습니다.
role별 상세 지시는 해당 `*.toml`의 `developer_instructions`에 직접 둡니다.

## Route Delivery Spec 운영

모든 orchestration은 route delivery spec 하나에서 시작합니다.

- owner: [orch-delivery.toml](./orch-delivery.toml)

`orch-delivery` 하나가 **Spec → Ask → Build → QA**를 소유합니다.
별도 Delivery Plan 문서는 만들지 않고, 실행 계약은 route delivery spec 안에 `## Delivery` 섹션으로 함께 둡니다.
이 spec은 화면, 백엔드, API, 상태, UI 요소, 테스트, 담당 `agent_type`, 실행 순서를 모두 명시합니다.
`orch-delivery`는 승인된 route delivery spec에 없는 agent를 호출하지 않고, 허용 파일 범위 밖 파일을 수정하지 않습니다.

Screen/Feature spec은 planning spec입니다. 목표, 화면 러프, props/event, rendering/rhythm, 하위 조합, 상태별 렌더링, story/unit test 계약만 소유하고 실행 그래프나 backend/foundation build order를 소유하지 않습니다.

`## Delivery` 필수 하위 섹션:

- `### Goal`
- `### Planning Spec References`
- `### Design Alignment`
- `### Screen Rough`
- `### Rhythm / Layout Contract`
- `### Component Inventory`
- `### Foundation Contract`
  - `#### Hook 인벤토리`
  - `#### Toolkit 인벤토리`
  - `#### Type 인벤토리`
  - `#### Store / State 인벤토리`
- `### Storybook / Test Contract`
  - `#### Storybook 인벤토리`
  - `#### Unit Test 인벤토리`
- `### Backend / API Contract`
  - `#### Prisma / Database 인벤토리`
  - `#### Prisma Annotation 인벤토리`
  - `#### Common Schema 인벤토리`
  - `#### Entity / VO 인벤토리`
  - `#### DTO / Query DTO 인벤토리`
  - `#### Repository 인벤토리`
  - `#### Service 인벤토리`
  - `#### ApplicationService 인벤토리`
  - `#### Facade / Gateway 인벤토리`
  - `#### 엔드포인트 인벤토리`
  - `#### Module / Bootstrap 인벤토리`
  - `#### Seed 인벤토리`
  - `#### Codegen / API Client 인벤토리`
- `### Required Elements`
- `### Agent Assignment Matrix`
- `### Execution Graph`
  - `#### Visual Execution Flow`
  - `#### Parallel Group Table`
  - `#### Step Order Table`
  - `#### Canonical Phase Order`
- `### Shared File Locks`
- `### QA / Acceptance`
- `### Blocked / Re-entry Rules`
- `### Approval / Execution Log`

병렬 실행은 spec에서 `parallel: true`이고 파일 ownership이 겹치지 않는 leaf/component step에만 허용합니다.

구현 대상의 route delivery spec을 먼저 작성하거나 갱신한 뒤, Codex 질문 도구로 사용자의 진행 승인을 받습니다.
승인 전에는 builder/QA agent를 실행하지 않습니다.

Storybook/Test 소유권:

- PC/Web은 `packages/fe-ui/src/**` component source를 소유한 builder role이 story/test를 함께 작성합니다.
- Mobile은 `packages/fe-mo-ui/src/**` component source를 소유한 builder role이 story/test를 함께 작성합니다.
- Mobile builder role은 작업 전에 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- Mobile의 사용자 노출 텍스트는 `@cocrepo/mo-ui` `Text` primitive를 사용합니다. `react-native` `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- Mobile compound/action primitive가 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화합니다. `Switch`, `Checkbox`, `RadioGroup.Item`, `Button`, `Chip` 등이 HeroUI Native에 raw string children을 그대로 넘기면 안 됩니다.
- Mobile HeroUI Native compound wrapper는 return-only re-export로 끝내지 않습니다. field 계열은 upstream `TextField`, `Label`, `Description`, `FieldError`, `InputGroup` composition을 먼저 사용하고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot escape hatch를 함께 유지합니다.
- route `page.tsx`, Expo route file, `layout.tsx`, `_layout.tsx`, Store, backend-only step은 Storybook 대상이 아니며 필요한 unit/E2E 검증만 route delivery spec에 적습니다.
- QA role은 story/test 누락, 실패, contract drift를 검증합니다.

## Spec 범위

Route delivery spec:

- Next.js route page: `apps/*/web/src/app/**/page.tsx` → 같은 route 폴더의 `page.spec.md`
- Expo Router native route screen: `apps/mobile/src/app/**/index.tsx` → 같은 route 폴더의 `index.spec.md`

Planning spec:

- fe-ui Screen component: `packages/fe-ui/src/screen/[ScreenName]/[ScreenName].tsx` → 같은 폴더의 `[ScreenName].spec.md`
- fe-ui Feature component: `packages/fe-ui/src/feature/**/[FeatureName].tsx` → 같은 component owner 위치의 `[FeatureName].spec.md`
- fe-mo-ui Screen component: `packages/fe-mo-ui/src/screen/[ScreenName]/[ScreenName].tsx` → 같은 폴더의 `[ScreenName].spec.md`
- fe-mo-ui Feature component: `packages/fe-mo-ui/src/feature/**/[FeatureName].tsx` → 같은 component owner 위치의 `[FeatureName].spec.md`

그 외 backend entity/dto/service/repository/controller/module/app/facade/integration/vo/prisma/schema, store/hook/toolkit/type/barrel/config/script/test/e2e/layout, Next.js `layout.tsx`, Expo Router `_layout.tsx`, web/mobile leaf 계층에는 spec을 만들지 않습니다.

상세 정책은 별도 문서로 분리하지 않고 이 README, `.codex/config.toml`, 각 role TOML의 내장 지시문에 직접 유지합니다.

## Feedback Loop 운영

- 실행 agent는 peer role을 직접 호출하거나 다른 role 책임 파일을 임의 수정하지 않습니다.
- 모든 finding은 `orch-delivery`가 `Feedback:` packet으로 수집한 뒤 follow-up, spec re-entry, blocked/pending 중 하나로 재배치합니다.
- orchestrated 실행 agent의 최종 보고에는 `Feedback:` packet을 항상 포함합니다.
- packet이 누락되면 `orch-delivery`가 같은 agent에 1회 보완 요청하고, 두 번째에도 없으면 `dependency-missing` 또는 `implementation-blocker`로 차단합니다.

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
- [be-service-builder.toml](./be-service-builder.toml): NestJS Service role
- [be-app-builder.toml](./be-app-builder.toml): ApplicationService role
- [be-facade-builder.toml](./be-facade-builder.toml): Controller boundary Facade role
- [be-gateway-builder.toml](./be-gateway-builder.toml): 외부 시스템 Gateway/Client/Adapter role
- [be-controller-builder.toml](./be-controller-builder.toml): NestJS REST Controller role
- [be-module-builder.toml](./be-module-builder.toml): NestJS Module/Router wiring role
- [be-bootstrap-integrator.toml](./be-bootstrap-integrator.toml): AppModule bootstrap role
- [be-seed-maker.toml](./be-seed-maker.toml): seed/reference-data role

## Web Frontend

- [fe-display-builder.toml](./fe-display-builder.toml): Display UI role
- [fe-control-builder.toml](./fe-control-builder.toml): Control/input role
- [fe-cell-builder.toml](./fe-cell-builder.toml): DataGrid/Table Cell role
- [fe-columns-builder.toml](./fe-columns-builder.toml): columns/DataGrid boundary role
- [fe-widget-builder.toml](./fe-widget-builder.toml): Widget role
- [fe-layout-builder.toml](./fe-layout-builder.toml): reusable Layout role
- [fe-feature-builder.toml](./fe-feature-builder.toml): Feature role
- [fe-data-grid-builder.toml](./fe-data-grid-builder.toml): DataGrid renderer/input/state contract role
- [fe-form-builder.toml](./fe-form-builder.toml): create/update form layer role
- [fe-hook-builder.toml](./fe-hook-builder.toml): web/mobile 공통 React hook role
- [fe-menu-builder.toml](./fe-menu-builder.toml): menu system role
- [fe-store-builder.toml](./fe-store-builder.toml): shared MobX Store role
- [fe-screen-builder.toml](./fe-screen-builder.toml): `packages/fe-ui/src/screen/[ScreenName]` web screen visual owner role
- [fe-route-layout-builder.toml](./fe-route-layout-builder.toml): Next.js route layout/shell role
- [fe-route-builder.toml](./fe-route-builder.toml): route/API/state thin container integration role

## Mobile

- [fe-mo-action-builder.toml](./fe-mo-action-builder.toml): RN command/action role
- [fe-mo-input-builder.toml](./fe-mo-input-builder.toml): RN text/input role
- [fe-mo-selection-builder.toml](./fe-mo-selection-builder.toml): RN selection/stateful choice role
- [fe-mo-navigation-builder.toml](./fe-mo-navigation-builder.toml): RN navigation control role
- [fe-mo-data-display-builder.toml](./fe-mo-data-display-builder.toml): RN data-display/surface/layout primitive role
- [fe-mo-feedback-builder.toml](./fe-mo-feedback-builder.toml): RN feedback/status/overlay role
- [fe-mo-menu-builder.toml](./fe-mo-menu-builder.toml): RN Menu/SubMenu role
- [fe-mo-widget-builder.toml](./fe-mo-widget-builder.toml): RN reusable Widget composition role
- [fe-mo-feature-builder.toml](./fe-mo-feature-builder.toml): RN reusable Feature composition role
- [fe-mo-screen-builder.toml](./fe-mo-screen-builder.toml): shared screen visual owner role
- [fe-mo-route-layout-builder.toml](./fe-mo-route-layout-builder.toml): Expo Router native `_layout.tsx` shell role
- [fe-mo-route-builder.toml](./fe-mo-route-builder.toml): Expo route/API/state/native wiring role

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
