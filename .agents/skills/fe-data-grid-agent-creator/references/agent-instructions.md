# fe-data-grid-agent 상세 지시

원본 에이전트 파일: `.codex/agents/38-fe-data-grid-agent.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 역할은 웹 전용 agent입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native 런타임 작업은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

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
- 재사용 후보가 있으면 우선 채택하고, 신규 구현이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
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
- Cell 소스 변경 시 같은 위치 단위 테스트 작성/갱신을 검토합니다.

### 검증

- `rg "Meta.*DataGrid|Meta.*DataGridState" packages/fe-ui/src packages/common-type/src`
- `rg "from .*display.*/.*DataGrid|from .*display.*/.*Table" packages/fe-ui/src`
- `pnpm --filter=@cocrepo/ui typecheck`
- `pnpm --filter=@cocrepo/ui test -- DataGrid`


- DataGrid renderer/input/상태를 신규 생성하거나 수정하면 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 행 key, column rendering, input renderer, empty/loading 분기, event callback을 검증합니다.
