---
name: "fe-data-grid-builder"
description: "이 skill은 `fe-data-grid-agent` 역할로 일할 때 사용합니다. DataGrid 렌더링, 상태 계약, Column/Cell 통합 계약을 정리하는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# fe-data-grid-builder

DataGrid/Table Column builder를 만들거나 고치면 [Column 규칙](references/columns.md)을 함께 적용합니다.
DataGrid/Table Cell 컴포넌트를 만들거나 고치면 [Cell 규칙](references/cells.md)을 함께 적용합니다.

## 플랫폼 라우팅

- 이 역할은 웹 전용 agent입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native 런타임 작업은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 `DataGrid`, `columns`, `cell`, `@cocrepo/ui` export, 허용 대상 Screen/Feature 스펙, 테스트를 먼저 검색합니다.
- DataGrid/Table 후보는 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- `@heroui/react` Table/Pagination/Checkbox/Button/Dropdown 등과 기존 `DataGrid`로 표현 가능한 table UI를 raw `<table>`/`div`/`button` + className 조합으로 재구현하지 않습니다.
- 신규 grid/table wrapper 생성 전에 기존 `DataGrid`를 확장하고 호출부를 함께 맞출 수 있는지 우선 판단합니다.
- 동일 책임의 중복 DataGrid/Table wrapper를 금지합니다.

### FE DataGrid 역할

`packages/fe-ui/src/data-grid`, DataGrid/Table용 `packages/fe-ui/src/data-grid/columns`, `packages/fe-ui/src/data-grid/cell` 전용 역할입니다.

### 책임

- `DataGrid`, `InputRenderer`, `data-grid/input/**`, `DataGridState` 계열을 data-grid 축 안에서 정리합니다.
- `data-grid/columns/**`의 DataGrid/Table Column builder와 preset/helper를 data-grid 축 안에서 정리합니다.
- `data-grid/cell/**`의 DataGrid/Table Cell 컴포넌트를 Pure UI, Widget, Feature 계층에 맞게 정리합니다.
- table 렌더링 계층이 중첩되지 않도록 `DataGrid.tsx` 단일 렌더러를 유지합니다.
- TanStack Table 행 model, HeroUI Table 렌더링, 정렬 헤더, loading/empty 상태, selection/action bar, pagination 연결은 `DataGrid.tsx`가 직접 소유합니다.
- query/selection 상태는 `DataGridStateModel`, `DataGridQueryStateModel`, `DataGridSelectionStateModel` 계약을 기준으로 다룹니다.
- 검색/필터/버튼/드롭다운 입력은 `InputRenderer.tsx`와 `data-grid/input/**` 하위 컴포넌트로 확장합니다.
- column builder는 Cell을 조합만 하며, 실제 셀 UI는 `data-grid/cell/**`이 소유합니다.
- `display/data-display`는 일반 display primitive만 담당하고, DataGrid/Table 구현을 다시 만들지 않습니다.
- screen은 `DataGrid`를 감싸는 `SectionSurface` owner를 직접 결정합니다. DataGrid가 page-level surface를 암묵적으로 만들지 않습니다.
- feature/widget table panel에서 local panel이 필요하면 `Surface`만 사용합니다.
- 신규 DataGrid 호출부에서 제거된 detail/form 이전 방식 surface wrapper로 table panel을 만들지 않습니다.

### 출력 경로

- `packages/fe-ui/src/data-grid/DataGrid.tsx`
- `packages/fe-ui/src/data-grid/DataGridState.ts`
- `packages/fe-ui/src/data-grid/InputRenderer.tsx`
- `packages/fe-ui/src/data-grid/input/**`
- `packages/fe-ui/src/data-grid/columns/**`
- `packages/fe-ui/src/data-grid/cell/**`
- `packages/fe-ui/src/data-grid/index.ts`
- 필요 시 공통 계약은 `packages/common-type/src/table.ts`와 `packages/common-type/src/index.ts`에 함께 반영합니다.

### 필수 규칙

- DataGrid leaf 소스 변경만으로는 신규 전용 spec을 만들지 않습니다. 허용 대상 Page/Feature source를 함께 바꾸는 경우에만 해당 담당 스펙을 갱신합니다.
- DataGrid 전용 Table wrapper를 새로 만들지 않습니다.
- 행 key helper는 duplicate-safe 해야 하며 `DataGrid.tsx`와 외부 호출부에서 재사용할 수 있도록 공개합니다.
- DataGrid 공개 컴포넌트, 상태 model, helper, 타입은 `data-grid/index.ts`에서 노출합니다.
- DataGrid column builder는 `data-grid/columns/index.ts`에서 노출하고, public export는 `data-grid/index.ts`를 거칩니다.
- 삭제된 이전 방식 grid composition 계층, 이전 방식 display 하위 DataGrid/Table 경로, 별도 Table wrapper를 되살리지 않습니다.
- `useMemo`/`useCallback`을 새로 추가하지 않고, client 컴포넌트는 `observer` 기준을 유지합니다.
- `data-grid/cell/**`은 DataGrid/Table에서 재사용 가능한 Cell만 둡니다. 특정 도메인 전용 이름이나 도메인 API/store 연결은 만들지 않습니다.
- `data-grid/columns/**`은 field, label, accessor, align, cell 조합 선언만 담당합니다.
- 새 Cell이 필요하면 먼저 기존 Cell 조합 가능성을 확인하고, 불가할 때만 최소 범위로 추가합니다.

### 검증

- `rg "Meta.*DataGrid|Meta.*DataGridState" packages/fe-ui/src packages/common-type/src`
- `rg "from .*display.*/.*DataGrid|from .*display.*/.*Table" packages/fe-ui/src`
- `pnpm --filter=@cocrepo/ui typecheck`
- `pnpm --filter=@cocrepo/ui test -- DataGrid`

- 단위 테스트는 행 key, column rendering, input renderer, empty/loading 분기, event callback을 검증합니다.

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
