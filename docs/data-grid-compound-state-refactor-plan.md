# DataGrid compound state 리팩터링 계획

## 목적

DataGrid를 하나의 완성형 컴포넌트로만 소비하는 구조에서, 상태 책임과 UI 구조를 명시적으로 드러내는 compound 구조로 전환한다. 이 리팩터링의 목표는 상태를 늘리는 것이 아니라, 부모가 소유한 단일 `DataGridState`를 책임별 하위 state로 나누어 각 UI 구성 요소에 직접 연결하는 것이다.

## 설계 결정

- `DataGridState`가 DataGrid 상태의 유일한 소유자다.
- 하위 state는 독립적인 상태 원천이나 복사본이 아니다. 모두 같은 `DataGridState`의 책임별 facade다.
- `Container`는 순수한 UI 배치 역할만 가지며 `state` prop을 받지 않는다.
- 상태와 행동이 있는 구성 요소만 자신의 책임에 맞는 state를 받는다.
- `Table`은 `DataGrid` 하위 property가 아닌 독립 compound namespace다.
- `Pagination`은 table footer와 다른 Grid 탐색 책임이므로 `Table.Container` 밖에 둔다.
- 완성형 `<DataGrid />`를 유지한다면 compound 표준 조합을 호출하는 얇은 편의 API로만 둔다. 별도 상태나 별도 조립 규칙을 소유하지 않는다.

## 목표 UI 조립 구조

```tsx
<DataGrid.Container>
  <DataGrid.Toolbar state={dataGridState.toolbar} />
  <DataGrid.GroupPanel state={dataGridState.groupPanel} />

  <Table.Container>
    <Table.Header state={dataGridState.table.header} />
    <Table.Body state={dataGridState.table.body} />
    <Table.Footer state={dataGridState.table.footer} />
  </Table.Container>

  <DataGrid.Pagination state={dataGridState.pagination} />
  <DataGrid.ActionBar state={dataGridState.actionBar} />
</DataGrid.Container>
```

`DataGrid.Container`와 `Table.Container`는 UI 배치와 markup만 담당한다. 이 컴포넌트들은 query, selection, columns 또는 changes를 직접 받거나 변경하지 않는다.

## 목표 상태 트리

```text
DataGridState
|- query: DataGridQueryState
|- columns: DataGridColumnsState
|- selection: DataGridSelectionState
|- changes: DataGridChangesState
|- toolbar: DataGridToolbarState
|- groupPanel: DataGridGroupPanelState
|- table: DataGridTableState
|  |- header: DataGridTableHeaderState
|  |- body: DataGridTableBodyState
|  `- footer: DataGridTableFooterState
|- pagination: DataGridPaginationState
`- actionBar: DataGridActionBarState
```

각 state의 이름에는 소유 UI와 DataGrid 문맥이 드러나야 한다. 예를 들어 `Table.Header`에는 `DataGridTableHeaderState`, `DataGrid.Pagination`에는 `DataGridPaginationState`를 전달한다. `State`, `TableState`, `HeaderState`처럼 문맥이 없는 이름은 사용하지 않는다.

## 상태 소유와 위임 규칙

### DataGridState

- query, column, selection, changes의 canonical 값을 소유한다.
- URL query 동기화 callback과 외부 selection callback을 보유한다.
- 하위 facade state를 한 번 생성하고 동일 인스턴스를 유지한다.
- 하위 state가 필요한 canonical 값 또는 변경 동작을 위임받을 수 있게 한다.

### 하위 state

- `DataGridToolbarState`는 검색, filter, column 설정에 필요한 query와 column 동작만 노출한다.
- `DataGridGroupPanelState`는 grouping 표시와 grouping 변경 동작만 노출한다.
- `DataGridTableHeaderState`는 header 렌더링, sort, column sizing, column visibility 관련 동작만 노출한다.
- `DataGridTableBodyState`는 row rendering, selection, hierarchy, inline edit, row move 관련 동작만 노출한다.
- `DataGridTableFooterState`는 합계 또는 소계처럼 실제 table footer 요구사항이 있을 때만 상태를 가진다. 요구사항이 없으면 비어 있거나 렌더하지 않는다.
- `DataGridPaginationState`는 `skip`, `take`, `totalCount`와 page 변경 동작만 노출한다.
- `DataGridActionBarState`는 선택 개수와 선택된 행에 가능한 action만 노출한다.

하위 state는 동일 값을 별도 field에 복제하거나 서로를 동기화하지 않는다. 필요한 경우 root state를 참조하거나 root가 전달한 canonical model을 참조한다.

## 공개 API 방향

