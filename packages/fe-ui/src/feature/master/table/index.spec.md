# master/table feature 기획서

> 생성일: 2026-03-21
> 타입: feature
> 위치: packages/fe-ui/src/feature/master/table/index.ts

## 역할

`MetaDataGrid` 기반 마스터 테이블 재사용 엔트리입니다.
목록, 검색, 필터, 페이지네이션, 선택 액션을 갖는 테이블형 page는 이 경로를 표준 재사용 타깃으로 사용합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `MetaDataGrid` | 마스터 테이블 기본 컴포넌트 |
| `useMetaDataGridQueryStates` | URL query state 동기화 훅 |
| `MetaDataGrid*` | 헤더/본문/푸터/스켈레톤 등 보조 구성요소 |

## 구현 메모

- 실제 구현은 `packages/fe-ui/src/feature/MetaDataGrid/`가 담당합니다.
- 이 파일은 `feature/master/table` 공식 공개 엔트리 역할만 수행합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `MetaDataGrid` 공식 재사용 엔트리를 `feature/master/table`로 승격 | codex |
