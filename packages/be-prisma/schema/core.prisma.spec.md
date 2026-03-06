# core.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/core.prisma

## 역할

Category/Group/Tenant/Assignment 등 공통 코어 도메인 모델을 정의합니다.
다른 도메인이 참조하는 분류/연결의 기반 스키마 역할을 담당합니다.

## 운영 규칙

- `core.prisma` 변경 시 `core.prisma.spec.md`를 함께 갱신합니다.
- 공통 모델 변경은 연계 도메인(space/user/grant 등) 영향 범위를 함께 기록합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

