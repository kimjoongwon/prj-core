# oidc.facade.spec 테스트 기획서

> 생성일: 2026-04-14
> 타입: test
> 위치: packages/be-integration/__tests__/oidc.facade.spec.ts

## 역할

`OidcFacade`가 전달받은 protocol client config를 기준으로 authorization request를 만드는지 검증합니다.

## 주요 시나리오

| 시나리오 | 설명 |
|------|------|
| admin client | `admin-web` protocol config로 authorization request를 생성합니다. |
| storybook client | `storybook-web` protocol config로 authorization request를 생성합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Storybook RP canonical clientId `storybook-web` 기준의 테스트 sidecar를 신규 생성 | codex |
