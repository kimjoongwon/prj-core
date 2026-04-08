# AdminTimelinesTimelineIdEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminTimelinesTimelineIdEditPage/AdminTimelinesTimelineIdEditPage.tsx

## 역할

이 파일은 타임라인 수정 화면의 pure page 레이어를 담당합니다.
라우트/쿼리/뮤테이션/토스트/로컬 상태는 app route가 소유하고, 이 page는 props로 받은 값과 핸들러만 렌더링합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminTimelinesTimelineIdEditPage | 공개 계약 요소 |
| AdminTimelinesTimelineIdEditPageProps | 타임라인 수정 화면 렌더링 props 계약 |

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
| onChangeDescriptionTextarea | `(value: string) => void` | 설명 입력 변경 핸들러 |
| onClickCancelButton | `() => void` | 취소 버튼 핸들러 |
| onClickSubmitButton | `() => void` | 수정 버튼 핸들러 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | dev compile 정체를 줄이기 위해 `@cocrepo/ui` self barrel 대신 상대 import를 사용하도록 정리 | codex |
| 2026-03-30 | route/runtime 의존성을 app route로 이동하고 page를 pure props contract로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
