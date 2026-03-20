# e2e-idp-local script 기획서

> 생성일: 2026-03-20
> 타입: script
> 위치: scripts/e2e-idp-local.sh

## 역할

IDP 로컬 E2E를 one-shot으로 실행합니다.
Postgres/Redis 준비, Prisma schema push/seed, `idp-api` 기동, Playwright 실행까지 한 번에 묶습니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 실행 | `pnpm test:e2e:idp:local` |
| Playwright 프로젝트 | 기본 `idp-chromium`, `E2E_PLAYWRIGHT_PROJECT=idp-mobile` 로 변경 가능 |
| env 파일 우선순위 | `apps/idp/api/.env.local` → `apps/idp/api/.env` |
| Postgres 준비 | `DATABASE_URL`이 `localhost/127.0.0.1`를 가리키면 `prj-core-e2e-postgres` 컨테이너를 자동 생성/재사용 |
| Redis 준비 | `REDIS_HOST`가 `localhost/127.0.0.1`를 가리키면 `prj-core-e2e-redis` 컨테이너를 자동 생성/재사용 |
| DB bootstrap | 기본적으로 `pnpm --filter=@cocrepo/prisma db:push` + `db:seed` 실행 |
| API 준비 | 기본적으로 `@cocrepo/service`와 `idp-api`를 빌드한 뒤 `idp-api start:dev`를 백그라운드로 기동 |
| 실패 로그 | `IDP_API_LOG_FILE` 기본값 `/tmp/idp-api-e2e.log` |
| 건너뛰기 옵션 | `E2E_SKIP_BUILD=1`, `E2E_SKIP_DB_BOOTSTRAP=1` 지원 |

## 구현 체크리스트

- [x] `.env.local`과 `.env`를 모두 지원
- [x] 외부 DB/Redis 호스트를 사용하는 경우 컨테이너 관리를 건너뜀
- [x] 로컬 포트가 이미 열려 있으면 기존 서비스를 재사용
- [x] Playwright 브라우저가 없으면 자동 설치
- [x] 테스트 종료 시 스크립트가 시작한 `idp-api` 프로세스만 정리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-20 | IDP 로컬 E2E one-shot 실행 스크립트 신규 추가 | codex |
