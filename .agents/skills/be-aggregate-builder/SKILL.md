---
name: "be-aggregate-builder"
description: "이 skill은 `be-aggregate-builder` 역할로 일할 때 사용합니다. Aggregate 서비스를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-aggregate-builder

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

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
