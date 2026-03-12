# Templates Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/templates/templates.module.ts

## 역할

`TemplatesController`가 Service와 Template service/repository 조합을 주입받을 수 있도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| TemplatesService | Controller 진입용 Template 유즈케이스 |
| TemplatesService | Template 도메인 서비스 |
| TemplatesRepository | Template 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| TemplatesService | 다른 모듈이 참조할 수 있는 Template application 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | TemplatesModule export를 TemplatesService 기준으로 정렬 | codex |
