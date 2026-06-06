# TimelineDetailPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TimelineDetailPage/TimelineDetailPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.

## 디자인 스케치

```text
TimelineDetailPage
- DetailPage
  - PageTitleBar
    - Button x2
  - DetailPageSurface
    - VStack
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
          - DateTimeCell (조건부)
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
            - Button
          - Table
            - Table.Header
            - Table.Body
  - Modal x2
    - Modal overlay content
      - Modal.Header
      - Modal.Body
      - Modal.Footer
        - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailPage` | `../../detail` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Pencil` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `DetailPageSurface` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `../../rhythm` | 화면 조합 요소 |
| `DetailSectionCard` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSection` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `DateTimeCell` | `../../cell` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Table` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Header` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Column` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Body` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Row` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Cell` | `@heroui/react` | 목록/표 데이터 표시 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineDetailPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/link | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | 초기 화면 기획 수립 | codex |
