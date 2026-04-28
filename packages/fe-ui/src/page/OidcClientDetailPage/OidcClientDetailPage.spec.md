# OidcClientDetailPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcClientDetailPage/OidcClientDetailPage.tsx

## 역할

OIDC 클라이언트 상세 화면의 pure page 컴포넌트입니다.
상세 조회, 활성 상태 전환, 삭제, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합과 삭제 확인 modal만 담당합니다.

## 디자인 스케치

```text
OidcClientDetailPage
- DetailPage
  - PageTitleBar
    - Button x4
  - DetailPageSurface
    - VStack
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
          - SecretField
          - ActiveStatusCell
          - DateTimeCell
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
          - AuthMethodCell
      - DetailSectionCard x2
        - DetailSection
          - PageTitleBar
  - ConfirmModal
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Edit` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `PowerOff` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Power` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `DetailSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SecretField` | `@cocrepo/ui` | 화면 조합 요소 |
| `ActiveStatusCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AuthMethodCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `ConfirmModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientDetailPageClient | 상세 표시 계약 |
| OidcClientDetailPageProps | pure page 입력 계약 |
| OidcClientDetailPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | OIDC 클라이언트 상세 화면의 조회/상태 전환/삭제/라우팅 책임 경계 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시명 기준 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
