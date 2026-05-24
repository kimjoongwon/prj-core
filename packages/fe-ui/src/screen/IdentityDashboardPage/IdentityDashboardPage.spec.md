# IdentityDashboardPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/IdentityDashboardPage/IdentityDashboardPage.tsx

## 역할

IDP 대시보드 화면의 pure screen 컴포넌트입니다.
통계와 로그인 추이 조회는 route thin container가 소유하고 이 파일은 detail shell 안의 시각 조합만 담당합니다.

## 디자인 스케치

```text
IdentityDashboardPage
- DetailPage
  - PageTitleBar
  - DetailPageSurface
    - VStack
      - DetailSectionCard x2
        - DetailSection
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
| `DetailPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `DetailSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdentityDashboardPageStats | 대시보드 통계 계약 |
| IdentityDashboardPageTrendItem | 최근 로그인 추이 row 계약 |
| IdentityDashboardPageProps | pure screen 입력 계약 |
| IdentityDashboardPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## UI 규칙

- 최근 로그인 추이 막대는 동일한 날짜 row가 들어와도 index 기반 stable key로 렌더링해 duplicate key warning을 방지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | 통계 라벨과 로그인 추이 상태 문구의 런타임 i18n 번역 적용 경로 반영 | codex |
| 2026-03-29 | IDP 대시보드의 통계/추이 조회 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
