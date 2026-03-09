# subject.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/subject.prisma

## 역할

권한 대상 Subject 카탈로그를 정의합니다.

## 운영 규칙

- `subject.prisma` 변경 시 `subject.prisma.spec.md`를 함께 갱신합니다.
- Ability 참조 무결성 및 시스템/커스텀 구분 규칙을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 grant.prisma에서 Subject 도메인 분리 | codex |

