# DataGrid 계획 문서

> 생성일: 2026-07-02
> 타입: component spec
> 위치: `packages/fe-ui/src/data-grid/DataGrid.tsx`

## 역할

`DataGrid`는 목록 화면에서 사용하는 표준 데이터 테이블 컴포넌트입니다.
컬럼, 필터, 정렬, 페이지네이션, 선택 상태를 하나의 계약으로 렌더링합니다.

조회·컬럼·선택 상호작용은 `DataGridState`에 반영합니다.
행 클릭과 이동처럼 상위 데이터 구조가 결정해야 하는 결과만 config callback으로 전달합니다.
서버에는 class instance를 저장하지 않고 `toJSON()`으로 만든 snapshot만 영구 저장합니다.

## 기능

| 기능 | 설명 |
| --- | --- |
| 컬럼 렌더링 | TanStack Table column 정의를 기준으로 header와 cell을 렌더링합니다. |
| 셀 렌더링 | `data-grid/cell/**`의 공용 Cell 컴포넌트를 column cell renderer에서 조합해 값, 상태, 액션을 표시합니다. |
| 컬럼 표시 설정 | 사용자 state의 `columns.visibility`를 기준으로 표시 가능한 컬럼만 렌더링합니다. |
| 컬럼 순서 | 사용자 state의 `columns.order`를 기준으로 컬럼 표시 순서를 정합니다. |
| 컬럼 크기 | 사용자 state의 `columns.sizing`을 기준으로 컬럼 너비를 적용합니다. |
| 컬럼 너비 조절 | header 오른쪽 resize handle drag로 `columns.sizing`을 갱신합니다. |
| row grouping | `query.groupBy` 컬럼 기준으로 같은 값을 가진 row를 그룹 row 아래에 묶고 expand/collapse 할 수 있습니다. |
| 실제 계층 행 | `getSubRows`가 반환한 실제 자식 행을 펼치고 접습니다. `setGrouping`으로 만든 가상 그룹 행과 섞지 않습니다. |
| 인라인 편집 | `columns[].editable` 셀을 클릭하면 편집 UI로 전환하고 값을 `state.changes`에 즉시 반영합니다. |
| 행 이동 | 이동 가능한 계층 행을 위아래로 정렬하고 가로 이동량으로 부모를 변경한 뒤 `onRowMove`에 결과를 전달합니다. |
| 변경 추적 | 생성·수정·삭제 내역을 원본 행 변경 없이 배열 snapshot으로 관리합니다. |
| row group panel | AG Grid `rowGroupPanelShow`처럼 grouping 가능한 컬럼을 추가, 제거, 순서 변경하고 `groupBy` query string에 반영하는 상단 panel을 표시할 수 있습니다. |
| group pagination | `groupBy` query가 있으면 백엔드는 group 단위로 페이지네이션하고, DataGrid에는 선택된 group의 leaf row만 flat 배열로 전달합니다. |
| 정렬 | 사용자 state의 `query.sort`를 기준으로 정렬 상태를 표시하고 변경합니다. |
| 필터 | `headerInput`은 컬럼 필터 정의로 사용하고, `floatingFilter: true`인 컬럼만 AG Grid floating filter처럼 header 아래 input row에 표시해 query string에 반영합니다. |
| 페이지네이션 | `query.skip`, `query.take`를 state로 관리하고 query string에 반영합니다. |
| 행 선택 | 화면에는 선택 개수와 벌크 액션만 표시합니다. 선택된 row key 목록은 노출하지 않습니다. |
| loading/empty | 로딩 중 skeleton과 빈 상태 메시지를 표시합니다. |
| 다크모드 | header, cell, floating filter, grid line, selected/hover 상태가 light/dark 각각 충분한 대비를 갖도록 렌더링합니다. |

## 구현 구성

### 주요 config

