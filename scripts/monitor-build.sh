#!/bin/bash

# 빌드 메모리 모니터링 스크립트

echo "🔧 Build Memory Monitor - 빌드 메모리 사용량 모니터링"
echo "=================================================="

# 시작 시간 기록
START_TIME=$(date +%s)

# 메모리 사용량 모니터링 함수
monitor_memory() {
    local pid=$1
    local max_memory=0
    
    while kill -0 $pid 2>/dev/null; do
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            memory=$(ps -o rss= -p $pid 2>/dev/null | awk '{print $1}')
        else
            # Linux
            memory=$(ps -o rss= -p $pid 2>/dev/null | awk '{print $1}')
        fi
        
        if [[ -n "$memory" && "$memory" -gt "$max_memory" ]]; then
            max_memory=$memory
        fi
        
        sleep 1
    done
    
    echo "📊 최대 메모리 사용량: $((max_memory / 1024)) MB"
}

# TypeScript 컴파일 단계
echo "1️⃣ TypeScript 컴파일 시작..."
NODE_OPTIONS='--max_old_space_size=4096' pnpm tsc -b &
TSC_PID=$!

monitor_memory $TSC_PID
wait $TSC_PID
TSC_EXIT_CODE=$?

if [ $TSC_EXIT_CODE -ne 0 ]; then
    echo "❌ TypeScript 컴파일 실패"
    exit $TSC_EXIT_CODE
fi

echo "✅ TypeScript 컴파일 완료"

# Vite 빌드 단계
echo "2️⃣ Vite 빌드 시작..."
NODE_OPTIONS='--max_old_space_size=4096' pnpm vite build &
VITE_PID=$!

monitor_memory $VITE_PID
wait $VITE_PID
VITE_EXIT_CODE=$?

if [ $VITE_EXIT_CODE -ne 0 ]; then
    echo "❌ Vite 빌드 실패"
    exit $VITE_EXIT_CODE
fi

# 완료 시간 계산
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "✅ 빌드 완료!"
echo "⏱️ 총 소요시간: ${DURATION}초"
echo "💡 메모리 사용량이 4GB를 넘으면 추가 최적화가 필요합니다."
