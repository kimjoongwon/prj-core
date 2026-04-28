# AbilityDetailPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AbilityDetailPage/AbilityDetailPage.tsx

## 역할

권한 상세 route의 loading, not-found, ready, delete-confirm modal 상태를 page 레이어에서 조합하는 pure page 컴포넌트입니다.

## 디자인 스케치

```text
AbilityDetailPage
- DetailPage
  - PageTitleBar
    - Button x3
  - DetailPageSurface
    - VStack
      - DetailSectionCard
        - Chip
      - DetailSectionCard
        - Chip (조건부)
      - DetailSectionCard
  - Modal
    - ModalContent
      - ModalHeader
        - Key
      - ModalBody
      - ModalFooter
        - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailPage` | `../../detail` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSectionCard` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Edit` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `../../rhythm` | 화면 조합 요소 |
| `Chip` | `../../display` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalContent` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalHeader` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Key` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ModalBody` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalFooter` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityDetailPageAbility | 상세 view model 계약 |
| AbilityDetailPageProps | 공개 계약 요소 |
| AbilityDetailPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | 초기 화면 기획 수립 | codex |