| 필드 | 설명 |
| --- | --- |
| `rowGroupPanelShow` | `"never"`, `"always"`, `"onlyWhenGrouping"` 중 하나입니다. AG Grid Row Group Panel처럼 grouping control 표시 여부를 정합니다. |
| `columns[].rowGroup` | 해당 컬럼을 기본 grouping 기준으로 사용합니다. |
| `columns[].enableRowGroup` | 해당 컬럼을 Row Group Panel에서 grouping 기준으로 선택할 수 있게 합니다. |
| `getSubRows` | 실제 부모·자식 행의 자식 배열을 반환합니다. |
| `columns[].rowExpander` | 계층 들여쓰기, 펼침 버튼, 이동 핸들을 표시할 컬럼입니다. |
| `columns[].editable` | 일반 cell과 별도로 클릭 편집 시 사용할 renderer를 선언합니다. |
| `onRowMove` | 이동된 행, 새 부모, 새 index, 최종 형제 순서를 상위 상태에 전달합니다. |

### group response 계약

일반 목록과 `groupBy` 목록의 `rows`는 leaf row 배열을 받습니다.
백엔드는 group row tree를 내려주지 않고, `groupBy` query가 있을 때 선택된 group에 속한 leaf row를 flat 배열로 반환합니다.
DataGrid는 `query.groupBy` 값을 기준으로 받은 leaf row를 클라이언트에서 그룹으로 묶어 표시합니다.

카테고리처럼 실제 행 자체가 부모가 되는 경우에는 `groupBy`를 사용하지 않습니다.
상위에서 중첩 행을 만들고 `getSubRows`로 연결하며, 빈 부모 행과 각 행의 id를 그대로 유지합니다.

`groupBy`가 없는 경우 `skip`/`take`는 일반 row 단위입니다.
`groupBy`가 있는 경우 `skip`/`take`는 첫 번째 group level의 group 단위입니다.
예를 들어 `groupBy=status&skip=0&take=3` 요청에서 선택된 3개 group의 leaf row가 각각 3, 4, 5개라면 `rows.length`는 12가 될 수 있습니다.
이때 `totalCount`는 leaf row 수가 아니라 전체 group 수입니다.

여러 `groupBy`가 있는 경우 페이지네이션은 첫 번째 group level에 적용하고, 선택된 top-level group 아래의 leaf row를 모두 반환합니다.

### 재사용할 것

| 대상 | 사용 방식 |
| --- | --- |
| `DataGrid.tsx` | 기존 DataGrid를 확장합니다. 별도 Table wrapper를 새로 만들지 않습니다. |
| `@tanstack/react-table` | column/header/cell 렌더링, row model, expanded row model, `flexRender`, row id 계산에 사용합니다. |
| `getDataGridRowKey` | 중복 row id까지 처리하는 row key helper로 계속 사용하고 공개 export를 유지합니다. |
| `InputRenderer.tsx` | toolbar filter, header filter, data filter, selection action button을 config 기반으로 렌더링하는 진입점으로 사용합니다. |
| `data-grid/input/SearchInput.tsx` | 검색 입력과 단일 text filter에 사용합니다. |
| `data-grid/input/SelectInput.tsx` | 단일 select filter에 사용합니다. |
| `data-grid/input/ButtonInput.tsx` | 컬럼 설정, data filter 열기, 벌크 액션 버튼에 사용합니다. |
| `data-grid/input/DropdownInput.tsx` | 정해진 action menu나 option menu에 사용합니다. |
| `Button` | DataGrid 내부 command button에 사용합니다. raw `<button>`을 새로 만들지 않습니다. |
| `Input` | 검색, header text filter, text 기반 filter에 사용합니다. raw `<input type="text">`를 새로 만들지 않습니다. |
| `Select` | 단일 선택 filter에 사용합니다. |
| `Checkbox` | row 선택, 전체 선택, 컬럼 표시 설정에 사용합니다. raw checkbox를 새로 만들지 않습니다. |
| `Pagination` | 하단 페이지 이동에 사용합니다. |
| `Skeleton` | loading 상태에 사용합니다. |
| `EmptyState` | empty 상태에 사용합니다. |
| `data-grid/columns/data-grid/**` | 도메인별 column builder는 계속 외부에서 주입합니다. DataGrid가 도메인 column을 직접 만들지 않습니다. |
| `data-grid/cell/**` | BooleanCell, ActionButtonCell 같은 공용 Cell 컴포넌트는 DataGrid slice의 표시 단위로 관리하고 column cell renderer에서 재사용합니다. |

