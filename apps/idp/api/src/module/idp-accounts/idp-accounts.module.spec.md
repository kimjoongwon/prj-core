# idp-accounts.module module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/idp/api/src/module/idp-accounts/idp-accounts.module.ts

## 역할

이 파일은 module 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| IdpAccountsModule | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/facade | 기능 구현 의존성 |
| @cocrepo/repository | 기능 구현 의존성 |
| @cocrepo/service | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |
| ./idp-accounts.controller | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함
- [x] controller에서 `@cocrepo/facade` 주입 사용
- [x] controller의 `@cocrepo/app` 직접 주입 제거
- [x] `IdpAccountService`의 tenant scope 의존성인 `SpaceContext`를 module provider로 등록함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | `IdpAccountService`가 현재 tenant scope를 해석할 수 있도록 `SpaceContext` provider wiring을 추가 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | `IdpAccountFacade`가 주입하는 `IdpAccountService` provider를 module wiring에 복구 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-12 | 컨트롤러를 `IdpAccountService` 기반으로 변경 | codex |
| 2026-03-12 | `module` 체크리스트를 `@cocrepo/service` 직접 주입 정합성 기준으로 갱신 | codex |
| 2026-03-13 | `IdpAccountFacade` provider로 controller boundary 조합을 분리 | codex |
