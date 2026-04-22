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
    exit 1
  fi

  # 대화형 모드
  echo ""
  echo -e "${BOLD}🚀 서비스 시작${RESET}"
  echo ""
  echo -e "  ${CYAN}1${RESET})  core-api        ${DIM}백엔드 서버${RESET}"
  echo -e "  ${CYAN}2${RESET})  admin-web       ${DIM}어드민 프론트엔드${RESET}"
  echo -e "  ${CYAN}3${RESET})  proposal-web    ${DIM}퍼블릭 제안 랜딩${RESET}"
  echo -e "  ${CYAN}4${RESET})  idp-api         ${DIM}인증 서버 (백엔드)${RESET}"
  echo -e "  ${CYAN}5${RESET})  idp-web         ${DIM}인증 서버 (프론트엔드)${RESET}"
  echo -e "  ${CYAN}6${RESET})  tool-storybook  ${DIM}스토리북${RESET}"
  echo -e "  ${CYAN}7${RESET})  mobile          ${DIM}Expo 모바일 앱${RESET}"
  echo ""
  echo -e "  ${DIM}복수 선택 가능 (예: 1 2 7)${RESET}"
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
HAS_IDP="false"
HAS_MOBILE="false"
MOBILE_TARGET=""
MOBILE_RUNTIME=""
TURBO_PID=""
MOBILE_DEVTOOLS_PID=""

# 서비스별 포트 조회
get_port() {
  case $1 in
    core-api)        echo "${CORE_API_PORT:-3006}" ;;
    admin-web)       echo "${ADMIN_WEB_PORT:-3000}" ;;
    proposal-web)    echo "${PROPOSAL_WEB_PORT:-3011}" ;;
    idp-api)         echo "${IDP_API_PORT:-3007}" ;;
    idp-web)         echo "${IDP_WEB_PORT:-3008}" ;;
    tool-storybook)  echo "${STORYBOOK_PORT:-6006}" ;;
    mobile)          echo "${MOBILE_PORT:-8081}" ;;
  esac
}

CORE_API_PORT_VALUE=$(get_port core-api)
IDP_API_PORT_VALUE=$(get_port idp-api)
MOBILE_PORT_VALUE=$(get_port mobile)

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
    4|idp-api|start:idp-api)
      FILTERS="$FILTERS --filter=idp-api"; SERVICES="$SERVICES idp-api"; HAS_IDP="true"
      ;;
    5|idp-web|start:idp-web)
      FILTERS="$FILTERS --filter=idp-web"; SERVICES="$SERVICES idp-web"; HAS_FRONTEND="true"
      ;;
    6|tool-storybook|start:tool-storybook)
      FILTERS="$FILTERS --filter=tool-storybook"; SERVICES="$SERVICES tool-storybook"
      ;;
    7|mobile|start:mobile)
      set_mobile_target prompt
      set_mobile_runtime prompt
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
    *) echo -e "${YELLOW}잘못된 번호: ${choice}${RESET}"; exit 1 ;;
  esac
done

ensure_mobile_target
ensure_mobile_runtime

