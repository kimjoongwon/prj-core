# AssetDetailScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/AssetDetailScreen/AssetDetailScreen.tsx

## 역할

에셋 상세 화면의 pure screen 컴포넌트입니다. 에셋 조회, 폴더 목록 조회, 삭제/이동 mutation, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합과 page-local 이동 선택 상태만 담당합니다.

## 디자인 스케치

```text
AssetDetailScreen
- VStack
  - PageTitleBar
    - Button x3
  - ScreenSurface
    - VStack
      - SectionSurface
        - PageTitleBar
          - Button
        - AssetPreview
        - Chip x3
        - DateTimeCell
      - SectionSurface
        - Section
          - PageTitleBar
          - DateTimeCell
      - SectionSurface
        - Section
          - PageTitleBar
          - Select
          - Button
      - SectionSurface
        - Section
          - PageTitleBar
          - Input x2
  - AssetPreviewDialog
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Maximize2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `AssetPreview` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |
| `FolderInput` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `AssetPreviewDialog` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| AssetDetailScreenAsset | 상세 에셋 데이터 계약 |
| AssetDetailScreenFolder | 폴더 선택 옵션 계약 |
| AssetDetailScreenProps | pure screen 입력 계약 |
| AssetDetailScreen | 공개 계약 요소 |

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
| 2026-03-29 | 에셋 상세 화면의 조회/삭제/폴더 이동/라우팅 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
