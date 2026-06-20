# InquiryEditScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/InquiryEditScreen/InquiryEditScreen.tsx

## 역할

이 파일은 문의 수정 화면의 pure screen 레이어를 담당합니다. bootstrap 조회, AI 채움, 저장 mutation, 라우팅은 app route가 소유하고 이 파일은 메타 편집 UI와 CTA만 렌더링합니다.

## 디자인 스케치

```text
InquiryEditScreen
- VStack
  - PageTitleBar
    - Button
  - ScreenSurface
    - VStack
      - SectionSurface (조건부)
        - Section
          - PageTitleBar
          - AiForm
      - SectionSurface
        - Section
          - PageTitleBar
          - VStack
            - Input
            - Select x2
            - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@cocrepo/ui` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `AiForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| InquiryEditScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/inquiries | 문의 enum type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |