# taxonomy.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/taxonomy.prisma

## 역할

분류/그룹 공통 도메인(Category, Group)과 관련 enum을 정의합니다.
다른 도메인의 Classification/Association 모델이 참조하는 기준 체계를 제공합니다.

## 운영 규칙

- `taxonomy.prisma` 변경 시 `taxonomy.prisma.spec.md`를 함께 갱신합니다.
- Category/Group 무결성 규칙(트리 구조, type 분류)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 core.prisma에서 taxonomy 도메인 분리 | codex |

