# Actions Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/actions.repository.ts

## 역할

Action(권한 행위 정의) 엔티티의 데이터 접근을 담당합니다. CRUD 외에 이름 기반 조회, 그룹 기반 조회, upsert 등 권한 시스템 초기화/동기화에 필요한 메서드를 제공합니다.

## 엔티티

- **대상 Entity**: Action (`@cocrepo/entity`)
- **Prisma 모델**: `action`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findAll()` | - | `Promise<Action[]>` | 삭제되지 않은 모든 Action 조회 |
| `findByGroup(group)` | string | `Promise<Action[]>` | 그룹명으로 목록 조회 |
| `findById(id)` | string | `Promise<Action \| null>` | ID로 단건 조회 |
| `findByName(name)` | string | `Promise<Action \| null>` | 이름(unique)으로 조회 |
| `findByNames(names)` | string[] | `Promise<Action[]>` | 여러 이름으로 다건 조회 |
| `create(data)` | Prisma.ActionUncheckedCreateInput | `Promise<Action>` | 단건 생성 |
| `updateById(id, data)` | string, Prisma.ActionUncheckedUpdateInput | `Promise<Action>` | ID로 수정 |
| `removeById(id)` | string | `Promise<Action>` | 소프트 삭제 (removedAt 설정) |
| `upsertMany(actions)` | Prisma.ActionUncheckedCreateInput[] | `Promise<Action[]>` | 이름 기준 upsert (시드 데이터 동기화) |

## 쿼리 최적화

- `findAll()`: `{ group: "asc" }, { order: "asc" }, { name: "asc" }` 복합 정렬
- `findByGroup()` / `findByNames()`: `{ order: "asc" }, { name: "asc" }` 정렬
- 소프트 삭제: `removedAt: null` 조건으로 삭제된 데이터 필터링

## upsertMany 특이사항

`upsertMany()`는 Action 이름을 unique key로 사용합니다. 기존 Action이 존재하면 `displayName`, `description`, `group`, `order`, `config`, `removedAt`(null로 복구)을 업데이트합니다. 시스템 초기화 및 권한 정의 동기화에 사용됩니다.

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date()` 설정
- upsert 시 `removedAt: null`로 복구 가능

## 구현 체크리스트

- [x] actions.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
