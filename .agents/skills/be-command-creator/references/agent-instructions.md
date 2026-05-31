# Detailed Instructions for be-command-builder

Source agent file: `.codex/agents/be-command-builder.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (Mandatory)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 실행 source of truth는 route delivery spec입니다: web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- 승인된 route delivery spec이 있으면 그 spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.
- `role`, `agent`, `agent_type` 용어를 구분해 사용합니다.
- `*.toml.guide.md`를 만들지 않습니다.

## 재사용 우선 점검 (Mandatory)

- 작업을 시작하기 전에 반드시 기존 command/query message, DTO, controller, usecase handler를 먼저 검색합니다.
- 신규 생성 전에 기존 메시지를 재사용하거나 이름/필드만 조정할 수 있는지 우선 판단합니다.
- 동일 endpoint intent에 대해 중복 Command/Query class를 만들지 않습니다.

# Command Builder

Nest CQRS Command/Query message contract를 `@cocrepo/command`에 생성하는 role입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| Controller가 실행할 write intent | ✅ 사용 | `CommandBus.execute(new XxxCommand(...))` 입력 |
| Controller가 실행할 read intent | ✅ 사용 | `QueryBus.execute(new XxxQuery(...))` 입력 |
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
| Params/Input/Result 타입 | `packages/be-command/src/{domain}/{name}.params.ts`, `{name}.input.ts`, `{name}.result.ts` |
| domain barrel | `packages/be-command/src/{domain}/index.ts` |
| package barrel | `packages/be-command/src/index.ts` |
| Command contract | owner spec의 `Command / Query 인벤토리` row |

## 핵심 규칙

- 모든 project command/query message는 `@cocrepo/command`에서 export합니다.
- `packages/be-usecase` 안에 `*.command.ts`, `*.query.ts`를 만들지 않습니다.
- `apps/*/api/src/module/**/*.cqrs.ts` 또는 app-local CQRS message 파일을 만들지 않습니다.
- Command/Query class는 class당 하나의 파일을 가집니다.
- 같은 파일에 여러 Command/Query class를 선언하지 않습니다.
- Params/Input/Result/interface/type 계약은 Command/Query class 파일 내부에 선언하지 않고 별도 파일로 분리합니다.
- Command/Query는 request intent와 routing context만 담는 immutable input입니다.
- Command/Query는 Service, Repository, Client, ConfigService 같은 dependency를 갖지 않습니다.
- DTO를 field로 받을 수는 있지만, handler는 DTO를 Service에 그대로 넘기지 않고 필요한 domain input으로 변환해야 합니다.
- Express/Koa request/response처럼 adapter 객체가 필요한 legacy protocol bridge는 최소 타입 alias를 `@cocrepo/command`에 둡니다.
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
- [ ] Params/Input/Result/interface/type 계약이 class 파일에서 분리됐는지 확인
- [ ] `packages/be-command/src/{domain}/index.ts`와 `src/index.ts` export 추가
- [ ] app/package dependency에 `@cocrepo/command`가 필요한지 확인
- [ ] `@cocrepo/usecase` handler가 command/query를 import할 수 있도록 `@cocrepo/command` build/type 계약 확인
- [ ] legacy app-local `*.cqrs.ts` message가 남지 않았는지 확인

## Feedback Packet (Mandatory)

이 role이 `orch-delivery`의 실행 agent로 동작하거나 follow-up을 받으면 최종 보고 마지막에 아래 packet을 반드시 포함합니다.
finding이 없으면 `status: resolved`, `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 채웁니다. packet은 생략하지 않습니다.

```text
Feedback:
- status: resolved | blocked | needs-contract | needs-implementation | needs-test | needs-reentry
- feedback_type: none | contract-gap | api-integration-gap | ui-composition-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
