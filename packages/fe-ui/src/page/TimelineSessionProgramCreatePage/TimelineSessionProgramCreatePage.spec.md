# TimelineSessionProgramCreatePage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/TimelineSessionProgramCreatePage/TimelineSessionProgramCreatePage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Program 생성 시 선택한 Routine의 execution preview를 보여주고, 영상 누락 Exercise가 포함된 Routine은 저장을 차단합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineSessionProgramCreatePage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/routines | 기능 구현 의존성 |
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/api/core/users | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- Routine picker는 선택 후보에 `스케줄 가능` 또는 `영상 누락` 상태를 표시합니다.
- 선택된 Routine 아래에 execution preview를 렌더링합니다.
- preview에 스케줄 불가 Activity가 포함되면 저장 버튼을 비활성화합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Program 신규 생성 화면에 Routine execution preview와 schedulable 차단 규칙을 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
