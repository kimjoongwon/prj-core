# OidcClientEditScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/OidcClientEditScreen/OidcClientEditScreen.tsx

## 역할

OIDC 클라이언트 수정 화면의 pure screen 컴포넌트입니다.
상세 조회, 저장 mutation, 라우팅은 route thin container가 소유하고 이 파일은 폼 렌더링과 로컬 입력 상태만 담당합니다.

## 디자인 스케치

```text
OidcClientEditScreen
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
[←] OIDC 클라이언트 수정                         [저장]
    기존 인증 클라이언트 설정을 수정합니다.

┌──────────────────────────────────────────────────────────────┐
│ 기본 정보                                                     │
│ Client ID        [ admin-web                            ] 🔒  │
│ 이름             [ Admin Web                            ]    │
│ Client Secret    [ 변경하지 않으려면 비워두세요         ]    │
├──────────────────────────────────────────────────────────────┤
│ 인증 설정                                                     │
│ 인증 방식        [ client_secret_basic                    v ] │
│ Grant Types      □ authorization_code  □ refresh_token        │
│ Response Types   □ code                                      │
│ 스코프           [ openid profile email                  ]    │
│                                                              │
│ ┌──────────────────────────┐ ┌──────────────────────────────┐ │
│ │ ☑ First-party 클라이언트 │ │ ☑ 권한 동의 화면 생략        │ │
│ │ OFF로 변경하면 consent   │ │ First-party ON일 때만 활성   │ │
│ │ 생략 값은 false로 정리   │ │ prompt=consent는 항상 표시   │ │
│ └──────────────────────────┘ └──────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Redirect URIs / 앱 복귀 설정 / 로그인 화면 설정 / 추가 정보   │
└──────────────────────────────────────────────────────────────┘
                                             [취소] [저장]
```

### Tablet

```text
[←] OIDC 클라이언트 수정
    admin-web 클라이언트를 수정합니다.

┌──────────────────────────────────────────────┐
│ 클라이언트 설정                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 기본 정보                                │ │
│ │ Client ID [admin-web] readonly           │ │
│ ├──────────────────────────────────────────┤ │
│ │ 인증 설정                                │ │
│ │ ☑ First-party 클라이언트                 │ │
│ │ ☑ 권한 동의 화면 생략                    │ │
│ │ First-party OFF 변경 시 skipConsent=false│ │
│ ├──────────────────────────────────────────┤ │
│ │ Redirect URIs / 복귀 설정 / 로그인 UI    │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
                                      [취소] [저장]
```

### Mobile

```text
[←]
OIDC 클라이언트 수정
기존 인증 클라이언트 설정을 수정합니다.

┌──────────────────────────────┐
│ 기본 정보                     │
│ Client ID                    │
│ [ admin-web              ] 🔒 │
│ 이름 [Admin Web            ] │
│ Client Secret                │
│ [ 비워두면 기존 Secret 유지] │
├──────────────────────────────┤
│ 인증 설정                     │
│ 인증 방식 [ ...          v ] │
│ Grant Types / Response Types │
│ 스코프                       │
│                              │
│ ┌──────────────────────────┐ │
│ │ ☑ First-party 클라이언트 │ │
│ │ OFF 시 consent 생략 해제 │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ ☑ 권한 동의 화면 생략    │ │
│ │ First-party ON일 때 활성 │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ 나머지 설정은 세로 누적       │
└──────────────────────────────┘
[취소] [저장]
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `BackButton` | `@cocrepo/ui` | 사용자 액션 실행 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `OidcClientForm` | `@cocrepo/ui` | 입력 폼 또는 AI 입력 흐름 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientEditScreenClient | 수정 화면 초기값 계약 (`isFirstParty`, `skipConsent`, `loginUi` 포함) |
| OidcClientEditScreenSubmitInput | route로 전달하는 제출 계약 (`isFirstParty`, `skipConsent`, `loginUi` 포함) |
| OidcClientEditScreenProps | pure screen 입력 계약 |
| OidcClientEditScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | OIDC client 로그인 UI override 타입 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |