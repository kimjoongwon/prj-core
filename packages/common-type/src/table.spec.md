# table util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-type/src/table.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| MetaDataGridConfig | 공개 계약 요소 |
| MetaDataGridState | MetaDataGrid interaction state 공통 계약 |
| MetaDataGridQueryState | query 값과 setter를 묶는 grid state slice |
| MetaDataGridQueryStates | page-owned query state 공통 계약 |
| MetaDataGridSetQueryStates | page-owned query state setter 공통 계약 |
| MetaDataGridSelectionState | selection 값을 묶는 grid state slice |
| MetaDataGridColumnConfig | 공개 계약 요소 |
| InputType | 공개 계약 요소 |
| InputConfig | 공개 계약 요소 |
| InputTypeProps | 공개 계약 요소 |
| SelectOption | 공개 계약 요소 |
| DropdownItem | 공개 계약 요소 |
| InputHandlers | 공개 계약 요소 |
| SelectionConfig | 공개 계약 요소 |
| ResponsiveConfig | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | MetaDataGridColumnConfig.filter와 InputConfig placement 계약을 추가 | codex |
| 2026-04-25 | MetaDataGridConfig에서 server render data를 분리하고 rows/totalCount/isLoading props 경계를 반영 | codex |
| 2026-04-25 | MetaDataGrid interaction state 계약을 추가하고 query state를 config에서 분리 | codex |
| 2026-04-24 | MetaDataGrid query state 공통 타입 계약을 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
