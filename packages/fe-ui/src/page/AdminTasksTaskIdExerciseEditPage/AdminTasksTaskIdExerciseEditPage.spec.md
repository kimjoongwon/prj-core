# AdminTasksTaskIdExerciseEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminTasksTaskIdExerciseEditPage/AdminTasksTaskIdExerciseEditPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
기존 Exercise 상세를 수정하면서 이미지/영상 자산 ID와 스케줄 가능 상태를 함께 관리합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminTasksTaskIdExerciseEditPage | 공개 계약 요소 |
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
| react | 기능 구현 의존성 |

## UI 규칙

- 수정 폼은 `imageFileId`, `videoFileId`를 편집 가능한 입력으로 노출합니다.
- `videoFileId` 존재 여부에 따라 현재 Exercise의 `스케줄 가능` 상태를 즉시 표시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Exercise 수정 화면에 영상 기반 스케줄 가능 상태와 자산 식별자 편집 필드를 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
