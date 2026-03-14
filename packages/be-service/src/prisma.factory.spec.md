# prisma.factory util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-service/src/prisma.factory.ts

## 역할

ConfigService에서 읽은 `DATABASE_URL`로 Prisma PostgreSQL Adapter 기반 클라이언트를 생성하고,
애플리케이션 부팅 단계에서 즉시 DB 연결을 검증하는 팩토리입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| createPrismaClient | 공개 계약 요소 |

## 비즈니스 규칙

- `DATABASE_URL`이 없으면 즉시 예외를 던진다.
- Prisma client를 생성한 뒤 `$connect()`로 연결 가능 여부를 부팅 단계에서 확인한다.
- 연결 대상 host:port를 로그에 남겨 로컬 환경 포트 불일치를 빠르게 진단한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Prisma client를 lazy 실패 대신 fail-fast 연결 검증으로 전환하고 연결 대상 로그를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
