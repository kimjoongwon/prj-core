# timeline.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/timeline.prisma

## 역할

Timeline/Session/Program과 세션 enum을 포함한 일정 실행 도메인을 정의합니다.

## 운영 규칙

- `timeline.prisma` 변경 시 `timeline.prisma.spec.md`를 함께 갱신합니다.
- Session enum과 Session 모델 필드의 일관성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 task.prisma에서 timeline 도메인 분리 | codex |

