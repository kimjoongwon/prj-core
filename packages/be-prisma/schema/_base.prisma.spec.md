# _base.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/_base.prisma

## 역할

Prisma `generator`/`datasource`와 도메인 스키마가 공유하는 모델 분류 메타데이터 규칙을 정의합니다.
도메인 스키마들이 `@aggregate-root: true`, `@schema-type`와 보조 태그를 일관되게 사용할 수 있는 기준점 역할을 담당합니다.

## 운영 규칙

- `_base.prisma` 변경 시 `_base.prisma.spec.md`를 함께 갱신합니다.
- 공통 규칙 변경 시 하위 도메인 폴더(`access-control/`, `identity/`, `asset/` 등) 영향 범위를 명시합니다.
- `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName` 메타데이터 규칙을 일관되게 유지합니다.
- 각 schema 파일은 `_base.prisma`를 제외하고 대표 소유 모델 1개에만 `@aggregate-root: true`를 가져야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 도메인 폴더 구조와 `@aggregate-root: true` 운영 규칙을 `_base.prisma` 기준 문서에 반영 | codex |
| 2026-03-10 | `@join-role` 선택 기준과 대표 예시를 `_base.prisma` 공통 문서에 보강 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
