# global-modules util 기획서

> 생성일: 2026-03-11
> 타입: util
> 위치: packages/be-common/src/global-modules.ts

## 역할

이 파일은 API/서비스에서 공통으로 사용하는 NestJS 글로벌 모듈 집합을 생성하는 팩토리 유틸리티를 제공합니다.
메일 전송 구현체 binding은 전용 `EmailModule`에서 담당하고, 이 유틸리티는 메일 provider 세부사항을 직접 초기화하지 않습니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| createGlobalModules | 공개 계약 요소 |
| CreateGlobalModulesOptions | 공개 계약 요소 |
| GlobalModuleConfigLoader | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/type | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |
| @nestjs/config | 기능 구현 의존성 |
| @nestjs/jwt | 기능 구현 의존성 |
| @nestjs/throttler | 기능 구현 의존성 |
| @nestjs-cls/transactional | 기능 구현 의존성 |
| @nestjs-cls/transactional-adapter-prisma | 기능 구현 의존성 |
| jsonwebtoken | 기능 구현 의존성 |
| nestjs-cls | 기능 구현 의존성 |
| nestjs-pino | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | 더 이상 사용되지 않는 글로벌 `MailerModule` wiring을 제거하고 메일 provider 초기화 책임을 전용 `EmailModule`로 이관 | codex |
| 2026-03-23 | `MailerModule`이 `smtp.secure`를 사용하도록 조정해 SMTP provider 교체 시 transport 보안 모드가 설정 계약을 따르도록 정리 | codex |
| 2026-03-11 | 신규 생성 | codex |
