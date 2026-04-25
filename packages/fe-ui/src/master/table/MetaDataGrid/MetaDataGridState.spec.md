# MetaDataGridState 기획서

> 생성일: 2026-04-25
> 타입: state
> 위치: packages/fe-ui/src/master/table/MetaDataGrid/MetaDataGridState.ts

## 역할

`MetaDataGrid`가 소비하는 interaction state를 MobX class로 제공합니다.
호출부는 `useLocalObservable(() => new MetaDataGridStateModel(...))`로 인스턴스를 만들고, route/page가 소유한 query state 변경은 `syncQuery` action으로 동기화합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `MetaDataGridStateModel` | `MetaDataGridState`를 구현하는 MobX state class |
| `MetaDataGridQueryStateModel` | query values와 setter delegate를 보관하는 MobX state class |
| `MetaDataGridStateModelOptions` | state class 생성 입력 |

## 상태 소유권

| 상태 | owner | 설명 |
|------|-------|------|
| `query.values` | route/page query state | URL query와 API params의 source of truth |
| `query.setValues` | route/page query setter | 검색/필터/페이지네이션 commit 진입점 |
| `selection` | page-local state | 선택 상태가 필요한 화면에서 선택적으로 주입 |

## 동작 규칙

- `MetaDataGrid` 호출부는 plain object state를 넘기지 않습니다.
- `useLocalObservable`로 `MetaDataGridStateModel` 인스턴스를 생성합니다.
- props로 받은 query state가 바뀌면 `useEffect`에서 `syncQuery`를 호출합니다.
- text search는 `SearchInput` draft에만 머물다가 Enter/clear 시 `query.setValues`로 commit됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | MetaDataGrid state class 신규 생성 | codex |
