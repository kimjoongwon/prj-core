# storybook-auth.e2e e2e 기획서

> 생성일: 2026-03-26
> 타입: e2e
> 위치: apps/tool/storybook/src/runtime/storybook-auth.e2e.ts

## 역할

이 파일은 e2e 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 동작 메모

- Storybook 로그인 셸은 generic auth endpoint 진입 시 canonical `clientId=storybook-web`을 기대합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Storybook OIDC canonical clientId를 `storybook-web` 기준으로 검증하도록 정리 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
