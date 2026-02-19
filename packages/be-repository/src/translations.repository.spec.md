# Translations Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/translations.repository.ts

## 역할

다국어 번역(Translation) 엔티티의 데이터 접근을 담당합니다. `languageCode + key` 복합 고유 키로 번역 문자열을 관리합니다. 언어/카테고리 기반 조회, 키 패턴 검색, upsert를 통한 번역 동기화 등 i18n 시스템 전반을 지원합니다.

## 엔티티

- **대상 Entity**: Translation (`@cocrepo/entity`)
- **Prisma 모델**: `translation`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findByKey(languageCode, key)` | LanguageCode, string | `Promise<Translation \| null>` | 언어+키 복합 고유값으로 단건 조회 |
| `findByCategory(languageCode, category)` | LanguageCode, string | `Promise<Translation[]>` | 언어+카테고리로 목록 조회 |
| `findMany(params)` | 필터 파라미터 | `Promise<{ data: Translation[], total: number }>` | 다중 필터 + 페이지네이션 조회 |
| `findById(id)` | string | `Promise<Translation \| null>` | ID로 단건 조회 |
| `create(data)` | Prisma.TranslationUncheckedCreateInput | `Promise<Translation>` | 단건 생성 |
| `updateById(id, data)` | string, Prisma.TranslationUncheckedUpdateInput | `Promise<Translation>` | ID로 수정 |
| `upsert(data)` | { languageCode, key, text, category, isTranslated } | `Promise<Translation>` | 언어+키 기준 upsert |
| `deleteById(id)` | string | `Promise<Translation>` | 물리 삭제 |
| `createMany(data)` | Prisma.TranslationCreateManyInput[] | `Promise<number>` | 다중 생성 (중복 스킵) |

## findMany 필터 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| languageCode | LanguageCode? | 언어 코드 필터 |
| category | string? | 카테고리 필터 |
| isTranslated | boolean? | 번역 완료 여부 필터 |
| key | string? | 키 부분 문자열 검색 (대소문자 무시) |
| page | number | 페이지 번호 (기본: 1) |
| limit | number | 페이지 크기 (기본: 20) |

## 쿼리 최적화

- `findByKey()`: 복합 unique 인덱스 `languageCode_key` 활용
- `findByCategory()`: `{ key: "asc" }` 키 정렬
- `findMany()`: 조건부 where 구성 + skip/take 페이지네이션
- `findMany()` 정렬: `{ languageCode: "asc" }, { key: "asc" }` 복합 정렬
- `key` 검색: Prisma `contains` + `mode: "insensitive"` 대소문자 무시 검색
- `upsert()`: `languageCode_key` unique 기준으로 create/update 결정

## 삭제 정책

- **물리 삭제**: `deleteById()` → `translation.delete()`
- 소프트 삭제 없음

## 구현 체크리스트

- [x] translations.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환
- [x] LanguageCode 타입 활용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
