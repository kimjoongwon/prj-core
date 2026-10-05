#!/bin/bash

# 서비스 시작 스크립트 - 복수 선택 가능

set -e

BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
DIM='\033[2m'
RESET='\033[0m'

# Watcher 수가 많은 monorepo에서 EMFILE(too many open files) 방지
CURRENT_NOFILE=$(ulimit -n 2>/dev/null || echo 0)
if [[ "$CURRENT_NOFILE" -lt 65536 ]]; then
  ulimit -n 65536 2>/dev/null || true
fi

# macOS/Node 환경에서 fs.watch 한도 초과(EMFILE) 방지
export CHOKIDAR_USEPOLLING="${CHOKIDAR_USEPOLLING:-1}"
export CHOKIDAR_INTERVAL="${CHOKIDAR_INTERVAL:-1000}"
export WATCHPACK_POLLING="${WATCHPACK_POLLING:-true}"

# worktree 환경 파일이 있으면 자동 로드
if [[ -f ".env.worktree" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ./.env.worktree
  set +a
fi

# 팀 OpenBao에서 로컬 개발용 시크릿(SMTP, 객체 스토리지, 인증 서명)을
# 가져와 각 앱의 .env에 병합한다. 실패해도 기존 .env로 계속 진행하며,
# 건너뛰려면 START_SKIP_SECRETS_PULL=1
if [[ ! "${START_SKIP_SECRETS_PULL:-}" =~ ^(y|yes|true|1|on)$ ]]; then
  if ! node scripts/pull-local-secrets.mjs --quiet; then
    echo -e "${YELLOW}⚠️ OpenBao 시크릿 pull 실패 — 기존 .env 값으로 진행합니다.${RESET}" >&2
  fi
fi

ensure_shared_local_env() {
  # DATABASE_URL이 없으면 실제 연결 가능한 Postgres를 probe로 찾아 결정한다.
  # 후보 순서: DATABASE_URL → POSTGRES_* → 로컬 OS role(native PG) → cocrepo 기본값.
  # native Homebrew PG는 OS role(trust)만 허용하므로 cocrepo 기본값이 P1010으로
  # 거부된다. probe 실패 시 아래 기본값으로 진행한다(docker-compose PG용).
  if [[ -z "${DATABASE_URL:-}" ]]; then
    if local_pg_exports="$(node scripts/local-postgres-env.mjs --shell 2>/dev/null)"; then
      eval "$local_pg_exports"
    else
      export POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
      export POSTGRES_DATABASE="${POSTGRES_DATABASE:-plate}"
      export POSTGRES_PORT="${POSTGRES_PORT:-5432}"
      export POSTGRES_USER="${POSTGRES_USER:-cocrepo}"
      export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-devpassword}"

      if [[ -n "${POSTGRES_PASSWORD:-}" ]]; then
        export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?schema=public"
      else
        export DATABASE_URL="postgresql://${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?schema=public"
      fi
    fi
  fi

  export DIRECT_URL="${DIRECT_URL:-$DATABASE_URL}"

  export REDIS_HOST="${REDIS_HOST:-localhost}"
  export REDIS_PORT="${REDIS_PORT:-6379}"
  export CORS_ENABLED="${CORS_ENABLED:-true}"
  export NODE_ENV="${NODE_ENV:-development}"
  export NODE_OPTIONS="${NODE_OPTIONS:---no-deprecation}"
  export API_PREFIX="${API_PREFIX:-api}"
  export APP_ADMIN_EMAIL="${APP_ADMIN_EMAIL:-admin@example.com}"
  export APP_HEADER_LANGUAGE="${APP_HEADER_LANGUAGE:-x-custom-lang}"
  export AUTH_JWT_TOKEN_EXPIRES_IN="${AUTH_JWT_TOKEN_EXPIRES_IN:-10d}"
  export AUTH_JWT_TOKEN_REFRESH_IN="${AUTH_JWT_TOKEN_REFRESH_IN:-7d}"

  # Bootstrap credentials are intentionally synthetic and local-only. They
  # must be supplied by the deployment secret manager in production.
  if [[ "$NODE_ENV" == "production" ]]; then
    if [[ -n "${LOCAL_BOOTSTRAP_ADMIN_EMAIL:-}" || -n "${LOCAL_BOOTSTRAP_ADMIN_PASSWORD:-}" ]]; then
      echo "❌ LOCAL_BOOTSTRAP_ADMIN_*는 production에서 사용할 수 없습니다." >&2
      exit 1
    fi
  else
    export LOCAL_BOOTSTRAP_ADMIN_EMAIL="${LOCAL_BOOTSTRAP_ADMIN_EMAIL:-local-admin@example.com}"
    export LOCAL_BOOTSTRAP_ADMIN_PASSWORD="${LOCAL_BOOTSTRAP_ADMIN_PASSWORD:-local-admin-password-change-me}"
    export LOCAL_BOOTSTRAP_ADMIN_NAME="${LOCAL_BOOTSTRAP_ADMIN_NAME:-Local Administrator}"
    export LOCAL_BOOTSTRAP_ADMIN_NICKNAME="${LOCAL_BOOTSTRAP_ADMIN_NICKNAME:-local-admin}"
  fi

  export ADMIN_WEB_URL="${ADMIN_WEB_URL:-http://localhost:${ADMIN_WEB_PORT:-3000}}"
  export CORE_API_URL="${CORE_API_URL:-http://localhost:${CORE_API_PORT:-3006}}"
  export IDP_API_URL="${IDP_API_URL:-http://localhost:${IDP_API_PORT:-3007}}"
  export IDP_WEB_URL="${IDP_WEB_URL:-http://localhost:${IDP_WEB_PORT:-3008}}"
  export STORYBOOK_URL="${STORYBOOK_URL:-http://localhost:${STORYBOOK_PORT:-6006}}"

  export CORE_API_INTERNAL_URL="${CORE_API_INTERNAL_URL:-$CORE_API_URL}"
  export IDP_API_INTERNAL_URL="${IDP_API_INTERNAL_URL:-$IDP_API_URL}"
  export NEXT_PUBLIC_WS_URL="${NEXT_PUBLIC_WS_URL:-ws://localhost:${CORE_API_PORT:-3006}}"
  # 발급자는 idp-api다 — core-api는 이 JWKS로 토큰을 검증만 한다.
  export OIDC_JWKS_URI="${OIDC_JWKS_URI:-${IDP_API_URL}/oidc/jwks}"
  export OIDC_ADMIN_BASE_URL="${OIDC_ADMIN_BASE_URL:-$ADMIN_WEB_URL}"
  export OIDC_STORYBOOK_BASE_URL="${OIDC_STORYBOOK_BASE_URL:-$STORYBOOK_URL}"
}

ensure_shared_local_env

start_local_infrastructure() {
  if [[ "${START_SKIP_INFRA_START:-}" =~ ^(y|yes|true|1|on)$ ]]; then
    return
  fi
  # 로컬 PostgreSQL/Redis가 이미 떠 있으면(native Homebrew, 클러스터 터널 등)
  # 그대로 사용하고 docker compose 기동을 건너뛴다.
  if (exec 3<>/dev/tcp/"${POSTGRES_HOST:-localhost}"/"${POSTGRES_PORT:-5432}") 2>/dev/null; then
    exec 3>&- 3<&-
    if (exec 3<>/dev/tcp/"${REDIS_HOST:-localhost}"/"${REDIS_PORT:-6379}") 2>/dev/null; then
      exec 3>&- 3<&-
      echo -e "${GREEN}✅ 로컬 PostgreSQL/Redis가 이미 실행 중 — docker 인프라 기동을 건너뜁니다${RESET}"
      return
    fi
  fi
  if ! command -v docker >/dev/null 2>&1; then
    echo -e "${YELLOW}❌ Docker가 필요합니다. Docker Desktop을 실행하거나 START_SKIP_INFRA_START=1로 자동 기동을 건너뛰세요.${RESET}" >&2
    exit 1
  fi
  if ! docker info >/dev/null 2>&1; then
    echo -e "${YELLOW}❌ Docker daemon에 연결할 수 없습니다. Docker Desktop을 실행하세요.${RESET}" >&2
    exit 1
  fi
  echo -e "${YELLOW}🐳 로컬 PostgreSQL/Redis 기동 중...${RESET}"
  docker compose -f docker-compose.local.yml up -d --wait
}

# -- 인자 제거 (pnpm이 -- 를 전달할 수 있음)
ARGS=()
for arg in "$@"; do
  [[ "$arg" != "--" ]] && ARGS+=("$arg")
done

START_CHOICES_VALUE="${START_CHOICES:-}"
PROMPT_MODE="none"
PROMPT_TTY_FD=""

if [[ -t 0 ]]; then
  PROMPT_MODE="stdin"
elif { exec {PROMPT_TTY_FD}<> /dev/tty; } 2>/dev/null; then
  PROMPT_MODE="tty"
fi

can_prompt() {
  [[ "$PROMPT_MODE" != "none" ]]
}

prompt_read() {
  local __resultvar=$1
  local prompt=$2
  local value=""

  case "$PROMPT_MODE" in
    stdin)
      echo -ne "$prompt"
      IFS= read -r value || return 1
      ;;
    tty)
      echo -ne "$prompt" >&"$PROMPT_TTY_FD"
      IFS= read -r -u "$PROMPT_TTY_FD" value || return 1
      ;;
    *)
      return 1
      ;;
  esac

  printf -v "$__resultvar" '%s' "$value"
}

