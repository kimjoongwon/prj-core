# OidcClientCreateScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/OidcClientCreateScreen/OidcClientCreateScreen.tsx

## 역할

OIDC 클라이언트 등록 화면의 pure screen 컴포넌트입니다.
생성 mutation과 라우팅은 route thin container가 소유하고 이 파일은 폼 렌더링과 로컬 검증 상태만 담당합니다.

## 디자인 스케치

```text
OidcClientCreateScreen
- VStack
  - PageTitleBar
    - BackButton
  - ScreenSurface
    - VStack
      - SectionSurface
        - Section
          - PageTitleBar
          - OidcClientForm
```

## 화면 러프

### Desktop

```text
[←] OIDC 클라이언트 등록
    새 인증 클라이언트를 생성합니다.

┌──────────────────────────────────────────────────────────────┐
│ 기본 정보                                                     │
│ Client ID        [ my-app-client                         ]    │
│ 이름             [ My Application                        ]    │
│ Client Secret    [ 직접 입력하거나 자동 생성하세요     ][생성] │
│ □ Public 클라이언트 (Secret 없음)                             │
├──────────────────────────────────────────────────────────────┤
│ 인증 설정                                                     │
│ 인증 방식        [ client_secret_basic                    v ] │
│ Grant Types      □ authorization_code  □ refresh_token        │
│ Response Types   □ code                                      │
│ 스코프           [ openid profile email                  ]    │
│                                                              │
│ ┌──────────────────────────┐ ┌──────────────────────────────┐ │
│ │ □ First-party 클라이언트 │ │ □ 권한 동의 화면 생략        │ │
│ │ 플랫폼 소유/신뢰 client  │ │ First-party에서만 사용 가능  │ │
│ └──────────────────────────┘ └──────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Redirect URIs                                                 │
│ [ https://app.example.com/callback                         ]  │
│ [+ URI 추가]                                                  │
├──────────────────────────────────────────────────────────────┤
│ 앱 복귀 설정 / 로그인 화면 설정 / 추가 정보                   │
│ [로그인 셸 URL] [기본 복귀 URL] [공통 로그인 사용] ...         │
└──────────────────────────────────────────────────────────────┘
                                             [취소] [등록]
```

### Tablet

```text
[←] OIDC 클라이언트 등록
    새 인증 클라이언트를 생성합니다.

┌──────────────────────────────────────────────┐
│ 클라이언트 설정                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 기본 정보                                │ │
│ │ Client ID / 이름 / Secret                │ │
│ ├──────────────────────────────────────────┤ │
│ │ 인증 설정                                │ │
│ │ Grant Types / Response Types / Scope     │ │
│ │ ┌──────────────────┐ ┌────────────────┐ │ │
│ │ │ □ First-party   │ │ □ Consent skip │ │ │
│ │ │ 신뢰 client     │ │ first-party only│ │ │
│ │ └──────────────────┘ └────────────────┘ │ │
│ ├──────────────────────────────────────────┤ │
│ │ Redirect URIs / 복귀 설정 / 로그인 UI    │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
                                      [취소] [등록]
```

### Mobile

```text
[←]
OIDC 클라이언트 등록
새 인증 클라이언트를 생성합니다.

┌──────────────────────────────┐
│ 기본 정보                     │
│ Client ID                    │
│ [ my-app-client            ] │
│ 이름                         │
│ [ My Application           ] │
│ Client Secret                │
│ [ 직접 입력 또는 자동 생성 ] │
│ [자동 생성]                  │
│ □ Public 클라이언트          │
├──────────────────────────────┤
│ 인증 설정                     │
│ 인증 방식 [ ...          v ] │
│ Grant Types                   │
│ □ authorization_code          │
│ □ refresh_token               │
│ Response Types                │
│ □ code                        │
│ 스코프 [openid profile email]│
│                              │
│ ┌──────────────────────────┐ │
│ │ □ First-party 클라이언트 │ │
│ │ 플랫폼 소유/신뢰 client  │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ □ 권한 동의 화면 생략    │ │
│ │ First-party OFF면 disabled│ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Redirect URIs / 복귀 / UI    │
│ 입력 그룹은 세로로 누적된다. │
└──────────────────────────────┘
[취소] [등록]
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `BackButton` | `@cocrepo/ui` | 사용자 액션 실행 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `OidcClientForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientCreateScreenSubmitInput | route로 전달하는 제출 계약 (`isFirstParty`, `skipConsent`, `loginUi` 포함) |
| OidcClientCreateScreenProps | pure screen 입력 계약 |
| OidcClientCreateScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | OIDC client 로그인 UI override 타입 |
| @cocrepo/ui | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |