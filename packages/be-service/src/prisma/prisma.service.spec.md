# Prisma Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/prisma.service.ts

## 역할

Prisma ORM 클라이언트를 NestJS 라이프사이클에 통합하는 인프라 서비스입니다.
`PrismaClient`를 상속하여 모듈 초기화 시 DB 연결, 모듈 종료 시 연결 해제를 자동으로 처리합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `PrismaClient` (@cocrepo/prisma) | Prisma ORM 클라이언트 (상속) |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `onModuleInit` | - | `Promise<void>` | 모듈 초기화 시 DB 연결 (`$connect`) |
| `onModuleDestroy` | - | `Promise<void>` | 모듈 종료 시 DB 연결 해제 (`$disconnect`) |

## 비즈니스 규칙

- NestJS `OnModuleInit`, `OnModuleDestroy` 인터페이스를 구현하여 라이프사이클 관리
- `PrismaClient`를 상속하므로 Prisma의 모든 모델 접근 가능
- Repository 패턴에서 이 서비스를 주입받아 사용

## 에러 처리

- DB 연결 실패 시 Prisma 기본 에러 처리

## 권한 요구사항

- 내부 인프라 서비스 (직접 사용 제한 - Repository를 통해서만 사용 권장)

## 구현 체크리스트

- [x] prisma.service.ts
- [x] `@Injectable()` 데코레이터
- [x] `OnModuleInit`, `OnModuleDestroy` 구현
- [x] 전역 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
