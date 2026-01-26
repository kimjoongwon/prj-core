#!/bin/bash
# ComfyUI 설치 스크립트 (macOS Apple Silicon)

set -e

COMFYUI_DIR="${COMFYUI_DIR:-$HOME/ComfyUI}"

echo "=== ComfyUI 설치 스크립트 ==="
echo "설치 경로: $COMFYUI_DIR"
echo ""

# 이미 설치되어 있는지 확인
if [ -d "$COMFYUI_DIR" ] && [ -f "$COMFYUI_DIR/main.py" ]; then
    echo "ComfyUI가 이미 설치되어 있습니다: $COMFYUI_DIR"
    echo "재설치하려면 해당 폴더를 삭제 후 다시 실행하세요."
    exit 0
fi

# Git 확인
if ! command -v git &> /dev/null; then
    echo "Error: git이 설치되어 있지 않습니다."
    exit 1
fi

# Python 확인
if ! command -v python3 &> /dev/null; then
    echo "Error: python3가 설치되어 있지 않습니다."
    exit 1
fi

echo "1. ComfyUI 클론 중..."
git clone https://github.com/comfyanonymous/ComfyUI.git "$COMFYUI_DIR"

echo ""
echo "2. 가상환경 생성 중..."
cd "$COMFYUI_DIR"
python3 -m venv venv

echo ""
echo "3. 의존성 설치 중 (시간이 걸릴 수 있습니다)..."
source venv/bin/activate

# pip 업그레이드
pip install --upgrade pip

# PyTorch (Apple Silicon MPS 지원)
pip install torch torchvision torchaudio

# ComfyUI 의존성
pip install -r requirements.txt

echo ""
echo "=== 설치 완료 ==="
echo "ComfyUI 경로: $COMFYUI_DIR"
echo ""
echo "실행 방법:"
echo "  cd $COMFYUI_DIR"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "또는 start-comfyui.sh 스크립트를 사용하세요."
