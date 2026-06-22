# IdentityDashboardScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/IdentityDashboardScreen/IdentityDashboardScreen.tsx

## 역할

IDP 대시보드 화면의 pure screen 컴포넌트입니다.
통계와 로그인 추이 조회는 route thin container가 소유하고 이 파일은 detail layout 안의 시각 조합만 담당합니다.

## 디자인 스케치

```text
IdentityDashboardScreen
- VStack
  - PageTitleBar
  - ScreenSurface
    - VStack
      - SectionSurface x2
        - Section
          - PageTitleBar
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Activity` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `CheckCircle` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `XCircle` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Lock` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `UserX` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `KeyRound` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdentityDashboardScreenStats | 대시보드 통계 계약 |
| IdentityDashboardScreenTrendItem | 최근 로그인 추이 row 계약 |
| IdentityDashboardScreenProps | pure screen 입력 계약 |
| IdentityDashboardScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## UI 규칙

- 최근 로그인 추이 막대는 동일한 날짜 row가 들어와도 index 기반 stable key로 렌더링해 duplicate key warning을 방지합니다.