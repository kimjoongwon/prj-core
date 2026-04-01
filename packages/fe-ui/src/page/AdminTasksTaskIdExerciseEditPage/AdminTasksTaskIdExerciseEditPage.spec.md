# AdminTasksTaskIdExerciseEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminTasksTaskIdExerciseEditPage/AdminTasksTaskIdExerciseEditPage.tsx

## 역할

이 파일은 Exercise 수정 화면의 pure presentational page 컴포넌트를 담당합니다.
기존 Exercise 상세를 수정하면서 선택된 이미지/영상 preview와 공통 `AssetBrowser` picker modal을 함께 표시하지만, 조회/저장/route 이동과 로컬 폼 상태는 app route container가 소유합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminTasksTaskIdExerciseEditPage | Exercise 수정 화면의 pure page contract |
| AdminTasksTaskIdExerciseEditPageProps | Exercise 수정 폼 값, 스케줄 가능 상태, CTA handler를 주입받는 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | JSX runtime |

## UI 규칙

- 수정 폼은 `imageFileId`, `videoFileId`를 편집 가능한 입력으로 노출합니다.
- `videoFileId` 존재 여부에 따라 현재 Exercise의 `스케줄 가능` 상태를 즉시 표시합니다.
- 이미지/영상 선택 modal은 `/assets`와 동일한 `AssetBrowser` feature를 picker mode로 재사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-01 | 수정 화면의 자산 선택 modal을 공통 `AssetBrowser` feature로 전환 | codex |
| 2026-03-30 | API/router/local state를 route로 이동하고 pure page props contract로 재정의 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Exercise 수정 화면에 영상 기반 스케줄 가능 상태와 자산 식별자 편집 필드를 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
