# Backend CQRS / Boundary Reference

이 문서는 현재 backend CQRS 경계와 legacy 제거 기준을 설명하는 활성 reference입니다.
세부 구현 절차, 파일 배치, naming 규칙은 각 `.agents/skills/*-creator` skill이 소유합니다.

## 현재 흐름

```txt
HTTP request
  -> Controller (@cocrepo/controller)
  -> CommandBus / QueryBus
  -> Command / Query message (@cocrepo/command)
  -> UseCase handler (@cocrepo/usecase)
  -> Aggregate / Service / Client
  -> Repository / external provider
```

- Controller 구현 파일은 `packages/be-controller/src/**`에 둡니다.
- `apps/core/api/src/module/**`는 Nest module, provider wiring, RouterModule 경로 등록만 소유합니다.
- Controller는 `CommandBus`와 `QueryBus` 외 business dependency를 직접 주입하지 않습니다.
- Command/Query message는 request intent와 routing context만 담고 provider로 등록하지 않습니다.
- UseCase handler는 workflow 조율을 수행하고 도메인 규칙은 Aggregate, 지원 기능은 Service/Client에 위임합니다.
- Repository는 persistence 접근과 rehydrate/read projection을 소유합니다.

## Naming 기준

| 경계 | 기본 이름 | 파일 |
|------|-----------|------|
| Request body DTO | `CreateXDto`, `UpdateXDto` | `packages/be-dto/src/**` |
| List query DTO | `QueryXsDto` 또는 기존 도메인 관례 | `packages/be-dto/src/**` |
| Write Command | `CreateXCommand`, `UpdateXCommand` | `packages/be-command/src/{domain}/{name}.command.ts` |
| Write Command input | `CreateXCommandInput` | `packages/be-command/src/{domain}/{name}.input.ts` |
| Read Query | `GetXQuery`, `QueryXsQuery`, `ListXsQuery` | `packages/be-command/src/{domain}/{name}.query.ts` |
| UseCase handler | `CreateXUseCase`, `GetXUseCase` | `packages/be-usecase/src/**` |
| Aggregate method input | `CreateXInput`, `UpdateXInput` | `packages/be-aggregate/src/**` |
| Service/Client input | capability 중심 `SendEmailInput`, `PutObjectInput` | 해당 package 내부 |

- 일반 request DTO는 `toCommand()`, `toEntity()` 같은 변환 메서드를 갖지 않습니다.
- Query DTO는 read filter 계약으로 `toPrismaWhere()`, `toPrismaOrderBy()` 같은 helper를 가질 수 있습니다.
- write Command의 body payload 생성자 속성명은 `readonly input`입니다.
- body payload 이름으로 `params`나 `dto`를 쓰지 않습니다.
- route/user/header context는 `xId`, `actorId`, `spaceId`처럼 별도 생성자 인자로 둡니다.

## Passing 기준

- Controller에서 단일 body DTO가 `CommandInput`과 구조적으로 같으면 `new CreateXCommand(dto)`로 넘깁니다.
- 여러 출처를 합칠 때만 Controller 또는 UseCase에서 얇게 조합합니다.
  - 예: `{ ...body, actorId: user.id }`
- UseCase에서 `CommandInput`이 Aggregate/Service/Client input과 구조적으로 같으면 그대로 위임합니다.
- field rename, policy 보정, 여러 출처 조합이 필요할 때만 mapper/input 파일을 별도로 둡니다.
- Aggregate, Service, Client는 DTO나 Command/Query class를 public method input으로 받지 않습니다.

## Owner 기준

| owner | 소유 |
|-------|------|
| `be-controller-builder` | `packages/be-controller/src/**` Controller 구현과 barrel |
| `be-module-builder` | `apps/core/api/src/module/**` module/provider/router wiring |
| `be-command-builder` | `packages/be-command/src/**` Command/Query message와 input/result |
| `be-usecase-builder` | `packages/be-usecase/src/**` UseCase/EventHandler/Saga provider |
| `be-aggregate-builder` | `packages/be-aggregate/src/**` Aggregate service |
| `be-service-builder` | `packages/be-service/src/**` 지원 Service |
| `be-client-builder` | `packages/be-client/src/**` 외부 provider Client |
| `be-repository-builder` | `packages/be-repository/src/**` persistence Repository |

## 제거된 경계 기준

- 신규 작업에서 `be-app-builder`, `be-facade-builder`, `be-gateway-builder` agent_type을 사용하지 않습니다.
- 신규 app/runtime import에서 `@cocrepo/app`, `@cocrepo/facade`, `@cocrepo/gateway`를 사용하지 않습니다.
- `@cocrepo/facade` 패키지는 제거된 runtime 경계입니다.
- legacy gateway package가 남아 있어도 active app, controller, usecase 경계로 새 의존을 추가하지 않습니다.
- legacy workflow가 필요하면 UseCase, Client, Service owner로 이동합니다.

## 검증 Gate

```bash
rg 'from "@cocrepo/usecase"' packages/be-controller/src -g "*.controller.ts"
rg "constructor\\(.*Service|Repository|Prisma" packages/be-controller/src -g "*.controller.ts"
rg "@cocrepo/(app|facade|gateway)" apps/core/api packages/be-controller packages/be-usecase -g "!**/dist/**"
rg "\\.cqrs|packages/be-usecase/src/.*\\.(command|query)\\.ts" apps packages -g "!**/dist/**"
pnpm --filter @cocrepo/command type-check
pnpm --filter @cocrepo/usecase type-check
pnpm --filter @cocrepo/controller type-check
pnpm --filter core-api type-check
```

위 `rg` 명령은 결과가 없으면 통과입니다.
