#!/bin/bash

# K8s 클러스터의 Redis에 포트포워딩하는 스크립트
# pnpm start:server:dev 실행 시 자동으로 호출됨

set -e

echo "🔐 Redis 비밀번호 가져오는 중..."

# Redis 비밀번호 가져오기
export REDIS_PASSWORD=$(kubectl get secret --namespace redis redis -o jsonpath="{.data.redis-password}" | base64 -d)

if [ -z "$REDIS_PASSWORD" ]; then
    echo "❌ Redis 비밀번호를 가져오지 못했습니다. kubectl 설정을 확인하세요."
    exit 1
fi

echo "✅ Redis 비밀번호 획득 완료"

# 기존 포트포워딩 프로세스 종료 (있는 경우)
echo "🔄 기존 Redis 포트포워딩 정리 중..."
pkill -f "kubectl port-forward.*redis-master.*6379" 2>/dev/null || true

# 잠시 대기
sleep 1

# 포트포워딩 시작 (백그라운드)
echo "🚀 Redis 포트포워딩 시작 (127.0.0.1:6379)..."
kubectl port-forward --namespace redis svc/redis-master 6379:6379 &
PORT_FORWARD_PID=$!

# 포트포워딩 PID 저장 (정리용)
echo $PORT_FORWARD_PID > /tmp/redis-port-forward.pid

# 포트포워딩이 준비될 때까지 대기
echo "⏳ 포트포워딩 준비 대기 중..."
sleep 3

# 연결 테스트
echo "🔍 Redis 연결 테스트 중..."
if redis-cli -h 127.0.0.1 -p 6379 -a "$REDIS_PASSWORD" ping 2>/dev/null | grep -q "PONG"; then
    echo "✅ Redis 연결 성공!"
else
    echo "⚠️ Redis 연결 테스트 실패 (redis-cli가 없거나 아직 준비 중일 수 있음)"
    echo "   서버가 시작되면 자동으로 연결됩니다."
fi

echo ""
echo "📝 Redis 환경변수:"
echo "   REDIS_HOST=127.0.0.1"
echo "   REDIS_PORT=6379"
echo "   REDIS_PASSWORD=(설정됨)"
echo ""

# 환경변수 설정
export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379

# 종료 시 포트포워딩 정리
cleanup() {
    echo ""
    echo "🛑 Redis 포트포워딩 종료 중..."
    if [ -f /tmp/redis-port-forward.pid ]; then
        kill $(cat /tmp/redis-port-forward.pid) 2>/dev/null || true
        rm /tmp/redis-port-forward.pid
    fi
    pkill -f "kubectl port-forward.*redis-master.*6379" 2>/dev/null || true
    echo "✅ 정리 완료"
}

trap cleanup EXIT INT TERM

# 서버 실행 (패키지 watch + 서버)
echo "🚀 NestJS 서버 시작 중..."
cd "$(dirname "$0")/.."
# turbo start:dev --filter='./packages/*' --filter=server --concurrency=20
turbo start:dev --filter=server
