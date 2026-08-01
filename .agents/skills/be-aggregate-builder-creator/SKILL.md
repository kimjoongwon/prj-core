---
name: "be-aggregate-builder-creator"
description: "이 skill은 `be-aggregate-builder` 역할로 일할 때 사용합니다. Aggregate 서비스를 만드는 방법을 쉽게 안내합니다."
---

# be-aggregate-builder-creator

`be-aggregate-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/16-be-aggregate-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

# Aggregate 서비스 빌더

Aggregate service provider를 생성하는 역할입니다.

## 범위

이 역할은 `@cocrepo/aggregate` package의 aggregate service provider를 소유합니다.
여기서 Aggregate는 entity가 아니라 service layer의 aggregate service입니다.

## Owns

- `packages/be-aggregate/src/{domain}/{domain}.aggregate.ts`
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
- file: `packages/be-aggregate/src/{domain}/{domain}.aggregate.ts`
- class: `{Domain}Aggregate`
- domain barrel: `packages/be-aggregate/src/{domain}/index.ts`
- package barrel: `packages/be-aggregate/src/index.ts`

예:

```txt
packages/be-aggregate/src/reservation/reservation.aggregate.ts
export class ReservationAggregate
```

## 규칙

- `{Domain}Aggregate`는 Nest `@Injectable()` provider입니다.
- `{Domain}Aggregate`는 aggregate service이며 entity가 아닙니다.
- `{Domain}Aggregate` class는 class당 하나의 파일을 가집니다.
- aggregate class 파일에는 top-level type/helper/mapper/constant를 함께 두지 않습니다. 입력/Payload/Result/helper는 같은 domain 폴더의 별도 파일로 분리합니다.
- aggregate root entity는 `@cocrepo/entity`에 둡니다.
- DTO, Command/Query class, Request, Response, Express 객체를 받지 않습니다.
- public method는 `{Domain}Input`, `{Domain}Payload` 같은 aggregate-owned application/domain 입력 타입을 받습니다.
- public method 인자명은 기본적으로 `input`을 사용합니다. Command input과 구조적으로 같아도 Aggregate-owned `CreateXInput`, `UpdateXInput` 타입을 signature로 유지합니다.
- Prisma create/update input을 public method signature로 노출하지 않습니다. Repository 호출을 위해 persistence shape가 필요하면 같은 domain 폴더의 별도 mapper/helper 파일에서 변환합니다.
- Aggregate는 `TransactionHost`, `PrismaClient`, Prisma `where/orderBy/select/include`를 직접 소유하지 않습니다. DB 접근과 Prisma 변환은 Repository 또는 Repository 인접 mapper가 담당합니다.
- 여러 Repository 호출이 하나의 업무 단위를 이뤄야 하면 Aggregate public method에 `@Transactional()`을 붙이고, Repository는 CLS `TransactionHost.tx`로 같은 transaction을 사용합니다.
- Controller에서 직접 주입하지 않습니다. UseCase handler가 호출합니다.
- Repository를 통해 aggregate root entity를 로드하고, entity method를 호출한 뒤 저장합니다.
- 여러 aggregate/service/client를 조합하는 작업 흐름 조율은 UseCase에 둡니다.
- 하나의 aggregate root 내부 도메인 규칙, 종속 모델 변경 진입점, aggregate 저장 흐름만 소유합니다.
- 여러 출처의 값을 매핑할 때는 `input.xxx`, `context.userId`, `aggregate.id`처럼 소스 경로를 보존합니다.
- aggregate root를 넘어 여러 package/domain에서 공유되는 response shape type은 `@cocrepo/type`, 순수 런타임 builder는 `@cocrepo/toolkit`에 둡니다.

## Template

```typescript
import { Reservation } from "@cocrepo/entity";
import { ReservationsRepository } from "@cocrepo/repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ReservationAggregate {
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

## 최종 보고

최종 보고에는 변경 파일, 실행한 검증, 남은 이슈를 사람이 확인할 수 있게 요약합니다.
