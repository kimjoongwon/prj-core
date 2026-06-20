# InquiryCreateScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/InquiryCreateScreen/InquiryCreateScreen.tsx

## 역할

이 파일은 문의 접수 화면의 pure screen 레이어를 담당합니다. bootstrap 데이터, 고객 검색, AI 채움, 생성 mutation, 라우팅은 app route가 소유하고 이 파일은 입력 섹션과 CTA 렌더링만 담당합니다.
target 구조는 route `page.tsx`가 `ScreenSurface`를 명시하고, screen 내부는 `VStack` rhythm과 복수 `SectionSurface`를 소유하는 형태입니다.

## 디자인 스케치

```text
InquiryCreateScreen
- route page / route-local client boundary
  - ScreenSurface
    - InquiryCreateScreen
- screen
  - VStack
    - PageTitleBar
      - Button
    - SectionSurface (AI 폼 추천)
      - PageTitleBar
      - AiForm
    - SectionSurface (문의 입력)
      - PageTitleBar
      - Input x2
      - TextArea
      - Select x3
      - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@cocrepo/ui` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ScreenSurface` | route page | page-level surface topology |
| `VStack` | `@cocrepo/ui` | screen rhythm |
| `SectionSurface` | `@cocrepo/ui` | screen 주요 구역 surface |
| `AiForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `TextArea` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| InquiryCreateScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/inquiries | 문의 enum type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |