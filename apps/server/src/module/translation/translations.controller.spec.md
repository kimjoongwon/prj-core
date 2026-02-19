# Translations Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/translation/translations.controller.ts`

## 역할

Translation(번역) 관련 CRUD 및 캐시 관리 API를 제공합니다. 다국어 지원을 위한 번역 데이터의 생성, 조회, 수정, 삭제와 Redis 캐시 무효화를 지원합니다. FULL_ACCESS 전용 API입니다.

## 베이스 경로

`/api/v1/translations`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | Query: `GetTranslationsDto` | `TranslationResponseDto[]` | 번역 목록 조회 (필터링, 페이지네이션) |
| GET | `/:id` | Param: `id` (CUID) | `TranslationResponseDto` | 번역 상세 조회 |
| POST | `/` | Body: `CreateTranslationDto` | `TranslationResponseDto` | 번역 생성 |
| PATCH | `/:id` | Param: `id` (CUID), Body: `UpdateTranslationDto` | `TranslationResponseDto` | 번역 수정 |
| DELETE | `/:id` | Param: `id` (CUID) | void (204) | 번역 삭제 |
| DELETE | `/cache` | - | void (204) | 전체 번역 캐시 무효화 |
| DELETE | `/cache/:languageCode` | Param: `languageCode` (string) | void (204) | 언어별 번역 캐시 무효화 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET `/` | O (`@ApiAuth()`) | FULL_ACCESS (설명에 명시) |
| GET `/:id` | O (`@ApiAuth()`) | FULL_ACCESS |
| POST `/` | O (`@ApiAuth()`) | FULL_ACCESS |
| PATCH `/:id` | O (`@ApiAuth()`) | FULL_ACCESS |
| DELETE `/:id` | O (`@ApiAuth()`) | FULL_ACCESS |
| DELETE `/cache` | O (`@ApiAuth()`) | FULL_ACCESS |
| DELETE `/cache/:languageCode` | O (`@ApiAuth()`) | FULL_ACCESS |

## 의존성

| 서비스 | 역할 |
|--------|------|
| `TranslationsFacade` | 번역 CRUD, 캐시 무효화 로직 (Service + Redis 조합) |

## 응답 메시지

| 엔드포인트 | 메시지 키 |
|------------|----------|
| GET `/` | `common.translation.list.success` |
| GET `/:id` | `common.translation.detail.success` |
| POST `/` | `common.translation.create.success` |
| PATCH `/:id` | `common.translation.update.success` |
| DELETE `/:id` | `common.translation.delete.success` |
| DELETE `/cache` | `common.translation.cache.invalidated` |
| DELETE `/cache/:languageCode` | `common.translation.cache.invalidated` |

## 에러 응답

| 엔드포인트 | 상태 코드 | 조건 |
|------------|----------|------|
| GET `/` | 500 | 서버 에러 |
| GET `/:id` | 404 (`TRANSLATION_ERRORS.NOT_FOUND`), 500 | 미존재/서버 에러 |
| POST `/` | 400 (`TRANSLATION_ERRORS.DUPLICATE_KEY`), 500 | 키 중복/서버 에러 |
| PATCH `/:id` | 404 (`TRANSLATION_ERRORS.NOT_FOUND`), 500 | 미존재/서버 에러 |
| DELETE `/:id` | 404 (`TRANSLATION_ERRORS.NOT_FOUND`), 500 | 미존재/서버 에러 |
| DELETE `/cache` | 500 | 서버 에러 |
| DELETE `/cache/:languageCode` | 500 | 서버 에러 |

## 특이사항

- Facade 패턴 사용 (`TranslationsFacade`): TranslationsService + RedisService 조합
- Translation ID는 UUID가 아닌 CUID 사용
- 에러 상수는 `TRANSLATION_ERRORS` (`@cocrepo/constant`)에서 관리
- DELETE 엔드포인트는 `HttpStatus.NO_CONTENT` (204) 반환
- 캐시 무효화: 전체 또는 언어별 선택적 무효화 가능
- `@Roles` Guard 미사용 (설명에 FULL_ACCESS 전용이라고 명시되어 있으나, 코드에는 Guard 미적용)
- API 태그: `TRANSLATIONS`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
