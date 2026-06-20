# 역할 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/roles`

## 사용자 시나리오

1. 관리자가 역할 목록을 확인합니다.
2. 새 역할 등록 화면으로 이동합니다.
3. 상세 버튼으로 역할 상세 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/RoleListScreen/RoleListScreen.tsx`
- route는 `useGetRoles()`와 ``nuqs` `useQueryStates()``를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetRoles()` | 역할 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/roles/new`로 이동 |