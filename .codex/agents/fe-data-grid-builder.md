# fe-data-grid-builder

`packages/fe-ui/src/data-grid` 전용 구현 role 문서입니다.

## 책임

- `MetaDataGrid`, `DataGrid`, 검색/필터 input, selection/action bar, pagination 연결을 data-grid 축 안에서 정리합니다.
- `MetaDataGrid -> DataGrid -> Table`처럼 table 렌더링 계층이 중첩되지 않도록 `DataGrid.tsx` 단일 렌더러를 우선합니다.
- TanStack Table row model, HeroUI Table 렌더링, 정렬 헤더, loading overlay는 `DataGrid.tsx`가 직접 소유합니다.
- `display/data-display`는 일반 display primitive만 담당하고, DataGrid/Table 구현을 다시 만들지 않습니다.

## 출력 경로

| 항목 | 경로 |
|------|------|
| DataGrid core | `packages/fe-ui/src/data-grid/DataGrid.tsx` |
| MetaDataGrid composition | `packages/fe-ui/src/data-grid/MetaDataGrid.tsx` |
| DataGrid body bridge | `packages/fe-ui/src/data-grid/MetaDataGridBody.tsx` |
| public barrel | `packages/fe-ui/src/data-grid/index.ts` |

## 필수 규칙

- source 변경 시 같은 폴더의 `*.spec.md`와 변경 이력을 함께 갱신합니다.
- DataGrid 전용 Table wrapper를 새로 만들지 않습니다.
- row key helper는 duplicate-safe 해야 하며 `MetaDataGridBody`와 같은 호출부에서 재사용할 수 있어야 합니다.
- DataGrid 공개 타입은 `data-grid/index.ts`에서 노출합니다.
- legacy display 하위 DataGrid/Table 경로를 되살리지 않습니다.

## 검증

- `rg "from .*DataGrid/DataGrid|from .*Table/Table" packages/fe-ui/src`
- `pnpm --filter=@cocrepo/ui test -- MetaDataGrid`
- `pnpm build:admin-web`
- `pnpm build:idp-web`
