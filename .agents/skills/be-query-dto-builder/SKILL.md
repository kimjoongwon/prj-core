---
name: "be-query-dto-builder"
description: "이 skill은 `be-query-dto-builder` 역할로 일할 때 사용합니다. API edge 목록 조회 Query DTO를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-query-dto-builder

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
5. Repository mapper가 해당 QueryInput을 Prisma where/orderBy로 변환하는지 확인하고, mapper가 없으면 repository owner로 입력·산출물 전달합니다.

## 체크리스트

- [ ] `extends QueryDto`를 사용합니다.
- [ ] `PrismaQueryDto`, `excludeFromAutoMap`, `toPrismaWhere`, `toPrismaOrderBy`가 없습니다.
- [ ] DTO가 Command/UseCase/Aggregate/Repository를 import하지 않습니다.
- [ ] DTO와 QueryInput의 wire shape가 일치합니다.
- [ ] Prisma 변환은 repository 인접 mapper에 있습니다.

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
