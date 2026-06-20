# be-command-builder 상세 지시

원본 에이전트 파일: `.codex/agents/13-be-command-builder.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 command/query message, DTO, controller, usecase handler를 먼저 검색합니다.
- 신규 생성 전에 기존 메시지를 재사용하거나 이름/필드만 조정할 수 있는지 우선 판단합니다.
- 동일 endpoint intent에 대해 중복 Command/Query class를 만들지 않습니다.

# Command 빌더

Nest CQRS Command/Query message 계약을 `@cocrepo/command`에 생성하는 역할입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| Controller가 실행할 write intent | ✅ 사용 | `CommandBus.execute(신규 XxxCommand(...))` 입력 |
| Controller가 실행할 read intent | ✅ 사용 | `QueryBus.execute(신규 XxxQuery(...))` 입력 |
| app-local `*.cqrs.ts` message 이동 | ✅ 사용 | message는 `packages/be-command`로 이동 |
| UseCase handler 구현 | ❌ 미사용 | `be-usecase-builder` 사용 |
| Event message 생성 | ❌ 미사용 | `be-event-builder` 사용 |
| Controller 구현 | ❌ 미사용 | `be-controller-builder` 사용 |
| Service/Repository 구현 | ❌ 미사용 | 각각 전용 builder 사용 |

## 출력

| 항목 | 경로 |
|------|------|
| Command 클래스 | `packages/be-command/src/{domain}/{name}.command.ts` |
| Query 클래스 | `packages/be-command/src/{domain}/{name}.query.ts` |
| Command 입력/Query/Result 보조 타입 | `packages/be-command/src/{domain}/{name}.input.ts`, 필요한 경우 `{name}.result.ts` 또는 read 전용 보조 타입 |
| domain barrel | `packages/be-command/src/{domain}/index.ts` |
| package barrel | `packages/be-command/src/index.ts` |
| Command 계약 | 담당 스펙의 `Command / Query 인벤토리` 행 |

## 핵심 규칙

- 모든 project command/query message는 `@cocrepo/command`에서 export합니다.
- `packages/be-usecase` 안에 `*.command.ts`, `*.query.ts`를 만들지 않습니다.
- `apps/*/api/src/module/**/*.cqrs.ts` 또는 app-local CQRS message 파일을 만들지 않습니다.
- Command/Query class는 class당 하나의 파일을 가집니다.
- 같은 파일에 여러 Command/Query class를 선언하지 않습니다.
- Command 입력/Result/interface/type 계약은 Command/Query class 파일 내부에 선언하지 않고 별도 파일로 분리합니다.
- Command/Query는 request intent와 routing context만 담는 immutable input입니다.
- Command/Query는 Service, Repository, Client, ConfigService 같은 dependency를 갖지 않습니다.
- write Command는 DTO class, Prisma create/update input, repository params, persistence DTO를 import하지 않습니다. Controller의 body DTO와 구조적으로 호환되는 `*CommandInput` 타입을 command package 안에 별도로 선언합니다.
- read Query는 현재 프로젝트의 behaviorful Query DTO를 import할 수 있습니다. `toPrismaWhere()`, `toPrismaOrderBy()`, `toPageMetaDto()` 같은 read filter 메서드는 Query DTO owner가 소유합니다.
- read Query는 behaviorful Query DTO를 그대로 받는 흐름을 기본으로 합니다. 별도 query params 파일은 DTO를 쓸 수 없는 read 전용 보조 계약이 필요할 때만 만듭니다.
- write Command payload 파일은 `{name}.input.ts`, 타입명은 `{Verb}{Domain}CommandInput`, 생성자 속성명은 `readonly input`을 사용합니다.
- route/user/header처럼 routing context는 `xId`, `actorId`, `spaceId` 같은 명시적 생성자 인자로 둡니다. body payload 이름으로 `params`나 `dto`를 쓰지 않습니다.
- Controller가 단일 body DTO만 전달하는 write intent는 `new XxxCommand(dto)`처럼 넘길 수 있게 Command input 타입을 설계합니다. route/user/header 등 여러 출처를 합칠 때만 `{ ...body, routeId, actorId }` 같은 얇은 조합 객체를 사용합니다.
- Express/Koa request/response처럼 adapter 객체가 필요한 이전 방식 protocol bridge는 최소 타입 alias를 `@cocrepo/command`에 둡니다.
- handler array는 `@cocrepo/usecase` 소유입니다. command package는 provider를 export하지 않습니다.

## 템플릿

```typescript
import type { ConfirmReservationCommandInput } from "./confirm-reservation.input";

export class ConfirmReservationCommand {
	constructor(
		readonly reservationId: string,
		readonly input: ConfirmReservationCommandInput,
		readonly actorId: string,
	) {}
}

export class GetReservationQuery {
  constructor(readonly reservationId: string) {}
}
```

## 체크리스트

- [ ] `rg "\\.cqrs|\\.command|\\.query"`로 기존 message 위치를 확인
- [ ] Command/Query class가 `packages/be-command`에만 생성됐는지 확인
- [ ] Command/Query class가 class당 하나의 파일로 분리됐는지 확인
- [ ] Command 입력/Result/interface/type 계약이 class 파일에서 분리됐는지 확인
- [ ] write Command가 DTO class, Prisma input, Repository params를 import하지 않는지 확인
- [ ] read Query가 DTO를 import한다면 Query DTO owner의 behaviorful Query DTO인지 확인
- [ ] `packages/be-command/src/{domain}/index.ts`와 `src/index.ts` export 추가
- [ ] app/package dependency에 `@cocrepo/command`가 필요한지 확인
- [ ] `@cocrepo/usecase` handler가 command/query를 import할 수 있도록 `@cocrepo/command` build/type 계약 확인
- [ ] 이전 방식 app-local `*.cqrs.ts` message가 남지 않았는지 확인
