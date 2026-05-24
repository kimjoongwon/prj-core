# OidcInteractionPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/screen/OidcInteractionPage/OidcInteractionPage.tsx

## 역할

OIDC interaction의 loading, error, login, consent 상태를 page 레이어에서 조합하며,
상위 route가 설계한 `oidcInteractionPage` state slice 안의 `oidcLoginForm`, `oidcConsentPanel`을 각 branch에 연결합니다.
login/consent 상호작용 이벤트는 page wrapper가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 디자인 스케치

```text
OidcInteractionPage
- OidcLoginForm
```

## 화면 러프

### Desktop

```text
primary panel 안의 OidcInteractionPage

loading:
┌────────────────────────────────────────────┐
│                    ◌                       │
│ 로그인 화면을 준비하고 있어요               │
│ 잠시 후 안전한 인증 화면으로 이동합니다.     │
│ 4초 이상 지속 시: [다시 시도]               │
└────────────────────────────────────────────┘

login:
┌────────────────────────────────────────────┐
│ client logo/name + headline                │
│ 이메일 [                                ]  │
│ 비밀번호 [                              ]  │
│ □ 로그인 상태 유지     비밀번호를 잊으셨나요?│
│ [로그인]                                   │
└────────────────────────────────────────────┘

consent:
┌────────────────────────────────────────────┐
│ 권한 동의                                  │
│ client가 요청한 scope 목록                  │
│ [취소]                         [동의하고 계속] │
└────────────────────────────────────────────┘
```

### Tablet

```text
primary panel 안의 OidcInteractionPage
┌──────────────────────────────────────┐
│ loading/login/consent/error card      │
│                                      │
│ loading:                             │
│ 로그인 화면을 준비하고 있어요         │
│ [다시 시도]는 4초 후 노출             │
│                                      │
│ login: 입력/remember/forgot/CTA       │
│ consent: scope list + CTA             │
└──────────────────────────────────────┘
```

### Mobile

```text
loading:
┌──────────────────────────────┐
│              ◌               │
│ 로그인 화면을 준비하고 있어요 │
│ 잠시 후 안전한 인증 화면으로  │
│ 이동합니다.                  │
│ [다시 시도]                  │
└──────────────────────────────┘

login:
┌──────────────────────────────┐
│ Coc ID                       │
│ 이메일 [ user@example.com ]  │
│ 비밀번호 [ ••••••••••••• ]   │
│ □ 로그인 상태 유지           │
│ 비밀번호를 잊으셨나요?       │
│ [로그인]                     │
└──────────────────────────────┘

consent:
┌──────────────────────────────┐
│ 권한 동의                    │
│ Admin Web이 계정 접근을 요청 │
│ openid / profile / email     │
│ [취소]                       │
│ [동의하고 계속]              │
└──────────────────────────────┘
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `AuthCard` | `../../widget` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `AuthCardHeader` | `../../widget` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AlertBanner` | `../../display` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Button` | `../../control` | 사용자 액션 실행 |
| `OidcConsentPanel` | `../../form` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `OidcLoginForm` | `../../form` | 입력 폼 또는 AI 입력 흐름 구성 |

## 상태별 렌더링

- loading: "로그인 화면을 준비하고 있어요"와 "잠시 후 안전한 인증 화면으로 이동합니다."를 표시하고, 4초 이상 지속되면 `onClickRecoveryButton` 기반 "다시 시도" CTA를 표시한다.
- login/consent/error: route shell의 모바일 폭 안에서 카드와 CTA가 넘치지 않도록 단일 컬럼 기준을 유지한다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| IdpInteractionClientInfo | client별 로그인 화면 override(`loginUi`)를 포함한 공개 계약 요소 |
| OidcInteractionPageState | 공개 계약 요소 |
| OidcInteractionPageProps | 공개 계약 요소 |
| OidcInteractionPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 화면 러프를 Desktop/Tablet/Mobile 기준으로 재구성하고 loading/login/consent responsive 상태를 명시 | codex |
| 2026-05-09 | loading 복구 CTA와 모바일 login/consent markdown 화면 러프를 추가 | codex |
| 2026-05-09 | loading 상태 문구와 4초 지연 재시도 CTA, 모바일 공통 화면 기준을 추가 | codex |
| 2026-05-05 | interaction client 정보에 `loginUi`를 추가해 로그인/동의 widget이 client별 표시 설정을 사용할 수 있도록 갱신 | codex |
| 2026-05-01 | loading/error 분기 문구의 런타임 i18n 번역 적용 경로 반영 | codex |
| 2026-04-22 | OIDC 로그인/동의 상태와 액션 책임 경계 정리 | codex |
| 2026-04-22 | OIDC 상호작용 모드와 login 폼 상태 묶음 계약 정리 | codex |
| 2026-04-22 | OIDC 로그인 분기의 form 조합 계약 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시명 기준 정리 | codex |
| 2026-03-25 | 초기 화면 기획 수립 | codex |