```ts
export const DataGrid = {
  Container: DataGridContainer,
  Toolbar: DataGridToolbar,
  GroupPanel: DataGridGroupPanel,
  Pagination: DataGridPagination,
  ActionBar: DataGridActionBar,
};

export const Table = {
  Container: DataGridTableContainer,
  Header: DataGridTableHeader,
  Body: DataGridTableBody,
  Footer: DataGridTableFooter,
};
```

`Table`이라는 공개 이름이 기존 공용 Table export와 충돌하면 공개 import 이름만 `DataGridTable`로 조정한다. 이 경우에도 내부 compound 구조는 `Container`, `Header`, `Body`, `Footer` 두 단계로 유지한다.

완성형 API를 제공할 경우에는 다음처럼 compound 조립을 감싸는 용도로 제한한다.

```tsx
<DataGrid state={dataGridState} />
```

이 API는 새 state를 만들거나 compound와 다른 상태 흐름을 만들지 않는다.

## 목표 폴더 트리와 컴포넌트 이름

기존 `packages/fe-ui/src/data-grid`의 PascalCase 폴더 관례를 유지한다. 공용 Cell, input, columns, internal 유틸은 현재 위치를 유지하고, Grid와 Table의 조립 및 state만 아래 구조로 정리한다.

```text
packages/fe-ui/src/data-grid/
|- index.ts
|- index.stories.tsx                    # DataGrid 모든 주요 계약을 검증하는 단일 Storybook 파일
|- DataGrid.tsx                         # 선택 사항: 표준 compound 조합의 thin wrapper
|- state/
|  |- DataGridState.ts
|  |- DataGridQueryState.ts
|  |- DataGridColumnsState.ts
|  |- DataGridSelectionState.ts
|  |- DataGridChangesState.ts
|  |- DataGridToolbarState.ts
|  |- DataGridGroupPanelState.ts
|  |- DataGridPaginationState.ts
|  |- DataGridActionBarState.ts
|  `- table/
|     |- DataGridTableState.ts
|     |- DataGridTableHeaderState.ts
|     |- DataGridTableBodyState.ts
|     |- DataGridTableFooterState.ts
|     `- DataGridEditingState.ts
|- DataGridContainer/
|  |- DataGridContainer.tsx
|  `- index.ts
|- DataGridToolbar/
|  |- DataGridToolbar.tsx
|  `- index.ts
|- DataGridGroupPanel/
|  |- DataGridGroupPanel.tsx
|  `- index.ts
|- DataGridPagination/
|  |- DataGridPagination.tsx
|  `- index.ts
|- DataGridActionBar/
|  |- DataGridActionBar.tsx
|  `- index.ts
|- Table/
|  |- index.ts
|  |- TableContainer/
|  |  |- TableContainer.tsx
|  |  `- index.ts
|  |- TableHeader/
|  |  |- TableHeader.tsx
|  |  `- index.ts
|  |- TableBody/
|  |  |- TableBody.tsx
|  |  `- index.ts
|  `- TableFooter/
|     |- TableFooter.tsx
|     `- index.ts
|- DataGridLoading/
|- DataGridEmptyRow/
|- input/
|  |- ColumnFilterInput/
|  |  |- ColumnFilterInput.tsx
|  |  `- index.ts
|  |- ColumnSortInput/
|  |  |- ColumnSortInput.tsx
|  |  `- index.ts
|  `- ColumnResizerInput/
|     |- ColumnResizerInput.tsx
|     `- index.ts
|- cell/
|  |- SelectionCell/
|  |  |- SelectionCell.tsx
|  |  `- index.ts
|  |- HierarchyCell/
|     |- HierarchyCell.tsx
|     `- index.ts
|  `- EditorCell/
|     |- EditorCell.tsx
|     `- index.ts
|- columns/
`- internal/
```

### component namespace와 prop 계약

```ts
export const DataGrid = {
  Container: DataGridContainer,
  Toolbar: DataGridToolbar,
  GroupPanel: DataGridGroupPanel,
  Pagination: DataGridPagination,
  ActionBar: DataGridActionBar,
};

