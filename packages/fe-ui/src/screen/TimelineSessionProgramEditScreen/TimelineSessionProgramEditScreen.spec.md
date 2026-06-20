# TimelineSessionProgramEditScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Program 수정 시 선택한 Routine의 execution preview를 보여주고, 스케줄 불가 Routine으로의 교체를 차단합니다.

## 디자인 스케치

```text
TimelineSessionProgramEditScreen
- VStack
  - PageTitleBar
    - Button
  - ScreenSurface
    - SectionSurface
      - Section
        - PageTitleBar
        - VStack
          - Input x2
          - Button
          - Input
          - Button
          - Chip
          - Input
          - Select
          - Button
  - ProgramPickerModal x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ProgramPickerModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineSessionProgramEditScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/routines | 기능 구현 의존성 |
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/api/core/users | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## UI 규칙

- 현재 Program의 Routine 변경 후보마다 schedulable 상태를 표시합니다.
- 선택된 Routine의 execution preview를 즉시 갱신합니다.
- preview에 영상 누락 Exercise가 있으면 저장 버튼을 비활성화합니다.
- execution preview row key는 activity id/order가 중복돼도 충돌하지 않도록 index를 함께 사용합니다.