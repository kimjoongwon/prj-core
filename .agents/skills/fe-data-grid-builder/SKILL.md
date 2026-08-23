---
name: "fe-data-grid-builder"
description: "이 skill은 `fe-data-grid-agent` 역할로 일할 때 사용합니다. DataGrid 렌더링, 상태 계약, Column/Cell 통합 계약을 정리하는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# fe-data-grid-builder

DataGrid/Table Column builder를 만들거나 고치면 이 문서의 "Column 세부 계약" 섹션을 함께 적용합니다.
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

- `DataGrid`, `Table`, `data-grid/input/**`, `data-grid/cell/**`, `DataGridState` 계열을 data-grid 축 안에서 정리합니다.
- `data-grid/columns/**`의 DataGrid/Table Column builder와 preset/helper를 data-grid 축 안에서 정리합니다.
- `data-grid/cell/**`의 DataGrid/Table Cell 컴포넌트를 Pure UI, Widget, Feature 계층에 맞게 정리합니다.
- 표준 렌더링은 `index.tsx`의 compound 조립을 기준으로 하며, `DataGrid.tsx`를 유지하면 같은 조립과 state를 사용하는 thin wrapper로만 둡니다.
- TanStack Table 행 model, HeroUI Table 렌더링, 정렬 헤더, loading/empty 상태, selection/action bar, pagination 연결은 책임별 compound leaf와 facade state가 나누어 소유합니다.
- `DataGridState`는 단일 root state이고 child state는 canonical 값을 복제하지 않는 책임별 facade입니다.
- `DataGrid.Container`와 `Table.Container`는 state를 받지 않으며, 상태가 있는 leaf는 전체 root가 아닌 자신의 `DataGrid...State`만 받습니다.
- `Table`은 `DataGrid.Table`이 아닌 독립 compound namespace입니다.
- `ColumnFilterInput`, `ColumnSortInput`, `ColumnResizerInput`은 `data-grid/input/**`에 둡니다.
- `EditorCell`, `SelectionCell`, `HierarchyCell`은 `data-grid/cell/**`에 두고 필요한 값과 handler만 받습니다.
- column builder는 Cell을 조합만 하며, 실제 셀 UI는 `data-grid/cell/**`이 소유합니다.
- `display/data-display`는 일반 display primitive만 담당하고, DataGrid/Table 구현을 다시 만들지 않습니다.
- screen은 `DataGrid`를 감싸는 `SectionSurface` owner를 직접 결정합니다. DataGrid가 page-level surface를 암묵적으로 만들지 않습니다.
- feature/widget table panel에서 local panel이 필요하면 `Surface`만 사용합니다.
- 신규 DataGrid 호출부에서 제거된 detail/form 이전 방식 surface wrapper로 table panel을 만들지 않습니다.

### 출력 경로

- `packages/fe-ui/src/data-grid/index.tsx`
- `packages/fe-ui/src/data-grid/index.stories.tsx`
- `packages/fe-ui/src/data-grid/DataGrid.tsx` (선택 사항인 thin wrapper)
- `packages/fe-ui/src/data-grid/state/**`
- `packages/fe-ui/src/data-grid/DataGridContainer/**`
- `packages/fe-ui/src/data-grid/DataGridToolbar/**`
- `packages/fe-ui/src/data-grid/DataGridGroupPanel/**`
- `packages/fe-ui/src/data-grid/DataGridPagination/**`
- `packages/fe-ui/src/data-grid/DataGridActionBar/**`
- `packages/fe-ui/src/data-grid/Table/**`
- `packages/fe-ui/src/data-grid/input/**`
- `packages/fe-ui/src/data-grid/columns/**`
- `packages/fe-ui/src/data-grid/cell/**`
- `packages/fe-ui/src/data-grid/index.ts`
- 필요 시 공통 계약은 `packages/common-type/src/table.ts`와 `packages/common-type/src/index.ts`에 함께 반영합니다.

### 필수 규칙

