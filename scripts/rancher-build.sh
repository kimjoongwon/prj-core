#!/bin/bash

set -euo pipefail

BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
DIM='\033[2m'
RESET='\033[0m'

CONTAINER_CLI="${CONTAINER_CLI:-}"
RANCHER_DESKTOP_DOCKER_SOCK="${HOME}/.rd/docker.sock"

probe_container_cli() {
  local cli="$1"
  local cli_name

  cli_name="$(basename "$cli")"

  if [[ "$cli_name" == "docker" ]]; then
    if "$cli" info >/dev/null 2>&1; then
      return 0
    fi

    if [[ -S "$RANCHER_DESKTOP_DOCKER_SOCK" ]] && DOCKER_HOST="unix://${RANCHER_DESKTOP_DOCKER_SOCK}" "$cli" info >/dev/null 2>&1; then
      export DOCKER_HOST="unix://${RANCHER_DESKTOP_DOCKER_SOCK}"
      return 0
    fi

    return 1
  fi

  "$cli" info >/dev/null 2>&1
}

if [[ -z "$CONTAINER_CLI" ]]; then
  for candidate in \
    "docker" \
    "nerdctl" \
    "/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/bin/docker" \
    "/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/bin/nerdctl"
  do
    if ! command -v "$candidate" >/dev/null 2>&1; then
      continue
    fi

    if probe_container_cli "$candidate"; then
      CONTAINER_CLI="$candidate"
      break
    fi
  done

  if [[ -z "$CONTAINER_CLI" ]]; then
    echo -e "${YELLOW}사용 가능한 docker/nerdctl 데몬에 연결할 수 없습니다.${RESET}"
    echo "Rancher Desktop 또는 Docker Desktop이 실행 중인지 확인해주세요."
    exit 1
  fi
else
  if ! command -v "$CONTAINER_CLI" >/dev/null 2>&1; then
    echo -e "${YELLOW}${CONTAINER_CLI} 명령어를 찾을 수 없습니다.${RESET}"
    exit 1
  fi

  if ! probe_container_cli "$CONTAINER_CLI"; then
    echo -e "${YELLOW}${CONTAINER_CLI} 데몬 연결에 실패했습니다.${RESET}"
    echo "필요하면 CONTAINER_CLI=nerdctl 또는 Rancher Desktop 실행 상태를 확인해주세요."
    exit 1
  fi
fi

HAS_CURL="false"
if command -v curl >/dev/null 2>&1; then
  HAS_CURL="true"
fi

DEFAULT_TAG="local-$(date +%Y%m%d%H%M%S)"
ENV_NAME="${ENV_NAME:-stg}"
REGISTRY="${REGISTRY:-${IMAGE_REGISTRY:-${HARBOR_REGISTRY:-harbor.cocdev.co.kr}}}"
TAG="${TAG:-${IMAGE_TAG:-$DEFAULT_TAG}}"
CACHE_TAG="${CACHE_TAG:-buildcache}"

RUN_CHECK="${RUN_CHECK:-true}"
RUN_CHECK_TIMEOUT_SECONDS="${RUN_CHECK_TIMEOUT_SECONDS:-120}"
RUN_CHECK_INTERVAL_SECONDS="${RUN_CHECK_INTERVAL_SECONDS:-2}"

PUSH="${PUSH:-false}"
PUSH_CACHE_TAG="${PUSH_CACHE_TAG:-true}"
PUSH_COMPRESSION_FORMAT="${PUSH_COMPRESSION_FORMAT:-gzip}"
PUSH_COMPRESSION_LEVEL="${PUSH_COMPRESSION_LEVEL:-9}"
TLS_VERIFY="${TLS_VERIFY:-true}"

PULL_CACHE="${PULL_CACHE:-true}"

CLEANUP="${CLEANUP:-true}"
PRUNE_DANGLING_IMAGES="${PRUNE_DANGLING_IMAGES:-true}"
LOG_RETENTION_DAYS="${LOG_RETENTION_DAYS:-7}"

