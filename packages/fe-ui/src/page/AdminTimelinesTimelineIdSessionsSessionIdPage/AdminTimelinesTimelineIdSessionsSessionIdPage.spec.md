# AdminTimelinesTimelineIdSessionsSessionIdPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsSessionIdPage/AdminTimelinesTimelineIdSessionsSessionIdPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
세션 상세에서 Program 목록 summary를 표시하며 운동 수, 대표 운동, routine snapshot 이름을 함께 노출합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminTimelinesTimelineIdSessionsSessionIdPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/api/core/users | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/link | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- Program table은 `activityCount`, `previewExerciseNames`를 사용해 실행 운동 요약을 표시합니다.
- Routine 컬럼은 live routine name보다 `routineNameSnapshot`을 우선 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | 세션 상세 Program 목록에 운동 수/대표 운동 summary와 routine snapshot 우선 표시 규칙을 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
