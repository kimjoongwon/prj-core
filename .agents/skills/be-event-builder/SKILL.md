---
name: "be-event-builder"
description: "이 skill은 `be-event-builder` 역할로 일할 때 사용합니다. CQRS Event 메시지를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-event-builder

# Event 빌더

Nest CQRS Event message 계약을 `@cocrepo/event`에 생성하는 역할입니다. EventHandler와 Saga 구현은 `be-usecase-builder`가 소유합니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 이미 발생한 도메인/application event 계약 생성 | ✅ 사용 | `ReservationCreatedEvent` 같은 event message |
| Event package barrel export 정리 | ✅ 사용 | domain barrel + package barrel |
| EventHandler 구현 | ❌ 미사용 | `be-usecase-builder` 사용 |
| Saga 구현 | ❌ 미사용 | `be-usecase-builder` 사용 |
| Command/Query message 생성 | ❌ 미사용 | `be-command-builder` 사용 |

## 출력

| 항목 | 경로 |
|------|------|
| Event 클래스 | `packages/be-event/src/{domain}/{name}.event.ts` |
| Event payload 타입 | `packages/be-event/src/{domain}/{name}.payload.ts` |
| domain barrel | `packages/be-event/src/{domain}/index.ts` |
| package barrel | `packages/be-event/src/index.ts` |

## 핵심 규칙

- Event는 이미 발생한 사실을 표현합니다. 명령형 이름을 쓰지 않습니다.
- Event class 이름은 `{Domain}{PastTense}Event` 또는 `{Domain}{State}Event` 형태를 기본으로 합니다.
- Event는 DTO, Request, Response, Express 객체에 의존하지 않습니다.
- Event payload는 primitive, Date, enum, value object primitive snapshot만 가집니다.
- Event payload는 `readonly payload` 단일 객체를 기본으로 합니다.
- Event class는 class당 하나의 파일을 가집니다.
- Event class 파일에는 payload/interface/type/helper를 함께 두지 않습니다. Event payload는 별도 `{name}.payload.ts` 파일로 분리합니다.
- 기존 `params` 이름의 event 계약은 신규 기준에서 legacy이며, event를 수정할 때 payload 명명으로 함께 정리합니다.
- Event 계약 package는 Nest provider를 export하지 않습니다.
- EventHandler에서 CommandBus를 호출해야 하는 흐름이면 EventHandler가 아니라 Saga로 분리해야 합니다.

## 템플릿

```typescript
import type { ReservationCreatedEventPayload } from "./reservation-created.payload";

export class ReservationCreatedEvent {
  constructor(readonly payload: ReservationCreatedEventPayload) {}
}
```

## 체크리스트

- [ ] Event 이름이 이미 발생한 사실인지 확인
- [ ] DTO/Request/Response 의존 없음
- [ ] Event class가 class당 하나의 파일인지 확인
- [ ] Event payload/type이 class 파일에서 분리됐는지 확인
- [ ] payload 원천이 event 생성 위치에서 명확히 매핑됨
- [ ] `packages/be-event/src/{domain}/index.ts`와 `src/index.ts` export 추가
- [ ] EventHandler/Saga 작업은 `be-usecase-builder` 책임으로 남김

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
