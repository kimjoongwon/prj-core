# Translations Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/translations/translations.module.ts

## 역할

`TranslationsController`가 `TranslationFacade`를 주입받도록 facade/service/repository provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| TranslationFacade | Controller boundary 유즈케이스 및 캐시 무효화 응답 조립 |
| TranslationService | 번역 도메인 규칙 및 캐시 무효화 처리 |
| Translation repository provider | 번역 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| TranslationFacade | 다른 모듈이 참조할 수 있는 Translation boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | TranslationsModule export를 TranslationService 단일 진입점으로 정렬 | codex |
| 2026-03-13 | TranslationsModule boundary provider/export를 `TranslationFacade` 기준으로 갱신 | codex |