- `DataGrid`와 독립된 `Table.Container`, `Table.Header`, `Table.Body`, `Table.Footer` compound namespace를 사용하고 `DataGrid.Table`을 만들지 않습니다.
- `DataGrid.Container`와 `Table.Container`에는 state prop을 추가하지 않습니다.
- 상태가 있는 leaf에는 전체 `DataGridState` 대신 해당 책임의 facade state만 `state` prop으로 전달합니다. `config`, `rows`, `totalCount`, TanStack table model, callback 같은 외부 render input은 state에 동기화하지 않고 별도 prop으로 전달합니다.
- `DataGridConfig`는 `toolbar`, `groupPanel`, `table`의 ownership별 선언 계약입니다. standalone `Table`은 `DataGridTableConfig` 하나를 받고, Toolbar와 GroupPanel은 자기 config와 공유 `table.columns`만 받습니다.
- 행 key helper는 duplicate-safe 해야 하며 compound renderer와 외부 호출부에서 재사용할 수 있도록 공개합니다.
- DataGrid 공개 컴포넌트, 상태 model, helper, 타입은 `data-grid/index.ts`에서 노출합니다.
- DataGrid column builder는 `data-grid/columns/index.ts`에서 노출하고, public export는 `data-grid/index.ts`를 거칩니다.
- 삭제된 이전 방식 grid composition 계층과 display 하위 DataGrid/Table 경로를 되살리거나 compound 조립과 별도인 Table wrapper를 만들지 않습니다.
- `useMemo`/`useCallback`을 새로 추가하지 않고, client 컴포넌트는 `observer` 기준을 유지합니다.
- `data-grid/cell/**`은 DataGrid/Table에서 재사용 가능한 Cell만 둡니다. 특정 도메인 전용 이름이나 도메인 API/store 연결은 만들지 않습니다.
- `data-grid/columns/**`은 field, label, accessor, align, cell 조합 선언만 담당합니다.
- 새 Cell이 필요하면 먼저 기존 Cell 조합 가능성을 확인하고, 불가할 때만 최소 범위로 추가합니다.
- Storybook은 `data-grid/index.stories.tsx` 하나에서만 주요 compound 상태를 검증하고 leaf별 story 파일을 만들지 않습니다.

### 검증

- `rg "Meta.*DataGrid|Meta.*DataGridState" packages/fe-ui/src packages/common-type/src`
- `rg "from .*display.*/.*DataGrid|from .*display.*/.*Table" packages/fe-ui/src`
- `pnpm --filter=@cocrepo/ui typecheck`
- `pnpm --filter=@cocrepo/ui test -- DataGrid`

- 단위 테스트는 행 key, column rendering, input renderer, empty/loading 분기, event callback을 검증합니다.

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.

## DataGrid 핵심 계약

### 적용 범위

이 문서는 `packages/fe-ui/src/data-grid/**`의 DataGrid 본체, 상태, query 동기화, grouping, hierarchy, pagination, selection과 변경 추적 계약을 소유합니다.

Column 세부 계약은 이 문서에서, Cell 세부 계약은 `references/cells.md`에서 소유합니다. 화면별 요구사항이나 도메인 정책은 이 문서에 복제하지 않고 요청, 기존 소비 코드와 해당 owner 문서를 근거로 판단합니다.

### 역할과 상태 소유권

- DataGrid는 columns, filter, sort, pagination, selection을 하나의 계약으로 제공하는 표준 목록 렌더러입니다.
- `DataGridState`가 query, columns, selection, changes의 canonical 값을 소유하는 유일한 root state입니다.
- child state는 root 또는 root가 전달한 canonical model을 참조하는 책임별 facade이며 같은 값을 별도 field에 복제하거나 서로 동기화하지 않습니다.
- root는 child facade를 한 번 생성하고 동일 인스턴스를 유지합니다.
- 외부 callback은 row click, row move처럼 상위 계층이 처리해야 하는 고수준 결과에만 사용합니다.
- 서버에는 class instance가 아니라 `toJSON()`이 반환한 plain snapshot만 저장합니다.
- snapshot에는 함수, `ReactNode`, row 객체, `Set`, DOM 또는 React event를 넣지 않습니다.
- 복원은 서버 snapshot을 입력으로 사용하고 런타임 객체를 직렬화 계약으로 취급하지 않습니다.
- selection UI는 선택 개수와 가능한 action을 표현하며 내부 row key 목록을 화면 계약으로 노출하지 않습니다.

