# internal/fieldPresets 기획서

> 생성일: 2026-03-27
> 타입: ui-support
> 위치: packages/fe-ui/src/columns/internal/fieldPresets.ts

## 역할

`columns` 내부 구현이 공유하는 field key 및 기본 label preset 저장소입니다.
공개 배럴에서 직접 노출하지 않고 내부 builder만 사용합니다.

## 공개 계약

| 항목            | 설명                        |
| --------------- | --------------------------- |
| `COLUMN_FIELDS` | 내부 컬럼 field key preset  |
| `COLUMN_LABELS` | 내부 컬럼 기본 label preset |

## 변경 이력

| 일자       | 내용                                                                           | 작성자 |
| ---------- | ------------------------------------------------------------------------------ | ------ |
| 2026-03-29 | Task 목록의 스케줄 가능 상태 컬럼을 위해 `isSchedulable` field/label preset 추가 | codex  |
| 2026-03-27 | 루트 `columns` 공개 API와 내부 preset 저장소를 분리하기 위해 `internal`로 이동 | codex  |
