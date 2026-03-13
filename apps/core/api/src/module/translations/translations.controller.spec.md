# Translations Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/translations/translations.controller.ts`

## 역할

Translation CRUD 및 캐시 무효화 API를 노출하며, 컨트롤러 경계의 요청 해석과 응답 조립은 `TranslationFacade`에 위임합니다. FULL_ACCESS 전용 API입니다.

## 베이스 경로

`/api/v1/translations`

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| translationFacade | TranslationFacade | 번역 CRUD 및 캐시 무효화 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | 설명 |
|--------|------|------|
| GET | `/` | 번역 목록 조회 (필터링, 페이지네이션) |
| GET | `/:id` | 번역 상세 조회 |
| POST | `/` | 번역 생성 |
| PATCH | `/:id` | 번역 수정 |
| DELETE | `/:id` | 번역 삭제 |
| DELETE | `/cache` | 전체 번역 캐시 무효화 |
| DELETE | `/cache/:languageCode` | 언어별 번역 캐시 무효화 |

## 비즈니스 메모

- 번역 변경과 캐시 무효화 orchestration은 Facade가 담당하고, 실제 번역 규칙은 내부 `TranslationService`가 담당합니다.
- Translation ID는 CUID를 사용하며 DELETE 엔드포인트는 `204 No Content`를 반환합니다.
- `@Roles` Guard는 없지만 컨트롤러 설명상 FULL_ACCESS 전용 정책을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 TranslationService로 전환 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `TranslationFacade` 기준으로 갱신 | codex |
