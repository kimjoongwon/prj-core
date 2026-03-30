# AdminRoutinesRoutineIdEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminRoutinesRoutineIdEditPage/AdminRoutinesRoutineIdEditPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
기존 Routine 수정 시 각 Activity의 schedulable 상태를 다시 계산하고, 영상 누락 Exercise가 남아 있으면 저장을 차단합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminRoutinesRoutineIdEditPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/routines | 기능 구현 의존성 |
| @cocrepo/api/core/tasks | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## UI 규칙

- 로드된 Activity 목록은 `task.exercise.videoFileId` 기준으로 schedulable 상태를 계산합니다.
- 편집 중 스케줄 불가 Activity가 포함되면 경고 메시지와 함께 저장을 차단합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Routine 수정 화면에 Activity schedulable 재계산과 저장 차단 규칙을 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route runtime ownership에 맞춰 page를 props 기반 pure contract로 정리 | codex |
