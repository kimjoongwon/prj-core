# internal/rawFactory 기획서

> 생성일: 2026-03-27
> 타입: ui-support
> 위치: packages/fe-ui/src/columns/internal/rawFactory.tsx

## 역할

raw `<table>` 기반 페이지가 공유하는 내부 컬럼 factory 모음입니다.
raw table 공개 컬럼 파일은 이 helper를 조합만 하고, 이 파일은 내부 구현으로만 유지합니다.

## 공개 계약

| 항목                               | 설명                         |
| ---------------------------------- | ---------------------------- |
| `PageTableColumn`                  | raw table 내부 컬럼 계약     |
| `createPresetPageColumn` 외 helper | raw table용 내부 조립 helper |

## 변경 이력

| 일자       | 내용                                                           | 작성자 |
| ---------- | -------------------------------------------------------------- | ------ |
| 2026-03-27 | `pageTableColumns.tsx`의 raw helper를 내부 factory 파일로 분리 | codex  |
