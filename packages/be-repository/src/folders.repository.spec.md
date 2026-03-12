# Folders Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/folders.repository.ts

## 역할

Folder 모델의 데이터 접근을 담당합니다. 경로 조회, 계층 조회, 폴더 단위 CRUD를 제공합니다.

## 엔티티

- **대상 Entity**: Folder (`@cocrepo/entity`)
- **Prisma 모델**: `folder`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Folder \| null>` | ID로 단건 조회 |
| `findByIdWithChildren(id)` | string | `Promise<Folder \| null>` | 하위폴더/에셋 포함 조회 |
| `findByPath(path)` | string | `Promise<Folder \| null>` | 전체 경로 기반 조회 |
| `findBySpaceId(spaceId)` | string | `Promise<Folder[]>` | Space별 목록 조회 |
| `findByParentFolderId(parentFolderId)` | string \| null | `Promise<Folder[]>` | 부모 기준 하위 목록 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ folders: Folder[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.FolderUncheckedCreateInput | `Promise<Folder>` | 폴더 생성 |
| `updateById(id, data)` | string, Prisma.FolderUncheckedUpdateInput | `Promise<Folder>` | ID 기반 수정 |
| `removeById(id)` | string | `Promise<Folder>` | ID 기반 삭제 |

## 구현 체크리스트

- [x] folders.repository.ts
- [x] 계층/경로 조회 지원
- [x] 부모-자식 include 조회 지원

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(Folder) 신규 생성 | codex |

