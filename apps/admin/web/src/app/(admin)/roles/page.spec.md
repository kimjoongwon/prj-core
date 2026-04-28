# 역할 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/roles`

## 사용자 시나리오

1. 관리자가 역할 목록을 확인합니다.
2. 새 역할 등록 화면으로 이동합니다.
3. 상세 버튼으로 역할 상세 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- page component path: `packages/fe-ui/src/page/RoleListPage/RoleListPage.tsx`
- route는 `useGetRoles()`와 ``nuqs` `useQueryStates()``를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetRoles()` | 역할 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/roles/new`로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | page role을 `collection`으로 갱신 | codex |
| 2026-04-28 | MetaDataGrid 공식 재사용 타깃을 `data-grid`로 갱신 | codex |
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `RoleListPage` pure page와 thin route container 구조로 전환하고 조회/등록 라우팅을 route로 이동 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 역할 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