### 새로 만들거나 확장할 것

| 대상 | 역할 |
| --- | --- |
| `DataGridState.ts` | `DataGridState`, `DataGridColumnsState`, `DataGridQueryState`, `DataGridFilterState`, `DataGridFilterRule`, `DataGridPaginationState`, `DataGridSelectionState` class를 정의합니다. 불필요한 접미사가 붙은 이름은 사용하지 않습니다. |
| `DataGridChangesState.ts` | 저장 전 생성·수정·삭제 내역을 관리하고 렌더링용 행과 저장용 snapshot을 반환합니다. |
| `DataGridQueryString.ts` | `nuqs`를 사용해 `sort`, `groupBy`, filter key, `skip`, `take`를 URL query string과 동기화합니다. |
| `DataGridToolbar/DataGridToolbar.tsx` | 상단 toolbar view입니다. 좌/우 input과 컬럼 설정 진입점을 렌더링합니다. |
| `DataGridGroupPanel/DataGridGroupPanel.tsx` | AG Grid Row Group Panel처럼 grouping 가능한 컬럼을 추가, 제거, 순서 변경하는 compact panel입니다. |
| `DataGridTable/DataGridTable.tsx` | native table 컨테이너 view입니다. header/body를 조립합니다. |
| `DataGridTableHeader/DataGridTableHeader.tsx` | 선택 header, 정렬 header, `floatingFilter: true` 컬럼의 header filter row를 렌더링합니다. |
| `DataGridTableBody/DataGridTableBody.tsx` | group row, leaf row, cell, empty row를 렌더링합니다. |
| `DataGridColumnResizer/DataGridColumnResizer.tsx` | 컬럼 header 오른쪽 drag handle로 컬럼 너비를 조절하고 `columns.sizing`에 반영합니다. |
| `DataGridEmptyRow/DataGridEmptyRow.tsx` | empty 상태를 table row 안에서 렌더링합니다. |
| `DataGridLoading/DataGridLoading.tsx` | loading skeleton view입니다. |
| `DataGridPagination/DataGridPagination.tsx` | 하단 total count와 pagination을 렌더링합니다. |
| `DataGridActionBar/DataGridActionBar.tsx` | 선택 개수와 벌크 액션만 표시합니다. `selectedRowKeys` 목록은 표시하지 않습니다. |
| `DataGridSelectionCell/DataGridSelectionCell.tsx` | row 선택 checkbox/radio cell을 렌더링합니다. |
| `DataGridColumnSettings/DataGridColumnSettings.tsx` | `columns.order`, `columns.visibility`, `columns.sizing`을 조정하는 컬럼 설정 UI입니다. `Button`, `Checkbox`, `Dropdown` 계열을 재사용합니다. |
| `DataGridHeaderFilter/DataGridHeaderFilter.tsx` | 컬럼 header 아래에 붙는 filter input을 렌더링합니다. 내부 입력은 `InputRenderer`와 기존 input 컴포넌트를 재사용합니다. |
| `DataGridSortHeader/DataGridSortHeader.tsx` | 정렬 가능한 header label과 정렬 방향 표시를 담당합니다. 상태 변경은 `query.sort`에 반영합니다. |
| `DataGrid*/index.tsx` | 각 DataGrid 하위 컴포넌트의 public entry입니다. `observer(...)`를 적용하고 props type을 재export합니다. |
| `DataGridDataFilter.tsx` | 여러 field/operator/value rule을 조합하는 data filter UI입니다. 결과는 `query.filters.data`에 반영합니다. |
| `data-grid/input/MultiSelectInput.tsx` | `InputRenderer`의 `multi-select` 타입 구현입니다. |
| `data-grid/input/DateRangeInput.tsx` | `InputRenderer`의 `date-range` 타입 구현입니다. |
| `data-grid/input/ChipGroupInput.tsx` | `InputRenderer`의 `chip-group` 타입 구현입니다. |
| `data-grid/cell/**` | DataGrid/Table에서 재사용하는 Pure UI, Widget, Feature Cell 컴포넌트를 보강합니다. |

### 만들지 않을 것

