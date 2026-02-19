# Categories Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/categories.repository.ts

## 역할

Category(분류 체계) 엔티티의 데이터 접근을 담당합니다. Role 및 User 분류에 사용되는 계층형 카테고리 구조를 관리합니다. 순환 참조 방지를 위한 하위 카테고리 재귀 조회, 연결된 역할 수 조회 등의 기능을 제공합니다.

## 엔티티

- **대상 Entity**: Category (`@cocrepo/entity`)
- **Prisma 모델**: `category`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id, include?)` | string, Prisma.CategoryInclude | `Promise<Category \| null>` | ID로 조회 (옵셔널 include) |
| `findByName(name)` | string | `Promise<Category \| null>` | 이름으로 조회 |
| `findMany(params)` | where?, orderBy?, include? | `Promise<Category[]>` | 조건별 목록 조회 |
| `create(data)` | Prisma.CategoryUncheckedCreateInput | `Promise<Category>` | 카테고리 생성 |
| `updateById(id, data)` | string, Prisma.CategoryUncheckedUpdateInput | `Promise<Category>` | ID로 수정 |
| `deleteById(id)` | string | `Promise<Category>` | 물리 삭제 |
| `countChildrenById(id)` | string | `Promise<number>` | 직접 하위 카테고리 수 조회 |
| `countRoleClassificationsByCategoryId(categoryId)` | string | `Promise<number>` | 카테고리에 연결된 RoleClassification 수 조회 |
| `findAllDescendantIds(categoryId)` | string | `Promise<string[]>` | 모든 하위 카테고리 ID 재귀 조회 |

## 쿼리 최적화

- `findMany()`: `include` 파라미터로 동적 연관 로딩 지원
- `findMany()` 기본 정렬: `{ createdAt: "asc" }`
- `countChildrenById()`: `parentId` 조건으로 직접 하위만 카운트

## 재귀 조회 (findAllDescendantIds)

BFS(너비 우선 탐색) 방식으로 모든 하위 카테고리 ID를 수집합니다. 순환 참조 방지 검증(부모-자식 관계 설정 시)에 사용됩니다.

```
순서:
1. queue에 categoryId 추가
2. queue에서 꺼내 children 조회 (select: id만)
3. children을 descendantIds와 queue에 추가
4. queue가 빌 때까지 반복
```

## 삭제 정책

- **물리 삭제**: `deleteById()` → `category.delete()`
- 소프트 삭제 없음 (삭제 전 연결된 역할 수 확인 권장)

## 구현 체크리스트

- [x] categories.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
