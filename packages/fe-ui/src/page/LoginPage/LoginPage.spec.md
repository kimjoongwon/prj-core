# LoginPage ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/page/LoginPage/LoginPage.tsx

## 역할

로그인 page 레이어에서 제목/에러/CTA를 배치하고 실제 입력 control 조합은 `LoginForm`에 위임합니다.
state shape은 pure page가 정의하지 않고 상위 route가 설계한 `loginPage` slice를 소비하며,
page 내부에서는 `state.loginForm`만 form에 전달합니다.
submit 이벤트는 page가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| LoginPageState | 공개 계약 요소 |
| LoginPageProps | 공개 계약 요소 |
| LoginPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | 문서 예시를 plain object 대신 route page MobX class + `state.loginPage` 전달 패턴으로 갱신 | codex |
| 2026-04-22 | page가 submit wrapper를 소유하고 `LoginForm`은 state-only contract만 쓰도록 정리 | codex |
| 2026-04-22 | pure page가 route가 설계한 `loginPage.loginForm` state slice를 소비하도록 계약명을 `LoginPageState`로 정리 | codex |
| 2026-04-22 | page가 control을 직접 소유하지 않고 `LoginForm`을 조합하도록 책임을 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-26 | `LoginPage` 폴더명을 컴포넌트명 기준으로 정렬하고 경로 표기를 갱신 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
