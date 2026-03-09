# action.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/action.prisma

## 역할

권한 행위 Action 카탈로그와 설정(config)을 정의합니다.

## 운영 규칙

- `action.prisma` 변경 시 `action.prisma.spec.md`를 함께 갱신합니다.
- Action config 구조 변경 시 권한 해석 로직 영향 범위를 명시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 grant.prisma에서 Action 도메인 분리 | codex |

