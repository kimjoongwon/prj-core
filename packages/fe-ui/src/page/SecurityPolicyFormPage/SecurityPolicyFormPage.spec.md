# SecurityPolicyFormPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/SecurityPolicyFormPage/SecurityPolicyFormPage.tsx

## 역할

보안 정책 설정 화면의 pure page 컴포넌트입니다.
정책 조회, 저장 mutation, 성공 상태 관리는 route thin container가 소유하고 이 파일은 form shell과 로컬 입력 상태만 담당합니다.

## 디자인 스케치

```text
SecurityPolicyFormPage
- FormPage
  - PageTitleBar
    - Button
  - FormPageSurface
    - VStack
      - FormSectionCard
        - FormSection
          - PageTitleBar
          - VStack
            - Input
            - VStack
            - Input x2
      - FormSectionCard x2
        - FormSection
          - PageTitleBar
          - VStack
            - Input x3
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `FormPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Save` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `FormPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `FormSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `FormSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Switch` | `@heroui/react` | 사용자 입력 컨트롤 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| SecurityPolicyFormPagePolicy | 보안 정책 표시 계약 |
| SecurityPolicyFormPageSubmitInput | 저장 payload 계약 |
| SecurityPolicyFormPageProps | pure page 입력 계약 |
| SecurityPolicyFormPage | 공개 계약 요소 |

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
| 2026-03-29 | 보안 정책 화면의 조회/저장/저장 성공 상태 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
