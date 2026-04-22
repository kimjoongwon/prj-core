# TaskExerciseDetailPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/TaskExerciseDetailPage/TaskExerciseDetailPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Exercise 상세를 표시하면서 현재 스케줄 가능 상태와 연결된 이미지/영상 자산 링크를 함께 제공합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| TaskExerciseDetailPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/tasks | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- 상세 상단 메타에 `스케줄 가능` 배지를 표시합니다.
- `imageFileId`, `videoFileId`가 있으면 자산 상세 경로 링크를 제공합니다.
- 연관 Routine 목록은 동일 Routine이 중복 수집돼도 index 기반 stable key로 렌더링합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | 연관 Routine 목록이 중복 생성 시점 데이터를 받아도 key warning 없이 렌더링하도록 UI 규칙을 보강 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Exercise 상세 화면에 schedulable 배지와 자산 링크 노출 규칙을 추가 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
