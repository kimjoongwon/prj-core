# setNestApp util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/setNestApp.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| setNestApp | `I18nTranslationService`를 global filter/interceptor에 연결하는 앱 초기화 유틸 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-13 | 전역 i18n 번역기 주입 대상을 `I18nTranslationService`로 명시 | codex |
