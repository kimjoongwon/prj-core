# AbilityFormPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/AbilityFormPage/AbilityFormPage.tsx

## 역할

권한 등록/수정 route가 공통으로 사용하는 pure editor page 컴포넌트입니다. 로딩, not-found, ready 상태와 폼 시각 조합만 소유하고 검증/뮤테이션/라우팅은 app route container가 담당합니다.

## 디자인 스케치

```text
AbilityFormPage
- FormPage
  - PageTitleBar
    - Button x2
  - FormPageSurface
    - VStack
      - FormSectionCard
        - FormSection
          - PageTitleBar
          - Input
          - TextArea
      - FormSectionCard
        - FormSection
          - PageTitleBar
          - Select x2
          - TextArea x2
          - Switch
          - TextArea (조건부)
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `FormPage` | `../../form` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `FormPageSurface` | `../../form` | 콘텐츠 그룹과 elevation 구성 |
| `FormSectionCard` | `../../form` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Save` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `../../rhythm` | 화면 조합 요소 |
| `FormSection` | `../../form` | 콘텐츠 그룹과 elevation 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `TextArea` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Switch` | `@heroui/react` | 사용자 입력 컨트롤 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityFormPageOption | Select 옵션 계약 |
| AbilityFormPageForm | 폼 값 계약 |
| AbilityFormPageChangeHandlers | 필드 변경 핸들러 계약 |
| AbilityFormPageProps | 공개 계약 요소 |
| AbilityFormPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | 초기 화면 기획 수립 | codex |
