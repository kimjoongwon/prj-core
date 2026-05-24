# TimelineSessionProgramDetailPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TimelineSessionProgramDetailPage/TimelineSessionProgramDetailPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Program 상세에서 routine snapshot 메타와 `executionPlan` 기반 실행 운동 목록을 읽기 전용으로 표시합니다.

## 디자인 스케치

```text
TimelineSessionProgramDetailPage
- DetailPage
  - PageTitleBar
    - Button x2
  - DetailPageSurface
    - DetailSectionCard
      - DetailSection
        - PageTitleBar
        - Link x2
        - DateTimeCell (조건부)
    - DetailSectionCard
      - DetailSection
        - PageTitleBar
  - Modal
    - ModalContent
      - ModalHeader
      - ModalBody
      - ModalFooter
        - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailPage` | `../../detail` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSectionCard` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Pencil` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `DetailSection` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `Link` | `next/link` | 사용자 액션 실행 |
| `DateTimeCell` | `../../cell` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalContent` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalHeader` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalBody` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalFooter` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineSessionProgramDetailPage | 공개 계약 요소 |

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
| 2026-03-29 | Program 상세 화면의 실행 운동 영역과 루틴 스냅샷 표시 규칙 추가 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
