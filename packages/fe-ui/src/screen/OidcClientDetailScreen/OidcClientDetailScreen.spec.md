# OidcClientDetailScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/OidcClientDetailScreen/OidcClientDetailScreen.tsx

## 역할

OIDC 클라이언트 상세 화면의 pure screen 컴포넌트입니다.
상세 조회, 활성 상태 전환, 삭제, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합과 삭제 확인 modal만 담당합니다.

## 디자인 스케치

```text
OidcClientDetailScreen
- VStack
  - PageTitleBar
    - Button x4
  - ScreenSurface
    - VStack
      - SectionSurface
        - Section
          - PageTitleBar
          - SecretField
          - ActiveStatusCell
          - First-party Chip
          - Consent skip Chip
          - DateTimeCell
      - SectionSurface
        - Section
          - PageTitleBar
          - AuthMethodCell
      - SectionSurface x3
        - Section
          - PageTitleBar
  - ConfirmModal
```

## 화면 러프

### Desktop

```text
[←] OIDC 클라이언트 상세
    Admin Web
                                      [수정] [비활성화] [삭제]

┌──────────────────────────────────────────────────────────────┐
│ 기본 정보                                                     │
│ Client ID              admin-web                             │
│ Client Secret          •••••••••••••••• [복사]               │
│ 상태                   활성                                  │
│ 클라이언트 신뢰 구분   [First-party]                         │
│ 권한 동의              [동의 생략]                           │
│ 생성일 / 수정일        2026-05-09 12:00                      │
├──────────────────────────────────────────────────────────────┤
│ 인증 설정                                                     │
│ 인증 방식              client_secret_basic                    │
│ Grant Types            authorization_code, refresh_token      │
│ Response Types         code                                   │
│ 스코프                 openid profile email                   │
├──────────────────────────────────────────────────────────────┤
│ Redirect URIs / 앱 복귀 설정 / 로그인 화면 설정 / 추가 정보   │
└──────────────────────────────────────────────────────────────┘

삭제 클릭 시:
┌─────────────────────────────┐
│ 클라이언트 삭제 확인        │
│ 삭제 후 복구할 수 없습니다. │
│              [취소] [삭제] │
└─────────────────────────────┘
```

### Tablet

```text
[←] OIDC 클라이언트 상세
Admin Web                                      [수정] [비활성화] [삭제]

┌──────────────────────────────────────────────┐
│ 기본 정보                                    │
│ Client ID        admin-web                   │
│ Client Secret    •••••••••••••••• [복사]    │
│ 상태             활성                       │
│ 신뢰 구분        [First-party]              │
│ 권한 동의 화면   [동의 생략]                │
├──────────────────────────────────────────────┤
│ 인증 설정                                    │
│ grant/response/scope chip은 줄바꿈 허용      │
├──────────────────────────────────────────────┤
│ Redirect URIs / 로그인 화면 설정 / 추가 정보 │
└──────────────────────────────────────────────┘
```

### Mobile

```text
[←]
OIDC 클라이언트 상세
Admin Web

[수정] [비활성화] [삭제]

┌──────────────────────────────┐
│ 기본 정보                     │
│ Client ID                    │
│ admin-web                    │
│ 상태                         │
│ 활성                         │
│ 클라이언트 신뢰 구분         │
│ [First-party]                │
│ 권한 동의                    │
│ [동의 생략]                  │
│ 생성일 / 수정일              │
├──────────────────────────────┤
│ 인증 설정                     │
│ 인증 방식 / grant / scope    │
├──────────────────────────────┤
│ Redirect URIs                │
│ 긴 URI는 줄바꿈되어 표시된다.│
├──────────────────────────────┤
│ 앱 복귀 / 로그인 화면 / 추가 │
└──────────────────────────────┘
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
| `Edit` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `PowerOff` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Power` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SecretField` | `@cocrepo/ui` | 화면 조합 요소 |
| `ActiveStatusCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AuthMethodCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `ConfirmModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientDetailScreenClient | 상세 표시 계약 (`isFirstParty`, `skipConsent`, `loginUi` 포함) |
| OidcClientDetailScreenProps | pure screen 입력 계약 |
| OidcClientDetailScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @cocrepo/type | OIDC client 로그인 UI override 타입 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |