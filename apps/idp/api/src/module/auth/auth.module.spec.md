# auth.module module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/idp/api/src/module/auth/auth.module.ts

## 역할

이 파일은 인증 관련 provider 조합과 controller/application service 연결을 담당합니다.
특히 `AuthApplicationService`가 `verifyToken()`에서 merged ability를 조회할 수 있도록 `AbilityService`와 관련 repository provider를 함께 구성합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| AuthModule | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/app | 인증 application service 의존성 |
| @cocrepo/integration | OIDC integration facade 의존성 |
| @cocrepo/repository | 기능 구현 의존성 |
| @cocrepo/service | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |
| ./auth.controller | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | AbilityService merged ability 조회를 위해 RoleGrantsRepository/UserGrantsRepository provider를 함께 구성하도록 갱신 | codex |
| 2026-04-06 | `AuthApplicationService.verifyToken()`의 merged ability 조회를 위해 `AbilityService`와 권한 repository provider 구성을 반영 | codex |
| 2026-03-23 | `EmailService` 직접 provider 등록을 제거하고 `EmailModule` import 방식으로 교체해 전송 구현 결합을 모듈 외부로 분리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | AuthModule provider/export를 ApplicationService + OidcFacade 구조로 전환 | codex |
