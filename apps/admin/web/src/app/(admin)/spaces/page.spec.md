# 공간 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/spaces`

## 사용자 시나리오

1. 관리자가 공간 목록을 검색합니다.
2. 공간명을 눌러 시설 상세 화면으로 이동합니다.
3. 신규 공간 등록 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `master`
- reusable target: `master/table`
- page component path: `packages/fe-ui/src/page/SpaceListPage/SpaceListPage.tsx`
- route는 `useGetSpaces()`와 `useMetaDataGridQueryStates()`를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetSpaces()` | 공간 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/spaces/new`로 이동 |
| `onClickSpaceGroundName` | route가 `/spaces/[spaceId]/ground`로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `SpaceListPage` pure page와 thin route container 구조로 전환하고 조회/라우팅을 route로 이동 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 공간 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