INTERACTIVE="false"

if [[ -n "$START_CHOICES_VALUE" ]]; then
  choices="$START_CHOICES_VALUE"
elif [[ ${#ARGS[@]} -gt 0 ]]; then
  choices="${ARGS[*]}"
else
  INTERACTIVE="true"

  if ! can_prompt; then
    echo ""
    echo -e "${YELLOW}비대화형 환경에서는 선택 UI를 표시할 수 없습니다.${RESET}"
    echo -e "  ${DIM}예: pnpm start -- core-api admin-web${RESET}"
    echo -e "  ${DIM}예: START_CHOICES=\"1 6\" pnpm start${RESET}"
    echo -e "  ${DIM}예: START_CHOICES=\"mobile mobile:ios mobile:go\" pnpm start${RESET}"
    echo -e "  ${DIM}예: pnpm start -- mobile-storybook:web${RESET}"
    exit 1
  fi

  # 대화형 모드
  echo ""
  echo -e "${BOLD}🚀 서비스 시작${RESET}"
  echo ""
  echo -e "  ${CYAN}1${RESET})  core-api        ${DIM}백엔드 서버${RESET}"
  echo -e "  ${CYAN}2${RESET})  admin-web       ${DIM}어드민 프론트엔드${RESET}"
  echo -e "  ${CYAN}3${RESET})  proposal-web    ${DIM}퍼블릭 제안 랜딩${RESET}"
  echo -e "  ${CYAN}4${RESET})  tool-storybook  ${DIM}스토리북${RESET}"
  echo -e "  ${CYAN}5${RESET})  mobile          ${DIM}Expo 모바일 앱${RESET}"
  echo -e "  ${CYAN}6${RESET})  mobile-storybook ${DIM}Expo 모바일 Storybook${RESET}"
  echo -e "  ${CYAN}7${RESET})  idp-api         ${DIM}IDP 인증 서버(oidc-provider)${RESET}"
  echo -e "  ${CYAN}8${RESET})  idp-web         ${DIM}IDP 로그인 UI${RESET}"
  echo ""
  echo -e "  ${DIM}복수 선택 가능 (예: 1 2 6)${RESET}"
  echo ""
  if ! prompt_read choices "${BOLD}번호 선택: ${RESET}"; then
    echo -e "\n${YELLOW}입력이 취소되었습니다.${RESET}"
    exit 1
  fi
fi

if [[ -z "$choices" ]]; then
  echo -e "\n${YELLOW}선택이 없습니다.${RESET}"
  exit 1
fi

FILTERS=""
SERVICES=""
HAS_FRONTEND="false"
HAS_BACKEND="false"
HAS_MOBILE="false"
HAS_MOBILE_STORYBOOK="false"
MOBILE_TARGET=""
MOBILE_RUNTIME=""
MOBILE_STORYBOOK_TARGET=""
TURBO_PID=""
MOBILE_PID=""
MOBILE_DEVTOOLS_PID=""

# 서비스별 포트 조회
get_port() {
  case $1 in
    core-api)        echo "${CORE_API_PORT:-3006}" ;;
    admin-web)       echo "${ADMIN_WEB_PORT:-3000}" ;;
    proposal-web)    echo "${PROPOSAL_WEB_PORT:-3011}" ;;
    tool-storybook)  echo "${STORYBOOK_PORT:-6006}" ;;
    mobile)          echo "${MOBILE_PORT:-8081}" ;;
    mobile-storybook) echo "${MOBILE_STORYBOOK_PORT:-8083}" ;;
    idp-api)         echo "${IDP_API_PORT:-3007}" ;;
    idp-web)         echo "${IDP_WEB_PORT:-3008}" ;;
  esac
}

