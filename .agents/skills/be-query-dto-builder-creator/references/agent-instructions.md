# be-query-dto-builder 상세 지시

원본 에이전트 파일: `.codex/agents/12-be-query-dto-builder.toml`

이 참고 문서는 목록 조회 Query DTO의 현재 계약을 담고 있습니다. 승인된 spec이 더 구체적인 지시를 제공하면 spec을 우선합니다.

---

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
