---
name: "be-command-builder-creator"
description: "이 skill은 `be-command-builder` 역할로 일할 때 사용합니다. CQRS Command/Query 메시지를 만드는 방법을 쉽게 안내합니다."
---

# be-command-builder-creator

`be-command-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/13-be-command-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

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
| Command 입력/Query 보조 타입 | `packages/be-input/src/command/{domain}/{name}.input.ts` |
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
- write Command는 DTO class, Prisma create/update input, repository params, persistence DTO를 import하지 않습니다. Controller의 body DTO와 구조적으로 호환되는 `*CommandInput` 타입을 `@cocrepo/input`에 선언합니다.
- read Query는 DTO class를 import하지 않습니다. Controller query DTO와 구조적으로 호환되는 `*QueryInput` 타입을 `@cocrepo/input`에 선언합니다.
- read Query는 해당 `*QueryInput`을 `implements`하고 입력 필드를 class 최상위 readonly 속성으로 노출합니다.
- Query DTO의 Prisma 변환 메서드는 만들지 않습니다. `sort`, `skip`, `take`, 검색/필터 wire shape만 Query DTO와 QueryInput에 공유하고, Prisma 변환은 repository 인접 mapper가 소유합니다.
- write Command payload 파일은 `packages/be-input/src/command/{domain}/{name}.input.ts`, 타입명은 `{Verb}{Domain}CommandInput`을 사용합니다.
- Command/Query class는 해당 `*CommandInput` 또는 `*QueryInput`을 `implements`하고, 입력 필드를 class 최상위 readonly 속성으로 노출합니다.
- Command/Query 생성자는 `constructor(input: XxxInput) { Object.assign(this, input); }` 형태를 기본으로 하며, `readonly input`으로 중첩하지 않습니다.
- route/user/header처럼 다른 출처의 값이 함께 필요하면 그 값은 명시적 생성자 인자로 두고, body/query 입력 필드는 class 최상위로 펼칩니다.
- route/user/header처럼 routing context는 `xId`, `actorId`, `spaceId` 같은 명시적 생성자 인자로 둡니다. body payload 이름으로 `params`나 `dto`를 쓰지 않습니다.
- Controller가 단일 body DTO만 전달하는 write intent는 `new XxxCommand(dto)`처럼 넘길 수 있게 Command input 타입을 설계합니다. route/user/header 등 여러 출처를 합칠 때만 `{ ...body, routeId, actorId }` 같은 얇은 조합 객체를 사용합니다.
- Express/Koa request/response처럼 adapter 객체가 필요한 이전 방식 protocol bridge는 최소 타입 alias를 `@cocrepo/command`에 둡니다.
- handler array는 `@cocrepo/usecase` 소유입니다. command package는 provider를 export하지 않습니다.

## 템플릿

```typescript
import type { ConfirmReservationCommandInput } from "@cocrepo/input";

export class ConfirmReservationCommand implements ConfirmReservationCommandInput {
	readonly memo?: ConfirmReservationCommandInput["memo"];

	constructor(
		readonly reservationId: string,
		input: ConfirmReservationCommandInput,
		readonly actorId: string,
	) {
		Object.assign(this, input);
	}
}

export class GetReservationQuery {
  constructor(readonly reservationId: string) {}
}
```

## 체크리스트

- [ ] `rg "\\.cqrs|\\.command|\\.query"`로 기존 message 위치를 확인
- [ ] Command/Query class가 `packages/be-command`에만 생성됐는지 확인
- [ ] Command/Query class가 class당 하나의 파일로 분리됐는지 확인
- [ ] Command 입력/Query/interface/type 계약이 `@cocrepo/input`로 분리됐는지 확인
- [ ] Command/Query class에 `readonly input` 중첩이 남지 않았는지 확인
- [ ] write Command가 DTO class, Prisma input, Repository params를 import하지 않는지 확인
- [ ] read Query가 DTO를 import하지 않고 `@cocrepo/input`의 QueryInput만 사용하는지 확인
- [ ] `packages/be-command/src/{domain}/index.ts`와 `src/index.ts` export 추가
- [ ] app/package dependency에 `@cocrepo/command`가 필요한지 확인
- [ ] `@cocrepo/usecase` handler가 command/query를 import할 수 있도록 `@cocrepo/command` build/type 계약 확인
- [ ] 이전 방식 app-local `*.cqrs.ts` message가 남지 않았는지 확인
