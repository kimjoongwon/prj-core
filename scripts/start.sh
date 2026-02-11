#!/bin/bash

# 서비스 시작 스크립트 - 복수 선택 가능

set -e

BOLD='\033[1m'
CYAN='\033[36m'
GREEN='\033[32m'
YELLOW='\033[33m'
DIM='\033[2m'
RESET='\033[0m'

echo ""
echo -e "${BOLD}🚀 서비스 시작${RESET}"
echo ""
echo -e "  ${CYAN}1${RESET})  server       ${DIM}백엔드 서버${RESET}"
echo -e "  ${CYAN}2${RESET})  admin        ${DIM}어드민 프론트엔드${RESET}"
echo -e "  ${CYAN}3${RESET})  idp          ${DIM}인증 서버${RESET}"
echo -e "  ${CYAN}4${RESET})  storybook    ${DIM}스토리북${RESET}"
echo -e "  ${CYAN}5${RESET})  proposal     ${DIM}기획서${RESET}"
echo ""
echo -e "  ${DIM}복수 선택 가능 (예: 1 2)${RESET}"
echo ""
echo -ne "${BOLD}번호 선택: ${RESET}"
read -r choices

if [[ -z "$choices" ]]; then
  echo -e "\n${YELLOW}선택이 없습니다.${RESET}"
  exit 1
fi

FILTERS=""
SERVICES=""
HAS_FRONTEND="false"
HAS_BACKEND="false"

for choice in $choices; do
  case $choice in
    1) FILTERS="$FILTERS --filter=server..."; SERVICES="$SERVICES server"; HAS_BACKEND="true" ;;
    2) FILTERS="$FILTERS --filter=admin"; SERVICES="$SERVICES admin"; HAS_FRONTEND="true" ;;
    3) FILTERS="$FILTERS --filter=idp..."; SERVICES="$SERVICES idp" ;;
    4) FILTERS="$FILTERS --filter=storybook"; SERVICES="$SERVICES storybook" ;;
    5) FILTERS="$FILTERS --filter=proposal"; SERVICES="$SERVICES proposal"; HAS_FRONTEND="true" ;;
    *) echo -e "${YELLOW}잘못된 번호: ${choice}${RESET}"; exit 1 ;;
  esac
done

# 프론트엔드(admin/proposal) 선택 시 codegen 환경 질문
CODEGEN_ENV=""
if [[ "$HAS_FRONTEND" == "true" ]]; then
  echo ""
  echo -e "${BOLD}📦 API 코드젠 환경${RESET}"
  echo -e "  ${CYAN}1${RESET})  local      ${DIM}로컬 서버 (localhost:3006)${RESET}"
  echo -e "  ${CYAN}2${RESET})  stg        ${DIM}스테이징 서버${RESET}"
  echo -e "  ${CYAN}3${RESET})  prod       ${DIM}운영 서버${RESET}"
  echo -e "  ${CYAN}4${RESET})  건너뛰기   ${DIM}코드젠 실행 안 함${RESET}"
  echo ""
  echo -ne "${BOLD}번호 선택: ${RESET}"
  read -r codegen_choice

  case $codegen_choice in
    1) CODEGEN_ENV="local" ;;
    2) CODEGEN_ENV="stg" ;;
    3) CODEGEN_ENV="prod" ;;
    4|"") CODEGEN_ENV="" ;;
    *) echo -e "${YELLOW}잘못된 번호: ${codegen_choice}${RESET}"; exit 1 ;;
  esac
fi

# local 선택 시: 백엔드 없으면 자동 추가
if [[ "$CODEGEN_ENV" == "local" && "$HAS_BACKEND" != "true" ]]; then
  FILTERS="$FILTERS --filter=server..."
  SERVICES="$SERVICES server"
  HAS_BACKEND="true"
  echo -e "\n${YELLOW}⚠️  local 코드젠은 서버가 필요합니다. server를 자동으로 포함합니다.${RESET}"
fi

echo -e "\n${GREEN}▶${SERVICES} 시작${RESET}\n"

if [[ "$CODEGEN_ENV" == "local" ]]; then
  # local: 서버 먼저 띄우고 → health check → codegen → turbo에 join
  turbo start:dev $FILTERS --concurrency=20 &
  TURBO_PID=$!

  echo -e "${DIM}서버 시작 대기 중...${RESET}"
  until curl -s -o /dev/null -w "%{http_code}" http://localhost:3006/api-json 2>/dev/null | grep -q "200"; do
    sleep 2
  done

  echo -e "${GREEN}✅ 서버 준비 완료. API 코드젠 실행...${RESET}"
  pnpm --filter=@cocrepo/api codegen:local
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}"

  wait $TURBO_PID

elif [[ -n "$CODEGEN_ENV" ]]; then
  # stg/prod: 코드젠 먼저 실행 (서버 불필요)
  echo -e "${GREEN}▶ API 코드젠 (${CODEGEN_ENV}) 실행...${RESET}"
  pnpm --filter=@cocrepo/api codegen:${CODEGEN_ENV}
  echo -e "${GREEN}✅ API 코드젠 완료${RESET}\n"

  turbo start:dev $FILTERS --concurrency=20

else
  # 건너뛰기 또는 프론트엔드 미선택
  turbo start:dev $FILTERS --concurrency=20
fi
