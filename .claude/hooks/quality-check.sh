#!/bin/bash
# Claude 작업 완료 후 코드 품질 검사를 실행하는 스크립트
# 에러 발생 시 exit 2를 반환하여 Claude가 수정하도록 유도

cd "$CLAUDE_PROJECT_DIR"

has_error=false

# 1. Lint 검사
echo "🔍 Lint 검사 중..."
lint_output=$(pnpm lint 2>&1) || {
    has_error=true
    echo "$lint_output"
    echo ""
    echo "❌ Lint 에러 발견"
    echo ""
}

# 2. Format 검사
echo "🔍 Format 검사 중..."
format_output=$(pnpm format 2>&1) || {
    has_error=true
    echo "$format_output"
    echo ""
    echo "❌ Format 에러 발견"
    echo ""
}

# 3. Type 검사
echo "🔍 Type 검사 중..."
typecheck_output=$(pnpm type-check 2>&1) || {
    has_error=true
    echo "$typecheck_output"
    echo ""
    echo "❌ Type 에러 발견"
    echo ""
}

# 에러가 있으면 Claude에게 피드백 전달 후 차단
if [ "$has_error" = true ]; then
    echo ""
    echo "================================"
    echo "⚠️ 코드 품질 검사에서 에러가 발견되었습니다."
    echo "위 에러들을 수정해주세요."
    echo "================================"
    exit 2  # exit 2 = 작업 차단, Claude가 다시 시도
fi

echo "✅ 모든 코드 품질 검사 통과"
exit 0