RUN_ID="$(date +%Y%m%d-%H%M%S)"
LOG_ROOT="${LOG_ROOT:-${CONTAINER_BUILD_LOG_DIR:-${RANCHER_BUILD_LOG_DIR:-./.tmp/container-build-logs}}}"
LOG_DIR="${LOG_DIR:-${LOG_ROOT}/${RUN_ID}}"
mkdir -p "$LOG_DIR"

ARGS=()
for arg in "$@"; do
  [[ "$arg" != "--" ]] && ARGS+=("$arg")
done

SELECTED_TARGETS=()
LOG_FILES=()
RUN_LOG_FILES=()
PUSH_LOG_FILES=()
CHECK_CONTAINERS=()
CLEANUP_DONE="false"
PUSH_COMPLETED="false"

is_true() {
  case "$1" in
    1|true|TRUE|True|yes|YES|Yes|on|ON|On) return 0 ;;
    *) return 1 ;;
  esac
}

add_target() {
  local value="$1"
  local existing

  for existing in "${SELECTED_TARGETS[@]-}"; do
    if [[ "$existing" == "$value" ]]; then
      return
    fi
  done

  SELECTED_TARGETS+=("$value")
}

resolve_target() {
  local value="$1"
  case "$value" in
    1|core-api) echo "core-api" ;;
    2|admin-web) echo "admin-web" ;;
    3|proposal-web) echo "proposal-web" ;;
    4|idp-api) echo "idp-api" ;;
    5|idp-web) echo "idp-web" ;;
    *) return 1 ;;
  esac
}

get_dockerfile() {
  local target="$1"
  case "$target" in
    core-api) echo "devops/Dockerfile.core-api" ;;
    admin-web) echo "devops/Dockerfile.admin-web" ;;
    proposal-web) echo "devops/Dockerfile.proposal-web" ;;
    idp-api) echo "devops/Dockerfile.idp-api" ;;
    idp-web) echo "devops/Dockerfile.idp-web" ;;
    *) return 1 ;;
  esac
}

get_image_name() {
  local target="$1"
  case "$target" in
    core-api) echo "core-api" ;;
    admin-web) echo "admin-web" ;;
    proposal-web) echo "proposal-web" ;;
    idp-api) echo "idp-api" ;;
    idp-web) echo "idp-web" ;;
    *) return 1 ;;
  esac
}

get_health_port() {
  local target="$1"
  case "$target" in
    core-api) echo "3006" ;;
    admin-web) echo "3000" ;;
    proposal-web) echo "3011" ;;
    idp-api) echo "3007" ;;
    idp-web) echo "3008" ;;
    *) return 1 ;;
  esac
}

get_health_path() {
  local target="$1"
  case "$target" in
    core-api) echo "/api-json" ;;
    admin-web) echo "/admin/auth/login" ;;
    proposal-web) echo "/proposal" ;;
    idp-api) echo "/api-json" ;;
    idp-web) echo "/auth/login" ;;
    *) return 1 ;;
  esac
}

remove_check_container() {
  local container_name="$1"
  "$CONTAINER_CLI" rm -f "$container_name" >/dev/null 2>&1 || true
}

cleanup_check_containers() {
  local container_name
  for container_name in "${CHECK_CONTAINERS[@]-}"; do
    remove_check_container "$container_name"
  done
}

run_cleanup_tasks() {
  if ! is_true "$CLEANUP"; then
    return
  fi

  if [[ "$CLEANUP_DONE" == "true" ]]; then
    return
  fi

  CLEANUP_DONE="true"

  echo ""
  echo -e "${GREEN}정리 작업 시작${RESET}"

  if is_true "$PRUNE_DANGLING_IMAGES"; then
    "$CONTAINER_CLI" image prune -f --filter dangling=true >/dev/null 2>&1 || true
    echo -e "${DIM}  - dangling 이미지 정리 완료${RESET}"
  else
    echo -e "${DIM}  - 이미지 캐시 보존 (PRUNE_DANGLING_IMAGES=${PRUNE_DANGLING_IMAGES})${RESET}"
  fi

  if [[ "$PUSH_COMPLETED" == "true" && "$TAG" != "latest" && "$TAG" != "$CACHE_TAG" ]]; then
    local target
    local image_name
    local image_path
    for target in "${SELECTED_TARGETS[@]-}"; do
      image_name="$(get_image_name "$target")"
      image_path="${REGISTRY}/${ENV_NAME}/${image_name}"
      "$CONTAINER_CLI" rmi "${image_path}:${TAG}" >/dev/null 2>&1 || true
    done
    echo -e "${DIM}  - 푸시 완료된 실행 태그(${TAG}) 로컬 정리 (latest/cache 유지)${RESET}"
  fi

  if [[ -d "$LOG_ROOT" ]]; then
    find "$LOG_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +"$LOG_RETENTION_DAYS" -exec rm -rf {} + 2>/dev/null || true
    echo -e "${DIM}  - 오래된 로그 정리 (${LOG_RETENTION_DAYS}일 초과)${RESET}"
  fi

  echo -e "${GREEN}✅ 정리 완료${RESET}"
}