export const Table = {
  Container: TableContainer,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
};
```

| 컴포넌트 | state prop | 책임 |
| --- | --- | --- |
| `DataGrid.Container` | 없음 | Grid 전체 layout과 children 배치 |
| `DataGrid.Toolbar` | `DataGridToolbarState` | query input과 column 설정 |
| `DataGrid.GroupPanel` | `DataGridGroupPanelState` | grouping 표시와 변경 |
| `Table.Container` | 없음 | `<table>` 계열 markup과 Header, Body, Footer 배치 |
| `Table.Header` | `DataGridTableHeaderState` | header, sort, resize, visibility |
| `Table.Body` | `DataGridTableBodyState` | row, cell, selection, editing, hierarchy, row move |
| `Table.Footer` | `DataGridTableFooterState` | 합계, 소계 등 table footer 정보 |
| `DataGrid.Pagination` | `DataGridPaginationState` | 페이지 이동과 범위 표시 |
| `DataGrid.ActionBar` | `DataGridActionBarState` | 선택 결과 action 표현 |

`DataGrid.Container`와 `Table.Container`에 state prop을 추가하지 않는다. 상태가 없어도 필요한 정적 UI 설정은 일반 prop 또는 children으로 전달할 수 있지만, query, column, selection, changes 같은 DataGrid 상태를 소유하거나 전달받지 않는다.

### 기존 경로 이동 원칙

| 현재 경로 | 목표 경로 | 비고 |
| --- | --- | --- |
| `DataGrid.tsx` | `DataGridContainer/DataGridContainer.tsx` | 기존 root/compound 조립 역할을 Container로 명확화 |
| `DataGridTable.tsx` | `Table/TableContainer/TableContainer.tsx` | Table의 최상위 markup 책임 |
| `DataGridTableHeader/` | `Table/TableHeader/` | `Table.Header` leaf |
| `DataGridTableBody/` | `Table/TableBody/` | `Table.Body` leaf |
| 신규 | `Table/TableFooter/` | 실제 footer 요구사항이 생길 때 구현 |
| `DataGridState.ts` | `state/DataGridState.ts` | root state와 facade state의 진입점 |
| `DataGridChangesState.ts` | `state/DataGridChangesState.ts` | canonical changes model |
| `DataGridHeaderFilter/` | `input/ColumnFilterInput/` | column filter 입력 UI |
| `DataGridSortHeader/` | `input/ColumnSortInput/` | column sort 입력 UI |
| `DataGridColumnResizer/` | `input/ColumnResizerInput/` | column width 조절 입력 UI |
| `DataGridSelectionCell/` | `cell/SelectionCell/` | row selection 표시 cell |
| `DataGridHierarchyCell/` | `cell/HierarchyCell/` | hierarchy 표시 cell |
| `editor/DataGridEditor.tsx` | `cell/EditorCell/EditorCell.tsx` | inline edit cell UI |

`ColumnFilterInput`, `ColumnSortInput`, `ColumnResizerInput`은 Header가 조합하지만 입력 행동을 소유하므로 `input/`에 둔다. `SelectionCell`, `HierarchyCell`은 Body가 조합하지만 cell UI이므로 `cell/`에 둔다. 이 leaf들은 `Table.Header` 또는 `Table.Body`의 state를 직접 받지 않고, 필요한 값과 handler만 prop으로 받는다.

`EditorCell`은 table cell 안에서 값을 표시하고 수정 lifecycle을 연결하므로 `cell/`에 둔다. `DataGridEditingState`는 `state/table/`에 남고, `EditorCell`은 editing state 전체를 받지 않는다. Body가 전달한 value, validation 결과, `onValueChange`, `onFinish`, `onCancel`만 사용한다.

## Storybook 범위

- `packages/fe-ui/src/data-grid/index.stories.tsx` 하나만 작성한다.
- 이 파일은 표준 compound 조립과 `default`, `loading`, `empty`, `selected`, `sort`, `filter`, `pagination`, `grouping`, `hierarchy`, `inline edit`, `row move`를 named story로 제공한다.
- fixture와 story 전용 `DataGridState`는 이 파일 안에 두며, 실제 API, router, MobX 전역 store, browser storage에는 의존하지 않는다.
- Header, Body, Footer, toolbar, group panel, pagination, action bar, cell, input에는 별도 story 파일을 만들지 않는다.

## 구현 단계

1. 기존 `fe-data-grid-agent` 정의의 최소 갱신을 먼저 반영한다.
2. `DataGridState`의 canonical 상태와 하위 facade state의 책임을 먼저 확정한다.
3. `DataGridToolbarState`, `DataGridGroupPanelState`, `DataGridTableState`, `DataGridTableHeaderState`, `DataGridTableBodyState`, `DataGridTableFooterState`, `DataGridPaginationState`, `DataGridActionBarState`를 추가하거나 기존 상태를 이 책임으로 이동한다.
4. `DataGrid.Container`, `DataGrid.Toolbar`, `DataGrid.GroupPanel`, `DataGrid.Pagination`, `DataGrid.ActionBar`를 state prop 계약에 맞춰 정리한다.
5. `Table.Container`, `Table.Header`, `Table.Body`, `Table.Footer`를 독립 namespace로 정리하고, 각 leaf에 필요한 하위 state만 전달한다.
6. 현재 `index.tsx`의 완성형 조립 로직을 compound 조립의 기준 구현으로 바꾼다.
7. 완성형 `<DataGrid />`를 유지할지 결정한 뒤, 유지한다면 기준 조립을 재사용하는 thin wrapper로 구현한다.
8. 기존 소비 화면을 새 compound 계약 또는 완성형 wrapper로 한 번에 전환한다. 두 API가 동일한 일을 서로 다르게 구현하지 않게 한다.
9. 공개 export, Storybook, 단위 테스트를 새 상태 경계와 조립 계약에 맞춰 갱신한다.

## 기존 fe-data-grid-agent 정의 최소 갱신

### 갱신 대상

```text
.codex/agents/fe-data-grid-agent.toml
.zcode/agents/fe-data-grid-agent.md
```

기존 `fe-data-grid-agent`는 자기 정의문의 역할 지시문을 따르는 웹 전용 worker다. 현재 runtime 등록 위치인 `.codex/agents/fe-data-grid-agent.toml`(과 미러 `.zcode/agents/fe-data-grid-agent.md`)의 기존 정의를 최소 갱신하며 새 agent를 생성하지 않는다. 이 단계에서는 agent를 여러 역할로 나누거나 agent 간 호출을 추가하지 않는다.

### agent 역할과 ownership

- 소유 경로는 `packages/fe-ui/src/data-grid/**`다.
- 직접 소유하는 작업은 DataGrid state, compound component, input, cell, column, export, 관련 테스트다.
- Screen, route, API, domain 정책을 변경해야 하면 필요한 입력과 소비 경로만 보고하고 임의로 수정하지 않는다.
- 리팩터링 계획 문서가 승인된 입력일 때만 구조 이동과 공개 계약 변경을 수행한다.
- 결과는 프로젝트의 Worker 최종 보고 형식으로 변경 경로, 공개 계약, 검증 결과를 남긴다.

### 정의문 최소 갱신 범위

정의문에는 다음 확정 규칙만 추가하거나 기존 규칙을 교체한다.

- `DataGridState` 하나를 root state로 사용하고, child state는 facade이며 상태 복제본이 아님을 명시한다.
- `DataGrid.Container`와 `Table.Container`는 state를 받지 않는 UI 구조 컴포넌트로 명시한다.
- 상태가 있는 leaf는 전체 `DataGridState` 대신 책임별 `DataGrid...State`를 받도록 명시한다.
- `Table`은 `DataGrid.Table`이 아닌 독립 compound namespace로 명시한다.
- `EditorCell`, `SelectionCell`, `HierarchyCell`은 `cell/`에, `ColumnFilterInput`, `ColumnSortInput`, `ColumnResizerInput`은 `input/`에 둔다.
- 기존의 단일 `DataGrid.tsx` 렌더러 규칙은 compound 조립 구조와 충돌하지 않게 `index.tsx` 조립 진입점 기준으로 갱신한다.

### 최소 사용 방식

루트는 아래처럼 하나의 ownership 단위만 agent에 맡긴다.

```text
DataGrid compound state 리팩터링 계획의 2단계를 수행한다.
대상은 packages/fe-ui/src/data-grid/state/**다.
계획 문서의 단일 root state와 facade 규칙을 적용하고, 변경 경로와 검증 결과만 보고한다.
```

다음 단계는 이전 결과의 공개 export, 상태 계약, 검증 결과만 입력으로 받아 진행한다. agent는 다른 subagent를 호출하거나 후속 실행 순서를 결정하지 않는다.

### 후속 고도화 범위

- agent별 세분화된 input template와 작업 분할 자동화
- 복잡한 facade state의 예제 또는 별도 reference 문서
- agent 출력의 자동 검사와 반복 실행 지원
- Storybook, Screen migration 등 다른 owner와의 자동 연결

이 항목들은 실제 `fe-data-grid-agent`를 사용해 본 뒤 필요할 때 추가한다.

## 완료 기준

- Container 계열 컴포넌트는 `state` prop을 받지 않는다.
- 상태가 있는 leaf는 전체 `DataGridState`가 아니라 자기 책임의 하위 state만 받는다.
- query, columns, selection, changes의 상태 원천은 하나이며 복제 또는 동기화 코드가 없다.
- `Table`은 `DataGrid.Table.*`가 아닌 독립 두 단계 compound namespace로 제공된다.
- pagination은 `Table.Footer`와 분리된 Grid 수준 구성 요소다.
- URL query 변경, selection 변경, edit commit, row move 결과가 기존과 같은 상위 callback 계약을 유지한다.
- 완성형 API를 유지하는 경우 compound 조립과 같은 상태 인스턴스와 행동을 사용한다.
- 각 state facade와 해당 UI leaf의 행동을 단위 테스트로 검증한다.

## 범위 밖

- 도메인별 column, cell, API 요청, Screen의 데이터 조회 정책을 DataGrid로 옮기지 않는다.
- state facade 도입을 이유로 새로운 전역 store 또는 React local state를 만들지 않는다.
- 시각 디자인 변경은 구조 리팩터링과 분리한다.
