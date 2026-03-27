# AbilityListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AbilityListPage/AbilityListPage.tsx

## 역할

권한 목록 route에서 사용하는 pure page 컴포넌트입니다. 필터, 빈 상태, 테이블 렌더링만 소유하고 데이터 조회와 라우팅은 app route container가 담당합니다.
raw table의 컬럼 정의는 page 내부에 두지 않고 `columns` 레이어의 공용 조합을 사용합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityListPageOption | 필터 Select 옵션 계약 |
| AbilityListPageAbility | 목록 행 view model 계약 |
| AbilityListPageFilters | 필터 상태 계약 |
| AbilityListPageProps | 공개 계약 요소 |
| AbilityListPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-27 | ability raw table도 exported row type 없이 page props row shape를 받는 builder 함수로 연결 | codex |
| 2026-03-27 | 권한 목록 raw table 컬럼을 page 내부 inline 선언 대신 `columns` 레이어의 공용 조합으로 이관 | codex |
| 2026-03-26 | abilities 목록 route의 page-level UI를 page 레이어로 이동 | codex |