on_exit() {
  local exit_code=$?
  cleanup_check_containers
  run_cleanup_tasks || true
  return "$exit_code"
}

trap on_exit EXIT INT TERM

set_run_env_args() {
  local target="$1"

  RUN_ENV_ARGS=()
  case "$target" in
    core-api)
      RUN_ENV_ARGS+=("-e" "NODE_ENV=${NODE_ENV:-production}")
      RUN_ENV_ARGS+=("-e" "APP_NAME=${APP_NAME:-core-api}")
      RUN_ENV_ARGS+=("-e" "APP_ADMIN_EMAIL=${APP_ADMIN_EMAIL:-admin@example.com}")
      RUN_ENV_ARGS+=("-e" "APP_PORT=${APP_PORT:-3006}")
      RUN_ENV_ARGS+=("-e" "API_PREFIX=${API_PREFIX:-api}")
      RUN_ENV_ARGS+=("-e" "FRONTEND_DOMAIN=${FRONTEND_DOMAIN:-http://localhost:3000}")
      RUN_ENV_ARGS+=("-e" "BACKEND_DOMAIN=${BACKEND_DOMAIN:-http://localhost}")
      RUN_ENV_ARGS+=("-e" "APP_FALLBACK_LANGUAGE=${APP_FALLBACK_LANGUAGE:-en}")
      RUN_ENV_ARGS+=("-e" "APP_HEADER_LANGUAGE=${APP_HEADER_LANGUAGE:-x-custom-lang}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_SECRET=${AUTH_JWT_SECRET:-container-local-secret}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_TOKEN_EXPIRES_IN=${AUTH_JWT_TOKEN_EXPIRES_IN:-1h}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_TOKEN_REFRESH_IN=${AUTH_JWT_TOKEN_REFRESH_IN:-7d}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_SALT_ROUNDS=${AUTH_JWT_SALT_ROUNDS:-10}")
      RUN_ENV_ARGS+=("-e" "SMTP_USERNAME=${SMTP_USERNAME:-noreply}")
      RUN_ENV_ARGS+=("-e" "SMTP_PASSWORD=${SMTP_PASSWORD:-noreply}")
      RUN_ENV_ARGS+=("-e" "SMTP_PORT=${SMTP_PORT:-1025}")
      RUN_ENV_ARGS+=("-e" "SMTP_HOST=${SMTP_HOST:-localhost}")
      RUN_ENV_ARGS+=("-e" "SMTP_SENDER=${SMTP_SENDER:-noreply@example.com}")
      RUN_ENV_ARGS+=("-e" "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-dummy-access-key}")
      RUN_ENV_ARGS+=("-e" "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-dummy-secret-key}")
      RUN_ENV_ARGS+=("-e" "AWS_REGION=${AWS_REGION:-ap-northeast-2}")
      RUN_ENV_ARGS+=("-e" "AWS_S3_BUCKET_NAME=${AWS_S3_BUCKET_NAME:-dummy-bucket}")
      RUN_ENV_ARGS+=("-e" "CORS_ENABLED=${CORS_ENABLED:-true}")
      RUN_ENV_ARGS+=("-e" "DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/postgres?schema=public}")
      RUN_ENV_ARGS+=("-e" "REDIS_HOST=${REDIS_HOST:-127.0.0.1}")
      RUN_ENV_ARGS+=("-e" "REDIS_PORT=${REDIS_PORT:-6379}")
      ;;
    admin-web)
      RUN_ENV_ARGS+=("-e" "NODE_ENV=${NODE_ENV:-production}")
      RUN_ENV_ARGS+=("-e" "PORT=${PORT:-3000}")
      RUN_ENV_ARGS+=("-e" "HOSTNAME=${HOSTNAME:-0.0.0.0}")
      ;;
    proposal-web)
      RUN_ENV_ARGS+=("-e" "NODE_ENV=${NODE_ENV:-production}")
      RUN_ENV_ARGS+=("-e" "PORT=${PORT:-3011}")
      RUN_ENV_ARGS+=("-e" "HOSTNAME=${HOSTNAME:-0.0.0.0}")
      ;;
    idp-api)
      RUN_ENV_ARGS+=("-e" "NODE_ENV=${NODE_ENV:-production}")
      RUN_ENV_ARGS+=("-e" "APP_NAME=${APP_NAME:-idp-api}")
      RUN_ENV_ARGS+=("-e" "APP_PORT=${APP_PORT:-3007}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_SECRET=${AUTH_JWT_SECRET:-container-local-secret}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_TOKEN_EXPIRES_IN=${AUTH_JWT_TOKEN_EXPIRES_IN:-1h}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_TOKEN_REFRESH_IN=${AUTH_JWT_TOKEN_REFRESH_IN:-7d}")
      RUN_ENV_ARGS+=("-e" "AUTH_JWT_SALT_ROUNDS=${AUTH_JWT_SALT_ROUNDS:-10}")
      RUN_ENV_ARGS+=("-e" "SMTP_USERNAME=${SMTP_USERNAME:-noreply}")
      RUN_ENV_ARGS+=("-e" "SMTP_PASSWORD=${SMTP_PASSWORD:-noreply}")
      RUN_ENV_ARGS+=("-e" "SMTP_PORT=${SMTP_PORT:-1025}")
      RUN_ENV_ARGS+=("-e" "SMTP_HOST=${SMTP_HOST:-localhost}")
      RUN_ENV_ARGS+=("-e" "SMTP_SENDER=${SMTP_SENDER:-noreply@example.com}")
      RUN_ENV_ARGS+=("-e" "CORS_ENABLED=${CORS_ENABLED:-true}")
      RUN_ENV_ARGS+=("-e" "DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/postgres?schema=public}")
      RUN_ENV_ARGS+=("-e" "DIRECT_URL=${DIRECT_URL:-postgresql://postgres:postgres@localhost:5432/postgres?schema=public}")
      RUN_ENV_ARGS+=("-e" "REDIS_HOST=${REDIS_HOST:-127.0.0.1}")
      RUN_ENV_ARGS+=("-e" "REDIS_PORT=${REDIS_PORT:-6379}")
      ;;
    idp-web)
      RUN_ENV_ARGS+=("-e" "NODE_ENV=${NODE_ENV:-production}")
      RUN_ENV_ARGS+=("-e" "PORT=${PORT:-3008}")
      RUN_ENV_ARGS+=("-e" "HOSTNAME=${HOSTNAME:-0.0.0.0}")
      ;;
    *)
      return 1
      ;;
  esac
}

parse_targets() {
  local input="$1"
  local token=""
  local target=""

  for token in $input; do
    if ! target="$(resolve_target "$token")"; then
      echo -e "${YELLOW}잘못된 선택: ${token}${RESET}"
      exit 1
    fi
    add_target "$target"
  done
}

ensure_registry_login() {
  local username="${REGISTRY_USERNAME:-${HARBOR_USERNAME:-}}"
  local password="${REGISTRY_PASSWORD:-${HARBOR_PASSWORD:-}}"
  local registry_host="${REGISTRY%%/*}"

  if [[ -z "$username" && -z "$password" ]]; then
    echo -e "${DIM}레지스트리 자격증명이 지정되지 않아 기존 로그인 세션을 사용합니다.${RESET}"
    return
  fi

  if [[ -z "$username" || -z "$password" ]]; then
    echo -e "${YELLOW}레지스트리 로그인 정보가 완전하지 않습니다. REGISTRY_USERNAME/HARBOR_USERNAME, REGISTRY_PASSWORD/HARBOR_PASSWORD를 모두 설정해주세요.${RESET}"
    exit 1
  fi

  echo -e "${DIM}레지스트리 로그인: ${registry_host}${RESET}"
  echo "$password" | "$CONTAINER_CLI" login \
    -u "$username" \
    --password-stdin \
    "$registry_host"
}

run_smoke_check() {
  local target="$1"
  local image_ref="$2"
  local container_name="container-build-check-${target}-${RUN_ID}"
  local run_log="${LOG_DIR}/${target}.run.log"
  local health_port
  local health_path
  local container_id=""
  local host_mapping=""
  local host_port=""
  local state=""
  local http_code=""
  local elapsed=0
  local ready="false"
  local run_status=0

  RUN_LOG_FILES+=("$run_log")
  health_port="$(get_health_port "$target")"
  health_path="$(get_health_path "$target")"

  set_run_env_args "$target"

  remove_check_container "$container_name"
  CHECK_CONTAINERS+=("$container_name")

  set +e
  container_id="$("$CONTAINER_CLI" run -d \
    --name "$container_name" \
    -p "127.0.0.1::${health_port}" \
    "${RUN_ENV_ARGS[@]-}" \
    "$image_ref" 2>>"$run_log")"
  run_status=$?
  set -e

  if [[ $run_status -ne 0 || -z "$container_id" ]]; then
    echo -e "${YELLOW}❌ ${target} 실행 실패 (로그: ${run_log})${RESET}"
    return 1
  fi

  host_mapping="$("$CONTAINER_CLI" port "$container_name" "${health_port}/tcp" 2>/dev/null | head -n 1 || true)"
  host_port="${host_mapping##*:}"

  if [[ -z "$host_mapping" || -z "$host_port" || "$host_port" == "$host_mapping" ]]; then
    "$CONTAINER_CLI" logs "$container_name" >"$run_log" 2>&1 || true
    echo -e "${YELLOW}❌ ${target} 포트 매핑 확인 실패 (로그: ${run_log})${RESET}"
    return 1
  fi

  echo -e "${DIM}  - Probe URL: http://127.0.0.1:${host_port}${health_path}${RESET}"

  while [[ $elapsed -lt $RUN_CHECK_TIMEOUT_SECONDS ]]; do
    state="$("$CONTAINER_CLI" inspect --format '{{.State.Status}}' "$container_name" 2>/dev/null || echo "missing")"
    if [[ "$state" != "running" ]]; then
      break
    fi

    if [[ "$HAS_CURL" == "true" ]]; then
      http_code="$(curl -s -o /dev/null -m 2 -w "%{http_code}" "http://127.0.0.1:${host_port}${health_path}" || true)"
      if [[ -n "$http_code" && "$http_code" != "000" ]]; then
        ready="true"
        break
      fi
    else
      if [[ $elapsed -ge 8 ]]; then
        ready="true"
        break
      fi
    fi

    sleep "$RUN_CHECK_INTERVAL_SECONDS"
    elapsed=$((elapsed + RUN_CHECK_INTERVAL_SECONDS))
  done

  "$CONTAINER_CLI" logs "$container_name" >"$run_log" 2>&1 || true

  if [[ "$ready" != "true" ]]; then
    state="$("$CONTAINER_CLI" inspect --format '{{.State.Status}}' "$container_name" 2>/dev/null || echo "missing")"
    echo -e "${YELLOW}❌ ${target} 실행 검증 실패 (state=${state}, 로그: ${run_log})${RESET}"
    return 1
  fi

  echo -e "${GREEN}  ✅ ${target} 실행 검증 통과${RESET}"
  remove_check_container "$container_name"
  return 0
}

if [[ ${#ARGS[@]} -eq 0 ]]; then
  echo ""
  echo -e "${BOLD}📦 Rancher Desktop 이미지 빌드 + 실행 검증${RESET}"
  echo ""
  echo -e "  ${CYAN}1${RESET}) core-api  ${DIM}core-api${RESET}"
  echo -e "  ${CYAN}2${RESET}) admin-web ${DIM}admin-web${RESET}"
  echo -e "  ${CYAN}3${RESET}) proposal-web ${DIM}proposal-web${RESET}"
  echo -e "  ${CYAN}4${RESET}) idp-api   ${DIM}idp-api${RESET}"
  echo -e "  ${CYAN}5${RESET}) idp-web   ${DIM}idp-web${RESET}"
  echo ""
  echo -e "  ${DIM}복수 선택 가능 (예: 1 2)${RESET}"
  echo ""
  echo -ne "${BOLD}번호 선택: ${RESET}"
  read -r choices

  if [[ -z "${choices// }" ]]; then
    echo -e "\n${YELLOW}선택이 없습니다.${RESET}"
    exit 1
  fi

  parse_targets "$choices"

  echo -ne "${BOLD}ENV 이름 [${ENV_NAME}]: ${RESET}"
  read -r input_env
  if [[ -n "${input_env}" ]]; then
    ENV_NAME="${input_env}"
  fi

  echo -ne "${BOLD}태그 [${TAG}]: ${RESET}"
  read -r input_tag
  if [[ -n "${input_tag}" ]]; then
    TAG="${input_tag}"
  fi

  echo -ne "${BOLD}레지스트리 [${REGISTRY}]: ${RESET}"
  read -r input_registry
  if [[ -n "${input_registry}" ]]; then
    REGISTRY="${input_registry}"
  fi
else
  for arg in "${ARGS[@]}"; do
    parse_targets "$arg"
  done
fi

if [[ ${#SELECTED_TARGETS[@]} -eq 0 ]]; then
  echo -e "${YELLOW}빌드 대상이 없습니다.${RESET}"
  exit 1
fi

echo ""
echo -e "${GREEN}빌드 파이프라인 시작${RESET}"
echo -e "  ENV: ${ENV_NAME}"
echo -e "  TAG: ${TAG}"
echo -e "  CACHE_TAG: ${CACHE_TAG}"
echo -e "  REGISTRY: ${REGISTRY}"
echo -e "  CONTAINER_CLI: ${CONTAINER_CLI}"
echo -e "  RUN_CHECK: ${RUN_CHECK}"
echo -e "  PUSH: ${PUSH}"
echo -e "  CLEANUP: ${CLEANUP}"
echo -e "  LOG_DIR: ${LOG_DIR}"
echo ""

for target in "${SELECTED_TARGETS[@]}"; do
  dockerfile="$(get_dockerfile "$target")"
  image_name="$(get_image_name "$target")"
  image_path="${REGISTRY}/${ENV_NAME}/${image_name}"

  if [[ ! -f "$dockerfile" ]]; then
    echo -e "${YELLOW}Dockerfile이 없습니다: ${dockerfile}${RESET}"
    exit 1
  fi

  if is_true "$PULL_CACHE"; then
    if "$CONTAINER_CLI" pull "${image_path}:${CACHE_TAG}" >/dev/null 2>&1; then
      echo -e "${DIM}캐시 이미지 pull 성공: ${image_path}:${CACHE_TAG}${RESET}"
    else
      echo -e "${DIM}캐시 이미지 pull 생략: ${image_path}:${CACHE_TAG}${RESET}"
    fi
  fi

  echo -e "${BOLD}- ${target}${RESET} (${dockerfile})"
  target_log="${LOG_DIR}/${target}.build.log"
  LOG_FILES+=("$target_log")
  echo -e "${DIM}로그 파일: ${target_log}${RESET}"

  set +e
  "$CONTAINER_CLI" build \
    -f "$dockerfile" \
    -t "${image_path}:${TAG}" \
    -t "${image_path}:latest" \
    -t "${image_path}:${CACHE_TAG}" \
    . 2>&1 | tee "$target_log"
  build_status=${PIPESTATUS[0]}
  set -e

  if [[ $build_status -ne 0 ]]; then
    echo -e "${YELLOW}❌ ${target} 빌드 실패 (로그: ${target_log})${RESET}"
    exit "$build_status"
  fi
done

echo ""
echo -e "${GREEN}✅ 빌드 완료${RESET}"

if is_true "$RUN_CHECK"; then
  echo ""
  echo -e "${GREEN}실행 검증 시작${RESET}"
  for target in "${SELECTED_TARGETS[@]}"; do
    image_name="$(get_image_name "$target")"
    image_path="${REGISTRY}/${ENV_NAME}/${image_name}"
    echo -e "${BOLD}- ${target}${RESET} 실행 검증"
    if ! run_smoke_check "$target" "${image_path}:${TAG}"; then
      exit 1
    fi
  done
  echo -e "${GREEN}✅ 실행 검증 완료${RESET}"
else
  echo -e "${YELLOW}실행 검증을 건너뜁니다. (RUN_CHECK=${RUN_CHECK})${RESET}"
fi

if is_true "$PUSH"; then
  echo ""
  echo -e "${GREEN}이미지 푸시 시작${RESET}"
  ensure_registry_login

  for target in "${SELECTED_TARGETS[@]}"; do
    image_name="$(get_image_name "$target")"
    image_path="${REGISTRY}/${ENV_NAME}/${image_name}"
    push_log="${LOG_DIR}/${target}.push.log"
    PUSH_LOG_FILES+=("$push_log")

    echo -e "${BOLD}- ${target}${RESET} push (${TAG}, latest)"
    set +e
    "$CONTAINER_CLI" push "${image_path}:${TAG}" 2>&1 | tee "$push_log"
    push_status=${PIPESTATUS[0]}
    set -e

    if [[ $push_status -ne 0 ]]; then
      echo -e "${YELLOW}❌ ${target}:${TAG} push 실패 (로그: ${push_log})${RESET}"
      exit "$push_status"
    fi

    set +e
    "$CONTAINER_CLI" push "${image_path}:latest" 2>&1 | tee -a "$push_log"
    push_latest_status=${PIPESTATUS[0]}
    set -e

    if [[ $push_latest_status -ne 0 ]]; then
      echo -e "${YELLOW}❌ ${target}:latest push 실패 (로그: ${push_log})${RESET}"
      exit "$push_latest_status"
    fi

    if is_true "$PUSH_CACHE_TAG"; then
      set +e
      "$CONTAINER_CLI" push "${image_path}:${CACHE_TAG}" 2>&1 | tee -a "$push_log"
      push_cache_status=${PIPESTATUS[0]}
      set -e

      if [[ $push_cache_status -ne 0 ]]; then
        echo -e "${YELLOW}❌ ${target}:${CACHE_TAG} push 실패 (로그: ${push_log})${RESET}"
        exit "$push_cache_status"
      fi
    fi
  done

  echo -e "${GREEN}✅ 이미지 푸시 완료${RESET}"
  PUSH_COMPLETED="true"
else
  echo -e "${YELLOW}이미지 푸시를 건너뜁니다. (PUSH=${PUSH})${RESET}"
fi

run_cleanup_tasks

echo ""
echo -e "${GREEN}완료된 이미지${RESET}"
for target in "${SELECTED_TARGETS[@]}"; do
  image_name="$(get_image_name "$target")"
  image_path="${REGISTRY}/${ENV_NAME}/${image_name}"
  echo "  - ${image_path}:${TAG}"
  echo "  - ${image_path}:latest"
  echo "  - ${image_path}:${CACHE_TAG}"
done

echo ""
echo "빌드 로그:"
for log_file in "${LOG_FILES[@]-}"; do
  echo "  - ${log_file}"
done

if [[ ${#RUN_LOG_FILES[@]} -gt 0 ]]; then
  echo ""
  echo "실행 검증 로그:"
  for run_log in "${RUN_LOG_FILES[@]-}"; do
    echo "  - ${run_log}"
  done
fi

if [[ ${#PUSH_LOG_FILES[@]} -gt 0 ]]; then
  echo ""
  echo "푸시 로그:"
  for push_log in "${PUSH_LOG_FILES[@]-}"; do
    echo "  - ${push_log}"
  done
fi

echo ""
echo -e "${DIM}다음 빌드를 빠르게 하려면 기본값(PULL_CACHE=true, PUSH_CACHE_TAG=true, PRUNE_DANGLING_IMAGES=true)을 유지하세요. (latest/buildcache 태그 유지)${RESET}"
