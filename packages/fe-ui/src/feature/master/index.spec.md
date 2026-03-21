# master feature barrel 기획서

> 생성일: 2026-03-21
> 타입: feature-barrel
> 위치: packages/fe-ui/src/feature/master/index.ts

## 역할

`master` 계층 재사용 feature의 공용 export 진입점을 제공합니다.
목록/테이블/그리드 계열 화면은 이 계층을 먼저 검토합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `table` | `MetaDataGrid` 기반 마스터 테이블 엔트리 |
| `list` | 리스트형 마스터 엔트리 예약 영역 |
| `grid` | 그리드형 마스터 엔트리 예약 영역 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `feature/master` 재사용 계층 신규 추가 | codex |
