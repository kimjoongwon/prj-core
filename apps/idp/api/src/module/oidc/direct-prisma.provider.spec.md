# direct-prisma.provider util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: apps/idp/api/src/module/oidc/direct-prisma.provider.ts

## 역할

OIDC 인증 흐름에서 CLS/RLS 프록시를 우회하는 별도 PrismaClient를 생성하고,
첫 사용 시점에 연결을 즉시 검증하는 인프라 provider입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| DirectPrismaProvider | 공개 계약 요소 |

## 비즈니스 규칙

- `DIRECT_URL` 우선, 없으면 `DATABASE_URL`을 사용한다.
- Direct Prisma client 생성 직후 `$connect()`를 호출해 잘못된 DB 포트를 첫 요청에서 늦게 발견하지 않도록 한다.
- 연결 실패 시 생성 중이던 pool/client를 정리하고 예외를 다시 던진다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Direct Prisma client를 생성 즉시 연결 검증하고 실패 시 pool/client 정리를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
