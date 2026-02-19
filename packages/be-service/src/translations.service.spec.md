# Translations Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/translations.service.ts

## 역할

다국어 번역 데이터(Translation)의 CRUD 및 Redis 캐시 무효화를 관리합니다.
관리자가 번역을 수정하면 해당 언어의 Redis 캐시를 자동으로 무효화합니다.
Upsert 기능으로 번역 동기화를 지원합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `TranslationsRepository` | 번역 CRUD |
| `RedisService` | 번역 캐시 무효화 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getTranslations` | `query: GetTranslationsDto` | `Promise<{data, total, page, limit, totalPages}>` | 번역 목록 조회 (필터링 + 페이지네이션) |
| `getTranslationById` | `id: string` | `Promise<Translation>` | ID로 번역 조회 |
| `getTranslationByKey` | `languageCode, key` | `Promise<Translation \| null>` | 언어 코드와 키로 번역 조회 |
| `createTranslation` | `data: CreateTranslationDto` | `Promise<Translation>` | 번역 생성 + 캐시 무효화 |
| `updateTranslation` | `id, data: UpdateTranslationDto` | `Promise<Translation>` | 번역 수정 + 캐시 무효화 |
| `deleteTranslation` | `id: string` | `Promise<Translation>` | 번역 삭제 + 캐시 무효화 |
| `upsertTranslation` | `data: CreateTranslationDto` | `Promise<Translation>` | 번역 Upsert + 캐시 무효화 |
| `invalidateCache` | `languageCode?: LanguageCode` | `Promise<void>` | Redis 캐시 무효화 |

## 비즈니스 규칙

- **unique 제약**: (languageCode, key) 복합 unique
- **캐시 무효화**: CUD 작업 시 해당 언어의 `i18n:{languageCode}:*` 패턴 삭제
- `languageCode` 없이 `invalidateCache()` 호출 시 `i18n:*` 전체 삭제
- `createTranslation`, `updateTranslation`, `deleteTranslation`: `@Transactional()` 적용

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 번역 없음 | `NotFoundException` | `TRANSLATION_ERRORS.NOT_FOUND` |
| 키 중복 | `BadRequestException` | `TRANSLATION_ERRORS.DUPLICATE_KEY` |

## 권한 요구사항

- 조회: 인증된 사용자
- CUD: FULL_ACCESS 역할 필요 (Controller 레이어에서 처리)

## 구현 체크리스트

- [x] translations.service.ts
- [x] `@Injectable()` 데코레이터
- [x] `@Transactional()` (create, update, delete, upsert)
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
