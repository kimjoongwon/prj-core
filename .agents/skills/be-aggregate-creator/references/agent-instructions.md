# Detailed Instructions for be-aggregate-builder

Source agent file: `.codex/agents/be-aggregate-builder.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

# Aggregate Root Service Builder

Aggregate root service provider를 생성하는 role입니다.

## Scope

이 role은 `@cocrepo/aggregate` package의 aggregate root service provider를 소유합니다.
여기서 AggregateRoot는 entity가 아니라 service layer의 aggregate root service입니다.

## Owns

- `packages/be-aggregate/src/{domain}/{domain}.aggregate-root.ts`
- `packages/be-aggregate/src/{domain}/index.ts`
- `packages/be-aggregate/src/index.ts`
- 필요한 경우 `packages/be-aggregate/package.json`, `tsconfig.json`

## Does Not Own

- aggregate root entity 구현 (`@cocrepo/entity`)
- Command/Query/UseCase handler (`@cocrepo/command`, `@cocrepo/usecase`)
- Repository query/save 구현 (`@cocrepo/repository`)
- Controller/Module wiring
- 외부 연동 Client 구현 (`@cocrepo/client`)

## Naming / Layout

- package: `@cocrepo/aggregate`
- file: `packages/be-aggregate/src/{domain}/{domain}.aggregate-root.ts`
- class: `{Domain}AggregateRoot`
- domain barrel: `packages/be-aggregate/src/{domain}/index.ts`
- package barrel: `packages/be-aggregate/src/index.ts`

예:

```txt
packages/be-aggregate/src/reservation/reservation.aggregate-root.ts
export class ReservationAggregateRoot
```

## Rules

- `{Domain}AggregateRoot`는 Nest `@Injectable()` provider입니다.
- `{Domain}AggregateRoot`는 aggregate root service이며 entity가 아닙니다.
- `{Domain}AggregateRoot` class는 class당 하나의 파일을 가집니다.
- aggregate-root class 파일에는 top-level type/helper/mapper/constant를 함께 두지 않습니다. Input/Payload/Result/helper는 같은 domain 폴더의 별도 파일로 분리합니다.
- aggregate root entity는 `@cocrepo/entity`에 둡니다.
- DTO, Request, Response, Express 객체를 받지 않습니다.
- Controller에서 직접 주입하지 않습니다. UseCase handler가 호출합니다.
- Repository를 통해 aggregate root entity를 로드하고, entity method를 호출한 뒤 저장합니다.
- 여러 aggregate/service/client를 조합하는 workflow orchestration은 UseCase에 둡니다.
- 하나의 aggregate root 내부 도메인 규칙, child mutation entrypoint, aggregate 저장 흐름만 소유합니다.
- 여러 출처의 값을 매핑할 때는 `input.xxx`, `context.userId`, `aggregate.id`처럼 source path를 보존합니다.
- aggregate root를 넘어 여러 package/domain에서 공유되는 response shape type은 `@cocrepo/type`, 순수 runtime builder는 `@cocrepo/toolkit`에 둡니다.

## Template

```typescript
import { Reservation } from "@cocrepo/entity";
import { ReservationsRepository } from "@cocrepo/repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ReservationAggregateRoot {
  constructor(private readonly repository: ReservationsRepository) {}

  async cancel(input: {
    reservationId: string;
    userId: string;
    spaceId: string;
    now: Date;
    cancelReason?: string | null;
  }): Promise<Reservation> {
    const reservation = await this.repository.findByIdForUser({
      reservationId: input.reservationId,
      userId: input.userId,
      spaceId: input.spaceId,
    });
    if (!reservation) {
      throw new NotFoundException("예약을 찾을 수 없습니다.");
    }

    reservation.cancel({
      now: input.now,
      cancelReason: input.cancelReason,
    });

    return this.repository.save(reservation);
  }
}
```

## Final Report

최종 보고에는 변경 파일, 실행한 검증, 남은 이슈를 사람이 확인할 수 있게 요약합니다.
