# be-usecase-builder 상세 지시

원본 에이전트 파일: `.codex/agents/19-be-usecase-builder.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 code, handler, service, repository, DTO, test를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

# UseCase Builder

Nest CQRS 기반 UseCase handler를 생성하는 역할입니다. Command/Query message는 `@cocrepo/command`가 소유하고, 이 역할은 그 message를 실행하는 handler만 소유합니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| Controller가 호출할 write 유즈케이스 | ✅ 사용 | Command + `@CommandHandler` |
| Controller가 호출할 read 유즈케이스 | ✅ 사용 | Query + `@QueryHandler` |
| 여러 Service/Client 조합 작업 흐름 | ✅ 사용 | UseCase handler 조율 |
| 단일 Aggregate Root write flow | ✅ 사용 | handler → `@cocrepo/aggregate` aggregate root service |
| Event 후속 side effect | ✅ 사용 | `@EventsHandler` 기반 EventHandler |
| Event → Command 조율 | ✅ 사용 | `@Saga` 기반 Saga |
| Command/Query message 생성 | ❌ 미사용 | `be-command-builder` 사용 |
| Event message 생성 | ❌ 미사용 | `be-event-builder` 사용 |
| 외부 시스템 protocol wrapper | ❌ 미사용 | `be-client-builder` 사용 |
| Controller 구현 | ❌ 미사용 | `be-controller-builder` 사용 |
| Repository/Prisma 직접 접근 | ❌ 미사용 | 금지 |

## 출력

| 항목 | 경로 |
|------|------|
| Command/Query import | `@cocrepo/command` |
| Event import | `@cocrepo/event` |
| UseCase handler | `packages/be-usecase/src/{domain}/{name}.usecase.ts` 또는 `packages/be-usecase/src/{namespace}/{domain}/{name}.usecase.ts` |
| EventHandler | `packages/be-usecase/src/{domain}/{name}.event-handler.ts` 또는 `packages/be-usecase/src/{namespace}/{domain}/{name}.event-handler.ts` |
| Saga | `packages/be-usecase/src/{domain}/{name}.saga.ts` 또는 `packages/be-usecase/src/{namespace}/{domain}/{name}.saga.ts` |
| Handler array / barrel | `packages/be-usecase/src/{domain}/index.ts`, `packages/be-usecase/src/{namespace}/{domain}/index.ts`, `packages/be-usecase/src/index.ts` |
| UseCase 계약 | 담당 스펙의 `UseCase 인벤토리` 행 |

## 핵심 규칙

- Command/Query는 request 의도를 담는 immutable input이며 `@cocrepo/command`에서 import합니다.
- Event는 이미 발생한 사실을 담는 immutable message이며 `@cocrepo/event`에서 import합니다.
- `packages/be-usecase/src/**/*.command.ts`, `packages/be-usecase/src/**/*.query.ts`를 만들지 않습니다.
- UseCase handler/EventHandler/Saga class는 class당 하나의 파일을 가집니다.
- 같은 파일에 `@CommandHandler`, `@QueryHandler`, `@EventsHandler`, `@Saga` class를 2개 이상 선언하지 않습니다.
- `core`, `idp`처럼 여러 aggregate root를 포함하는 namespace 폴더에 handler 파일을 평면으로 모아두지 않습니다.
- `packages/be-usecase/src/core/{domain}/`처럼 provider array 단위의 bounded context 폴더로 묶습니다.
- handler provider array와 barrel export는 domain `index.ts`에서만 조립합니다. `*.usecase.ts`, `*.event-handler.ts`, `*.saga.ts` 파일에서 provider array를 export하지 않습니다.
- handler class 파일에는 top-level type/helper/mapper를 함께 두지 않습니다.
- handler 한 개에서만 쓰더라도 여러 출처 조합, field rename, policy 보정, 복잡한 result shaping이 있으면 `{handler}.input.ts`, `{handler}.result.ts`, `{handler}.mapper.ts`처럼 별도 파일로 분리합니다.
- 둘 이상의 handler가 공유하는 context/mapper/helper는 `{domain}.context.ts`, `{domain}.mapper.ts`, `{domain}.support.ts`처럼 별도 파일로 분리합니다.
- domain을 넘는 shared type은 `@cocrepo/type`, pure 런타임 utility는 `@cocrepo/toolkit`에 둡니다.
- `packages/be-usecase/src`에는 DI provider, `ConfigService`/env, Request/Response, Service/Repository/Client, time/random, 외부 protocol에 닿는 `export function` 또는 exported arrow helper를 만들지 않습니다. 이런 로직은 `@cocrepo/service` support service, client, aggregate/domain object로 올립니다.
- UseCase 내부의 순수 mapper/normalizer/parser 함수는 creator skill이 허용한 전용 파일에서만 사용합니다. 여러 package/domain이 공유할 수 있으면 `@cocrepo/toolkit`으로 이동하고, 이미 존재하는 exported helper 예외는 만지는 시점에 service/toolkit/mapper owner로 정리하거나 차단 사유로 보고합니다.
- pagination처럼 여러 usecase domain이 공유하는 계약/빌더를 `packages/be-usecase/src/common`에 만들지 않습니다.
- Handler class 이름은 `{Verb}{Domain}UseCase` 형태를 기본으로 합니다.
- Handler는 application/usecase layer입니다. 작업 흐름 조율을 수행하고 도메인 규칙은 `@cocrepo/aggregate` AggregateRootService 또는 AggregateRootEntity에 위임합니다.
- CommandHandler는 transaction-critical 흐름만 직접 의존합니다. 실패해도 원 command 성공을 막지 않아야 하는 후속 작업은 EventBus로 분리합니다.
- EventHandler는 email, audit, notification, cache invalidation, external notification 같은 side effect를 담당합니다.
- EventHandler 안에서 CommandBus를 주입하거나 execute하지 않습니다. Event 이후 다른 UseCase/Command를 실행해야 하면 Saga로 분리합니다.
- Saga는 Event → Command 변환만 담당하고 도메인 service를 직접 조합하지 않습니다.
- Handler에서 Prisma/Repository를 직접 호출하지 않습니다. 예외가 필요한 read projection은 담당 스펙에 명시하고 repository query method를 통해 호출합니다.
- Handler에서 DTO를 import하거나 domain service로 넘기지 않습니다. write Command의 `input`을 application/usecase 입력으로 취급합니다.
- Query handler는 behaviorful Query DTO나 Query params를 read filter 입력으로 취급할 수 있습니다. Query DTO 자체의 필터 메서드는 `be-query-dto-builder`가 소유합니다.
- Command input이 Aggregate/Service/Client input과 구조적으로 호환되면 그대로 위임할 수 있습니다. 여러 출처 조합, field rename, policy 보정이 필요할 때만 별도 mapper/input 파일에서 target input으로 변환합니다.
- Handler에서 Prisma create/update input을 만들지 않습니다. persistence 입력 변환은 Aggregate/Repository owner가 수행합니다.
- 여러 출처의 값을 조합해 target input을 만들 때는 `command.input.xxx`, `context.userId`, `entity.id`처럼 값의 원천을 보존합니다. 반복이 길면 `const input = command.input`처럼 출처명 alias까지만 사용하고 deep destructuring으로 bare variable을 남발하지 않습니다.
- `@CommandHandler` / `@QueryHandler` decorator를 사용합니다.
- handler array는 module builder가 providers에 등록할 수 있게 export합니다.
- 이전 방식 app/boundary/external 명칭을 신규로 만들지 않습니다.
- Controller는 UseCase handler를 직접 주입하지 않고 `CommandBus`/`QueryBus`로 실행합니다.

## 템플릿

`confirm-reservation.usecase.ts`

```typescript
import { ConfirmReservationCommand } from "@cocrepo/command";
import { ReservationService } from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ConfirmReservationCommand)
export class ConfirmReservationUseCase
  implements ICommandHandler<ConfirmReservationCommand>
{
  constructor(private readonly reservationService: ReservationService) {}

  execute(command: ConfirmReservationCommand) {
    return this.reservationService.confirm(command.reservationId, command.actorId);
  }
}
```

`index.ts`

```typescript
import { ConfirmReservationUseCase } from "./confirm-reservation.usecase";

export const ReservationCommandHandlers = [ConfirmReservationUseCase];

export const ReservationUseCaseProviders = [...ReservationCommandHandlers];

export * from "./confirm-reservation.usecase";
```

## 체크리스트

- [ ] 필요한 Command/Query가 `@cocrepo/command`에 존재하는지 확인
- [ ] 필요한 Event가 `@cocrepo/event`에 존재하는지 확인
- [ ] UseCase package 안에 command/query source를 만들지 않음
- [ ] handler/EventHandler/Saga class가 class당 하나의 파일로 분리됨
- [ ] handler class 파일에 top-level type/helper/mapper가 남아 있지 않음
- [ ] provider array와 barrel export가 domain `index.ts`에서만 조립됨
- [ ] `@CommandHandler` 또는 `@QueryHandler` 적용
- [ ] Event 후속 side effect는 `@EventsHandler`, Event → Command 흐름은 `@Saga`로 분리
- [ ] EventHandler 안에서 CommandBus를 호출하지 않음
- [ ] Handler가 workflow 조율만 수행하고 도메인 규칙은 Aggregate/Service/Client로 위임하는지 확인
- [ ] Prisma 직접 호출 없음
- [ ] DTO import 없음
- [ ] Command input을 Aggregate/Service/Client input으로 그대로 위임하거나 필요한 경우에만 별도 mapper/input 파일에서 변환함
- [ ] 여러 input source를 조합할 때 소스 경로 또는 출처명 alias를 유지함
- [ ] 변경 범위에 DI/config/request/external protocol에 닿는 exported free function/helper가 남아 있지 않음
- [ ] handler array와 barrel export 추가
- [ ] Module provider 등록은 `be-module-builder` 책임으로 남김
