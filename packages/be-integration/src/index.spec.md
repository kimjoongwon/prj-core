# index 배럴 기획서

> 생성일: 2026-03-11
> 타입: index
> 위치: packages/be-integration/src/index.ts

## 역할

이 파일은 integration facade export를 제공하는 배럴 파일입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `OidcFacade` | OIDC 외부 시스템 연동 facade export |
| `OidcRpClientKey` | OIDC RP 식별자 type export |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | be-integration 패키지 index 배럴 신규 생성 | codex |
| 2026-03-16 | auth application/controller가 RP 구분 타입을 공유할 수 있도록 `OidcRpClientKey` export를 추가 | codex |
