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

for choice in $choices; do
  case $choice in
    1) FILTERS="$FILTERS --filter=server..."; SERVICES="$SERVICES server" ;;
    2) FILTERS="$FILTERS --filter=admin"; SERVICES="$SERVICES admin" ;;
    3) FILTERS="$FILTERS --filter=idp..."; SERVICES="$SERVICES idp" ;;
    4) FILTERS="$FILTERS --filter=storybook"; SERVICES="$SERVICES storybook" ;;
    5) FILTERS="$FILTERS --filter=proposal"; SERVICES="$SERVICES proposal" ;;
    *) echo -e "${YELLOW}잘못된 번호: ${choice}${RESET}"; exit 1 ;;
  esac
done

echo -e "\n${GREEN}▶${SERVICES} 시작${RESET}\n"
turbo start:dev $FILTERS --concurrency=20
