# TaskCreateScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TaskCreateScreen/TaskCreateScreen.tsx

## 역할

이 파일은 Task root + Exercise detail 등록 화면의 pure screen 레이어를 담당합니다.
route의 mutation/router/local state는 app route가 소유하고, 이 파일은 선택된 이미지/영상 preview와 공통 `AssetBrowser` picker modal을 props 기반으로 렌더링합니다.

## 디자인 스케치

```text
TaskCreateScreen
- VStack
  - PageTitleBar
    - Button x2
  - ScreenSurface
    - SectionSurface
      - Section
        - PageTitleBar
        - Input x4
        - TextArea
        - ExerciseMediaField x2
        - Chip
  - AssetBrowser
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `MediaThumbnail` | `@cocrepo/ui` | 화면 조합 요소 |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `TextArea` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ExerciseMediaField` | `현재 파일` | 페이지 내부 보조 컴포넌트 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AssetBrowser` | `@cocrepo/ui` | 화면 조합 요소 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TaskCreateScreen | 공개 계약 요소 |
| TaskCreateScreenProps | 태스크 등록 화면 렌더링 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## UI 규칙

- `videoFileId` 입력 여부에 따라 현재 폼의 `스케줄 가능` 상태를 즉시 표시합니다.
- 생성 payload는 Exercise의 `imageFileId`, `videoFileId`를 함께 전송합니다.
- 이미지/영상 선택 modal은 `/assets`와 같은 `AssetBrowser` feature를 picker mode로 재사용합니다.