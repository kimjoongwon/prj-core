# abilities.module module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/core/api/src/module/abilities/abilities.module.ts

## 역할

이 파일은 module 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| AbilitiesModule | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/service | Ability application service 의존성 |
| @cocrepo/repository | 기능 구현 의존성 |
| @cocrepo/service | 기능 구현 의존성 |
| nestjs-cls | 현재 요청 컨텍스트 조회 |
| @nestjs/common | 기능 구현 의존성 |
| ./abilities.controller | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | AbilityService가 RoleGrantsRepository/UserGrantsRepository를 주입받도록 provider 구성을 분리 | codex |
| 2026-04-05 | `getMyAbilities` 복구를 위해 AbilityApplicationService가 CLS 기반 사용자/Space 컨텍스트를 다시 사용하도록 정리 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | AbilitiesModule export를 AbilityService 기준으로 정렬 | codex |
| 2026-03-13 | `getMyAbilities` 제거에 맞춰 User/Auth 관련 미사용 provider를 정리 | codex |