CORE_API_PORT_VALUE=$(get_port core-api)
MOBILE_PORT_VALUE=$(get_port mobile)
MOBILE_STORYBOOK_PORT_VALUE=$(get_port mobile-storybook)

ensure_mobile_service() {
  HAS_MOBILE="true"
  if [[ " $SERVICES " != *" mobile "* ]]; then
    SERVICES="$SERVICES mobile"
  fi
}

set_mobile_target() {
  local next_target=$1

  ensure_mobile_service

  if [[ -n "$MOBILE_TARGET" && "$MOBILE_TARGET" != "$next_target" && "$MOBILE_TARGET" != "prompt" && "$next_target" != "prompt" ]]; then
    echo -e "${YELLOW}모바일 실행 대상이 중복 지정되었습니다: ${MOBILE_TARGET}, ${next_target}${RESET}"
    exit 1
  fi

  if [[ "$next_target" != "prompt" ]]; then
    MOBILE_TARGET="$next_target"
  elif [[ -z "$MOBILE_TARGET" ]]; then
    MOBILE_TARGET="prompt"
  fi
}

resolve_mobile_target_label() {
  case $1 in
    ios) echo "iOS" ;;
    android) echo "AOS" ;;
    all) echo "iOS + AOS" ;;
  esac
}

set_mobile_runtime() {
  local next_runtime=$1

  ensure_mobile_service

  if [[ -n "$MOBILE_RUNTIME" && "$MOBILE_RUNTIME" != "$next_runtime" && "$MOBILE_RUNTIME" != "prompt" && "$next_runtime" != "prompt" ]]; then
    echo -e "${YELLOW}모바일 실행 모드가 중복 지정되었습니다: ${MOBILE_RUNTIME}, ${next_runtime}${RESET}"
    exit 1
  fi

  if [[ "$next_runtime" != "prompt" ]]; then
    MOBILE_RUNTIME="$next_runtime"
  elif [[ -z "$MOBILE_RUNTIME" ]]; then
    MOBILE_RUNTIME="prompt"
  fi
}

resolve_mobile_runtime_label() {
  case $1 in
    local) echo "local build" ;;
    go) echo "Expo Go" ;;
  esac
}

ensure_mobile_storybook_service() {
  HAS_MOBILE_STORYBOOK="true"
  if [[ " $SERVICES " != *" mobile-storybook "* ]]; then
    SERVICES="$SERVICES mobile-storybook"
  fi
}

set_mobile_storybook_target() {
  local next_target=$1

  ensure_mobile_storybook_service

  if [[ -n "$MOBILE_STORYBOOK_TARGET" && "$MOBILE_STORYBOOK_TARGET" != "$next_target" && "$MOBILE_STORYBOOK_TARGET" != "prompt" && "$next_target" != "prompt" ]]; then
    echo -e "${YELLOW}모바일 Storybook 실행 대상이 중복 지정되었습니다: ${MOBILE_STORYBOOK_TARGET}, ${next_target}${RESET}"
    exit 1
  fi

  if [[ "$next_target" != "prompt" ]]; then
    MOBILE_STORYBOOK_TARGET="$next_target"
  elif [[ -z "$MOBILE_STORYBOOK_TARGET" ]]; then
    MOBILE_STORYBOOK_TARGET="prompt"
  fi
}

resolve_mobile_storybook_target_label() {
  case $1 in
    web) echo "Web" ;;
    ios) echo "iOS" ;;
    android) echo "AOS" ;;
    metro) echo "Metro" ;;
  esac
}

ensure_mobile_target() {
  if [[ "$HAS_MOBILE" != "true" ]]; then
    return
  fi

  if [[ -n "$MOBILE_TARGET" && "$MOBILE_TARGET" != "prompt" ]]; then
    return
  fi

  if [[ "$INTERACTIVE" == "true" ]]; then
    echo ""
    echo -e "${BOLD}📱 모바일 실행 대상${RESET}"
    echo -e "  ${CYAN}1${RESET})  iOS          ${DIM}iOS 시뮬레이터 실행${RESET}"
    echo -e "  ${CYAN}2${RESET})  AOS          ${DIM}Android 에뮬레이터 실행${RESET}"
    echo -e "  ${CYAN}3${RESET})  전체         ${DIM}iOS + AOS 모두 실행${RESET}"
    echo ""
    if ! prompt_read mobile_target_choice "${BOLD}번호 선택: ${RESET}"; then
      echo -e "\n${YELLOW}입력이 취소되었습니다.${RESET}"
      exit 1
    fi

    case $mobile_target_choice in
      1) MOBILE_TARGET="ios" ;;
      2) MOBILE_TARGET="android" ;;
      3|"") MOBILE_TARGET="all" ;;
      *) echo -e "${YELLOW}잘못된 번호: ${mobile_target_choice}${RESET}"; exit 1 ;;
    esac
  else
    MOBILE_TARGET="all"
  fi
}