| 대상 | 이유 |
| --- | --- |
| 별도 `DataTable`/`Table` wrapper | `DataGrid.tsx`가 단일 렌더러를 소유합니다. |
| `display/data-display` 하위 DataGrid | DataGrid 책임이 분산됩니다. |
| 새 Button/Input/Select/Pagination primitive | 이미 `@cocrepo/ui` primitive가 있습니다. |
| 도메인 전용 cell | `data-grid/cell/**`은 DataGrid/Table 공용 표시 단위만 소유합니다. 도메인 column builder는 공용 Cell을 조합만 합니다. |
| `hierarchy` 도메인 config | DataGrid는 `childrenField`, `parentField`, `orderField` 같은 도메인 필드명을 알지 않습니다. |

## Column 통합 계약

`packages/fe-ui/src/data-grid/columns/**`은 DataGrid/Table의 column builder 계층으로 DataGrid slice에 포함합니다.
Column과 Cell 규칙은 `fe-data-grid-agent`의 DataGrid 계약으로 통합합니다.

| 항목 | 계약 |
| --- | --- |
| 소유 owner | `fe-data-grid-agent`가 `data-grid/**` 안에서 `data-grid/columns/**`을 소유합니다. |
| 공개 경로 | `data-grid/columns/index.ts`에서 공개하고, `data-grid/index.ts`를 거쳐 `@cocrepo/ui` public export로 노출합니다. |
| 도메인 column | `data-grid/columns/data-grid/**`에 두며, DataGrid에 외부 주입되는 `DataGridColumnConfig` 조합만 담당합니다. |
| 내부 helper | `data-grid/columns/internal/**`에 두며, page나 feature가 직접 import하지 않습니다. |
| Cell 경계 | column builder는 field, label, accessor, align, cell 조합 선언만 담당하고 실제 UI는 `data-grid/cell/**`에 둡니다. |
| 금지 | DataGrid 외부에 새 `columns/**` top-level 레이어를 만들지 않습니다. |

## Cell 통합 계약

`packages/fe-ui/src/data-grid/cell/**`은 DataGrid/Table의 셀 표시 단위로 DataGrid slice에 포함합니다.
Cell 규칙과 구현 책임은 `fe-data-grid-agent`가 통합 소유합니다.

| 항목 | 계약 |
| --- | --- |
| 소유 owner | `fe-data-grid-agent`가 `data-grid/**`와 함께 `data-grid/cell/**`을 소유합니다. |
| Cell 계층 | 단순 값 표시 Pure UI Cell, UI 조합 Widget Cell, 행 액션 같은 Feature Cell로 나눕니다. |
| column builder 역할 | `data-grid/columns/data-grid/**`는 field, label, accessor, align, cell 조합 선언만 담당합니다. |
| 금지 | column builder 안에서 `div`, `span`, `Button`, `Chip`, `Switch` 같은 셀 UI 마크업을 직접 만들지 않습니다. |
| 도메인 경계 | 도메인 API 호출, store 연결, route 결정은 screen/feature/page가 소유하고 Cell에는 필요한 값과 handler만 전달합니다. |
| export | Cell은 자기 폴더 `index.ts`, `cell/index.ts`, `@cocrepo/ui` 공개 export 경로로 접근 가능해야 합니다. |

새 Cell이 필요하면 먼저 기존 Cell 조합으로 해결할 수 있는지 확인합니다.
새로 만들 때도 DataGrid/Table에서 반복 사용 가능한 이름과 props를 기준으로 만들고, 특정 도메인 전용 이름은 피합니다.

## Query string 동기화

`DataGrid`는 내부적으로 `nuqs`를 사용해 목록 조회에 필요한 query string을 변경합니다.
상위 route는 DataGrid 외부에서 sort/filter/page handler를 만들지 않습니다.

서버에 영구 저장되는 `DataGridState.toJSON()` snapshot은 사용자 선호의 원본이고, URL query string은 현재 목록 조회 조건입니다.

