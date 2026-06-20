# SecurityPolicyFormScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/SecurityPolicyFormScreen/SecurityPolicyFormScreen.tsx

## 역할

보안 정책 설정 화면의 pure screen 컴포넌트입니다.
정책 조회, 저장 mutation, 성공 상태 관리는 route thin container가 소유하고 이 파일은 form shell과 로컬 입력 상태만 담당합니다.

## 디자인 스케치

```text
SecurityPolicyFormScreen
- VStack
  - PageTitleBar
    - Button
  - ScreenSurface
    - VStack
      - SectionSurface
        - Section
          - PageTitleBar
          - VStack
            - Input
            - VStack
            - Input x2
      - SectionSurface x2
        - Section
          - PageTitleBar
          - VStack
            - Input x3
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Save` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Switch` | `@heroui/react` | 사용자 입력 컨트롤 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| SecurityPolicyFormScreenPolicy | 보안 정책 표시 계약 |
| SecurityPolicyFormScreenSubmitInput | 저장 payload 계약 |
| SecurityPolicyFormScreenProps | pure screen 입력 계약 |
| SecurityPolicyFormScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |