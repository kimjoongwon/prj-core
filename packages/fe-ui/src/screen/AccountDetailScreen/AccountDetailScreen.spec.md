# AccountDetailScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/AccountDetailScreen/AccountDetailScreen.tsx

## 역할

IDP 계정 상세 화면의 pure screen 컴포넌트입니다.
상세 조회, 계정 잠금/세션/비밀번호 mutation, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합과 액션 confirm modal만 담당합니다.

## 디자인 스케치

```text
AccountDetailScreen
- VStack
  - PageTitleBar
    - Button
  - ScreenSurface
    - VStack
      - SectionSurface
        - Section
          - PageTitleBar
          - Switch
          - Chip x2
          - Button (조건부)
          - DateTimeCell
          - Button (조건부)
          - Chip
          - DateTimeCell x2
      - SectionSurface
        - Section
          - PageTitleBar
          - Separator
          - Button x3
      - SectionSurface
        - Section
          - PageTitleBar
          - Separator
          - Chip
          - DateTimeCell
          - Select x2
          - Button
  - ConfirmModal (조건부)
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
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Switch` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Lock` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `LockOpen` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `RotateCcw` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Separator` | `@heroui/react` | 화면 조합 요소 |
| `Select` | `@heroui/react` | Space/Role 선택 |
| `ListBox.Item` | `@heroui/react` | Space/Role 옵션 표시 |
| `KeyRound` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `LogOut` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ShieldCheck` | `lucide-react` | 접근 권한 부여 액션을 시각화 |
| `ConfirmModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| AccountDetailScreenAccount | 상세 표시 계약 |
| AccountDetailScreenAccessGrant | 계정에 부여된 Space/Role 접근 권한 표시 계약 |
| AccountDetailScreenAccessGrantForm | 접근 권한 부여 폼 상태 계약 |
| AccountDetailScreenOption | Space/Role 선택 옵션 계약 |
| AccountDetailScreenProps | pure screen 입력 계약 |
| AccountDetailScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-24 | Storybook fixture가 접근 권한 목록과 Space/Role 권한 부여 폼 계약을 모두 포함하도록 정리 | codex |
| 2026-04-29 | 계정 상세에서 기존 접근 권한 목록과 Space/Role 권한 부여 폼을 표시하도록 공개 계약과 화면 구성을 갱신 | codex |
| 2026-04-08 | 계정 보안 액션의 확인 절차 진입 계약 정리 | codex |
| 2026-03-30 | 화면 데이터/이벤트 소유 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-29 | IDP 계정 상세 화면의 조회/보안 액션/라우팅 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
