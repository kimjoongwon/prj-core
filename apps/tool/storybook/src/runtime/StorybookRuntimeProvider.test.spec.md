# StorybookRuntimeProvider.test.tsx Spec

## 목적
- Storybook runtime provider의 핵심 bootstrap 회귀를 jsdom 단위 테스트로 검증합니다.
- 로그인 redirect URL 계산, 정적 admin mock space 선택, preview toolbar realm override를 빠르게 확인합니다.

## 핵심 테스트
- top-level Storybook URL을 기준으로 login redirect URL이 `/__storybook_auth/login?returnTo=...` 형태로 설정됩니다.
- live auth가 꺼진 admin runtime은 다중 mock space를 렌더링하고, `<select>` 변경으로 현재 Space를 로컬에서 전환할 수 있습니다.
- story parameter에 `realm`이 없을 때 `globals.storybookRealm = "admin"` toolbar override가 admin runtime bootstrap을 활성화합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 toolbar realm override fixture story id를 semantic page 기준으로 갱신 | codex |
| 2026-04-14 | Storybook runtime bootstrap 회귀용 단위 테스트 sidecar 신규 추가 | codex |
