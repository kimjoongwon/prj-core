# translations.application-service 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-app/src/translations.application-service.ts

## 역할

번역 관리 유즈케이스를 조합하는 application service를 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| TranslationsApplicationService | 번역 CRUD 및 캐시 무효화 공개 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | Facade를 ApplicationService로 전환하고 책임을 재정의 | codex |