| 동작 | query string 반영 |
| --- | --- |
| 정렬 변경 | `query.sort`를 `string[]`로 반영합니다. 예: `sort=name`, `sort=-createdAt`. |
| toolbar 필터 변경 | `query.filters.toolbar` 값을 input id 또는 query key 기준으로 반영합니다. |
| header 필터 변경 | `query.filters.columns` 값을 column id 또는 query key 기준으로 반영합니다. |
| data filter 변경 | `query.filters.data` 값을 API 조회 가능한 query key로 반영합니다. |
| row grouping 변경 | `query.groupBy`를 `string[]`로 반영합니다. 예: `groupBy=status&groupBy=createdAt`. |
| 페이지 변경 | `skip`을 반영합니다. |
| 페이지 크기 변경 | `take`를 반영하고 `skip`은 `0`으로 초기화합니다. |
| 정렬/필터/grouping 변경 | `skip`은 `0`으로 초기화합니다. |

query string에 쓰는 값은 API 조회에 필요한 값만 포함합니다.
`columns.visibility`, `columns.order`, `columns.sizing`, selection 값은 query string에 쓰지 않습니다.
`columns.grouping`은 panel 조작 직후 UI 반영과 사용자 snapshot 복원에만 사용하고, 백엔드 조회 조건은 `query.groupBy`를 기준으로 합니다.

## State 구조

`DataGridState`는 DataGrid 내부에서 사용하는 MobX state class입니다.
class는 메서드와 observable 상태를 가질 수 있지만, 서버에는 `toJSON()` 결과만 저장합니다.
snapshot에는 함수, ReactNode, row 객체, `Set`, transient click event를 포함하지 않습니다.
`restore(snapshot)`은 서버 snapshot을 class state로 복원할 때만 사용합니다.

`changes`는 저장 전 행 변경만 담당합니다. `created`, `updated`, `deleted`는 모두 배열이며 `toJSON()`에 `Set`이나 이벤트 객체를 포함하지 않습니다.

```ts
state.changes.toJSON();
// {
//   created: TData[],
//   updated: Array<{ id: DataGridRowKey; changes: Partial<TData> }>,
//   deleted: DataGridRowKey[],
// }
```

- 새 행 수정은 `created` 행 자체를 갱신하고 `updated`에 중복 기록하지 않습니다.
- 기존 행을 원래 값으로 되돌리면 해당 수정 필드를 제거합니다.
- 새 행 삭제는 `created`에서 제거하고, 기존 행 삭제만 `deleted`에 id를 남깁니다.
- 이동 결과의 `parentId`, `sortOrder` 반영과 중첩 rows 재구성은 `onRowMove`를 받은 상위 상태가 담당합니다.

```ts
export class DataGridState {
	key = "";
	version = 1;
	columns = new DataGridColumnsState();
	query = new DataGridQueryState();
	updatedAt: string | null = null;

	constructor(snapshot?: unknown) {
		makeAutoObservable(this);
		this.restore(snapshot);
	}

	restore(snapshot?: unknown): void {
		// snapshot을 검증한 뒤 하위 state에 반영합니다.
	}

	toJSON() {
		return {
			key: this.key,
			version: this.version,
			columns: this.columns.toJSON(),
			query: this.query.toJSON(),
			updatedAt: this.updatedAt,
		};
	}
}
```

### columns

`columns`는 DataGrid header와 cell 렌더링에 쓰는 컬럼 표시 상태입니다.

```ts
export class DataGridColumnsState {
	order: string[] = [];
	visibility: Record<string, boolean> = {};
	sizing: Record<string, number> = {};
	grouping: string[] = [];
	isGroupingCustomized = false;

	constructor(snapshot?: unknown) {
		makeAutoObservable(this);
		this.restore(snapshot);
	}

	restore(snapshot?: unknown): void {
		// columns snapshot을 검증한 뒤 반영합니다.
	}

	toJSON() {
		return {
			order: this.order,
			visibility: this.visibility,
			sizing: this.sizing,
			grouping: this.grouping,
		};
	}
}
```

| 필드 | 설명 |
| --- | --- |
| `order` | 컬럼 id 표시 순서입니다. |
| `visibility` | 사용자 기준 컬럼 표시 선호입니다. |
| `sizing` | 컬럼 id별 너비입니다. |
| `grouping` | panel 조작 직후 UI 반영과 snapshot 복원에 사용하는 grouping 컬럼 id 목록입니다. |
| `isGroupingCustomized` | 사용자가 config의 `rowGroup` 기본값을 덮어썼는지 여부입니다. `grouping: []`로 그룹을 비운 상태를 보존하는 데 사용합니다. |

