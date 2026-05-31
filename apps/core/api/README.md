# Core API

NestJS 기반 코어 API 애플리케이션입니다. 현재 백엔드 경계는 CQRS/UseCase 중심으로 정리합니다.

## Architecture

```txt
Controller
  -> CommandBus / QueryBus
  -> UseCase handler
  -> aggregate root service
  -> repository
  -> database
```

## Layer Policy

| 계층 | 역할 | 위치 |
| --- | --- | --- |
| Controller | HTTP 요청/응답, 인증 데코레이터, param/query/body 변환 | `apps/core/api/src/module/**` |
| UseCase handler | command/query 실행 흐름, 트랜잭션 경계, 응답 조립 | `packages/be-usecase/src/**` |
| Service | aggregate root 단위 도메인 규칙과 저장소 조합 | `packages/be-service/src/**` |
| Repository | Prisma 기반 데이터 접근, aggregate rehydrate/save | `packages/be-repository/src/**` |
| Entity | aggregate root 및 도메인 상태 변경 | `packages/be-entity/src/**` |
| Client | 외부 API 단일 연동 구현 | `packages/be-client/src/**` |

## Controller Rules

- Controller는 `CommandBus` 또는 `QueryBus`를 호출합니다.
- Controller에서 service/repository를 직접 주입하지 않습니다.
- HTTP status, guard, decorator, DTO 입력 변환은 Controller 책임입니다.
- workflow, pagination meta, read-model 조립은 UseCase handler 책임입니다.

## UseCase Rules

- `@CommandHandler()`와 `@QueryHandler()` handler를 UseCase로 봅니다.
- handler는 필요한 service/client/repository를 DI 받을 수 있습니다.
- 쓰기 작업은 command handler에서 트랜잭션 경계를 잡습니다.
- 조회 작업은 query handler에서 read model과 pagination meta를 조립합니다.

## Naming

- `@cocrepo/usecase`: 기존 application workflow 역할을 대체합니다.
- `@cocrepo/client`: 외부 시스템 단일 연동 구현입니다.
- facade 명칭은 core-api Controller 경계에서 사용하지 않습니다.
- 여러 외부 client를 조합하는 도메인 기능은 service로 승격합니다.

## Test

```bash
pnpm --filter core-api type-check
pnpm --filter core-api test:e2e
```
