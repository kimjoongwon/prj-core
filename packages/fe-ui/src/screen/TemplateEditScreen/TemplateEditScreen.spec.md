# TemplateEditScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TemplateEditScreen/TemplateEditScreen.tsx

## 역할

이 파일은 템플릿 수정 화면의 pure presentational page 컴포넌트를 담당합니다.
조회/저장 mutation, route 이동, 로컬 폼 상태와 변수 배열 제어는 app route container가 소유하고 이 page는 props contract만 렌더링합니다.

## 디자인 스케치

```text
TemplateEditScreen
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
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `TemplateForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TemplateEditScreen | 템플릿 수정 화면의 pure screen contract |
| TemplateEditScreenProps | TemplateForm 입력값, 변수 배열, CTA handler를 주입받는 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | JSX runtime |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 수정 화면의 조회/저장/이동 책임 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
