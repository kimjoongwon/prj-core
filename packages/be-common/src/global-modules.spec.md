# global-modules util 기획서

> 생성일: 2026-03-11
> 타입: util
> 위치: packages/be-common/src/global-modules.ts

## 역할

이 파일은 API/서비스에서 공통으로 사용하는 NestJS 글로벌 모듈 집합을 생성하는 팩토리 유틸리티를 제공합니다.

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
| @nestjs-modules/mailer | 기능 구현 의존성 |
| jsonwebtoken | 기능 구현 의존성 |
| nestjs-cls | 기능 구현 의존성 |
| nestjs-pino | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | 신규 생성 | codex |
