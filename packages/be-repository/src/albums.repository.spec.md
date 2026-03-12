# Albums Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/albums.repository.ts

## 역할

Album(앨범) 모델의 데이터 접근을 담당합니다. 소속 Space별 조회, 기본 정렬, 엔트리 포함 조회를 제공합니다.

## 엔티티

- **대상 Entity**: Album (`@cocrepo/entity`)
- **Prisma 모델**: `album`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Album \| null>` | ID로 단건 조회 |
| `findByIdWithEntries(id)` | string | `Promise<Album \| null>` | 엔트리 포함 단건 조회 |
| `findBySpaceId(spaceId)` | string | `Promise<Album[]>` | Space 단위 목록 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ albums: Album[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.AlbumUncheckedCreateInput | `Promise<Album>` | 앨범 생성 |
| `updateById(id, data)` | string, Prisma.AlbumUncheckedUpdateInput | `Promise<Album>` | ID 기반 수정 |
| `removeById(id)` | string | `Promise<Album>` | ID 기반 삭제 |
| `countBySpaceId(spaceId)` | string | `Promise<number>` | Space별 개수 조회 |

## 구현 체크리스트

- [x] albums.repository.ts
- [x] @Injectable() 및 TransactionHost 주입
- [x] plainToInstance로 Entity 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(Album) 신규 생성 | codex |