### 렌더링과 설정 계약

DataGrid는 `@tanstack/react-table`을 기반으로 다음 기능을 일관되게 제공합니다.

- `DataGrid.Container`와 `Table.Container`는 layout과 markup만 담당하며 state를 받지 않습니다.
- `DataGrid.Toolbar`, `DataGrid.GroupPanel`, `DataGrid.Pagination`, `DataGrid.ActionBar`와 `Table.Header`, `Table.Body`, `Table.Footer`는 자기 책임의 `DataGrid...State`를 `state` prop으로 받고, 화면을 그리는 외부 input은 별도 prop으로 받습니다.
- `Table`은 `DataGrid`의 property가 아닌 독립 namespace이고 pagination은 `Table.Footer` 밖에 둡니다.

- column visibility, order, sizing과 resize
- sort, filter와 pagination
- selection
- loading, empty와 dark mode
- row group panel
- inline edit와 변경 상태
- 생성, 수정, 삭제 snapshot
- row 이동
- 가상 grouping과 실제 hierarchy

공개 설정은 최소 다음 의미를 유지합니다.

| 설정 | 계약 |
|---|---|
| `rowGroupPanelShow` | `never`, `always`, `onlyWhenGrouping`으로 group panel 노출을 제어 |
| `columns[].rowGroup` | 초기 grouping 참여 여부 |
| `columns[].enableRowGroup` | 사용자가 grouping에 사용할 수 있는 column 여부 |
| `getSubRows` | 실제 parent-child hierarchy 연결 |
| `columns[].rowExpander` | hierarchy 확장 UI를 제공하는 column |
| `columns[].editable` | inline edit 허용 여부 |
| `onRowMove` | 상위 계층이 row 이동 결과를 반영하는 callback |

### Grouping과 hierarchy

#### 가상 grouping

- grouping 상태의 기준은 `query.groupBy: string[]`입니다.
- 일반 조회와 grouped 조회 모두 backend 응답 row는 leaf row입니다.
- backend는 group tree를 만들지 않습니다.
- grouped 조회에서는 선택된 group에 속한 leaf row를 flat하게 반환하고 DataGrid가 client-side group을 구성합니다.
- `groupBy`가 없으면 `skip`과 `take`는 row 기준입니다.
- `groupBy`가 있으면 `skip`과 `take`는 첫 번째 group level 기준입니다.
- grouped 조회의 `totalCount`는 leaf row 수가 아니라 첫 번째 level의 group 수입니다.
- 여러 `groupBy`를 사용해도 pagination 기준은 첫 번째 group level입니다.

#### 실제 hierarchy

- 실제 parent-child 데이터는 상위 계층이 중첩 구조로 만들고 DataGrid에 전달합니다.
- DataGrid는 `getSubRows`로 child row를 연결합니다.
- 실제 hierarchy에는 `query.groupBy`를 사용하지 않습니다.
- 가상 grouping과 실제 hierarchy를 하나의 row tree에 혼합하지 않습니다.
- parent 식별자, `sortOrder`와 중첩 재구성 같은 도메인 규칙은 DataGrid가 추론하지 않습니다.

### Query string과 저장 snapshot

- 현재 조회 상태의 URL 동기화는 DataGrid가 `nuqs`를 통해 소유합니다. route가 동일 상태를 위한 별도 handler를 중복 구성하지 않습니다.
- `query.sort`는 `string[]`입니다.
- toolbar 검색, header filter와 data filter는 query에 반영합니다.
- grouping은 `query.groupBy: string[]`에 반영합니다.
- pagination은 `skip`과 `take`에 반영합니다.
- sort, filter 또는 group 변경 시 `skip`을 `0`으로 초기화합니다.
- visibility, order, sizing과 selection은 URL query에 넣지 않습니다.
- URL query는 현재 조회 상태이고 `DataGridState.toJSON()`은 사용자 preference와 편집 상태를 위한 저장 snapshot입니다.
- UI grouping snapshot이 있더라도 backend 요청의 기준은 `query.groupBy`입니다.