ensure_mobile_runtime() {
  if [[ "$HAS_MOBILE" != "true" ]]; then
    return
  fi

  if [[ -n "$MOBILE_RUNTIME" && "$MOBILE_RUNTIME" != "prompt" ]]; then
    return
  fi

  if [[ "$INTERACTIVE" == "true" ]]; then
    echo ""
    echo -e "${BOLD}📦 모바일 실행 모드${RESET}"
    echo -e "  ${CYAN}1${RESET})  local build  ${DIM}development build / custom native app${RESET}"
    echo -e "  ${CYAN}2${RESET})  Expo Go      ${DIM}Expo Go로 실행${RESET}"
    echo ""
    if ! prompt_read mobile_runtime_choice "${BOLD}번호 선택: ${RESET}"; then
      echo -e "\n${YELLOW}입력이 취소되었습니다.${RESET}"
      exit 1
    fi

    case $mobile_runtime_choice in
      1) MOBILE_RUNTIME="local" ;;
      2|"") MOBILE_RUNTIME="go" ;;
      *) echo -e "${YELLOW}잘못된 번호: ${mobile_runtime_choice}${RESET}"; exit 1 ;;
    esac
  else
    MOBILE_RUNTIME="go"
  fi
}

ensure_mobile_storybook_target() {
  if [[ "$HAS_MOBILE_STORYBOOK" != "true" ]]; then
    return
  fi

  if [[ -n "$MOBILE_STORYBOOK_TARGET" && "$MOBILE_STORYBOOK_TARGET" != "prompt" ]]; then
    return
  fi

  if [[ "$INTERACTIVE" == "true" ]]; then
    echo ""
    echo -e "${BOLD}📚 모바일 Storybook 실행 대상${RESET}"
    echo -e "  ${CYAN}1${RESET})  Web          ${DIM}브라우저로 실행${RESET}"
    echo -e "  ${CYAN}2${RESET})  iOS          ${DIM}iOS 시뮬레이터 실행${RESET}"
    echo -e "  ${CYAN}3${RESET})  AOS          ${DIM}Android 에뮬레이터 실행${RESET}"
    echo -e "  ${CYAN}4${RESET})  Metro        ${DIM}QR/dev menu만 실행${RESET}"
    echo ""
    if ! prompt_read mobile_storybook_target_choice "${BOLD}번호 선택: ${RESET}"; then
      echo -e "\n${YELLOW}입력이 취소되었습니다.${RESET}"
      exit 1
    fi

    case $mobile_storybook_target_choice in
      1|"") MOBILE_STORYBOOK_TARGET="web" ;;
      2) MOBILE_STORYBOOK_TARGET="ios" ;;
      3) MOBILE_STORYBOOK_TARGET="android" ;;
      4) MOBILE_STORYBOOK_TARGET="metro" ;;
      *) echo -e "${YELLOW}잘못된 번호: ${mobile_storybook_target_choice}${RESET}"; exit 1 ;;
    esac
  else
    MOBILE_STORYBOOK_TARGET="web"
  fi
}

for choice in $choices; do
  case $choice in
    1|core-api|start:core-api)
      FILTERS="$FILTERS --filter=core-api"; SERVICES="$SERVICES core-api"; HAS_BACKEND="true"
      ;;
    2|admin-web|start:admin-web)
      FILTERS="$FILTERS --filter=admin-web"; SERVICES="$SERVICES admin-web"; HAS_FRONTEND="true"
      ;;
    3|proposal-web|start:proposal-web)
      FILTERS="$FILTERS --filter=proposal-web"; SERVICES="$SERVICES proposal-web"
      ;;
    4|tool-storybook|start:tool-storybook)
      FILTERS="$FILTERS --filter=tool-storybook"; SERVICES="$SERVICES tool-storybook"
      ;;
    7|idp-api|start:idp-api)
      FILTERS="$FILTERS --filter=idp-api"; SERVICES="$SERVICES idp-api"; HAS_BACKEND="true"
      ;;
    8|idp-web|start:idp-web)
      FILTERS="$FILTERS --filter=idp-web"; SERVICES="$SERVICES idp-web"
      ;;
    5|mobile|start:mobile)
      set_mobile_target prompt
      set_mobile_runtime prompt
      ;;
    6|mobile-storybook|tool-mobile-storybook|start:mobile-storybook)
      set_mobile_storybook_target prompt
      ;;
    ios:mobile|mobile:ios|start:mobile:ios)
      set_mobile_target ios
      ;;
    android:mobile|aos:mobile|mobile:android|mobile:aos|start:mobile:android)
      set_mobile_target android
      ;;
    all:mobile|mobile:all|start:mobile:all)
      set_mobile_target all
      ;;
    local:mobile|mobile:local|start:mobile:local)
      set_mobile_runtime local
      ;;
    go:mobile|mobile:go|expo-go:mobile|mobile:expo-go|start:mobile:go)
      set_mobile_runtime go
      ;;
    web:mobile-storybook|mobile-storybook:web|tool-mobile-storybook:web|start:mobile-storybook:web)
      set_mobile_storybook_target web
      ;;
    ios:mobile-storybook|mobile-storybook:ios|tool-mobile-storybook:ios|start:mobile-storybook:ios)
      set_mobile_storybook_target ios
      ;;
    android:mobile-storybook|aos:mobile-storybook|mobile-storybook:android|mobile-storybook:aos|tool-mobile-storybook:android|start:mobile-storybook:android)
      set_mobile_storybook_target android
      ;;
    metro:mobile-storybook|mobile-storybook:metro|tool-mobile-storybook:metro|start:mobile-storybook:metro)
      set_mobile_storybook_target metro
      ;;
    *) echo -e "${YELLOW}잘못된 번호: ${choice}${RESET}"; exit 1 ;;
  esac
