#!/bin/bash

# 서비스 시작 스크립트 - 복수 선택 가능

set -e

BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
DIM='\033[2m'
RESET='\033[0m'

# -- 인자 제거 (pnpm이 -- 를 전달할 수 있음)
ARGS=()
for arg in "$@"; do
  [[ "$arg" != "--" ]] && ARGS+=("$arg")
done

if [[ ${#ARGS[@]} -gt 0 ]]; then
  # 커맨드라인 인자로 전달된 경우
  choices="${ARGS[*]}"
else
  # 대화형 모드
  echo ""
  echo -e "${BOLD}🚀 서비스 시작${RESET}"
  echo ""
  echo -e "  ${CYAN}1${RESET})  server          ${DIM}백엔드 서버${RESET}"
  echo -e "  ${CYAN}2${RESET})  admin           ${DIM}어드민 프론트엔드${RESET}"
  echo -e "  ${CYAN}3${RESET})  idp-server      ${DIM}인증 서버 (백엔드)${RESET}"
  echo -e "  ${CYAN}4${RESET})  idp-client      ${DIM}인증 서버 (프론트엔드)${RESET}"
  echo -e "  ${CYAN}5${RESET})  storybook       ${DIM}스토리북${RESET}"
  echo -e "  ${CYAN}6${RESET})  proposal        ${DIM}기획서${RESET}"
  echo -e "  ${CYAN}7${RESET})  opencode-studio ${DIM}OpenCode Studio${RESET}"
  echo ""
  echo -e "  ${DIM}복수 선택 가능 (예: 1 2)${RESET}"
  echo ""
  echo -ne "${BOLD}번호 선택: ${RESET}"
  read -r choices
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

# 서비스별 포트 조회
get_port() {
  case $1 in
    server)          echo 3006 ;;
    admin)           echo 3000 ;;
    idp-server)      echo 3007 ;;
    idp-client)      echo 3008 ;;
    storybook)       echo 6006 ;;
    proposal)        echo 3001 ;;
    opencode-studio) echo 3010 ;;
  esac
}

for choice in $choices; do
  case $choice in
    1) FILTERS="$FILTERS --filter=server..."; SERVICES="$SERVICES server"; HAS_BACKEND="true" ;;
    2) FILTERS="$FILTERS --filter=admin"; SERVICES="$SERVICES admin"; HAS_FRONTEND="true" ;;
    3) FILTERS="$FILTERS --filter=idp-server..."; SERVICES="$SERVICES idp-server"; HAS_IDP="true" ;;
    4) FILTERS="$FILTERS --filter=idp-client"; SERVICES="$SERVICES idp-client"; HAS_FRONTEND="true" ;;
    5) FILTERS="$FILTERS --filter=storybook"; SERVICES="$SERVICES storybook" ;;
    6) FILTERS="$FILTERS --filter=proposal"; SERVICES="$SERVICES proposal"; HAS_FRONTEND="true" ;;
    7) FILTERS="$FILTERS --filter=opencode-studio"; SERVICES="$SERVICES opencode-studio"; HAS_FRONTEND="true" ;;
    *) echo -e "${YELLOW}잘못된 번호: ${choice}${RESET}"; exit 1 ;;
  esac
done