### 변경 추적과 row 이동

`DataGridState.changes`는 `created`, `updated`, `deleted` 배열을 소유합니다.

- 새 row의 편집은 `created`만 갱신합니다.
- 기존 row의 값을 원래 값으로 되돌리면 해당 변경 field를 `updated`에서 제거합니다.
- 새 row를 삭제하면 `created`에서 제거합니다.
- 기존 row를 삭제하면 식별자를 `deleted`에 추가합니다.
- inline edit 결과는 callback으로 우회하지 않고 `state.changes`에 반영합니다.
- 편집 중 draft 값은 DataGrid 내부에 보관하고, validator 성공 후에만 `state.changes.setValue()`로 커밋합니다.
- `columns[].editable`은 `text`, `number`, `date`, `date-time`, `select`, `multi-select`, `boolean`, `autocomplete`, `custom` editor type과 `click`, `doubleClick`, `enter`, `f2` trigger를 지원합니다.
- 편집 검증은 동기·비동기 결과를 모두 허용하며 오류가 있으면 편집 상태를 유지하고 editor와 cell에 오류 접근성 상태를 전달합니다.
- custom editor는 기존 `editable.render` 계약을 유지하되, 값 변경은 draft를 갱신하고 commit/cancel lifecycle을 DataGrid가 소유합니다.
- row 이동 UI는 DataGrid가 처리할 수 있지만 `parentId`, `sortOrder`와 nested row 재구성은 `onRowMove`를 받은 상위 계층이 처리합니다.

### 재사용과 경계

- `index.tsx`의 표준 compound 조립을 확장하며 `DataGrid.tsx`를 유지할 때는 동일 조립을 감싸는 thin wrapper로만 사용합니다.
- 독립 `Table` compound 외에 같은 책임의 `DataTable` 또는 별도 Table wrapper를 만들지 않습니다.
- row key에는 기존 `getDataGridRowKey`를 사용합니다.
- cell editor는 native `input`, `select`, `datalist` 기반 adapter를 우선 사용해 Excel식 직접 편집 경험을 제공합니다. HeroUI form wrapper를 DataGrid editor의 기본 구현으로 사용하지 않습니다.
- Button, Input, Select, Checkbox, Pagination, Skeleton과 EmptyState는 기존 공용 primitive를 재사용합니다.
- 도메인 column builder는 외부에서 주입하고 공용 Cell은 `data-grid/cell/**`에서 재사용합니다.
- DataGrid를 `display` 또는 `data-display` 계층에 중복 구현하지 않습니다.
- DataGrid 내부에 도메인 전용 Cell이나 도메인 field를 전제로 한 hierarchy 설정을 만들지 않습니다.
- column builder는 선언과 Cell 조합만 담당하며 실제 UI markup은 Cell이 소유합니다.
- API, store와 route 동작은 Screen, Feature 또는 Page가 소유하고 Cell에는 값과 handler만 전달합니다.
- export는 기존 `data-grid` 공개 경로를 유지하며 새 최상위 column 계층을 만들지 않습니다.
- Storybook은 `index.stories.tsx` 하나만 사용합니다.

### 기본 검증 기준

구현 전 기존 DataGrid, state/type, 공개 export, 소비 코드와 관련 테스트를 확인합니다. 구현 후에는 skill 본문의 기본 검증과 함께 다음 항목을 확인합니다.

- `toJSON()`과 restore가 plain snapshot 계약을 지키는지
- sort, filter와 group 변경 시 pagination이 초기화되는지
- 일반 조회와 grouped 조회의 `skip`, `take`, `totalCount` 의미가 구분되는지
- grouping과 hierarchy가 혼합되지 않는지
- 생성, 수정, 되돌리기와 삭제가 `changes` 규칙대로 반영되는지
- column visibility, order, sizing과 selection이 URL query에 유입되지 않는지
- 기존 primitive, Cell, input과 export 경로를 재사용하는지
- loading, empty, selection, inline edit, row move와 dark mode 상태가 기존 UI 계약을 유지하는지

## Column 세부 계약

`fe-data-grid-agent`가 DataGrid/Table Column builder를 만들거나 고칠 때 적용합니다.

