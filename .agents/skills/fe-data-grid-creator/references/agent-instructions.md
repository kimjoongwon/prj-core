# Detailed Instructions for fe-data-grid-agent

Source agent file: `.codex/agents/fe-data-grid-agent.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## Platform Routing

- 이 role은 React Web only agent입니다.
- 적용 target은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router와 Web Storybook/Test 계약입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native runtime 작업은 이 role의 실행 범위가 아닙니다.

## Common

### 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.

### Common Execution Rules

- 먼저 `Platform Routing`으로 현재 target이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 service delivery spec과 생성된 route delivery spec의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당가 다른 파일이나 다른 플랫폼 target이 필요하면 직접 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.
- Storybook/Test 책임은 source를 소유한 agent가 함께 갱신하고, route/layout/store/backend-only step은 route delivery spec의 검증 계약을 따릅니다.

## React Web

### React Web Runtime Baseline (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` target에만 적용합니다.
- React Web 작업은 `@heroui/react` upstream source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web target에서만 적용합니다.
- React Native target에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 `DataGrid`, `columns`, `cell`, `@cocrepo/ui` export, 허용 대상 Screen/Feature spec, 테스트를 먼저 검색합니다.
- DataGrid/Table 후보는 upstream `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- `@heroui/react` Table/Pagination/Checkbox/Button/Dropdown 등과 기존 `DataGrid`로 표현 가능한 table UI를 raw `<table>`/`div`/`button` + className 조합으로 재구현하지 않습니다.
- 신규 grid/table wrapper 생성 전에 기존 `DataGrid`를 확장하고 호출부를 함께 맞출 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 구현이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 DataGrid/Table wrapper를 금지합니다.

### FE Data Grid Agent

`packages/fe-ui/src/data-grid` 전용 role 입니다.

### 책임

- `DataGrid`, `InputRenderer`, `data-grid/input/**`, `DataGridState` 계열을 data-grid 축 안에서 정리합니다.
- table 렌더링 계층이 중첩되지 않도록 `DataGrid.tsx` 단일 렌더러를 유지합니다.
- TanStack Table row model, HeroUI Table 렌더링, 정렬 헤더, loading/empty 상태, selection/action bar, pagination 연결은 `DataGrid.tsx`가 직접 소유합니다.
- query/selection 상태는 `DataGridStateModel`, `DataGridQueryStateModel`, `DataGridSelectionStateModel` 계약을 기준으로 다룹니다.
- 검색/필터/버튼/드롭다운 입력은 `InputRenderer.tsx`와 `data-grid/input/**` 하위 컴포넌트로 확장합니다.
- `display/data-display`는 일반 display primitive만 담당하고, DataGrid/Table 구현을 다시 만들지 않습니다.
- page/feature 호출부는 `DataGrid`를 감싸는 `Surface` owner를 직접 결정합니다. DataGrid가 page-level surface를 암묵적으로 만들지 않습니다.

### 출력 경로

- `packages/fe-ui/src/data-grid/DataGrid.tsx`
- `packages/fe-ui/src/data-grid/DataGridState.ts`
- `packages/fe-ui/src/data-grid/InputRenderer.tsx`
- `packages/fe-ui/src/data-grid/input/**`
- `packages/fe-ui/src/data-grid/index.ts`
- 필요 시 공통 계약은 `packages/common-type/src/table.ts`와 `packages/common-type/src/index.ts`에 함께 반영합니다.

### 필수 규칙

- DataGrid leaf source 변경만으로는 신규 전용 spec을 만들지 않습니다. 허용 대상 Page/Feature source를 함께 바꾸는 경우에만 해당 owner spec을 갱신합니다.
- DataGrid 전용 Table wrapper를 새로 만들지 않습니다.
- row key helper는 duplicate-safe 해야 하며 `DataGrid.tsx`와 외부 호출부에서 재사용할 수 있도록 공개합니다.
- DataGrid 공개 컴포넌트, state model, helper, 타입은 `data-grid/index.ts`에서 노출합니다.
- 삭제된 legacy grid composition 계층, legacy display 하위 DataGrid/Table 경로, 별도 Table wrapper를 되살리지 않습니다.
- `useMemo`/`useCallback`을 새로 추가하지 않고, client 컴포넌트는 `observer` 기준을 유지합니다.

### 검증

- `rg "Meta.*DataGrid|Meta.*DataGridState" packages/fe-ui/src packages/common-type/src`
- `rg "from .*display.*/.*DataGrid|from .*display.*/.*Table" packages/fe-ui/src`
- `pnpm --filter=@cocrepo/ui typecheck`
- `pnpm --filter=@cocrepo/ui test -- DataGrid`

### Storybook / Unit Test 책임

- DataGrid renderer/input/state를 신규 생성하거나 수정하면 같은 작업에서 Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 기본 테이블, empty, loading, selectable/sort/filter/pagination 같은 주요 grid state를 포함합니다.
- unit test는 row key, column rendering, input renderer, empty/loading branch, event callback을 검증합니다.
- helper/type-only 변경이면 Storybook/Test 계약과 최종 보고에 불필요 사유를 남깁니다.