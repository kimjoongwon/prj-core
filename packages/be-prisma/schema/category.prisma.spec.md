# category.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/category.prisma

## 역할

카테고리 분류 체계(`Category`)와 카테고리 유형 enum(`CategoryTypes`)을 정의합니다.
트리 구조(parent/children)와 Classification 관계의 기준 엔티티를 제공합니다.

## 운영 규칙

- `category.prisma` 변경 시 `category.prisma.spec.md`를 함께 갱신합니다.
- Category 트리/분류 무결성 규칙을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | taxonomy.prisma에서 Category/CategoryTypes를 분리하여 Aggregate Root 단위로 정렬 | codex |