done

ensure_mobile_target
ensure_mobile_runtime
ensure_mobile_storybook_target

# 프론트엔드(admin) 선택 시 codegen 질문
CODEGEN_ENV=""
CODEGEN_TARGET=""
if [[ "$HAS_FRONTEND" == "true" && "$INTERACTIVE" == "true" ]]; then
  echo ""
  echo -e "${BOLD}📦 API 코드젠 대상${RESET}"
  echo -e "  ${CYAN}1${RESET})  전체         ${DIM}Core + IDP 클라이언트${RESET}"
  echo -e "  ${CYAN}2${RESET})  Server만     ${DIM}백엔드 서버 (port ${CORE_API_PORT_VALUE})${RESET}"
  echo -e "  ${CYAN}3${RESET})  IDP만        ${DIM}백엔드 서버 (port ${CORE_API_PORT_VALUE})${RESET}"
  echo -e "  ${CYAN}4${RESET})  건너뛰기     ${DIM}코드젠 실행 안 함${RESET}"
  echo ""
  if ! prompt_read codegen_target_choice "${BOLD}번호 선택: ${RESET}"; then
    echo -e "\n${YELLOW}입력이 취소되었습니다.${RESET}"
    exit 1
  fi

  case $codegen_target_choice in
    1) CODEGEN_TARGET="all" ;;
    2) CODEGEN_TARGET="server" ;;
    3) CODEGEN_TARGET="idp" ;;
    4|"") CODEGEN_TARGET="" ;;
    *) echo -e "${YELLOW}잘못된 번호: ${codegen_target_choice}${RESET}"; exit 1 ;;
  esac

  if [[ -n "$CODEGEN_TARGET" ]]; then
    echo ""
    echo -e "${BOLD}📦 API 코드젠 환경${RESET}"
    echo -e "  ${CYAN}1${RESET})  local      ${DIM}로컬 서버${RESET}"
    echo -e "  ${CYAN}2${RESET})  stg        ${DIM}스테이징 서버${RESET}"
    echo -e "  ${CYAN}3${RESET})  prod       ${DIM}운영 서버${RESET}"
    echo ""
    if ! prompt_read codegen_choice "${BOLD}번호 선택: ${RESET}"; then
      echo -e "\n${YELLOW}입력이 취소되었습니다.${RESET}"
      exit 1
    fi

    case $codegen_choice in
      1) CODEGEN_ENV="local" ;;
      2) CODEGEN_ENV="stg" ;;
      3) CODEGEN_ENV="prod" ;;
      *) echo -e "${YELLOW}잘못된 번호: ${codegen_choice}${RESET}"; exit 1 ;;
    esac
  fi
fi

