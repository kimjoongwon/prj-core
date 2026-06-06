# InquiryCreatePage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/InquiryCreatePage/InquiryCreatePage.tsx

## 역할

이 파일은 문의 접수 화면의 pure screen 레이어를 담당합니다. bootstrap 데이터, 고객 검색, AI 채움, 생성 mutation, 라우팅은 app route가 소유하고 이 파일은 입력 섹션과 CTA 렌더링만 담당합니다.

## 디자인 스케치

```text
InquiryCreatePage
- FormPage
  - PageTitleBar
    - Button
  - FormPageSurface
    - VStack
      - FormSectionCard (조건부)
        - FormSection
          - PageTitleBar
          - AiForm
      - FormSectionCard
        - FormSection
          - PageTitleBar
          - VStack
            - Input x2
            - TextArea (조건부)
            - Select x3
            - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `FormPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@cocrepo/ui` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `FormPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `FormSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `FormSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `AiForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `TextArea` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| InquiryCreatePage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/inquiries | 문의 enum type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 문의 생성 초기 입력 데이터, 고객 검색, AI 채우기 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
