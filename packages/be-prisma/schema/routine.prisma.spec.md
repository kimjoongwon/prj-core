# routine.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/routine.prisma

## 역할

Routine/Activity를 통해 루틴 실행 단위를 정의합니다.

## 운영 규칙

- `routine.prisma` 변경 시 `routine.prisma.spec.md`를 함께 갱신합니다.
- Task 및 Program 연계 브리지 무결성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 task.prisma에서 routine 도메인 분리 | codex |