# 프론트엔드(admin/idp-web) 선택 시 codegen 질문
CODEGEN_ENV=""
CODEGEN_TARGET=""
if [[ "$HAS_FRONTEND" == "true" && "$INTERACTIVE" == "true" ]]; then
  echo ""
  echo -e "${BOLD}📦 API 코드젠 대상${RESET}"
  echo -e "  ${CYAN}1${RESET})  전체         ${DIM}Server + IDP${RESET}"
  echo -e "  ${CYAN}2${RESET})  Server만     ${DIM}백엔드 서버 (port ${CORE_API_PORT_VALUE})${RESET}"
  echo -e "  ${CYAN}3${RESET})  IDP만        ${DIM}인증 서버 (port ${IDP_API_PORT_VALUE})${RESET}"
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
  if [[ ("$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "idp") && "$HAS_IDP" != "true" ]]; then
    FILTERS="$FILTERS --filter=idp-api"
    SERVICES="$SERVICES idp-api"
    HAS_IDP="true"
    echo -e "${YELLOW}⚠️  local 코드젠은 IDP 서버가 필요합니다. idp-api를 자동으로 포함합니다.${RESET}"
  fi
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

  if [[ "$HAS_IDP" == "true" ]]; then
    services+=("idp-api")
  fi

  if [[ ${#services[@]} -eq 0 ]]; then
    return
  fi

  echo -e "${YELLOW}🔎 로컬 인프라 사전 점검 중...${RESET}"
  node ./scripts/check-local-infra.mjs "${services[@]}"
}

# 종료 시 선택된 서비스의 포트 프로세스 정리
cleanup() {
  echo ""
  echo -e "${YELLOW}🛑 서비스 종료 중...${RESET}"

  if [[ -n "$MOBILE_DEVTOOLS_PID" ]]; then
    kill "$MOBILE_DEVTOOLS_PID" 2>/dev/null || true
  fi

  if [[ -n "$TURBO_PID" ]]; then
    kill "$TURBO_PID" 2>/dev/null || true
  fi

  for svc in $SERVICES; do
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
pre_cleanup_service_processes() {
  echo -e "${YELLOW}🧼 시작 전 관련 프로세스 정리 중...${RESET}"
  local cleaned="false"
  for svc in $SERVICES; do
    local pattern=""
    case $svc in
      core-api) pattern="turbo start:dev .*--filter=core-api|pnpm(\\.cjs)? --filter=core-api start:dev|apps/core/api/.+nest\\.js build --webpack --webpackPath webpack\\.config\\.js --watch|/apps/core/api/dist/main.js" ;;
      admin-web) pattern="turbo start:dev .*--filter=admin-web|pnpm(\\.cjs)? --filter=admin-web start:dev|apps/admin/web" ;;
      proposal-web) pattern="turbo start:dev .*--filter=proposal-web|pnpm(\\.cjs)? --filter=proposal-web start:dev|apps/proposal/web" ;;
      idp-api) pattern="turbo start:dev .*--filter=idp-api|pnpm(\\.cjs)? --filter=idp-api start:dev|apps/idp/api/.+nest\\.js build --webpack --webpackPath webpack\\.config\\.js --watch|/apps/idp/api/dist/main.js" ;;
      idp-web) pattern="turbo start:dev .*--filter=idp-web|pnpm(\\.cjs)? --filter=idp-web start:dev|apps/idp/web" ;;
      tool-storybook) pattern="turbo start:dev .*--filter=tool-storybook|pnpm(\\.cjs)? --filter=tool-storybook start:dev|apps/tool/storybook|STORYBOOK_REQUIRE_AUTH=true storybook dev|storybook dev -p" ;;
      mobile) pattern="mobile-app@1.0.0 start|pnpm --filter=mobile-app exec expo start|expo start .*--port ${MOBILE_PORT_VALUE}" ;;
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
pre_cleanup_ports() {
  echo -e "${YELLOW}🧹 시작 전 포트 정리 중...${RESET}"
  local cleaned="false"
  for svc in $SERVICES; do
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

run_local_infra_preflight
pre_cleanup_service_processes
pre_cleanup_ports

echo -e "\n${GREEN}▶${SERVICES} 시작${RESET}\n"

if [[ "$HAS_MOBILE" == "true" ]]; then
  echo -e "${DIM}모바일 실행 대상: $(resolve_mobile_target_label "$MOBILE_TARGET") / 실행 모드: $(resolve_mobile_runtime_label "$MOBILE_RUNTIME") / Metro port ${MOBILE_PORT_VALUE}${RESET}"
  if [[ "$MOBILE_RUNTIME" == "local" ]]; then
    echo -e "${DIM}local build는 development build(custom native app)가 기기에 설치되어 있어야 합니다.${RESET}"
  fi
  echo -e "${DIM}모바일 앱 연결 후 React Native DevTools를 자동으로 엽니다.${RESET}\n"
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

  # IDP health check
  if [[ "$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "idp" ]]; then
    echo -e "${DIM}IDP(${IDP_API_PORT_VALUE}) 시작 대기 중...${RESET}"
    until curl -s -o /dev/null -w "%{http_code}" "http://localhost:${IDP_API_PORT_VALUE}/api-json" 2>/dev/null | grep -q "200"; do
      sleep 2
    done
    echo -e "${GREEN}✅ IDP 준비 완료${RESET}"
  fi

  echo -e "${GREEN}▶ API 코드젠 실행...${RESET}"
  CODEGEN_CMD=$(resolve_codegen_cmd "$CODEGEN_ENV" "$CODEGEN_TARGET")
  eval $CODEGEN_CMD
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}"

  if [[ "$HAS_MOBILE" == "true" ]]; then
    run_mobile
  fi

  wait_for_turbo

elif [[ -n "$CODEGEN_ENV" ]]; then
  # stg/prod: 코드젠 먼저 실행 (서버 불필요)
  echo -e "${GREEN}▶ API 코드젠 (${CODEGEN_ENV} / ${CODEGEN_TARGET}) 실행...${RESET}"
  CODEGEN_CMD=$(resolve_codegen_cmd "$CODEGEN_ENV" "$CODEGEN_TARGET")
  eval $CODEGEN_CMD
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}\n"

  if [[ "$HAS_MOBILE" == "true" && has_turbo_services ]]; then
    run_turbo_background
    run_mobile
    wait_for_turbo
  elif [[ "$HAS_MOBILE" == "true" ]]; then
    run_mobile
  else
    run_turbo_foreground
  fi

else
  # 건너뛰기 또는 프론트엔드 미선택
  if [[ "$HAS_MOBILE" == "true" && has_turbo_services ]]; then
    run_turbo_background
    run_mobile
    wait_for_turbo
  elif [[ "$HAS_MOBILE" == "true" ]]; then
    run_mobile
  else
    run_turbo_foreground
  fi
fi
