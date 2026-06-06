# TimelineEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TimelineEditPage/TimelineEditPage.tsx

## 역할

이 파일은 타임라인 수정 화면의 pure screen 레이어를 담당합니다.
라우트/쿼리/뮤테이션/토스트/로컬 상태는 app route가 소유하고, 이 page는 props로 받은 값과 핸들러만 렌더링합니다.

## 디자인 스케치

```text
TimelineEditPage
- FormPage
  - PageTitleBar
  - FormPageSurface
    - FormSectionCard
      - FormSection
        - VStack
          - Input
          - TextArea
          - Button
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `FormPage` | `../../form` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `FormPageSurface` | `../../form` | 콘텐츠 그룹과 elevation 구성 |
| `FormSectionCard` | `../../form` | 콘텐츠 그룹과 elevation 구성 |
| `FormSection` | `../../form` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `../../rhythm` | 화면 조합 요소 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `TextArea` | `@heroui/react` | 사용자 입력 컨트롤 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineEditPage | 공개 계약 요소 |
| TimelineEditPageProps | 타임라인 수정 화면 렌더링 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## props 계약

| 필드 | 타입 | 설명 |
|------|------|------|
| timelineName | `string \| undefined` | 페이지 헤더 description에 표시할 현재 타임라인명 |
| name | `string` | 수정 중인 타임라인명 값 |
| description | `string` | 수정 중인 설명 값 |
| nameError | `string \| undefined` | 타임라인명 검증 메시지 |
| descriptionError | `string \| undefined` | 설명 검증 메시지 |
| isSubmitPending | `boolean` | 수정 API 진행 상태 |
| isSubmitDisabled | `boolean` | 수정 버튼 활성화 여부 |
| onChangeNameInput | `(value: string) => void` | 이름 입력 변경 핸들러 |
| onChangeDescriptionTextArea | `(value: string) => void` | 설명 입력 변경 핸들러 |
| onClickCancelButton | `() => void` | 취소 버튼 핸들러 |
| onClickSubmitButton | `() => void` | 수정 버튼 핸들러 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | Space 콘텐츠 언어 기준 리소스 작성 안내와 언어 선택/필터 계약 반영 | codex |
| 2026-03-30 | 수정 화면의 저장/이동 책임 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
