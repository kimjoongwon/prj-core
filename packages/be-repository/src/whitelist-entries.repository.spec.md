# WhitelistEntries Repository 기획서

> 생성일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/whitelist-entries.repository.ts

## 역할

`WhitelistEntry` 모델의 `@schema-owner: true` 데이터 접근을 담당합니다.
화이트리스트 타입/값 기반 조회와 생성/수정/삭제를 제공합니다.

## 엔티티

- **대상 Entity**: WhitelistEntry (`@cocrepo/entity`)
- **Prisma 모델**: `whitelistEntry`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<WhitelistEntry \| null>` | ID로 단건 조회 |
| `findByType(type)` | `WhitelistType` | `Promise<WhitelistEntry[]>` | 타입별 목록 조회 |
| `findByTypeAndValue(type, value)` | `WhitelistType`, `string` | `Promise<WhitelistEntry \| null>` | 타입/값 조합 단건 조회 |
| `findMany(params)` | where/orderBy/skip/take | `Promise<{ entries: WhitelistEntry[]; totalCount: number }>` | 조건 기반 목록/페이지네이션 조회 |
| `count(where)` | `Prisma.WhitelistEntryWhereInput` | `Promise<number>` | 조건별 건수 조회 |
| `create(data)` | `Prisma.WhitelistEntryUncheckedCreateInput` | `Promise<WhitelistEntry>` | 엔트리 생성 |
| `updateById(id, data)` | string, `Prisma.WhitelistEntryUncheckedUpdateInput` | `Promise<WhitelistEntry>` | 엔트리 수정 |
| `deleteById(id)` | string | `Promise<WhitelistEntry>` | 엔트리 삭제 |

## 구현 체크리스트

- [x] whitelist-entries.repository.ts
- [x] 타입/값 조합 조회 메서드 제공
- [x] 페이지네이션과 건수 조회 지원

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락된 WhitelistEntry 레포 생성 | codex |
