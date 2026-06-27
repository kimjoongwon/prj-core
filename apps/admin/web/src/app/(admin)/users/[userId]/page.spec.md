# 이용자 상세 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/users/[userId]`

## 사용자 시나리오

1. 관리자가 이용자 기본 정보를 확인합니다.
2. 이용자에게 부여되는 권한은 역할 상세의 RolePolicy 할당을 통해 관리합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- API: `useGetUserById`
- reusable target: `packages/fe-ui/src/screen/UserDetailScreen/UserDetailScreen.tsx`

## Route / Screen Mapping

| route | screen | 설명 |
|-------|--------|------|
| `/users/[userId]` | `UserDetailScreen` | 사용자 기본 정보를 표시하고 목록 복귀 액션을 연결 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 초기 렌더 | `useGetUserById(userId)` | 이용자 기본 정보 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/users` 이동 |

## SectionSurface / Elevation

| 항목 | 결정 |
|------|------|
| ScreenSurface owner | page/screen content owner |
| 본문 | `UserDetailScreen`가 `ScreenSurface > SectionSurface`로 기본 정보 영역 구성 |
