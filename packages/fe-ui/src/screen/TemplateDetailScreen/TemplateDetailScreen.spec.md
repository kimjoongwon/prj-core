# TemplateDetailScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TemplateDetailScreen/TemplateDetailScreen.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.

## 디자인 스케치

```text
TemplateDetailScreen
- VStack
  - PageTitleBar
    - TemplateActions
  - ScreenSurface
    - VStack
      - SectionSurface
        - Section
          - PageTitleBar
          - TemplateTypeBadge
          - Switch
          - DateTimeCell x2
      - SectionSurface
        - Section
          - PageTitleBar
          - TemplateContentViewer
      - SectionSurface
        - Section
          - PageTitleBar
          - VariableReadTable (조건부)
  - Modal
    - Modal overlay content
      - Modal.Header
      - Modal.Body
      - Modal.Footer
        - Button x2
  - PreviewModal
  - SendTestModal
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `TemplateActions` | `@cocrepo/ui` | 화면 조합 요소 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `TemplateTypeBadge` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Switch` | `@heroui/react` | 사용자 입력 컨트롤 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `TemplateContentViewer` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `VariableReadTable` | `@cocrepo/ui` | 목록/표 데이터 표시 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `PreviewModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |
| `SendTestModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TemplateDetailScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/templates | 기능 구현 의존성 |
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
| 2026-03-26 | 초기 화면 기획 수립 | codex |
