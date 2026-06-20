# TemplateCreateScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TemplateCreateScreen/TemplateCreateScreen.tsx

## 역할

이 파일은 템플릿 등록 화면의 pure screen 레이어를 담당합니다.
route의 mutation/router/local state는 app route가 소유하고, 이 파일은 `TemplateForm` 조합과 props 기반 제출 UI만 담당합니다.

## 디자인 스케치

```text
TemplateCreateScreen
- VStack
  - PageTitleBar
  - ScreenSurface
    - SectionSurface
      - TemplateForm
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `TemplateForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TemplateCreateScreen | 공개 계약 요소 |
| TemplateCreateScreenProps | 템플릿 등록 화면 렌더링 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |