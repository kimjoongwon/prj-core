#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/apps/idp/api/.env"
PLAYWRIGHT_PROJECT="${E2E_PLAYWRIGHT_PROJECT:-idp-chromium}"
IDP_API_LOG_FILE="${IDP_API_LOG_FILE:-/tmp/idp-api-e2e.log}"
POSTGRES_CONTAINER_NAME="${E2E_POSTGRES_CONTAINER_NAME:-prj-core-e2e-postgres}"
REDIS_CONTAINER_NAME="${E2E_REDIS_CONTAINER_NAME:-prj-core-e2e-redis}"
IDP_API_STARTED_BY_SCRIPT=0
IDP_API_PID=""
CONTAINER_CLI_RESOLVED=""

BOLD='\033[1m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
DIM='\033[2m'
RESET='\033[0m'

log() {
  echo -e "${GREEN}$*${RESET}"
}

warn() {
  echo -e "${YELLOW}$*${RESET}"
}

error() {
  echo -e "${RED}$*${RESET}" >&2
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    error "필수 명령어가 없습니다: $1"
    exit 1
  fi
}

resolve_container_cli() {
  if [[ -n "$CONTAINER_CLI_RESOLVED" ]]; then
    echo "$CONTAINER_CLI_RESOLVED"
    return
  fi

  if [[ -n "${CONTAINER_CLI:-}" ]]; then
    if command -v "$CONTAINER_CLI" >/dev/null 2>&1 && "$CONTAINER_CLI" info >/dev/null 2>&1; then
      CONTAINER_CLI_RESOLVED="$CONTAINER_CLI"
      echo "$CONTAINER_CLI_RESOLVED"
      return
    fi

    error "CONTAINER_CLI=$CONTAINER_CLI 에 연결할 수 없습니다."
    exit 1
  fi

  for candidate in docker nerdctl; do
    if command -v "$candidate" >/dev/null 2>&1 && "$candidate" info >/dev/null 2>&1; then
      CONTAINER_CLI_RESOLVED="$candidate"
      echo "$CONTAINER_CLI_RESOLVED"
      return
    fi
  done

  error "사용 가능한 container CLI(docker/nerdctl)를 찾지 못했습니다."
  exit 1
}

port_in_use() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

get_listener_pid() {
  local port="$1"
  lsof -t -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -n 1
}

ensure_not_kubectl_port_forward() {
  local port="$1"
  local label="$2"
  local pid=""
  local command_line=""

  pid="$(get_listener_pid "$port")"
  if [[ -z "$pid" ]]; then
    return
  fi

  command_line="$(ps -p "$pid" -o command= 2>/dev/null || true)"
  if [[ "$command_line" == *"kubectl port-forward"* ]]; then
    error "$label 포트 $port 를 kubectl port-forward 가 점유하고 있습니다."
    error "로컬 E2E는 원격 포워딩이 아니라 로컬 개발용 ${label}을 사용해야 합니다."
    error "port-forward 를 종료하거나 다른 포트로 바꾼 뒤 다시 실행하세요."
    exit 1
  fi
}

wait_for_tcp() {
  local host="$1"
  local port="$2"
  local label="$3"
  local attempt=0

  while [[ "$attempt" -lt 60 ]]; do
    if nc -z "$host" "$port" >/dev/null 2>&1; then
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 1
  done

  error "$label 연결 대기 중 타임아웃이 발생했습니다. ($host:$port)"
  return 1
}

wait_for_http() {
  local url="$1"
  local label="$2"
  local attempt=0

  while [[ "$attempt" -lt 120 ]]; do
    if curl --silent --fail --output /dev/null "$url"; then
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 1
  done

  error "$label 준비 대기 중 타임아웃이 발생했습니다. ($url)"
  return 1
}

container_exists() {
  local cli="$1"
  local name="$2"
  "$cli" ps -a --format '{{.Names}}' | grep -Fx "$name" >/dev/null 2>&1
}

is_local_host() {
  local host="$1"
  [[ "$host" == "localhost" || "$host" == "127.0.0.1" ]]
}

load_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    error "IDP API env 파일을 찾지 못했습니다. apps/idp/api/.env 가 필요합니다."
    exit 1
  fi

  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a

  APP_PORT="${APP_PORT:-3007}"
  API_PREFIX="${API_PREFIX:-api}"
  REDIS_HOST="${REDIS_HOST:-localhost}"
  REDIS_PORT="${REDIS_PORT:-6379}"
}

parse_database_url() {
  local db_meta

  db_meta="$(DATABASE_URL="$DATABASE_URL" node <<'NODE'
const url = new URL(process.env.DATABASE_URL);
const fields = [
  url.hostname || "localhost",
  url.port || "5432",
  url.pathname.replace(/^\//, "") || "postgres",
  decodeURIComponent(url.username || ""),
  decodeURIComponent(url.password || ""),
];
process.stdout.write(fields.join("\t"));
NODE
)"

  IFS=$'\t' read -r DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD <<< "$db_meta"
}

validate_local_targets() {
  if ! is_local_host "$DB_HOST"; then
    error "로컬 E2E 스크립트는 원격 DB를 허용하지 않습니다. 현재 DATABASE_URL 호스트: $DB_HOST"
    error "apps/idp/api/.env 를 localhost/127.0.0.1 대상으로 맞춘 뒤 다시 실행하세요."
    exit 1
  fi

  if ! is_local_host "$REDIS_HOST"; then
    error "로컬 E2E 스크립트는 원격 Redis를 허용하지 않습니다. 현재 REDIS_HOST: $REDIS_HOST"
    error "apps/idp/api/.env 를 localhost/127.0.0.1 대상으로 맞춘 뒤 다시 실행하세요."
    exit 1
  fi
}

ensure_postgres() {
  if port_in_use "$DB_PORT"; then
    ensure_not_kubectl_port_forward "$DB_PORT" "Postgres"
    log "Postgres 포트 $DB_PORT 가 이미 열려 있습니다. 기존 서비스를 사용합니다."
    return
  fi

  local cli
  cli="$(resolve_container_cli)"

  if container_exists "$cli" "$POSTGRES_CONTAINER_NAME"; then
    log "Postgres 컨테이너를 시작합니다. ($POSTGRES_CONTAINER_NAME)"
    "$cli" start "$POSTGRES_CONTAINER_NAME" >/dev/null
  else
    log "Postgres 컨테이너를 생성합니다. ($POSTGRES_CONTAINER_NAME)"
    "$cli" run -d \
      --name "$POSTGRES_CONTAINER_NAME" \
      -e POSTGRES_DB="$DB_NAME" \
      -e POSTGRES_USER="$DB_USER" \
      -e POSTGRES_PASSWORD="$DB_PASSWORD" \
      -p "${DB_PORT}:5432" \
      postgres:16-alpine >/dev/null
  fi

  wait_for_tcp "$DB_HOST" "$DB_PORT" "Postgres"
}

ensure_redis() {
  if port_in_use "$REDIS_PORT"; then
    ensure_not_kubectl_port_forward "$REDIS_PORT" "Redis"
    log "Redis 포트 $REDIS_PORT 가 이미 열려 있습니다. 기존 서비스를 사용합니다."
    return
  fi

  local cli
  cli="$(resolve_container_cli)"

  if container_exists "$cli" "$REDIS_CONTAINER_NAME"; then
    log "Redis 컨테이너를 시작합니다. ($REDIS_CONTAINER_NAME)"
    "$cli" start "$REDIS_CONTAINER_NAME" >/dev/null
  else
    log "Redis 컨테이너를 생성합니다. ($REDIS_CONTAINER_NAME)"
    "$cli" run -d \
      --name "$REDIS_CONTAINER_NAME" \
      -p "${REDIS_PORT}:6379" \
      redis:7-alpine >/dev/null
  fi

  wait_for_tcp "$REDIS_HOST" "$REDIS_PORT" "Redis"
}

ensure_playwright_browsers() {
  log "Playwright 브라우저를 보장합니다."
  (
    cd "$ROOT_DIR"
    pnpm --filter=test-e2e ensure:browsers
  )
}

bootstrap_database() {
  if [[ "${E2E_SKIP_DB_BOOTSTRAP:-0}" == "1" ]]; then
    warn "E2E_SKIP_DB_BOOTSTRAP=1 이라서 Prisma push/seed 를 건너뜁니다."
    return
  fi

  log "Prisma schema push 를 실행합니다."
  (
    cd "$ROOT_DIR"
    pnpm --filter=@cocrepo/prisma db:push
  )

  log "Prisma seed 를 실행합니다."
  (
    cd "$ROOT_DIR"
    pnpm --filter=@cocrepo/prisma db:seed
  )
}

build_runtime_dependencies() {
  if [[ "${E2E_SKIP_BUILD:-0}" == "1" ]]; then
    warn "E2E_SKIP_BUILD=1 이라서 런타임 빌드를 건너뜁니다."
    return
  fi

  log "@cocrepo/service 를 빌드합니다."
  (
    cd "$ROOT_DIR"
    pnpm --filter=@cocrepo/service build
  )

  log "idp-api 를 빌드합니다."
  (
    cd "$ROOT_DIR"
    pnpm --filter=idp-api build
  )
}

start_idp_api() {
  if port_in_use "$APP_PORT"; then
    log "IDP API 포트 $APP_PORT 가 이미 열려 있습니다. 기존 서버를 사용합니다."
    return
  fi

  log "IDP API 개발 서버를 시작합니다. 로그: $IDP_API_LOG_FILE"
  (
    cd "$ROOT_DIR"
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
    pnpm --filter=idp-api start:dev
  ) >"$IDP_API_LOG_FILE" 2>&1 &

  IDP_API_PID=$!
  IDP_API_STARTED_BY_SCRIPT=1

  if ! wait_for_http "http://localhost:${APP_PORT}/${API_PREFIX}/password-policy" "IDP API"; then
    tail -n 80 "$IDP_API_LOG_FILE" >&2 || true
    exit 1
  fi
}

cleanup() {
  local status=$?

  if [[ "$IDP_API_STARTED_BY_SCRIPT" == "1" ]] && [[ -n "$IDP_API_PID" ]]; then
    warn "IDP API 개발 서버를 종료합니다."
    kill "$IDP_API_PID" >/dev/null 2>&1 || true
    wait "$IDP_API_PID" >/dev/null 2>&1 || true
  fi

  if [[ "$status" -ne 0 ]]; then
    warn "실패 로그: $IDP_API_LOG_FILE"
  fi
}

trap cleanup EXIT

main() {
  require_command pnpm
  require_command node
  require_command curl
  require_command lsof
  require_command nc

  load_env
  parse_database_url
  validate_local_targets

  echo ""
  echo -e "${BOLD}IDP 로컬 E2E 실행${RESET}"
  echo -e "  ${DIM}env 파일:${RESET} $ENV_FILE"
  echo -e "  ${DIM}Playwright 프로젝트:${RESET} $PLAYWRIGHT_PROJECT"
  echo ""

  ensure_postgres
  ensure_redis
  ensure_playwright_browsers
  build_runtime_dependencies
  bootstrap_database
  start_idp_api

  log "IDP E2E 테스트를 실행합니다."
  (
    cd "$ROOT_DIR"
    pnpm --filter=test-e2e exec playwright test --project="$PLAYWRIGHT_PROJECT" "$@"
  )
}

main "$@"
