# AdminTasksNewPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminTasksNewPage/AdminTasksNewPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Task root와 Exercise detail을 동시에 생성하며 이미지/영상 자산 ID 입력과 스케줄 가능 상태 preview를 제공합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminTasksNewPage | 공개 계약 요소 |
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/tasks | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- `videoFileId` 입력 여부에 따라 현재 폼의 `스케줄 가능` 상태를 즉시 표시합니다.
- 생성 payload는 Exercise의 `imageFileId`, `videoFileId`를 함께 전송합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Exercise 이미지/영상 자산 입력과 스케줄 가능 상태 preview를 신규 Task 생성 화면에 반영 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
