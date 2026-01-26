#!/bin/bash
# ComfyUI 실행 스크립트

COMFYUI_DIR="${COMFYUI_DIR:-$HOME/ComfyUI}"
PORT="${COMFYUI_PORT:-8188}"
LISTEN="${COMFYUI_LISTEN:-127.0.0.1}"

# ComfyUI 설치 확인
if [ ! -d "$COMFYUI_DIR" ] || [ ! -f "$COMFYUI_DIR/main.py" ]; then
    echo "Error: ComfyUI가 설치되어 있지 않습니다."
    echo "먼저 install-comfyui.sh를 실행하세요."
    exit 1
fi

# 이미 실행 중인지 확인
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "ComfyUI가 이미 포트 $PORT에서 실행 중입니다."
    exit 0
fi

cd "$COMFYUI_DIR"

# 가상환경 활성화
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

echo "ComfyUI 시작 중... (포트: $PORT)"
echo "URL: http://$LISTEN:$PORT"

# MPS(Apple Silicon GPU) 사용하여 실행
python main.py --listen $LISTEN --port $PORT
