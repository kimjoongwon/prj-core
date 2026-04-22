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
| env 파일 | `apps/idp/api/.env` |
| 안전 장치 | `DATABASE_URL`, `REDIS_HOST`가 `localhost/127.0.0.1`가 아니면 즉시 실패 |
| 포트 충돌 방지 | `kubectl port-forward`가 DB/Redis 포트를 점유 중이면 로컬 서비스로 오인하지 않고 즉시 실패 |
| Postgres 준비 | 로컬 DB일 때만 `prj-core-e2e-postgres` 컨테이너를 자동 생성/재사용 |
| Redis 준비 | 로컬 Redis일 때만 `prj-core-e2e-redis` 컨테이너를 자동 생성/재사용 |
| Browser 준비 | `pnpm --filter=test-e2e ensure:browsers`로 user-level Playwright browser cache를 보장 |
| DB bootstrap | 기본적으로 `pnpm --filter=@cocrepo/prisma db:push` + `db:seed` 실행 |
| API 준비 | 기본적으로 `@cocrepo/service`와 `idp-api`를 빌드한 뒤 `idp-api start:dev`를 백그라운드로 기동 |
| 실패 로그 | `IDP_API_LOG_FILE` 기본값 `/tmp/idp-api-e2e.log` |
| 건너뛰기 옵션 | `E2E_SKIP_BUILD=1`, `E2E_SKIP_DB_BOOTSTRAP=1` 지원 |

## 구현 체크리스트

- [x] `apps/idp/api/.env`만 사용
- [x] 외부 DB/Redis 호스트를 사용하는 경우 즉시 실패
- [x] 로컬 포트가 이미 열려 있으면 기존 서비스를 재사용
- [x] `kubectl port-forward`가 로컬 포트를 점유하면 안전하게 중단
- [x] Playwright 브라우저가 없으면 자동 설치
- [x] 테스트 종료 시 스크립트가 시작한 `idp-api` 프로세스만 정리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | repo-local browsers 디렉터리 대신 `test-e2e ensure:browsers`를 호출해 user-level browser cache를 보장하도록 변경 | codex |
| 2026-04-13 | `kubectl port-forward`가 DB/Redis 포트를 점유한 경우 로컬 개발 서비스로 오인하지 않도록 안전 장치를 추가 | codex |
| 2026-03-20 | IDP 로컬 E2E one-shot 실행 스크립트 신규 추가 | codex |
