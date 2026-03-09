# group.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/group.prisma

## 역할

그룹핑 체계 엔티티(`Group`)와 그룹 유형 enum(`GroupTypes`)을 정의합니다.
Association 관계에서 공통으로 참조하는 그룹 기준 엔티티를 제공합니다.

## 운영 규칙

- `group.prisma` 변경 시 `group.prisma.spec.md`를 함께 갱신합니다.
- Group 분류/연관 무결성 규칙을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | taxonomy.prisma에서 Group/GroupTypes를 분리하여 Aggregate Root 단위로 정렬 | codex |
