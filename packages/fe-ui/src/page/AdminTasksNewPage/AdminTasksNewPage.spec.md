# AdminTasksNewPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminTasksNewPage/AdminTasksNewPage.tsx

## 역할

이 파일은 Task root + Exercise detail 등록 화면의 pure page 레이어를 담당합니다.
route의 mutation/router/local state는 app route가 소유하고, 이 파일은 이미지/영상 자산 ID 입력과 스케줄 가능 상태 preview를 props 기반으로 렌더링합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminTasksNewPage | 공개 계약 요소 |
| AdminTasksNewPageProps | 태스크 등록 화면 렌더링 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## UI 규칙

- `videoFileId` 입력 여부에 따라 현재 폼의 `스케줄 가능` 상태를 즉시 표시합니다.
- 생성 payload는 Exercise의 `imageFileId`, `videoFileId`를 함께 전송합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 태스크 등록 로직을 route page로 이동하고 page를 pure props contract로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Exercise 이미지/영상 자산 입력과 스케줄 가능 상태 preview를 신규 Task 생성 화면에 반영 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
