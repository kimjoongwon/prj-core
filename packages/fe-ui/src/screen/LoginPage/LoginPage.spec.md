# LoginPage ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/screen/LoginPage/LoginPage.tsx

## 역할

로그인 page 레이어에서 제목/에러/CTA를 배치하고 실제 입력 control 조합은 `LoginForm`에 위임합니다.
state shape은 pure screen가 정의하지 않고 상위 route가 설계한 `loginPage` slice를 소비하며,
page 내부에서는 `state.loginForm`만 form에 전달합니다.
submit 이벤트는 page가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 화면 러프

```text
### Desktop
┌─ route auth shell / centered column ─────────────────────────┐
│                                                              │
│  ┌─ LoginPage form surface ────────────────────────────────┐ │
│  │ 안전한 운영 세션                                        │ │
│  │ 관리자 로그인                                            │ │
│  │ 예약, 결제, 권한 상태를 이어서 확인하세요.               │ │
│  │ 로그인 후 선택된 지점 scope로 관리자 API를 호출합니다.   │ │
│  │                                                          │ │
│  │ [LoginForm VStack gap=section]                          │ │
│  │   이메일                                                 │ │
│  │   [ admin@plate.com                                  ]   │ │
│  │   비밀번호                                               │ │
│  │   [ password                                       ]     │ │
│  │                                                          │ │
│  │ 입력한 계정으로 운영 콘솔 접근 권한을 확인합니다.        │ │
│  │ [ 로그인 → / loading disabled ]                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

### Tablet
┌─ centered auth column ───────────────────────────────┐
│ ┌─ LoginPage surface, full available width ────────┐ │
│ │ badge/title/caption                              │ │
│ │ LoginForm                                        │ │
│ │ session hint / feedback area                     │ │
│ │ full-width CTA                                   │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘

### Mobile
┌─ narrow auth column ─────────────────────────┐
│ ┌─ surface ────────────────────────────────┐ │
│ │ title wraps without overlap              │ │
│ │ caption can wrap to multiple lines       │ │
│ │ email/password fields stay stacked       │ │
│ │ hint/error area reserves height          │ │
│ │ full-width CTA keeps fixed height        │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `../../rhythm/VStack/VStack` | 화면 조합 요소 |
| `HStack` | `../../rhythm/HStack/HStack` | badge, session hint, error alert 조합 |
| `Surface` | `../../surface` | 로그인 form surface |
| `Text` | `../../display/data-display/Text/Text` | 제목/설명/오류 typography |
| `LoginForm` | `../../form/LoginForm/LoginForm` | 입력 폼 또는 AI 입력 흐름 구성 |
| `Button` | `../../control/Button/Button` | 사용자 액션 실행 |

## Props Contract

| Prop | 설명 |
|------|------|
| `state.loginForm` | route가 소유한 email/password form state slice |
| `state.errorMessage` | page-level server/display error message. 비어 있으면 보조 안내 문구를 보여주고, 값이 있으면 alert card로 표시 |
| `title` | 로그인 surface 제목 |
| `caption` | 로그인 surface 보조 설명 |
| `isLoading` | submit CTA loading/disabled guard |
| `onSubmitLoginForm` | form submit 시 route handler로 위임하는 page event prop |

## 상태별 렌더링

| 상태 | 렌더링 계약 |
|------|-------------|
| Ready | security badge, title/caption, session hint, 이메일/비밀번호 field, 보조 안내 문구, enabled CTA |
| Loading | CTA `isLoading` + disabled 상태로 중복 submit 방지. 입력/안내 영역 높이 변화 없음 |
| Error | alert card에 `danger` role text를 표시하고 CTA는 같은 surface 안에서 재시도 가능 |
| Long/Narrow | title/caption/error는 줄바꿈 가능, form/button은 full-width stack 유지 |

## Storybook / Test Contract

| 대상 | 계약 |
|------|------|
| `LoginPage.stories.tsx` | ready, loading, server error, long content, narrow viewport variant |
| `LoginForm.stories.tsx` | empty, with values, long values variant |
| `LoginPage.test.tsx` | title/caption/fields/button render, submit delegation, loading guard, error feedback |
| `LoginForm.test.tsx` | email/password field render and bound state update |

## 구성 요소

| 항목 | 설명 |
|------|------|
| LoginPageState | 공개 계약 요소 |
| LoginPageProps | 공개 계약 요소 |
| LoginPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-06-01 | admin 로그인 화면 시각 품질 보정: 보안 세션 badge, API scope hint, alert card, pill CTA, 한글 field label 기준으로 계약 갱신 | codex |
| 2026-05-31 | W1 admin native login route spec 기준 surface/rhythm/error/loading/story/test 계약 보강 | codex |
| 2026-05-02 | 로그인 page 제목/설명/CTA/에러 문구를 런타임 i18n catalog 번역 대상으로 연결 | codex |
| 2026-04-22 | 로그인 제출 흐름과 폼 상태 계약 정리 | codex |
| 2026-04-22 | 로그인 화면 상태 묶음 계약 정리 | codex |
| 2026-04-22 | 로그인 page와 form의 책임 경계 정리 | codex |
| 2026-03-03 | 초기 화면 기획 수립 | codex |
