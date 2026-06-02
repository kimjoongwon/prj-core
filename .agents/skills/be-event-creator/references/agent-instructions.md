# Detailed Instructions for be-event-builder

Source agent file: `.codex/agents/be-event-builder.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

# Event Builder

Nest CQRS Event message contract를 `@cocrepo/event`에 생성하는 role입니다. EventHandler와 Saga 구현은 `be-usecase-builder`가 소유합니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 이미 발생한 도메인/application event contract 생성 | ✅ 사용 | `ReservationCreatedEvent` 같은 event message |
| Event package barrel export 정리 | ✅ 사용 | domain barrel + package barrel |
| EventHandler 구현 | ❌ 미사용 | `be-usecase-builder` 사용 |
| Saga 구현 | ❌ 미사용 | `be-usecase-builder` 사용 |
| Command/Query message 생성 | ❌ 미사용 | `be-command-builder` 사용 |

## 출력

| 항목 | 경로 |
|------|------|
| Event 클래스 | `packages/be-event/src/{domain}/{name}.event.ts` |
| Event params 타입 | `packages/be-event/src/{domain}/{name}.params.ts` |
| domain barrel | `packages/be-event/src/{domain}/index.ts` |
| package barrel | `packages/be-event/src/index.ts` |

## 핵심 규칙

- Event는 이미 발생한 사실을 표현합니다. 명령형 이름을 쓰지 않습니다.
- Event class 이름은 `{Domain}{PastTense}Event` 또는 `{Domain}{State}Event` 형태를 기본으로 합니다.
- Event는 DTO, Request, Response, Express 객체에 의존하지 않습니다.
- Event payload는 primitive, Date, enum, value object primitive snapshot만 가집니다.
- Event payload는 `readonly params` 단일 객체를 기본으로 합니다.
- Event class는 class당 하나의 파일을 가집니다.
- Event class 파일에는 params/interface/type/helper를 함께 두지 않습니다. Event params는 별도 `{name}.params.ts` 파일로 분리합니다.
- Event contract package는 Nest provider를 export하지 않습니다.
- EventHandler에서 CommandBus를 호출해야 하는 흐름이면 EventHandler가 아니라 Saga로 분리해야 합니다.

## 템플릿

```typescript
import type { ReservationCreatedEventParams } from "./reservation-created.params";

export class ReservationCreatedEvent {
  constructor(readonly params: ReservationCreatedEventParams) {}
}
```

## 체크리스트

- [ ] Event 이름이 이미 발생한 사실인지 확인
- [ ] DTO/Request/Response 의존 없음
- [ ] Event class가 class당 하나의 파일인지 확인
- [ ] Event params/type이 class 파일에서 분리됐는지 확인
- [ ] payload 원천이 event 생성 위치에서 명확히 매핑됨
- [ ] `packages/be-event/src/{domain}/index.ts`와 `src/index.ts` export 추가
- [ ] EventHandler/Saga 작업은 `be-usecase-builder` 책임으로 남김

## Feedback Packet (필수)

```text
Feedback:
- status: resolved | blocked | needs-contract | needs-implementation | needs-test | needs-reentry
- feedback_type: none | contract-gap | api-integration-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
