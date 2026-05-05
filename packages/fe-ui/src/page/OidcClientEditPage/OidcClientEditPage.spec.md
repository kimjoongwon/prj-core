# OidcClientEditPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcClientEditPage/OidcClientEditPage.tsx

## 역할

OIDC 클라이언트 수정 화면의 pure page 컴포넌트입니다.
상세 조회, 저장 mutation, 라우팅은 route thin container가 소유하고 이 파일은 폼 렌더링과 로컬 입력 상태만 담당합니다.

## 디자인 스케치

```text
OidcClientEditPage
- FormPage
  - PageTitleBar
    - BackButton
  - FormPageSurface
    - VStack
      - FormSectionCard
        - FormSection
          - PageTitleBar
          - OidcClientForm
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `FormPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `BackButton` | `@cocrepo/ui` | 사용자 액션 실행 |
| `FormPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `FormSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `FormSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `OidcClientForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientEditPageClient | 수정 화면 초기값 계약 (`skipConsent`, `loginUi` 포함) |
| OidcClientEditPageSubmitInput | route로 전달하는 제출 계약 (`skipConsent`, `loginUi` 포함) |
| OidcClientEditPageProps | pure page 입력 계약 |
| OidcClientEditPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | first-party OIDC client 판별 |
| @cocrepo/type | OIDC client 로그인 UI override 타입 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-05 | client별 로그인 화면 override를 초기화/저장하는 `loginUi` 계약과 브랜드 컬러 검증을 추가 | codex |
| 2026-05-05 | first-party OIDC 클라이언트의 권한 동의 화면 생략 수정 계약과 custom scheme redirect URI 검증 허용 추가 | codex |
| 2026-03-30 | 화면 데이터/이벤트 소유 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-29 | OIDC 클라이언트 수정 화면의 조회/저장/라우팅 책임 경계 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시명 기준 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
