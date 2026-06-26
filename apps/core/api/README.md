# Core API

NestJS 기반 코어 API 애플리케이션입니다. 현재 백엔드 경계는 CQRS/UseCase 중심으로 정리합니다.

## Architecture

```txt
Controller
  -> CommandBus / QueryBus
  -> UseCase handler
  -> aggregate service
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

## UseCase 분리 의도

CommandBus/QueryBus 자체가 application 계층의 필수 조건은 아닙니다. 같은 구조는 Controller가 `XxxUseCase.execute(input)`을 직접 호출하는 방식으로도 만들 수 있습니다.

이 구조에서 더 중요한 선택은 하나의 큰 application service에 여러 케이스를 모으지 않고, 유스케이스 하나를 하나의 handler 파일로 분리하는 것입니다. `CreateAssetUseCase`, `MoveAssetUseCase`, `DeleteAssetUseCase`, `GetAssetsUseCase`처럼 케이스가 떨어져 있으면 각 파일은 자기 흐름에 필요한 dependency만 알고, 수정 범위와 테스트 범위도 작게 유지됩니다.

반대로 `AssetApplicationService` 하나에 create/update/delete/list가 모두 들어가면 upload 때문에 필요한 storage, delete 때문에 필요한 audit, list 때문에 필요한 read model 조립 의존성이 한 생성자와 한 파일에 섞이기 쉽습니다. 시간이 지나면 어떤 dependency가 어떤 유스케이스 때문에 필요한지 흐려지고, 단순 조회 작업도 쓰기 작업의 의존성과 함께 움직입니다.

따라서 이 프로젝트에서 CQRS handler를 쓰는 핵심 이유는 "CommandBus가 항상 더 우월해서"가 아니라, API 진입점 뒤의 application 흐름을 케이스 단위로 작게 나누고, 각 UseCase가 독립적인 변경/검증 단위가 되게 하기 위함입니다. Bus는 이 규칙을 일관되게 적용하기 위한 진입 방식입니다.

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
