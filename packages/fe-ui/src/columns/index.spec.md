# columns barrel 기획서

> 생성일: 2026-03-27
> 타입: index
> 위치: packages/fe-ui/src/columns/index.ts

## 역할

`columns` 재사용 계층의 공용 export 진입점을 제공합니다.
페이지는 이 레이어에서 공개 컬럼 조합 함수만 가져와 사용합니다.
내부 preset/factory는 `internal` 폴더에 숨깁니다.

## 공개 계약

| 항목       | 설명                                       |
| ---------- | ------------------------------------------ |
| `./master` | `MetaDataGrid` 기반 master table 컬럼 조합 |
| `./raw`    | raw table page용 컬럼 조합                 |

## 변경 이력

| 일자       | 내용                                                                                         | 작성자 |
| ---------- | -------------------------------------------------------------------------------------------- | ------ |
| 2026-03-27 | 공개 API는 `master`/`raw`만 노출하고 preset/factory는 `internal`로 숨기도록 구조를 재정리    | codex  |
| 2026-03-27 | 불필요한 `masterTableColumns.tsx` 중간 배럴을 제거하고 `./master`를 직접 export하도록 단순화 | codex  |
| 2026-03-27 | 공용 field preset과 raw table page용 columns export를 추가해 `columns` 레이어의 범위를 확장  | codex  |
| 2026-03-27 | page 내부 컬럼 정의를 `columns` 레이어로 이동하기 위한 공용 배럴 추가                        | codex  |
