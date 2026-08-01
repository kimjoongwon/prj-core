---
name: "be-query-dto-builder-creator"
description: "이 skill은 `be-query-dto-builder` 역할로 일할 때 사용합니다. API edge 목록 조회 Query DTO를 만드는 방법을 쉽게 안내합니다."
---

# be-query-dto-builder-creator

`be-query-dto-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/12-be-query-dto-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 재사용 우선 점검

- 작업을 시작하기 전에 기존 Query DTO, Command/Query input, Controller, Repository mapper를 먼저 검색합니다.
- 새 Query DTO를 만들기 전에 기존 wire shape와 `@cocrepo/input`의 `*QueryInput`을 재사용할 수 있는지 확인합니다.
- 동일 endpoint intent에 대해 중복 Query DTO를 만들지 않습니다.

# Query DTO 빌더

Query DTO는 API edge의 목록 조회 요청 shape, validation, Swagger metadata만 소유합니다.

## Owns

- `packages/be-dto/src/query/*.dto.ts`
- 도메인 폴더의 목록 조회 Query DTO 파일
- `packages/be-dto/src/query/query.dto.ts`
- 필요한 barrel export

## Does Not Own

- Prisma `WhereInput`, `OrderByInput`, create/update input
- `toPrismaWhere()`, `toPrismaOrderBy()` 같은 변환 메서드
- Repository mapper/helper
- Command/Query message class

## 핵심 규칙

- Query DTO class는 class당 하나의 파일을 가집니다.
- Query DTO는 `QueryDto`를 상속합니다. `PrismaQueryDto`는 사용하지 않습니다.
- Query DTO는 `skip`, `take`, `sort`, 검색어, boolean/date/enum/id 필터 같은 API wire field만 선언합니다.
- Query DTO field는 대응되는 `@cocrepo/input`의 `*QueryInput`과 같은 wire shape를 유지합니다.
- Controller는 DTO가 QueryInput과 구조적으로 호환되면 `new XxxQuery(dto)`로 그대로 전달할 수 있습니다.
- Query DTO는 Command, Query message, Entity, Repository를 import하지 않습니다.
- Query DTO는 `Prisma.*WhereInput`, `Prisma.*OrderByInput`, Prisma create/update input을 import하지 않습니다.
- Prisma enum은 API validation/Swagger에 필요한 경우만 `@cocrepo/prisma`에서 import할 수 있습니다.
- 필터/정렬을 Prisma shape로 변환하는 로직은 `packages/be-repository/src/*-query.mapper.ts`가 소유합니다.

## QueryDto 기본 계약

- `QueryDto`는 `skip?: number`, `take?: number`, `toPageMetaDto(totalCount)`만 제공합니다.
- `sort?: string[]`은 필요한 하위 Query DTO에서 선언합니다.
- `sort`는 JSON:API 컨벤션을 사용합니다.
  - `name` → ASC
  - `-createdAt` → DESC
  - 배열 순서가 정렬 우선순위입니다.

## 구현 절차

1. Controller endpoint가 받는 query parameter를 확인합니다.
2. 대응되는 `@cocrepo/input`의 `*QueryInput`을 확인하거나 생성 owner에게 필요성을 보고합니다.
3. Query DTO에 API field와 decorator만 선언합니다.
4. DTO에 변환 메서드나 Prisma type import가 생기지 않았는지 확인합니다.
5. Repository mapper가 해당 QueryInput을 Prisma where/orderBy로 변환하는지 확인하고, mapper가 없으면 repository owner로 인계합니다.

## 체크리스트

- [ ] `extends QueryDto`를 사용합니다.
- [ ] `PrismaQueryDto`, `excludeFromAutoMap`, `toPrismaWhere`, `toPrismaOrderBy`가 없습니다.
- [ ] DTO가 Command/UseCase/Aggregate/Repository를 import하지 않습니다.
- [ ] DTO와 QueryInput의 wire shape가 일치합니다.
- [ ] Prisma 변환은 repository 인접 mapper에 있습니다.
