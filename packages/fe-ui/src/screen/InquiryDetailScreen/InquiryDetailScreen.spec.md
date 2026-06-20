# InquiryDetailScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/InquiryDetailScreen/InquiryDetailScreen.tsx

## 역할

이 파일은 문의 상세 화면의 pure screen 레이어를 담당합니다. 조회, WebSocket 연결 관리, 삭제/메타 mutation, 로컬 실시간 상태, 라우팅은 app route가 소유하고 이 파일은 실시간 상태 스냅샷과 핸들러를 받아 화면만 합성합니다.

## 디자인 스케치

```text
InquiryDetailScreen
- InquiryWebSocketProvider
  - VStack
    - PageTitleBar
      - HStack
        - Button x3
    - ScreenSurface
      - VStack
        - SectionSurface
          - HStack
            - InquiryInfoCard
            - InquiryMetaPanel
        - SectionSurface
          - HStack
            - CustomerInfoCard
            - ParticipantList
        - SectionSurface
          - VStack
            - PageTitleBar
            - AiForm
        - SectionSurface
          - VStack
            - PageTitleBar
            - Input
            - HStack
            - Button
        - SectionSurface
          - RealtimeChatPanel
        - SectionSurface
          - SLATracker
    - ConfirmModal
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `InquiryWebSocketProvider` | `@cocrepo/ui` | 화면 조합 요소 |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `HStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Button` | `@cocrepo/ui` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Pencil` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `InquiryInfoCard` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `InquiryMetaPanel` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `CustomerInfoCard` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `ParticipantList` | `@cocrepo/ui` | 화면 조합 요소 |
| `AiForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |
| `RealtimeChatPanel` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `SLATracker` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `ConfirmModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| InquiryDetailScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/inquiries | 문의 enum type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| ./hooks/useInquiryWebSocket | WebSocket status type 참조 |