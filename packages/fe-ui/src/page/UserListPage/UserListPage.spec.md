# UserListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/UserListPage/UserListPage.tsx

## 역할

이용자 목록 route의 pure page 컴포넌트입니다. 검색 입력, 통계 카드, MetaDataGrid 시각 조합만 소유하고 query state와 데이터 조회는 route container가 담당합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| UserListPageUser | 목록 행 view model 계약 |
| UserListPageStats | 상단 통계 카드 계약 |
| UserListPageProps | 공개 계약 요소 |
| UserListPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | users 목록 route의 page-level UI를 page 레이어로 이동 | codex-worker |
