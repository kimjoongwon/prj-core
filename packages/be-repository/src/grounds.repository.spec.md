# Grounds Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/grounds.repository.ts

## 역할

Ground(물리적 공간 기반) 엔티티의 데이터 접근을 담당합니다. Ground는 Space(논리적 테넌트 공간)의 상위 개념으로, Space들이 속하는 물리적/조직적 기반 단위를 관리합니다.

## 엔티티

- **대상 Entity**: Ground (`@cocrepo/entity`)
- **Prisma 모델**: `ground`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findAll()` | - | `Promise<Ground[]>` | 삭제되지 않은 모든 Ground 조회 |
| `findById(id)` | string | `Promise<Ground \| null>` | ID로 단건 조회 |
| `findManyBySpaceId(spaceId)` | string | `Promise<Ground[]>` | Space ID로 연관 Ground 목록 조회 |
| `create(data)` | Prisma.GroundUncheckedCreateInput | `Promise<Ground>` | 생성 |
| `updateById(id, data)` | string, Prisma.GroundUncheckedUpdateInput | `Promise<Ground>` | ID로 수정 |
| `removeById(id)` | string | `Promise<Ground>` | 소프트 삭제 (removedAt 설정) |

## 쿼리 최적화

- `findAll()` / `findManyBySpaceId()`: `{ createdAt: "desc" }` 최신순 정렬
- `findById()`: `where: { id, removedAt: null }` 조건으로 삭제된 항목 제외
- 소프트 삭제: `removedAt: null` 조건 일관 적용

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date()` 설정
- 물리 삭제 메서드 없음

## 구현 체크리스트

- [x] grounds.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
