# Abilities Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/abilities.repository.ts

## 역할

Ability(권한 행위 단위) 엔티티의 데이터 접근을 담당합니다. Subject(대상)와 Action(행위)의 조합으로 구성된 Ability를 CRUD하고, Subject 기반 조회 및 다중 생성을 지원합니다. @nestjs-cls/transactional을 통해 트랜잭션을 지원합니다.

## 엔티티

- **대상 Entity**: Ability (`@cocrepo/entity`)
- **Prisma 모델**: `ability`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findAll()` | - | `Promise<Ability[]>` | 삭제되지 않은 모든 Ability 조회 |
| `findById(id)` | string | `Promise<Ability \| null>` | ID로 단건 조회 |
| `findByIds(ids)` | string[] | `Promise<Ability[]>` | ID 목록으로 다건 조회 |
| `findBySubjectId(subjectId)` | string | `Promise<Ability[]>` | Subject ID로 목록 조회 |
| `create(data)` | Prisma.AbilityUncheckedCreateInput | `Promise<Ability>` | 단건 생성 |
| `updateById(id, data)` | string, Prisma.AbilityUncheckedUpdateInput | `Promise<Ability>` | ID로 수정 |
| `removeById(id)` | string | `Promise<Ability>` | 소프트 삭제 (removedAt 설정) |
| `createMany(data)` | Prisma.AbilityCreateManyInput[] | `Promise<number>` | 다중 생성 (중복 스킵) |

## 쿼리 최적화

- 모든 조회에 `subject: true, action: true` include 포함 (연관 엔티티 eager loading)
- `findAll()` / `findByIds()` / `findBySubjectId()`: `{ createdAt: "desc" }` 정렬
- 소프트 삭제: `removedAt: null` 조건으로 삭제된 데이터 필터링
- `createMany()`: `skipDuplicates: true` 옵션으로 중복 무시

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date()` 설정
- 물리 삭제 메서드 없음

## 구현 체크리스트

- [x] abilities.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
