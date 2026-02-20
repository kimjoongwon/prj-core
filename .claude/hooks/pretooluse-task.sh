#!/bin/bash
# PreToolUse Task hook - Task 도구 실행 시 에이전트 시작 이벤트 처리
# stdin: Claude Code tool_use JSON

# stdin에서 JSON 읽기 (한 번만)
INPUT=$(cat)

# 에이전트 타입과 설명 파싱
AGENT_TYPE=$(echo "$INPUT" | jq -r '.tool_input.subagent_type // .tool_input.subagentType // empty' 2>/dev/null || echo "")
if [ -z "$AGENT_TYPE" ] || [ "$AGENT_TYPE" = "null" ]; then
  AGENT_TYPE="task"
fi
DESCRIPTION=$(echo "$INPUT" | jq -r '.tool_input.description // ""' 2>/dev/null || echo "")

# macOS 알림 (서브에이전트 시작)
NOTIF_TEXT="${AGENT_TYPE}: ${DESCRIPTION}"
osascript -e "display notification \"${NOTIF_TEXT}\" with title \"에이전트 시작\" sound name \"Submarine\"" 2>/dev/null || true

# 웹 비주얼라이저에 시작 이벤트 전송 (서버 없으면 조용히 무시)
DESC_SAFE=$(echo "${DESCRIPTION}" | head -c 200 | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | tr '\n' ' ')
curl -s --max-time 1 -X POST http://localhost:9333/event \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"start\",\"agent\":\"${AGENT_TYPE}\",\"desc\":\"${DESC_SAFE}\"}" \
  2>/dev/null || true
