# app.module module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/app.module.ts

## 역할

이 파일은 module 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| AppModule | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/be-common | 기능 구현 의존성 |
| @cocrepo/service | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |
| @nestjs/devtools-integration | dev 전용 Nest dependency graph 시각화 |
| @nestjs/core | 기능 구현 의존성 |
| @nestjs/throttler | 기능 구현 의존성 |
| ./abilities | aggregate root module |
| ./actions | aggregate root module |
| ./assets | aggregate root module |
| ./categories | aggregate root module |
| ./folders | aggregate root module |
| ./global.module | 기능 구현 의존성 |
| ./grants | aggregate root module |
| ./groups | aggregate root module |
| ./inquiries | aggregate root module |
| ./roles | aggregate root module |
| ./routines | aggregate root module |
| ./spaces | aggregate root module |
| ./subjects | aggregate root module |
| ./tasks | aggregate root module |
| ./templates | aggregate root module |
| ./timelines | aggregate root module |
| ./users | aggregate root module |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함
- [ ] top-level route/module은 aggregate root plural 기준으로만 등록함
- [ ] child resource는 parent root nested route로만 노출함
- [ ] Nest Devtools는 `ENABLE_NEST_DEVTOOLS=true` 이고 non-production일 때만 HTTP를 노출함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Core API AppModule에 dev 전용 Nest Devtools 모듈 등록과 기본 포트 규약을 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | AppModule 의존성과 라우트 등록 기준을 aggregate root plural 구조로 갱신 | codex |
| 2026-03-13 | frontend 런타임 미사용 `translations` aggregate root module 등록을 제거 | codex |
| 2026-03-15 | admin assets 복구를 위해 `assets`/`folders` aggregate root module과 라우트를 추가 | codex |
