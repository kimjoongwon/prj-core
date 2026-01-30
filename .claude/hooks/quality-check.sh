#!/bin/bash

# Stop hook - 작업 완료 시 타입 체크 & 린트 체크 실행
# 환경 변수: CLAUDE_PROJECT_DIR

# 색상 정의
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

cd "$CLAUDE_PROJECT_DIR" || exit 0

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔍 품질 검사 시작${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 1. TypeScript 타입 체크
echo ""
echo -e "${YELLOW}📋 TypeScript 타입 체크 중...${NC}"
TYPE_OUTPUT=$(npx tsc --noEmit --pretty 2>&1)
TYPE_EXIT_CODE=$?

if [ $TYPE_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ 타입 체크 통과${NC}"
else
  echo -e "${RED}❌ 타입 에러 발견${NC}"
  echo "$TYPE_OUTPUT" | head -50
  if [ $(echo "$TYPE_OUTPUT" | wc -l) -gt 50 ]; then
    echo -e "${YELLOW}... (더 많은 에러가 있음)${NC}"
  fi
fi

# 2. Biome 린트/포맷 체크
echo ""
echo -e "${YELLOW}📋 Biome 린트/포맷 체크 중...${NC}"
LINT_OUTPUT=$(npx biome check . 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ 린트/포맷 체크 통과${NC}"
else
  echo -e "${RED}❌ 린트/포맷 에러 발견${NC}"
  echo "$LINT_OUTPUT" | head -30
  if [ $(echo "$LINT_OUTPUT" | wc -l) -gt 30 ]; then
    echo -e "${YELLOW}... (더 많은 에러가 있음)${NC}"
  fi
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 결과 요약
if [ $TYPE_EXIT_CODE -eq 0 ] && [ $LINT_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ 모든 품질 검사 통과${NC}"
else
  echo -e "${YELLOW}⚠️ 품질 검사 이슈 발견 - 확인 필요${NC}"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# hook은 항상 성공으로 종료 (작업 흐름 중단 방지)
exit 0
