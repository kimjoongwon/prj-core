#!/bin/bash

set -euo pipefail

BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
DIM='\033[2m'
RESET='\033[0m'

if ! command -v podman >/dev/null 2>&1; then
  echo -e "${YELLOW}podman 명령어를 찾을 수 없습니다.${RESET}"
  echo "Podman 설치 후 다시 실행해주세요."
  exit 1
fi

DEFAULT_TAG="local-$(date +%Y%m%d%H%M%S)"
ENV_NAME="${ENV_NAME:-stg}"
REGISTRY="${REGISTRY:-${IMAGE_REGISTRY:-${HARBOR_REGISTRY:-harbor.cocdev.co.kr}}}"
TAG="${TAG:-${IMAGE_TAG:-$DEFAULT_TAG}}"
RUN_ID="$(date +%Y%m%d-%H%M%S)"
LOG_DIR="${LOG_DIR:-${PODMAN_BUILD_LOG_DIR:-./.tmp/podman-build-logs/${RUN_ID}}}"
mkdir -p "$LOG_DIR"

ARGS=()
for arg in "$@"; do
  [[ "$arg" != "--" ]] && ARGS+=("$arg")
done

SELECTED_TARGETS=()
LOG_FILES=()

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
    1|server|plate-server) echo "server" ;;
    2|admin|plate-admin) echo "admin" ;;
    3|idp-api) echo "idp-api" ;;
    4|idp-web) echo "idp-web" ;;
    *) return 1 ;;
  esac
}

get_dockerfile() {
  local target="$1"
  case "$target" in
    server) echo "devops/Dockerfile.server" ;;
    admin) echo "devops/Dockerfile.admin" ;;
    idp-api) echo "devops/Dockerfile.idp-api" ;;
    idp-web) echo "devops/Dockerfile.idp-web" ;;
    *) return 1 ;;
  esac
}

get_image_name() {
  local target="$1"
  case "$target" in
    server) echo "plate-server" ;;
    admin) echo "plate-admin" ;;
    idp-api) echo "idp-api" ;;
    idp-web) echo "idp-web" ;;
    *) return 1 ;;
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

if [[ ${#ARGS[@]} -eq 0 ]]; then
  echo ""
  echo -e "${BOLD}📦 Podman 이미지 빌드${RESET}"
  echo ""
  echo -e "  ${CYAN}1${RESET}) server    ${DIM}plate-server${RESET}"
  echo -e "  ${CYAN}2${RESET}) admin     ${DIM}plate-admin${RESET}"
  echo -e "  ${CYAN}3${RESET}) idp-api   ${DIM}idp-api${RESET}"
  echo -e "  ${CYAN}4${RESET}) idp-web   ${DIM}idp-web${RESET}"
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
echo -e "${GREEN}빌드 시작${RESET}"
echo -e "  ENV: ${ENV_NAME}"
echo -e "  TAG: ${TAG}"
echo -e "  REGISTRY: ${REGISTRY}"
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

  echo -e "${BOLD}- ${target}${RESET} (${dockerfile})"
  target_log="${LOG_DIR}/${target}.log"
  LOG_FILES+=("$target_log")
  echo -e "${DIM}로그 파일: ${target_log}${RESET}"

  set +e
  podman build \
    --format=docker \
    --layers \
    -f "$dockerfile" \
    -t "${image_path}:${TAG}" \
    -t "${image_path}:latest" \
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
for target in "${SELECTED_TARGETS[@]}"; do
  image_name="$(get_image_name "$target")"
  image_path="${REGISTRY}/${ENV_NAME}/${image_name}"
  echo "  - ${image_path}:${TAG}"
  echo "  - ${image_path}:latest"
done
echo ""
echo "빌드 로그:"
for log_file in "${LOG_FILES[@]-}"; do
  echo "  - ${log_file}"
done
