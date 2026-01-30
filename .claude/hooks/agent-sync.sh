#!/bin/bash

# Agent Sync Hook - OpenCode 에이전트를 Claude Code 형식으로 변환
# 환경 변수: CLAUDE_PROJECT_DIR

# 색상 정의
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$CLAUDE_PROJECT_DIR" || exit 0

AGENTS_DIR=".claude/agents"

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔄 Claude Code 에이전트 동기화 시작${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 최근 수정된 에이전트 파일 찾기 (마지막 5분 이내)
RECENTLY_MODIFIED=$(find "$AGENTS_DIR" -name "*.md" -mmin -5 -not -name "_TEMPLATE.md" 2>/dev/null)

if [ -z "$RECENTLY_MODIFIED" ]; then
  echo -e "${GREEN}✅ 최근 수정된 에이전트 없음${NC}"
  exit 0
fi

echo ""
echo -e "${YELLOW}📋 최근 수정된 에이전트:${NC}"
echo "$RECENTLY_MODIFIED" | while read -r file; do
  echo "  - $(basename "$file")"
done

echo ""
echo -e "${YELLOW}🔄 Claude Code 형식으로 변환 중...${NC}"

# 각 수정된 파일을 변환
echo "$RECENTLY_MODIFIED" | while read -r file; do
  filename=$(basename "$file" .md)

  echo ""
  echo -e "${CYAN}  처리 중: ${filename}${NC}"

  # OpenCode 에이전트를 Claude Code 형식으로 변환
  # (실제 변환 로직은 node 스크립트로 분리)
  node .claude/scripts/convert-agent-to-claude.js "$file"

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✅ 변환 완료: ${filename}${NC}"
  else
    echo -e "${YELLOW}  ⚠️ 변환 실패: ${filename}${NC}"
  fi
done

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 동기화 완료${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# hook은 항상 성공으로 종료 (작업 흐름 중단 방지)
exit 0
