---
name: "be-event-builder-creator"
description: "이 skill은 `be-event-builder` 역할로 일할 때 사용합니다. CQRS Event 메시지를 만드는 방법을 쉽게 안내합니다."
---

# be-event-builder-creator

`be-event-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/14-be-event-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

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
