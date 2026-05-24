# RoutineDetailPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/RoutineDetailPage/RoutineDetailPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.

## 디자인 스케치

```text
RoutineDetailPage
- DetailPage
  - PageTitleBar
  - DetailPageSurface
    - VStack
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
          - Chip (조건부)
          - DateTimeCell x2
      - DetailSectionCard x3
        - DetailSection
          - PageTitleBar
  - Modal
    - ModalContent
      - ModalHeader
      - ModalBody
      - ModalFooter
        - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Pencil` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `DetailSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `MediaThumbnail` | `@cocrepo/ui` | 화면 조합 요소 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalContent` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalHeader` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalBody` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalFooter` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoutineDetailPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/routines | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 화면 데이터/이벤트 소유 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-29 | 루틴 상세 조회 실패 시 not found 또는 재시도 가능한 오류 상태 표시 기준 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