### 플랫폼 라우팅

- 이 역할은 웹 전용 agent입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native 런타임 작업은 이 역할의 실행 범위가 아닙니다.

### 공통

#### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

### 웹 규칙

#### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

#### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 `data-grid/columns`, `cell`, `page`, `DataGrid`, 관련 Screen/Feature 구현, owner 문서, 테스트를 먼저 검색합니다.
- Column/cell 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 cell/column/helper 생성 전에 기존 구현을 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 `DataGrid`, `data-grid/columns`, `cell` 또는 `@heroui/react` Table/Chip/Button 등으로 표현 가능한 table UI를 raw `<table>`/`div`/`button` + className 조합으로 재구현하지 않습니다.
- 동일 책임의 중복 column helper / cell / page table 구현을 금지합니다.

#### FE DataGrid Column 역할

당신은 `packages/fe-ui/src/data-grid/columns` 레이어를 정리하는 DataGrid 보조 규칙을 따릅니다.
목표는 **column은 선언만 담당하고, 실제 셀 UI는 반드시 `packages/fe-ui/src/data-grid/cell`에 두는 것**입니다.

---

#### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| `packages/fe-ui/src/data-grid/columns/**`에 새 컬럼 조합이 필요할 때 | ✅ | `data-grid`/`internal` 기준으로 정리 |
| page 내부 inline table column을 `data-grid/columns` 레이어로 이동할 때 | ✅ | 공용 조합으로 승격 |
| `data-grid/columns` 안에 직접 JSX 마크업이 들어가 있을 때 | ✅ | `cell` 추출 대상 |
| `raw` table와 `DataGrid` 사이 경계를 정리할 때 | ✅ | 마지막 raw 소비처 제거 포함 |
| 새로운 Cell 컴포넌트가 필요할 때 | ⚠️ | 같은 `fe-data-grid-agent` owner 안에서 `fe-data-grid-builder` 보조 규칙을 함께 적용합니다. |
| 일반 Widget/Feature만 만들면 되는 작업 | ❌ | 다른 프론트엔드 agent 사용 |
| page route thin container만 수정하는 작업 | ❌ | `fe-route-agent` 중심으로 진행 |

---

#### 2. 책임 범위

#### 2.1 `data-grid/columns` 레이어

- `packages/fe-ui/src/data-grid/columns/data-grid/**`
  - `DataGridColumnConfig` 조합
  - 도메인별 collection table column 공개 계약
- `packages/fe-ui/src/data-grid/columns/internal/**`
  - 공용 preset/helper/factory
  - page가 직접 import하지 않는 내부 구현
- `packages/fe-ui/src/data-grid/columns/index.ts`
  - 공개 배럴

#### 2.2 `cell` 레이어

- `packages/fe-ui/src/data-grid/cell/**`
  - 실제 표시 책임
  - 값 포맷팅 / 상태 배지 / 액션 버튼 / 복합 셀 UI
  - 소유 owner는 `fe-data-grid-agent`입니다. Column builder는 조합/소비만 기본으로 합니다.

#### 2.3 필요 시 함께 수정하는 레이어

- `packages/fe-ui/src/screen/**`
  - 아직 custom `<table>`를 직접 그리고 있다면 `DataGrid` 전환
- 대응 관련 route/Page, Screen/Feature 구현과 owner 계약
  - 코드 변경 시 반드시 갱신

---

#### 3. 하드 규칙 (위반 시 실패)

1. `packages/fe-ui/src/data-grid/columns/**` 안에서 직접 커스텀 셀 마크업을 만들지 않습니다.
2. `data-grid/columns` 안에서 아래 계열 JSX를 직접 렌더링하지 않습니다.
   - `div`, `span`, `p`, `button`
   - `Button`, `Chip`, `Badge`, `Switch`, `Link`
3. `data-grid/columns`는 반드시 `packages/fe-ui/src/data-grid/cell`에서 공개한 셀 컴포넌트만 조합합니다.
4. 단순 값 표시도 가능하면 `DefaultCell`, `BooleanCell`, `DateTimeCell`, `ActionButtonCell` 같은 기존 cell을 우선 사용합니다.
5. `raw` table 전용 columns/helper는 신규 생성하지 않습니다.
6. `DataGrid`로 옮길 수 있는 page는 page 내부 custom `<table>`를 유지하지 않습니다.
7. `data-grid/columns` 폴더 내부에 새 helper/factory 함수를 만들면 **한글 주석**으로 역할을 짧게 설명합니다.
---

