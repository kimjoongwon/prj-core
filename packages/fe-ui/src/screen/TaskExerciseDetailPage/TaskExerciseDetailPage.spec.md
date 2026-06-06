# TaskExerciseDetailPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TaskExerciseDetailPage/TaskExerciseDetailPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Exercise 상세를 표시하면서 현재 스케줄 가능 상태와 연결된 이미지/영상 자산 링크를 함께 제공합니다.

## 디자인 스케치

```text
TaskExerciseDetailPage
- DetailPage
  - PageTitleBar
    - Button x2
  - DetailPageSurface
    - VStack
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
          - Chip
          - Link x2
          - DateTimeCell x2
      - DetailSectionCard x2
        - DetailSection
          - PageTitleBar
  - Modal
    - Modal overlay content
      - Modal.Header
      - Modal.Body
      - Modal.Footer
        - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Pencil` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `DetailSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Link` | `next/link` | 사용자 액션 실행 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

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
| 2026-03-29 | Exercise 상세 화면의 스케줄 가능 상태와 자산 연결 노출 기준 추가 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
