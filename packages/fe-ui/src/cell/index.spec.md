# index ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/cell/index.ts

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목                | 설명                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| `src/cell/*` export | table/status/date/profile 등 셀 전용 display primitive를 루트 배럴에서 공개 |

## 변경 이력

| 일자       | 내용                                                                                   | 작성자 |
| ---------- | -------------------------------------------------------------------------------------- | ------ |
| 2026-03-28 | `ActionButtonCell`, `ChipCell`, `RoleNameCell`, `LockStatusCell`, `FailedAttemptsCell`, `IdpAccountActionsCell` 공개를 추가 | codex  |
| 2026-03-27 | 이름 계열 테이블 렌더링 공통화를 위해 `NameCell` 공개를 추가                           | codex  |
| 2026-03-27 | `display/data-display/cell`을 `src/cell`로 이동하고 루트 공개 축으로 승격              | codex  |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex  |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/\* 기준으로 상향                           | codex  |
| 2026-03-03 | 누락된 sidecar spec 신규 생성                                                          | codex  |