# local 선택 시: 필요한 서버가 없으면 자동 추가
if [[ "$CODEGEN_ENV" == "local" ]]; then
  if [[ ("$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "server") && "$HAS_BACKEND" != "true" ]]; then
    FILTERS="$FILTERS --filter=core-api"
    SERVICES="$SERVICES core-api"
    HAS_BACKEND="true"
    echo -e "\n${YELLOW}⚠️  local 코드젠은 서버가 필요합니다. core-api를 자동으로 포함합니다.${RESET}"
  fi
  if [[ ("$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "idp") && "$HAS_BACKEND" != "true" ]]; then
    FILTERS="$FILTERS --filter=core-api"
    SERVICES="$SERVICES core-api"
    HAS_BACKEND="true"
    echo -e "${YELLOW}⚠️  local IDP 코드젠은 core-api를 자동으로 포함합니다.${RESET}"
  fi
fi

# admin-web은 core-api(비즈니스 API)와 idp-api·idp-web(발급자+로그인 UI)을
# 함께 필요로 한다 — 선택되지 않았으면 자동으로 포함한다.
if [[ " $SERVICES " == *" admin-web "* ]]; then
  for required_service in core-api idp-api idp-web; do
    if [[ " $SERVICES " != *" $required_service "* ]]; then
      FILTERS="$FILTERS --filter=$required_service"
      SERVICES="$SERVICES $required_service"
      if [[ "$required_service" != "idp-web" ]]; then
        HAS_BACKEND="true"
      fi
      echo -e "${YELLOW}⚠️  admin-web은 ${required_service}가 필요합니다. 자동으로 포함합니다.${RESET}"
    fi
  done
fi

# 인증 origin은 idp-web이다 — 발급자(issuer)와 로그인 UI가 같은 origin이어야
# oidc-provider 세션 쿠키가 interaction 제출 XHR에 실려간다. idp-web이 세션에
# 있을 때만 기본값을 덮어쓴다(단독 idp-api 세션은 .env 기본값 3007/3008 유지).
if [[ " $SERVICES " == *" idp-web "* ]]; then
  export OIDC_ISSUER="${OIDC_ISSUER:-$IDP_WEB_URL}"
  export OIDC_INTERACTION_BASE_URL="${OIDC_INTERACTION_BASE_URL:-$IDP_WEB_URL}"

  # idp-web dev의 온디맨드 컴파일로 첫 로그인 화면이 지연되는 것을 예열로
  # 흡수한다(로그인 플로우 경로를 백그라운드에서 한 번 방문). 더미 uid 방문은
  # interaction 조회 실패 에러 로그 1줄을 idp-api에 남긴다.
  (
    sleep 10
    curl -s -o /dev/null --max-time 60 "http://localhost:${IDP_WEB_PORT:-3008}/auth/forgot-password"
    curl -s -o /dev/null --max-time 60 "http://localhost:${IDP_WEB_PORT:-3008}/auth/login/__prewarm__"
    curl -s -o /dev/null --max-time 60 "http://localhost:${IDP_WEB_PORT:-3008}/auth/consent/__prewarm__"
  ) >/dev/null 2>&1 &
fi

# codegen 실행 커맨드 결정
resolve_codegen_cmd() {
  local env=$1
  local target=$2
  case $target in
    all)    echo "pnpm --filter=@cocrepo/api codegen:${env}" ;;
    server) echo "ORVAL_ENV=${env} pnpm --filter=@cocrepo/api codegen:server" ;;
    idp)    echo "ORVAL_ENV=${env} pnpm --filter=@cocrepo/api codegen:idp" ;;
  esac
}

run_local_infra_preflight() {
  if [[ "${START_SKIP_INFRA_CHECK:-}" =~ ^(y|yes|true|1|on)$ ]]; then
    echo -e "${DIM}START_SKIP_INFRA_CHECK enabled - skipping PostgreSQL/Redis preflight${RESET}"
    return
  fi

  local services=()

  if [[ "$HAS_BACKEND" == "true" ]]; then
    services+=("core-api")
  fi

  if [[ ${#services[@]} -eq 0 ]]; then
    return
  fi

  echo -e "${YELLOW}🔎 로컬 인프라 사전 점검 중...${RESET}"
  node ./scripts/check-local-infra.mjs "${services[@]}"
}

# 종료 시 선택된 서비스의 포트 프로세스 정리
#
# 기본 컨셉은 "이미 실행 중이면 종료하고 다시 시작"이다 — pre_cleanup이 점유
# 포트와 잔여 프로세스를 정리한 뒤 새로 띄운다. 단, 다른 start.sh 세션(또는
# 사용자 터미널)이 실행 중인 서비스를 건드리지 않고 재사용하려면
# START_REUSE=1. 재사용한 서비스는 이 세션이 소유한 것이 아니므로 종료
# cleanup 대상에서도 제외한다.
REUSED_SERVICES=""
reuse_enabled() {
  [[ "${START_REUSE:-}" =~ ^(y|yes|true|1|on)$ ]]
}
service_is_reused() {
  [[ " $REUSED_SERVICES " == *" $1 "* ]]
}
service_port_occupied() {
  local port
  port=$(get_port "$1")
  [[ -n "$port" ]] && lsof -nP -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1
}

cleanup() {
  echo ""
  echo -e "${YELLOW}🛑 서비스 종료 중...${RESET}"

  if [[ -n "$MOBILE_DEVTOOLS_PID" ]]; then
    kill "$MOBILE_DEVTOOLS_PID" 2>/dev/null || true
  fi

  if [[ -n "$MOBILE_PID" ]]; then
    kill "$MOBILE_PID" 2>/dev/null || true
  fi

  if [[ -n "$TURBO_PID" ]]; then
    kill "$TURBO_PID" 2>/dev/null || true
  fi

  for svc in $SERVICES; do
    if service_is_reused "$svc"; then
      echo -e "  ${DIM}포트 재사용 서비스 ${svc}는 이 세션 소유가 아니므로 종료하지 않음${RESET}"
      continue
    fi
    port=$(get_port "$svc")
    if [ -n "$port" ]; then
      pids=$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)
      if [ -n "$pids" ]; then
        echo -e "  ${DIM}포트 ${port} (${svc}) 프로세스 종료${RESET}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
      fi
    fi
  done
  echo -e "${GREEN}✅ 정리 완료${RESET}"
}
trap cleanup EXIT INT TERM

# 시작 전 선택된 서비스와 관련된 잔여 dev 프로세스 정리
#
# 기본적으로 점유 포트도 정리 대상이다(종료 후 재시작 컨셉). START_REUSE=1이면
# 포트가 점유된 서비스(다른 세션의 정상 실행)를 패턴 매칭 kill 대상에서 제외하고
# 재사용 목록에 넣는다. 재사용 중이 아닐 때 패턴 kill은 항상 수행해 바인딩에
# 실패한 채 남은 잔여 프로세스를 정리한다.
pre_cleanup_service_processes() {
  echo -e "${YELLOW}🧼 시작 전 관련 프로세스 정리 중...${RESET}"
  local cleaned="false"
  for svc in $SERVICES; do
    if reuse_enabled && service_port_occupied "$svc"; then
      REUSED_SERVICES="$REUSED_SERVICES $svc"
      port=$(get_port "$svc")
      echo -e "  ${YELLOW}⚠️  포트 ${port} (${svc}) 사용 중 — 다른 세션이 실행 중일 수 있어 정리하지 않고 재사용${RESET}"
      continue
    fi
    local pattern=""
    case $svc in
      core-api) pattern="turbo start:dev .*--filter=core-api|pnpm(\\.cjs)? --filter=core-api start:dev|apps/core/api/.+nest\\.js build --webpack --webpackPath webpack\\.config\\.js --watch|/apps/core/api/dist/main.js" ;;
      admin-web) pattern="turbo start:dev .*--filter=admin-web|pnpm(\\.cjs)? --filter=admin-web start:dev|apps/admin/web" ;;
      proposal-web) pattern="turbo start:dev .*--filter=proposal-web|pnpm(\\.cjs)? --filter=proposal-web start:dev|apps/proposal/web" ;;
      tool-storybook) pattern="turbo start:dev .*--filter=tool-storybook|pnpm(\\.cjs)? --filter=tool-storybook start:dev|apps/tool/storybook|storybook dev -p" ;;
      mobile) pattern="mobile-app@1.0.0 start|pnpm --filter=mobile-app exec expo start|expo start .*--port ${MOBILE_PORT_VALUE}" ;;
      mobile-storybook) pattern="tool-mobile-storybook@1.0.0|pnpm(\\.cjs)? --filter=tool-mobile-storybook|apps/tool/mobile-storybook|expo start .*--port ${MOBILE_STORYBOOK_PORT_VALUE}" ;;
      idp-api) pattern="turbo start:dev .*--filter=idp-api|pnpm(\\.cjs)? --filter=idp-api start:dev|apps/idp/api/.+nest\\.js build --webpack --webpackPath webpack\\.config\\.js --watch|/apps/idp/api/dist/main.js" ;;
      idp-web) pattern="turbo start:dev .*--filter=idp-web|pnpm(\\.cjs)? --filter=idp-web start:dev|apps/idp/web" ;;
    esac

    if [[ -n "$pattern" ]]; then
      pids=$(ps -ef | rg "$pattern" | rg -v "rg" | awk '{print $2}' | tr '\n' ' ' || true)
      if [[ -n "$pids" ]]; then
        cleaned="true"
        echo -e "  ${DIM}${svc} 관련 프로세스 종료${RESET}"
        kill -9 $pids 2>/dev/null || true
      fi
    fi
  done

  if [[ "$cleaned" == "false" ]]; then
    echo -e "  ${DIM}정리할 관련 프로세스 없음${RESET}"
  fi
}

