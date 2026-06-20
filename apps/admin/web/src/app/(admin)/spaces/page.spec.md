# 공간 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/spaces`

## 사용자 시나리오

1. 관리자가 공간 목록을 검색합니다.
2. 공간명을 눌러 시설 상세 화면으로 이동합니다.
3. 신규 공간 등록 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/SpaceListScreen/SpaceListScreen.tsx`
- route는 `useGetSpaces()`와 ``nuqs` `useQueryStates()``를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetSpaces()` | admin layout의 Space bootstrap/access gate 아래에서 공간 목록 조회. Space 전환은 hard reload로 query cache를 초기화 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/spaces/new`로 이동 |
| `onClickSpaceGroundName` | route가 `/spaces/[spaceId]/ground`로 이동 |