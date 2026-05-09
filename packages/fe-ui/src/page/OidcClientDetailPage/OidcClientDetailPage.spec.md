# OidcClientDetailPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcClientDetailPage/OidcClientDetailPage.tsx

## 역할

OIDC 클라이언트 상세 화면의 pure page 컴포넌트입니다.
상세 조회, 활성 상태 전환, 삭제, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합과 삭제 확인 modal만 담당합니다.

## 디자인 스케치

```text
OidcClientDetailPage
- DetailPage
  - PageTitleBar
    - Button x4
  - DetailPageSurface
    - VStack
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
          - SecretField
          - ActiveStatusCell
          - First-party Chip
          - Consent skip Chip
          - DateTimeCell
      - DetailSectionCard
        - DetailSection
          - PageTitleBar
          - AuthMethodCell
      - DetailSectionCard x3
        - DetailSection
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
| `DetailPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Edit` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `PowerOff` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Power` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `DetailSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `SecretField` | `@cocrepo/ui` | 화면 조합 요소 |
| `ActiveStatusCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AuthMethodCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `ConfirmModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientDetailPageClient | 상세 표시 계약 (`isFirstParty`, `skipConsent`, `loginUi` 포함) |
| OidcClientDetailPageProps | pure page 입력 계약 |
| OidcClientDetailPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @cocrepo/type | OIDC client 로그인 UI override 타입 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 화면 러프를 Desktop/Tablet/Mobile 기준으로 분리해 responsive detail 배치 기준을 강화 | codex |
| 2026-05-09 | 신뢰 구분과 consent 상태가 보이는 데스크톱/모바일 markdown 화면 러프를 추가 | codex |
| 2026-05-09 | 상세 기본 정보에 First-party/Third-party 신뢰 구분 표시 계약을 추가 | codex |
| 2026-05-05 | 상세 화면에 `loginUi` 기반 로그인 화면 설정 표시 섹션을 추가 | codex |
| 2026-05-05 | 권한 동의 화면 생략 상태를 기본 정보 영역에서 표시하도록 상세 계약 갱신 | codex |
| 2026-03-29 | OIDC 클라이언트 상세 화면의 조회/상태 전환/삭제/라우팅 책임 경계 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시명 기준 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