# 시작 전 선택된 서비스 포트에 남아있는 잔여 프로세스 정리
# 재사용으로 표시된 서비스(점유 중)는 건드리지 않는다.
pre_cleanup_ports() {
  echo -e "${YELLOW}🧹 시작 전 포트 정리 중...${RESET}"
  local cleaned="false"
  for svc in $SERVICES; do
    if service_is_reused "$svc"; then
      continue
    fi
    port=$(get_port "$svc")
    if [ -n "$port" ]; then
      pids=$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)
      if [ -n "$pids" ]; then
        cleaned="true"
        echo -e "  ${DIM}포트 ${port} (${svc}) 기존 프로세스 종료${RESET}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        for _ in {1..10}; do
          if ! lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
            break
          fi
          sleep 0.2
        done
      fi
    fi
  done

  if [[ "$cleaned" == "false" ]]; then
    echo -e "  ${DIM}정리할 포트 없음${RESET}"
  fi
}

if [[ "$HAS_BACKEND" == "true" ]]; then
  start_local_infrastructure
fi
run_local_infra_preflight
if [[ "$HAS_BACKEND" == "true" ]]; then
  echo -e "${YELLOW}🗃️  데이터베이스 migration/bootstrap 실행 중...${RESET}"
  pnpm --filter=@cocrepo/prisma db:migrate:deploy
  LOCAL_BOOTSTRAP_ADMIN_EMAIL="$LOCAL_BOOTSTRAP_ADMIN_EMAIL" \
    LOCAL_BOOTSTRAP_ADMIN_PASSWORD="$LOCAL_BOOTSTRAP_ADMIN_PASSWORD" \
    LOCAL_BOOTSTRAP_ADMIN_NAME="${LOCAL_BOOTSTRAP_ADMIN_NAME:-Local Administrator}" \
    LOCAL_BOOTSTRAP_ADMIN_NICKNAME="${LOCAL_BOOTSTRAP_ADMIN_NICKNAME:-local-admin}" \
    pnpm --filter=@cocrepo/prisma db:bootstrap
fi
pre_cleanup_service_processes
pre_cleanup_ports

# 재사용으로 표시된 서비스는 시작 대상에서 제외한다(이미 포트가 응답 중).
if [[ -n "${REUSED_SERVICES// /}" ]]; then
  kept_filters=""
  kept_services=""
  for svc in $SERVICES; do
    if service_is_reused "$svc"; then
      continue
    fi
    kept_filters="$kept_filters --filter=$svc"
    kept_services="$kept_services $svc"
  done
  FILTERS="$kept_filters"
  SERVICES="$kept_services"
  echo -e "${YELLOW}♻️  재사용(이미 실행 중):${REUSED_SERVICES} / 이번 세션 시작:${SERVICES:- 없음}${RESET}"
fi

echo -e "\n${GREEN}▶${SERVICES} 시작${RESET}\n"

if [[ "$HAS_MOBILE" == "true" ]]; then
  echo -e "${DIM}모바일 실행 대상: $(resolve_mobile_target_label "$MOBILE_TARGET") / 실행 모드: $(resolve_mobile_runtime_label "$MOBILE_RUNTIME") / Metro port ${MOBILE_PORT_VALUE}${RESET}"
  if [[ "$MOBILE_RUNTIME" == "local" ]]; then
    echo -e "${DIM}local build는 development build(custom native app)가 기기에 설치되어 있어야 합니다.${RESET}"
  fi
  echo -e "${DIM}모바일 앱 연결 후 React Native DevTools를 자동으로 엽니다.${RESET}\n"
fi

if [[ "$HAS_MOBILE_STORYBOOK" == "true" ]]; then
  echo -e "${DIM}모바일 Storybook 실행 대상: $(resolve_mobile_storybook_target_label "$MOBILE_STORYBOOK_TARGET") / Metro port ${MOBILE_STORYBOOK_PORT_VALUE}${RESET}\n"
fi

has_turbo_services() {
  [[ -n "${FILTERS// /}" ]]
}

run_turbo_background() {
  if has_turbo_services; then
    turbo start:dev $FILTERS --concurrency=20 &
    TURBO_PID=$!
  fi
}

run_turbo_foreground() {
  if has_turbo_services; then
    turbo start:dev $FILTERS --concurrency=20
  fi
}

