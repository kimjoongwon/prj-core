# Subjects Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/subjects.repository.ts

## 역할

Subject(권한 대상 리소스) 엔티티의 데이터 접근을 담당합니다. CASL 권한 시스템에서 "무엇에 대한" 권한인지를 정의하는 리소스 타입(예: "User", "Role", "menu:admin")을 관리합니다. 이름 기반 조회, 그룹 기반 조회, 패턴 검색을 지원합니다.

## 엔티티

- **대상 Entity**: Subject (`@cocrepo/entity`)
- **Prisma 모델**: `subject`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findAll()` | - | `Promise<Subject[]>` | 삭제되지 않은 전체 Subject 목록 조회 |
| `findById(id)` | string | `Promise<Subject \| null>` | ID로 단건 조회 |
| `findByName(name)` | string | `Promise<Subject \| null>` | 이름(unique)으로 조회 |
| `findByGroup(group)` | string | `Promise<Subject[]>` | 그룹명으로 목록 조회 |
| `findByPattern(pattern)` | string | `Promise<Subject[]>` | 이름 패턴으로 검색 (예: 'menu:', 'entity:') |
| `findByIds(ids)` | string[] | `Promise<Subject[]>` | 여러 ID로 다건 조회 |
| `create(data)` | Prisma.SubjectUncheckedCreateInput | `Promise<Subject>` | 생성 |
| `updateById(id, data)` | string, Prisma.SubjectUncheckedUpdateInput | `Promise<Subject>` | ID로 수정 |
| `removeById(id)` | string | `Promise<Subject>` | 소프트 삭제 (removedAt 설정) |

## 쿼리 최적화

- `findAll()` / `findByIds()`: `{ group: "asc" }, { order: "asc" }` 복합 정렬
- `findByGroup()` / `findByPattern()`: `{ order: "asc" }` 순서 정렬
- `findByPattern()`: `startsWith`로 접두어 패턴 매칭 (예: "menu:" 접두어로 시작하는 Subject)
- 소프트 삭제: `removedAt: null` 조건 일관 적용

## 패턴 검색 특이사항

`findByPattern(pattern)`에서 패턴의 `%` 문자를 제거하고 `startsWith` 조건으로 변환합니다. Prisma의 SQL LIKE 대신 TypeScript 수준에서 변환하는 방식입니다.

```
패턴: "menu:%"
→ startsWith: "menu:"
```

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date()` 설정
- 물리 삭제 메서드 없음

## 구현 체크리스트

- [x] subjects.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
