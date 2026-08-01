---
name: "be-prisma-builder-creator"
description: "이 skill은 `be-prisma-builder` 역할로 일할 때 사용합니다. Prisma schema를 만들고 관계를 정리하는 방법을 쉽게 안내합니다."
---

# be-prisma-builder-creator

`be-prisma-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/03-be-prisma-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

이 문서는 Prisma schema를 만들거나 수정하는 agent의 실행 규칙을 소유합니다.

## 재사용 우선 점검

- 작업 전 기존 schema, 승인된 spec, 검증 스크립트와 관련 테스트를 검색합니다.
- 새 model이나 enum을 만들기 전에 같은 선언과 같은 책임이 이미 있는지 확인합니다.
- 같은 model 또는 enum을 여러 파일에 선언하지 않습니다.
- 모델 전체 목록을 문서나 검증 코드에 복제하지 않습니다. 실제 `packages/be-prisma/schema/*.prisma` 선언을 단일 기준으로 사용합니다.

## 소유 범위

이 skill은 다음 작업에 사용합니다.

- Prisma model과 enum 추가 또는 수정
- 필드, 제약 조건과 relation 변경
- schema 파일 배치와 최소 메타데이터 정리
- schema 정적 검증 갱신

Entity, DTO, Repository와 application usecase는 해당 owner에게 인계합니다.

## 기준 문서

작업 전 아래 파일을 확인합니다.

- `packages/be-prisma/schema/_base.prisma`
- `packages/be-prisma/docs/schema-metadata-guide.md`
- `packages/be-prisma/docs/schema-file-conventions.md`
- `packages/be-prisma/scripts/validate-schema-conventions.ts`

스키마 변경과 운영 데이터 반영이 필요하면 아래 문서도 확인합니다.

- `packages/be-prisma/docs/schema-change-playbook.md`
- `packages/be-prisma/docs/seed-data-governance.md`

## 파일 배치

### 단일 폴더

- 모든 `.prisma` 파일은 `packages/be-prisma/schema/` 바로 아래에 둡니다.
- `schema/` 아래에 도메인이나 데이터 타입 하위 폴더를 만들지 않습니다.
- 일반 model 파일은 model을 정확히 하나만 선언합니다.
- 일반 model 파일에는 enum, generator 또는 datasource를 선언하지 않습니다.
- relation이 가깝거나 같은 Aggregate에 속해도 model이 둘이면 파일도 둘입니다.

### 기계식 파일 이름

model 이름은 `UpperCamelCase`로 작성합니다. 파일 이름은 아래 변환의 결과에 `.prisma`를 붙입니다.

```ts
name
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
  .toLowerCase();
```

예:

```text
User -> schema/user.prisma
OidcClient -> schema/oidc-client.prisma
AIAgentLog -> schema/ai-agent-log.prisma
```

모델별 경로를 수동 목록으로 관리하지 않습니다. 계산된 경로가 충돌하거나 대소문자만 다른 충돌이 생기면 이름을 임의 배치로 우회하지 말고 계약을 확인합니다.

### 예약 파일

`_base.prisma`:

- generator와 datasource만 선언합니다.
- model, enum과 모델 메타데이터를 선언하지 않습니다.
- 기존 generator output과 datasource 설정을 임의로 바꾸지 않습니다.

`_enums.prisma`:

- 모든 enum을 이름 오름차순으로 선언합니다.
- model, generator와 datasource를 선언하지 않습니다.
- enum에 model 설계 메타데이터를 두지 않습니다.
- enum 이름, 값과 `@map`은 DB mapping 계약 없이 바꾸지 않습니다.
- `///` 문서 주석은 DMMF 문서 계약 없이 바꾸지 않습니다.
- 실제 model 필드에서 사용하지 않는 enum을 미리 추가하지 않습니다.

## 메타데이터 계약

메타데이터의 종류, 형식, 데이터 타입과 Aggregate Root 판단 기준은 `packages/be-prisma/docs/schema-metadata-guide.md`가 단독으로 소유합니다.

- model을 만들거나 수정하기 전에 해당 가이드를 읽고 현재 계약을 적용합니다.
- 이 skill에서 별도의 메타데이터 목록이나 판단 기준을 만들지 않습니다.
- Prisma relation이나 필드에서 확인할 수 있는 정보를 설계 메타데이터로 반복하지 않습니다.
- 판단이 불분명하면 승인된 spec 또는 도메인 owner에게 확인합니다.

## 모델 타입과 관계 표현

- DDD의 `Entity`, `Value Object`, `Service` 분류를 Prisma model의 커스텀 태그로 복제하지 않습니다.
- 추가 속성이 있는 다대다 관계는 Prisma의 explicit many-to-many relation model로 표현합니다.
- 1:1 상세 모델은 FK, `@unique`, `@relation`으로 표현합니다. 1:1이라는 이유만으로 상속 타입으로 분류하지 않습니다.
- 실제 다형성은 `type` 또는 `kind` discriminator enum과 STI 또는 MTI 구조로 표현합니다.
- Prisma model 이름, relation, key와 discriminator로 드러나는 구조를 별도 메타데이터로 반복하지 않습니다.

관계 모델도 자체 파일을 사용하고 메타데이터 가이드의 model 계약을 적용합니다. 아래 예시는 relation 구조만 보여 줍니다.

```prisma
// schema/policy-ability.prisma
model PolicyAbility {
  id         String @unique @default(ulid()) @db.VarChar(26)
  seq        Int    @id @default(autoincrement())
  policySeq  Int
  abilitySeq Int

  policy  Policy  @relation(fields: [policySeq], references: [seq])
  ability Ability @relation(fields: [abilitySeq], references: [seq])

  @@unique([policySeq, abilitySeq])
}
```

기준 자료:

- Eric Evans, _Domain-Driven Design_: Entity, Value Object, Service, Aggregate
- Martin Fowler, _Patterns of Enterprise Application Architecture_: Association Table Mapping, Class Table Inheritance
- Prisma 공식 문서: explicit many-to-many relations, table inheritance

## 작업 순서

### 기존 model 수정

1. model 이름으로 계산된 `schema/<kebab-case>.prisma`를 찾습니다.
2. 승인된 spec과 현재 relation 및 제약 조건을 확인합니다.
3. 필요한 schema 변경만 수행합니다.
4. 메타데이터 가이드의 현재 계약을 확인합니다.
5. consumer 계약에 영향이 있으면 해당 owner에게 인계합니다.
6. 검증 명령을 실행합니다.

### 새 model 추가

1. 같은 선언과 같은 책임이 이미 없는지 검색합니다.
2. `UpperCamelCase` model 이름을 정합니다.
3. 기계식 변환으로 `schema/<kebab-case>.prisma` 경로를 계산합니다.
4. 그 파일에 model 하나만 선언합니다.
5. 메타데이터 가이드의 현재 계약과 판단 기준을 적용합니다.
6. relation, key와 constraint를 검토합니다.
7. schema 검증과 필요한 migration·client 검증을 실행합니다.

### enum 추가

1. 같은 enum이 없는지 검색합니다.
2. 실제 model에서 바로 사용하는지 확인합니다.
3. `_enums.prisma`의 이름 오름차순 위치에 추가합니다.
4. enum 값과 DB mapping을 검토합니다.
5. schema 검증과 필요한 migration·client 검증을 실행합니다.

## 검증

최소 검증:

```bash
pnpm --filter=@cocrepo/prisma run schema:check
pnpm --filter=@cocrepo/prisma exec prisma validate
```

필드, relation 또는 enum을 변경했다면 영향 범위에 맞춰 아래도 실행합니다.

```bash
pnpm --filter=@cocrepo/prisma run generate
pnpm --filter=@cocrepo/prisma test
pnpm --filter=@cocrepo/prisma type-check
pnpm --filter=@cocrepo/prisma build
```

## 완료 보고

최종 보고에는 다음을 포함합니다.

- 생성, 수정 또는 삭제한 파일 경로와 요약
- 실행한 검증과 결과
- 검증하지 못한 항목과 남은 위험
- 다음 owner가 있으면 handoff 대상과 소비할 산출물
- 다음 owner가 없으면 `next subagent: none-final`
