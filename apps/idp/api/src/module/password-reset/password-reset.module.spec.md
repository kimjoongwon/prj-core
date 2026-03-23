# password-reset.module module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/idp/api/src/module/password-reset/password-reset.module.ts

## 역할

이 파일은 비밀번호 재설정 유즈케이스에 필요한 facade/service/import wiring을 담당합니다.
메일 전송은 `EmailModule` import를 통해 공급받습니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| PasswordResetModule | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/service | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |
| ../oidc/oidc.module | 기능 구현 의존성 |
| ./password-reset.controller | 기능 구현 의존성 |
| ./password-reset.facade | 기능 구현 의존성 |
| ./password-reset.service | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `EmailService` 직접 provider 등록을 제거하고 `EmailModule` import로 교체해 비밀번호 재설정 서비스가 메일 provider 구현 세부사항을 모르게 정리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-13 | PasswordResetModule의 provider/export 참조를 PasswordResetFacade 기준으로 정리 | codex |
