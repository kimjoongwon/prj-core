# ActionEditScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/ActionEditScreen/ActionEditScreen.tsx

## 역할

Action 수정 화면의 pure screen 컴포넌트입니다.
상세 조회, 저장 mutation, 라우팅은 route thin container가 소유하고 이 파일은 폼 렌더링과 로컬 입력 상태만 담당합니다.

## 디자인 스케치

```text
ActionEditScreen
- VStack
  - ScreenSurface
    - VStack
      - SectionSurface
        - Input x2
        - TextArea
        - Select
        - Input
        - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `TextArea` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Save` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| ActionEditScreenAction | 수정 화면 초기값 계약 |
| ActionEditScreenForm | route로 전달하는 폼 제출 계약 |
| ActionEditScreenProps | pure screen 입력 계약 |
| ActionEditScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 화면 데이터/이벤트 소유 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-29 | Action 수정 화면의 조회/저장/라우팅 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