wait_for_turbo() {
  if [[ -n "$TURBO_PID" ]]; then
    wait "$TURBO_PID"
  fi
}

start_mobile_devtools_watcher() {
  if [[ "$HAS_MOBILE" != "true" ]]; then
    return
  fi

  node - "$MOBILE_PORT_VALUE" <<'NODE' >/dev/null 2>&1 &
const [rawPort] = process.argv.slice(2);
const port = Number(rawPort);
const origin = `http://127.0.0.1:${port}`;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findInspectableApp = (apps) =>
  [...apps]
    .reverse()
    .find(
      (app) =>
        app?.id &&
        app?.webSocketDebuggerUrl &&
        app?.reactNative?.logicalDeviceId
    );

(async () => {
  const deadline = Date.now() + 120000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${origin}/json/list`);
      if (response.ok) {
        const apps = await response.json();
        const app = findInspectableApp(apps);

        if (app?.id) {
          const url = new URL('/open-debugger', origin);
          url.searchParams.set('target', app.id);
          await fetch(url, {
            method: 'POST',
            signal: AbortSignal.timeout(1000),
          }).catch(() => null);
          return;
        }
      }
    } catch {}

    await wait(2000);
  }
})().catch(() => process.exit(0));
NODE
  MOBILE_DEVTOOLS_PID=$!
}

run_mobile() {
  if [[ "$HAS_MOBILE" != "true" ]]; then
    return
  fi

  local mobile_args=(pnpm --filter=mobile-app exec expo start --port "$MOBILE_PORT_VALUE")

  case $MOBILE_RUNTIME in
    local) mobile_args+=(--dev-client) ;;
    go) mobile_args+=(--go) ;;
  esac

  case $MOBILE_TARGET in
    ios) mobile_args+=(--ios) ;;
    android) mobile_args+=(--android) ;;
    all) mobile_args+=(--ios --android) ;;
  esac

  start_mobile_devtools_watcher
  "${mobile_args[@]}"
}

run_mobile_background() {
  if [[ "$HAS_MOBILE" != "true" ]]; then
    return
  fi

  run_mobile &
  MOBILE_PID=$!
}

run_mobile_storybook() {
  if [[ "$HAS_MOBILE_STORYBOOK" != "true" ]]; then
    return
  fi

  local storybook_script="web"

  case $MOBILE_STORYBOOK_TARGET in
    web) storybook_script="web" ;;
    ios) storybook_script="ios" ;;
    android) storybook_script="android" ;;
    metro) storybook_script="start:dev" ;;
  esac

  pnpm --filter=tool-mobile-storybook run "$storybook_script"
}

has_local_persistent_services() {
  [[ "$HAS_MOBILE" == "true" || "$HAS_MOBILE_STORYBOOK" == "true" ]]
}

run_local_persistent_services() {
  if [[ "$HAS_MOBILE" == "true" && "$HAS_MOBILE_STORYBOOK" == "true" ]]; then
    run_mobile_background
    run_mobile_storybook
    wait "$MOBILE_PID" 2>/dev/null || true
  elif [[ "$HAS_MOBILE" == "true" ]]; then
    run_mobile
  elif [[ "$HAS_MOBILE_STORYBOOK" == "true" ]]; then
    run_mobile_storybook
  fi
}

if [[ "$CODEGEN_ENV" == "local" ]]; then
  # local: 서버 먼저 띄우고 → health check → codegen → turbo에 join
  run_turbo_background

  # Server health check
  if [[ "$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "server" ]]; then
    echo -e "${DIM}Server(${CORE_API_PORT_VALUE}) 시작 대기 중...${RESET}"
    until curl -s -o /dev/null -w "%{http_code}" "http://localhost:${CORE_API_PORT_VALUE}/api-json" 2>/dev/null | grep -q "200"; do
      sleep 2
    done
    echo -e "${GREEN}✅ Server 준비 완료${RESET}"
  fi

  # IDP 코드젠도 통합 Swagger spec을 사용합니다.
  if [[ "$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "idp" ]]; then
    echo -e "${DIM}Swagger spec(${CORE_API_PORT_VALUE}) 시작 대기 중...${RESET}"
    until curl -s -o /dev/null -w "%{http_code}" "http://localhost:${CORE_API_PORT_VALUE}/api-json" 2>/dev/null | grep -q "200"; do
      sleep 2
    done
    echo -e "${GREEN}✅ Swagger spec 준비 완료${RESET}"
  fi

  echo -e "${GREEN}▶ API 코드젠 실행...${RESET}"
  CODEGEN_CMD=$(resolve_codegen_cmd "$CODEGEN_ENV" "$CODEGEN_TARGET")
  eval $CODEGEN_CMD
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}"

  if has_local_persistent_services; then
    run_local_persistent_services
  fi

  wait_for_turbo

elif [[ -n "$CODEGEN_ENV" ]]; then
  # stg/prod: 코드젠 먼저 실행 (서버 불필요)
  echo -e "${GREEN}▶ API 코드젠 (${CODEGEN_ENV} / ${CODEGEN_TARGET}) 실행...${RESET}"
  CODEGEN_CMD=$(resolve_codegen_cmd "$CODEGEN_ENV" "$CODEGEN_TARGET")
  eval $CODEGEN_CMD
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}\n"

  if has_local_persistent_services && has_turbo_services; then
    run_turbo_background
    run_local_persistent_services
    wait_for_turbo
  elif has_local_persistent_services; then
    run_local_persistent_services
  else
    run_turbo_foreground
  fi

else
  # 건너뛰기 또는 프론트엔드 미선택
  if has_local_persistent_services && has_turbo_services; then
    run_turbo_background
    run_local_persistent_services
    wait_for_turbo
  elif has_local_persistent_services; then
    run_local_persistent_services
  else
    run_turbo_foreground
  fi
fi
