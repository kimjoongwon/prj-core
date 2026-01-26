#!/bin/bash
# ComfyUI 중지 스크립트

PORT="${COMFYUI_PORT:-8188}"

# 포트에서 실행 중인 프로세스 찾기
PID=$(lsof -t -i :$PORT 2>/dev/null)

if [ -z "$PID" ]; then
    echo "ComfyUI가 실행 중이지 않습니다. (포트: $PORT)"
    exit 0
fi

echo "ComfyUI 중지 중... (PID: $PID)"
kill $PID 2>/dev/null

# 종료 대기
sleep 2

# 강제 종료 필요 시
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "강제 종료 중..."
    kill -9 $PID 2>/dev/null
fi

echo "ComfyUI가 중지되었습니다."
