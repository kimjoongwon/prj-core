#!/bin/bash

# Agent Sync Hook - Codex 에이전트를 Claude/OpenCode 형식으로 동기화
# 환경 변수: CLAUDE_PROJECT_DIR

# 색상 정의
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$CLAUDE_PROJECT_DIR" || exit 0

SYNC_SCRIPT=".claude/scripts/sync-agents-from-codex.js"

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔄 Claude Code 에이전트 동기화 시작${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -f "$SYNC_SCRIPT" ]; then
  echo -e "${YELLOW}⚠️ 동기화 스크립트가 없어 건너뜁니다: ${SYNC_SCRIPT}${NC}"
  exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Codex 기준 에이전트 동기화 실행 중...${NC}"
node "$SYNC_SCRIPT" --write --prune

if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️ 동기화 실패${NC}"
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 동기화 완료${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# hook은 항상 성공으로 종료 (작업 흐름 중단 방지)
exit 0
