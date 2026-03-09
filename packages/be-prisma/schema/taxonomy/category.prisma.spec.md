# category.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/taxonomy/category.prisma

## 역할

카테고리 분류 체계(`Category`)와 카테고리 유형 enum(`CategoryTypes`)을 정의합니다.
트리 구조(parent/children)와 Classification 관계의 기준 엔티티를 제공합니다.

## 운영 규칙

- `category.prisma` 변경 시 `category.prisma.spec.md`를 함께 갱신합니다.
- Category 트리/분류 무결성 규칙을 유지합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | taxonomy.prisma에서 Category/CategoryTypes를 분리하여 Aggregate Root 단위로 정렬 | codex |