#### 4. 작업 기준

#### 4.1 Cell 추출 기준

다음 중 하나라도 해당하면 `data-grid/columns` 안에 두지 말고 `src/data-grid/cell`로 이동합니다.

- 2개 이상의 element를 조합한다
- 색상/variant/status 매핑이 있다
- 버튼/링크/Chip/Badge/Switch가 들어간다
- `className`이 필요한 JSX가 나온다
- 같은 렌더링이 여러 column/page에서 재사용될 가능성이 있다

#### 4.2 `data-grid/columns`에 남아도 되는 것

- `createPresetColumn(...)`
- `createCreatedAtColumn(...)`
- `createActionsColumn(...)`
- `cell: ({ getValue }) => <ExistingCell ... />`
- field / label / size / align / accessorKey 같은 선언 메타데이터

#### 4.3 `raw` 제거 기준

- 마지막 raw 소비자까지 `DataGrid` 또는 `collection` column 조합으로 옮길 수 있으면
  - `data-grid/columns/raw/**` 삭제
  - `data-grid/columns/internal/rawFactory.*` 삭제
  - 상위 배럴 export 제거
- 더 이상 raw가 필요 없는데 문서만 남아 있으면 관련 소비 코드와 owner 문서도 같이 정리합니다.

---

#### 5. 구현 절차

1. `rg`로 기존 `data-grid/columns`, `cell`, `page`, `DataGrid` 사용처를 먼저 검색
2. 이미 있는 cell/preset/helper로 해결 가능한지 우선 판단
3. 부족한 셀은 `fe-data-grid-agent` 산출물로 요청하거나, 같은 승인 slice에서만 `packages/fe-ui/src/data-grid/cell`에 최소 범위로 추가/보강
4. `data-grid/columns/data-grid` 또는 `data-grid/columns/internal`에서 공용 조합으로 승격
5. page가 custom `<table>`를 직접 그리고 있으면 `DataGrid`로 전환
6. 더 이상 쓰지 않는 `raw` export/helper/file 제거
7. 대응 관련 route/Page, Screen/Feature 구현과 owner 계약 갱신
8. `biome format` + 타입 체크/검색 검증 수행

---

#### 6. 완료 전 필수 검증

```bash
# 1) columns 안에 직접 마크업이 남아 있는지 점검
rg -n "<(div|span|p|button)\\b|<(Button|Chip|Badge|Switch|Link)\\b" packages/fe-ui/src/data-grid/columns

# 2) raw 경로가 남아 있는지 점검
rg -n "data-grid/columns/raw|columns/raw|rawFactory|from \\\"\\./raw\\\"" packages/fe-ui apps/admin/web

# 3) 변경된 columns/page/cell 타입 체크
pnpm exec tsc -p packages/fe-ui/tsconfig.json --noEmit --pretty false
```

---

#### 7. 산출물 예시

- `packages/fe-ui/src/data-grid/cell/RoleNameCell/RoleNameCell.tsx`
- `packages/fe-ui/src/data-grid/columns/data-grid/adminColumns.tsx`
- `packages/fe-ui/src/screen/RoleListScreen/RoleListScreen.tsx`
- `packages/fe-ui/src/data-grid/columns/index.ts`

핵심은 **column 파일이 UI를 소유하지 않게 만드는 것**입니다.

- 이 역할이 불가피하게 cell 소스를 함께 수정한 경우에는 같은 작업에서 해당 cell의 같은 위치 단위 테스트도 갱신하고, 최종 보고에 왜 `fe-data-grid-agent` 인계 없이 함께 처리했는지 적습니다.
- columns 변경으로 연결된 cell/단위 테스트 누락과 DataGrid 계약 drift는 이 agent가 자체 검증하고, cell owner 범위가 필요하면 `fe-data-grid-agent` 인계로 보고합니다.
