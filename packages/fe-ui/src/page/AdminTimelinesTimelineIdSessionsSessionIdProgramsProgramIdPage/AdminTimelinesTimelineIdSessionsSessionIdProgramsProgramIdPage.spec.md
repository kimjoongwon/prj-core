# AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdPage/AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Program 상세에서 routine snapshot 메타와 `executionPlan` 기반 실행 운동 목록을 읽기 전용으로 표시합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/link | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- 기본 정보 영역은 `routineNameSnapshot`과 `activityCount`를 우선 사용합니다.
- `executionPlan` 각 항목은 순서, 반복, 휴식, 운동 설명, 시간, 횟수, 이미지/영상 자산 링크를 카드 형태로 노출합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | dev compile 정체를 줄이기 위해 `@cocrepo/ui` self barrel 대신 상대 import를 사용하도록 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Program 상세 화면에 executionPlan 기반 실행 운동 섹션과 routine snapshot 표시 규칙을 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
