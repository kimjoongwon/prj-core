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
| Params/입력/Result 타입 | `packages/be-command/src/{domain}/{name}.params.ts`, `{name}.input.ts`, `{name}.result.ts` |
| domain barrel | `packages/be-command/src/{domain}/index.ts` |
| package barrel | `packages/be-command/src/index.ts` |
| Command 계약 | 담당 스펙의 `Command / Query 인벤토리` 행 |

## 핵심 규칙

- 모든 project command/query message는 `@cocrepo/command`에서 export합니다.
- `packages/be-usecase` 안에 `*.command.ts`, `*.query.ts`를 만들지 않습니다.
- `apps/*/api/src/module/**/*.cqrs.ts` 또는 app-local CQRS message 파일을 만들지 않습니다.
- Command/Query class는 class당 하나의 파일을 가집니다.
- 같은 파일에 여러 Command/Query class를 선언하지 않습니다.
- Params/입력/Result/interface/type 계약은 Command/Query class 파일 내부에 선언하지 않고 별도 파일로 분리합니다.
- Command/Query는 request intent와 routing context만 담는 immutable input입니다.
- Command/Query는 Service, Repository, Client, ConfigService 같은 dependency를 갖지 않습니다.
- DTO를 field로 받을 수는 있지만, handler는 DTO를 Service에 그대로 넘기지 않고 필요한 domain input으로 변환해야 합니다.
- Express/Koa request/response처럼 adapter 객체가 필요한 이전 방식 protocol bridge는 최소 타입 alias를 `@cocrepo/command`에 둡니다.
- handler array는 `@cocrepo/usecase` 소유입니다. command package는 provider를 export하지 않습니다.

## 템플릿

```typescript
export class ConfirmReservationCommand {
  constructor(
    readonly reservationId: string,
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
- [ ] Params/입력/Result/interface/type 계약이 class 파일에서 분리됐는지 확인
- [ ] `packages/be-command/src/{domain}/index.ts`와 `src/index.ts` export 추가
- [ ] app/package dependency에 `@cocrepo/command`가 필요한지 확인
- [ ] `@cocrepo/usecase` handler가 command/query를 import할 수 있도록 `@cocrepo/command` build/type 계약 확인
- [ ] 이전 방식 app-local `*.cqrs.ts` message가 남지 않았는지 확인
