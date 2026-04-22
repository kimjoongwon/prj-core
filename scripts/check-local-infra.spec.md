# check-local-infra 기획서

> 생성일: 2026-04-22
> 타입: script
> 위치: scripts/check-local-infra.mjs

## 역할

`pnpm start`에서 백엔드(`core-api`, `idp-api`)를 띄우기 전에 로컬 PostgreSQL과 Redis 접근 가능 여부를 선검증하는 preflight 스크립트입니다.
서비스별 `.env`를 직접 파싱해 `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT`를 계산하고, 대상 호스트가 `localhost/127.0.0.1/::1`일 때만 TCP 연결 여부를 확인합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 실행 형태 | `node scripts/check-local-infra.mjs core-api idp-api` |
| 지원 대상 | `core-api`, `idp-api` |
| env 우선순위 | 현재 프로세스 환경 변수 > 서비스별 `.env` 파일 |
| PostgreSQL 판별 | `DATABASE_URL`의 host/port를 읽어 로컬 호스트일 때만 확인 |
| Redis 판별 | `REDIS_HOST`, `REDIS_PORT`를 읽어 로컬 호스트일 때만 확인 |
| remote host 처리 | 원격 호스트면 실패시키지 않고 local preflight를 skip |
| 실패 동작 | 로컬 PostgreSQL/Redis 포트에 연결되지 않으면 명확한 오류 메시지 후 종료 코드 `1` 반환 |
| 우회 방법 | `START_SKIP_INFRA_CHECK=1`이면 전체 preflight를 생략 |

## 구현 체크리스트

- [x] `.env`를 shell `source` 없이 안전하게 파싱
- [x] `core-api`, `idp-api` 중 실제 선택된 서비스만 검사
- [x] 동일 host/port 조합은 한 번만 검사
- [x] remote host 대상은 skip
- [x] `START_SKIP_INFRA_CHECK` 우회 지원

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | `pnpm start`용 로컬 PostgreSQL/Redis preflight 스크립트를 추가하고 service별 `.env` 기반 host/port 해석과 local host TCP 검증 규칙을 정의 | codex |
