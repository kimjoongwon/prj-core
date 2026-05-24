# LoginPage ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/screen/LoginPage/LoginPage.tsx

## 역할

로그인 page 레이어에서 제목/에러/CTA를 배치하고 실제 입력 control 조합은 `LoginForm`에 위임합니다.
state shape은 pure screen가 정의하지 않고 상위 route가 설계한 `loginPage` slice를 소비하며,
page 내부에서는 `state.loginForm`만 form에 전달합니다.
submit 이벤트는 page가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 디자인 스케치

```text
LoginPage
- VStack
  - VStack
  - VStack
    - LoginForm
  - Button
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `../../rhythm/VStack/VStack` | 화면 조합 요소 |
| `LoginForm` | `../../form/LoginForm/LoginForm` | 입력 폼 또는 AI 입력 흐름 구성 |
| `Button` | `../../control/Button/Button` | 사용자 액션 실행 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| LoginPageState | 공개 계약 요소 |
| LoginPageProps | 공개 계약 요소 |
| LoginPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | 로그인 page 제목/설명/CTA/에러 문구를 런타임 i18n catalog 번역 대상으로 연결 | codex |
| 2026-04-22 | 로그인 제출 흐름과 폼 상태 계약 정리 | codex |
| 2026-04-22 | 로그인 화면 상태 묶음 계약 정리 | codex |
| 2026-04-22 | 로그인 page와 form의 책임 경계 정리 | codex |
| 2026-03-03 | 초기 화면 기획 수립 | codex |
