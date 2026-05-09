# OidcClientCreatePage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcClientCreatePage/OidcClientCreatePage.tsx

## 역할

OIDC 클라이언트 등록 화면의 pure page 컴포넌트입니다.
생성 mutation과 라우팅은 route thin container가 소유하고 이 파일은 폼 렌더링과 로컬 검증 상태만 담당합니다.

## 디자인 스케치

```text
OidcClientCreatePage
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
| `FormPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `BackButton` | `@cocrepo/ui` | 사용자 액션 실행 |
| `FormPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `FormSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `FormSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `OidcClientForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientCreatePageSubmitInput | route로 전달하는 제출 계약 (`isFirstParty`, `skipConsent`, `loginUi` 포함) |
| OidcClientCreatePageProps | pure page 입력 계약 |
| OidcClientCreatePage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | OIDC client 로그인 UI override 타입 |
| @cocrepo/ui | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 화면 러프를 Desktop/Tablet/Mobile 기준으로 분리해 responsive form 배치 기준을 강화 | codex |
| 2026-05-09 | First-party/consent 설정을 포함한 데스크톱/모바일 markdown 화면 러프를 추가 | codex |
| 2026-05-09 | DB 기반 `isFirstParty` 제출 계약을 추가하고 `skipConsent`를 first-party 상태에 종속하도록 갱신 | codex |
| 2026-05-05 | client별 로그인 화면 override를 제출하는 `loginUi` 계약과 브랜드 컬러 검증을 추가 | codex |
| 2026-05-05 | first-party OIDC 클라이언트의 권한 동의 화면 생략 제출 계약과 custom scheme redirect URI 검증 허용 추가 | codex |
| 2026-03-30 | 화면 데이터/이벤트 소유 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-29 | OIDC 클라이언트 등록 화면의 생성/라우팅 책임 경계 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시명 기준 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
