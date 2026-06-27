# UserDetailScreen 기획서

> 생성일: 2026-03-21
> 타입: fe-ui-screen

## Props 계약

| prop | 설명 |
|------|------|
| `user` | 이용자 기본 정보 |
| `isLoading` | 이용자 기본 정보 로딩 여부 |
| `onClickBackButton` | 목록 복귀 액션 |

## 화면 러프

- `ScreenSurface` route wrapper 안에서 screen이 기본 정보 `SectionSurface`를 배치합니다.
- 회원 식별 정보는 compact info grid로 표시합니다.
- 권한/정책 할당은 사용자 상세에서 노출하지 않고 역할 상세의 정책 할당 화면에서 관리합니다.
