# Contents Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/contents.repository.ts

## 역할

Content 모델의 데이터 접근을 담당합니다. Space/게시글 단위 조회와 기본 CRUD를 제공합니다.

## 엔티티

- **Prisma 모델**: `content`
- **대상 타입**: `Content` (`@cocrepo/prisma`)

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Content \| null>` | ID로 단건 조회 |
| `findByIdWithPost(id)` | string | `Promise<Content \| null>` | 게시글 관계 포함 조회 |
| `findBySpaceId(spaceId)` | string | `Promise<Content[]>` | Space별 목록 조회 |
| `findBySpaceIdWithoutRemoved(spaceId)` | string | `Promise<Content[]>` | 삭제되지 않은 Space별 목록 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ items: Content[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.ContentUncheckedCreateInput | `Promise<Content>` | 콘텐츠 생성 |
| `updateById(id, data)` | string, Prisma.ContentUncheckedUpdateInput | `Promise<Content>` | ID 기반 수정 |
| `removeById(id)` | string | `Promise<Content>` | ID 기반 삭제 |

## 구현 체크리스트

- [x] contents.repository.ts
- [x] Prisma `content` modelAccessor 기반 조회/저장
- [x] `removedAt: null` 필터 지원 메서드 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(Content) 신규 생성 | codex |

