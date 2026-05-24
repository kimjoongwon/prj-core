# RoleCreatePage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/RoleCreatePage/RoleCreatePage.tsx

## 역할

이 파일은 역할 등록 화면의 pure screen 레이어를 담당합니다.
route의 mutation/router/local state는 app route가 소유하고, 이 파일은 props로 받은 값과 핸들러만 렌더링합니다.

## 디자인 스케치

```text
RoleCreatePage
- FormPage
  - PageTitleBar
    - Button
  - FormPageSurface
    - VStack
      - FormSectionCard
        - Input x2
        - Textarea
        - Button
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `FormPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `FormPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `FormSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Textarea` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Save` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoleCreatePage | 공개 계약 요소 |
| RoleCreatePageProps | 역할 등록 화면 렌더링 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 역할 등록 화면의 제출/라우팅 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
