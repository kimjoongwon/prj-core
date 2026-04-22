# RoutineCreatePage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/RoutineCreatePage/RoutineCreatePage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Routine 작성 시 스케줄 가능한 Task만 편성 후보로 노출하고, 영상 누락 Exercise가 포함되면 저장을 차단합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoutineCreatePage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/routines | 기능 구현 의존성 |
| @cocrepo/api/core/tasks | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- Task 검색 결과는 `exercise.videoFileId`가 있는 항목만 기본 후보로 사용합니다.
- 이미 추가된 Activity 중 스케줄 불가 항목이 있으면 저장 버튼을 차단하고 경고를 표시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Routine 신규 작성 화면에 schedulable Task 필터와 저장 차단 규칙을 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route runtime ownership에 맞춰 page를 props 기반 pure contract로 정리 | codex |