# 커맨드라인 인자 모드 여부
INTERACTIVE="true"
if [[ ${#ARGS[@]} -gt 0 ]]; then
  INTERACTIVE="false"
fi

# 프론트엔드(admin/proposal) 선택 시 codegen 질문
CODEGEN_ENV=""
CODEGEN_TARGET=""
if [[ "$HAS_FRONTEND" == "true" && "$INTERACTIVE" == "true" ]]; then
  echo ""
  echo -e "${BOLD}📦 API 코드젠 대상${RESET}"
  echo -e "  ${CYAN}1${RESET})  전체         ${DIM}Server + IDP${RESET}"
  echo -e "  ${CYAN}2${RESET})  Server만     ${DIM}백엔드 서버 (port 3006)${RESET}"
  echo -e "  ${CYAN}3${RESET})  IDP만        ${DIM}인증 서버 (port 3007)${RESET}"
  echo -e "  ${CYAN}4${RESET})  건너뛰기     ${DIM}코드젠 실행 안 함${RESET}"
  echo ""
  echo -ne "${BOLD}번호 선택: ${RESET}"
  read -r codegen_target_choice

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
    echo -ne "${BOLD}번호 선택: ${RESET}"
    read -r codegen_choice

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
    FILTERS="$FILTERS --filter=server..."
    SERVICES="$SERVICES server"
    HAS_BACKEND="true"
    echo -e "\n${YELLOW}⚠️  local 코드젠은 서버가 필요합니다. server를 자동으로 포함합니다.${RESET}"
  fi
  if [[ ("$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "idp") && "$HAS_IDP" != "true" ]]; then
    FILTERS="$FILTERS --filter=idp-server..."
    SERVICES="$SERVICES idp-server"
    HAS_IDP="true"
    echo -e "${YELLOW}⚠️  local 코드젠은 IDP 서버가 필요합니다. idp-server를 자동으로 포함합니다.${RESET}"
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

# 종료 시 선택된 서비스의 포트 프로세스 정리
cleanup() {
  echo ""
  echo -e "${YELLOW}🛑 서비스 종료 중...${RESET}"
  for svc in $SERVICES; do
    port=$(get_port "$svc")
    if [ -n "$port" ]; then
      pids=$(lsof -ti :"$port" 2>/dev/null || true)
      if [ -n "$pids" ]; then
        echo -e "  ${DIM}포트 ${port} (${svc}) 프로세스 종료${RESET}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
      fi
    fi
  done
  echo -e "${GREEN}✅ 정리 완료${RESET}"
}
trap cleanup EXIT INT TERM

echo -e "\n${GREEN}▶${SERVICES} 시작${RESET}\n"

if [[ "$CODEGEN_ENV" == "local" ]]; then
  # local: 서버 먼저 띄우고 → health check → codegen → turbo에 join
  turbo start:dev $FILTERS --concurrency=20 &
  TURBO_PID=$!

  # Server health check
  if [[ "$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "server" ]]; then
    echo -e "${DIM}Server(3006) 시작 대기 중...${RESET}"
    until curl -s -o /dev/null -w "%{http_code}" http://localhost:3006/api-json 2>/dev/null | grep -q "200"; do
      sleep 2
    done
    echo -e "${GREEN}✅ Server 준비 완료${RESET}"
  fi

  # IDP health check
  if [[ "$CODEGEN_TARGET" == "all" || "$CODEGEN_TARGET" == "idp" ]]; then
    echo -e "${DIM}IDP(3007) 시작 대기 중...${RESET}"
    until curl -s -o /dev/null -w "%{http_code}" http://localhost:3007/api-json 2>/dev/null | grep -q "200"; do
      sleep 2
    done
    echo -e "${GREEN}✅ IDP 준비 완료${RESET}"
  fi

  echo -e "${GREEN}▶ API 코드젠 실행...${RESET}"
  CODEGEN_CMD=$(resolve_codegen_cmd "$CODEGEN_ENV" "$CODEGEN_TARGET")
  eval $CODEGEN_CMD
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}"

  wait $TURBO_PID

elif [[ -n "$CODEGEN_ENV" ]]; then
  # stg/prod: 코드젠 먼저 실행 (서버 불필요)
  echo -e "${GREEN}▶ API 코드젠 (${CODEGEN_ENV} / ${CODEGEN_TARGET}) 실행...${RESET}"
  CODEGEN_CMD=$(resolve_codegen_cmd "$CODEGEN_ENV" "$CODEGEN_TARGET")
  eval $CODEGEN_CMD
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}\n"

  turbo start:dev $FILTERS --concurrency=20

else
  # 건너뛰기 또는 프론트엔드 미선택
  turbo start:dev $FILTERS --concurrency=20
fi
