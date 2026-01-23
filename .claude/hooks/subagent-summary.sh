#!/bin/bash

# SubagentStop hook - 서브에이전트 완료 시 요약 출력
# 환경 변수: CLAUDE_SUBAGENT_TYPE, CLAUDE_SUBAGENT_PROMPT, CLAUDE_SUBAGENT_RESULT

# 색상 정의
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 구분선
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 에이전트 완료${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 에이전트 타입
if [ -n "$CLAUDE_SUBAGENT_TYPE" ]; then
  echo -e "${YELLOW}📦 Agent:${NC} $CLAUDE_SUBAGENT_TYPE"
fi

# 작업 내용 (프롬프트 첫 줄 또는 요약)
if [ -n "$CLAUDE_SUBAGENT_PROMPT" ]; then
  # 프롬프트에서 첫 100자만 추출
  SUMMARY=$(echo "$CLAUDE_SUBAGENT_PROMPT" | head -c 100 | tr '\n' ' ')
  if [ ${#CLAUDE_SUBAGENT_PROMPT} -gt 100 ]; then
    SUMMARY="$SUMMARY..."
  fi
  echo -e "${YELLOW}📋 Task:${NC} $SUMMARY"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