### query

`query`는 API 목록 조회와 query string 동기화에 쓰는 상태입니다.
정렬, 필터, 페이지네이션은 모두 `query` 아래에서 관리합니다.

```ts
export class DataGridQueryState {
	sort: string[] = [];
	filters = new DataGridFilterState();
	pagination = new DataGridPaginationState();

	constructor(snapshot?: unknown) {
		makeAutoObservable(this);
		this.restore(snapshot);
	}

	restore(snapshot?: unknown): void {
		// query snapshot을 검증한 뒤 반영합니다.
	}

	toJSON() {
		return {
			sort: this.sort,
			filters: this.filters.toJSON(),
			pagination: this.pagination.toJSON(),
		};
	}
}
```

| 필드 | 설명 |
| --- | --- |
| `sort` | API 정렬 wire shape입니다. 예: `["name", "-createdAt"]`. |
| `filters` | toolbar, header, data filter 값을 관리합니다. |
| `pagination` | 목록 조회 범위를 관리합니다. |

### filters

`query.filters`는 DataGrid 조회 조건에 관여하는 모든 입력 값입니다.
상단 toolbar 필터, 컬럼 header 필터, 복합 data filter를 함께 관리합니다.

```ts
export class DataGridFilterState {
	toolbar: Record<string, JsonValue> = {};
	columns: Record<string, JsonValue> = {};
	data: DataGridFilterRule[] = [];

	constructor(snapshot?: unknown) {
		makeAutoObservable(this);
		this.restore(snapshot);
	}

	restore(snapshot?: unknown): void {
		// filter snapshot을 검증한 뒤 반영합니다.
	}

	toJSON() {
		return {
			toolbar: this.toolbar,
			columns: this.columns,
			data: this.data.map((rule) => rule.toJSON()),
		};
	}
}

export class DataGridFilterRule {
	id = "";
	field = "";
	operator = "";
	value: JsonValue = null;

	constructor(snapshot?: unknown) {
		makeAutoObservable(this);
		this.restore(snapshot);
	}

	restore(snapshot?: unknown): void {
		// filter rule snapshot을 검증한 뒤 반영합니다.
	}

	toJSON() {
		return {
			id: this.id,
			field: this.field,
			operator: this.operator,
			value: this.value,
		};
	}
}
```

| 필드 | 설명 |
| --- | --- |
| `toolbar` | DataGrid 상단 영역의 검색, select, date-range 같은 필터 값입니다. |
| `columns` | 컬럼 header에 붙는 필터 input 값입니다. |
| `data` | 여러 필드와 연산자를 조합하는 data filter rule 목록입니다. |

### pagination

`query.pagination`은 목록 조회 범위를 저장합니다.

```ts
export class DataGridPaginationState {
	skip = 0;
	take = 20;

	constructor(snapshot?: unknown) {
		makeAutoObservable(this);
		this.restore(snapshot);
	}

	restore(snapshot?: unknown): void {
		// pagination snapshot을 검증한 뒤 반영합니다.
	}

	toJSON() {
		return {
			skip: this.skip,
			take: this.take,
		};
	}
}
```

| 필드 | 설명 |
| --- | --- |
| `skip` | 조회 시작 offset입니다. |
| `take` | 한 페이지 row 수입니다. |

## Selection state

선택된 row key 목록은 벌크 액션 대상을 식별하기 위한 DataGrid 내부 상태입니다.
서버 영구 저장 state와 query string에는 포함하지 않습니다.
화면에는 key 목록을 표시하지 않고 선택 개수와 가능한 액션만 표시합니다.

```ts
export class DataGridSelectionState {
	selectedRowKeys: string[] = [];

	constructor() {
		makeAutoObservable(this);
	}

	get selectedCount() {
		return this.selectedRowKeys.length;
	}
}
```

| 필드 | 설명 |
| --- | --- |
| `selectedRowKeys` | 벌크 액션 target 계산에만 쓰는 내부 row key 목록입니다. |
