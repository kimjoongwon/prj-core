# Spaces Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/spaces.repository.ts

## 역할

Space(논리적 테넌트 공간) 엔티티의 데이터 접근을 담당합니다. Multi-Tenancy 시스템에서 각 테넌트 공간을 관리하며, SpaceClassification 계층 구조 기반의 접근 가능 Space ID 조회를 지원합니다. Ground(물리적 기반)와의 연관도 처리합니다.

## 엔티티

- **대상 Entity**: Space (`@cocrepo/entity`)
- **Prisma 모델**: `space`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Space \| null>` | ID로 단건 조회 (기본 정보만) |
| `findByIdWithGround(id)` | string | `Promise<Space \| null>` | ID로 조회 (Ground 포함) |
| `findManyWithGround()` | - | `Promise<Space[]>` | Ground detail 포함 전체 Space 목록 조회 |
| `findGroundBySpaceId(spaceId)` | string | `Promise<Ground \| null>` | Space의 1:1 Ground detail 조회 |
| `findGroundByBusinessNo(businessNo)` | string | `Promise<Ground \| null>` | Ground 사업자번호 중복 확인 |
| `findAll()` | - | `Promise<Space[]>` | 전체 Space 목록 조회 (삭제 제외) |
| `create(data?)` | Prisma.SpaceUncheckedCreateInput? | `Promise<Space>` | Space 생성 (data 없으면 빈 객체로 생성) |
| `createGroundBySpaceId(spaceId, data)` | string, Prisma.GroundUncheckedCreateInput | `Promise<Ground>` | Space root 아래 Ground detail 생성 |
| `updateGroundBySpaceId(spaceId, data)` | string, Prisma.GroundUncheckedUpdateInput | `Promise<Ground>` | Space root 아래 Ground detail 수정 |
| `updateById(id, data)` | string, Prisma.SpaceUncheckedUpdateInput | `Promise<Space>` | ID로 수정 |
| `findSpaceIdsByCategoryHierarchy(spaceId)` | string | `Promise<string[]>` | SpaceCategory 위계 기반 접근 가능한 Space ID 배열 조회 |
| `findByIdsWithGround(ids)` | string[] | `Promise<Space[]>` | 여러 ID로 조회 (Ground 포함) |
| `removeById(id)` | string | `Promise<Space>` | 소프트 삭제 (removedAt 설정) |

## 카테고리 위계 기반 조회 (findSpaceIdsByCategoryHierarchy)

Multi-Tenancy 접근 제어의 핵심 메서드입니다.

```
동작 원리:
1. 주어진 spaceId의 SpaceClassification → Category (children 포함) 조회
2. 현재 Category ID + 직접 하위 Category ID들 수집
3. 수집된 categoryIds에 속한 모든 SpaceClassification 조회
4. 해당 Space ID 배열 반환

ROOT Category → 자신 + 모든 하위 Category의 Space
BRANCH Category → 자신만
```

## 쿼리 최적화

- `findAll()` / `removeById()`: `removedAt: null` 소프트 삭제 필터링
- `findAll()` / `findByIdsWithGround()`: `{ createdAt: "desc" }` 최신순
- `findSpaceIdsByCategoryHierarchy()`: SpaceClassification → Category → children 3단계 include

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date()` 설정
- Ground detail도 함께 `removedAt` 처리한다.
- 물리 삭제 메서드 없음

## 구현 체크리스트

- [x] spaces.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Space root 아래 Ground detail 조회/수정 메서드를 반영 | codex |
