# _base.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/_base.prisma

## 역할

Prisma `generator`/`datasource`와 공통 기준 enum, 베이스 스키마 규약을 정의합니다.
도메인 스키마들이 공유하는 기본 설정과 타입 체계의 기준점 역할을 담당합니다.

## 운영 규칙

- `_base.prisma` 변경 시 `_base.prisma.spec.md`를 함께 갱신합니다.
- 공통 규칙 변경 시 하위 도메인 파일(`core/user/space/...`) 영향 범위를 명시합니다.
- `@schema-type`, `@description`, `/// @displayName` 표준 주석 규칙을 일관되게 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
