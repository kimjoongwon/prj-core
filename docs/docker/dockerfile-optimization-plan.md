# Dockerfile.server 최적화 계획

## 📋 현재 상황 분석

### 기존 Dockerfile 문제점
- **비효율적인 레이어 구조**: 불필요한 WORKDIR 변경과 중복된 설정
- **의존성 설치 비효율**: lockfile과 package.json 변경 감지 최적화 부족  
- **빌드 단계 비최적화**: Docker 레이어 캐싱 활용 미흡
- **이미지 크기 비최적화**: 불필요한 전역 패키지 설치

### 환경 조건
- ✅ **Prisma Client**: 이미 `packages/shared-schema/generated/`에 커밋됨 → 생성 단계 불필요
- ✅ **컨테이너 런타임**: Podman 사용 → BuildKit 의존 기능 제외
- ✅ **Jenkins CI**: 영구 저장소 마운트 → pnpm store 공유 최적화 가능

## 🎯 최적화 목표

1. **의존성 설치 캐싱 최대화**: package.json 변경 시에만 재설치
2. **Jenkins pnpm Store 활용**: 영구 저장소로 의존성 재사용
3. **Podman 호환성**: BuildKit 의존 기능 제외한 순수 레이어 캐싱
4. **빌드 시간 최소화**: 소스 코드 변경 시에만 재빌드
5. **이미지 크기 최적화**: 프로덕션 런타임 파일만 포함

## 🔄 최적화 전략

### 1단계: pnpm Store 영구 저장소 활용

#### Jenkins 마운트 설정
```bash
# Jenkins에서 영구 볼륨 생성 (한 번만)
podman volume create jenkins-pnpm-store

# 빌드 시 마운트
podman build -v jenkins-pnpm-store:/pnpm-store -f devops/Dockerfile.server -t server:latest .
```

#### Dockerfile 내 pnpm Store 설정
```dockerfile
FROM node:22-alpine AS base
ARG PNPM_VERSION=9.6.0
ENV PNPM_HOME=/usr/local/bin
ENV PNPM_STORE_PATH=/pnpm-store  # 마운트된 store 경로
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
RUN pnpm config set store-dir /pnpm-store  # store 경로 설정
```

### 2단계: 의존성 레이어 최적화

#### 의존성 정보만 먼저 복사
```dockerfile
FROM base AS deps
# lockfile과 package.json만 먼저 복사 (변경 빈도 낮음)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY packages/*/package.json packages/*/
COPY apps/server/package.json apps/server/

# 마운트된 store 활용하여 설치 (package.json 변경 시에만 재실행)
RUN pnpm install --frozen-lockfile
```

### 3단계: 소스 코드 및 빌드 레이어

#### 소스 코드 복사 및 빌드
```dockerfile
FROM base AS builder
# 의존성 복사 (deps 레이어에서)
COPY --from=deps /app/node_modules ./node_modules

# 소스 코드 복사 (이미 커밋된 Prisma Client 포함)
COPY . .

# Turbo 빌드 (소스 변경 시에만 재실행)
RUN pnpm turbo build --filter=server
```

### 4단계: 프로덕션 이미지 최적화

#### 런타임 파일만 선별 복사
```dockerfile
FROM node:22-alpine AS runtime
WORKDIR /app

# 런타임에 필요한 파일만 복사
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/shared-schema/generated ./packages/shared-schema/generated  
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json

ENV NODE_ENV=production
ENV DOCKER_ENV=true
EXPOSE 8080

CMD ["node", "/app/apps/server/dist/main"]
```

## 📊 예상 성능 개선

### 레이어별 캐시 효과

| 빌드 시나리오 | pnpm Store | Docker Layer | 총 개선 효과 |
|---------------|------------|--------------|-------------|
| **첫 빌드** | ❌ | ❌ | 0% (기준점) |
| **의존성 동일, 소스 변경** | ✅ | ✅ | **80-90%** |
| **소스만 변경** | ✅ | ✅ | **70-85%** |  
| **의존성 추가** | 🔄 | ❌ | **60-75%** |
| **package.json만 변경** | 🔄 | ✅ | **40-50%** |

### 빌드 시간 단축 예상

#### 현재 vs 최적화 후
- **첫 빌드**: 현재와 유사 (store 구축 시간 포함)
- **두 번째 이후**: **70-90% 단축** (store + 레이어 캐시 활용)
- **소스만 변경**: **60-70% 단축** (의존성 레이어 캐시 히트)

## 🔧 세부 최적화 포인트

### 1. Podman 특화 최적화

#### BuildKit 의존 기능 제외
- `--mount=type=cache` 제거 (Podman 호환성)
- 순수 레이어 캐싱에 의존
- 마운트 볼륨을 통한 pnpm store 공유

#### 레이어 순서 최적화
```
변경 빈도: 낮음 → 높음
1. 시스템 패키지 설치 (거의 변경 안 됨)
2. pnpm 설정 (거의 변경 안 됨)
3. 의존성 정보 (가끔 변경됨)
4. 의존성 설치 (package.json 변경 시)
5. 소스 코드 (자주 변경됨)
6. 빌드 실행 (소스 변경 시)
```

### 2. .dockerignore 최적화

```dockerignore
# 빌드 컨텍스트 최소화로 전송 시간 단축
node_modules
.turbo
dist
.git
docs
*.md
.env.local
.env.development.local
coverage
.nyc_output

# IDE 관련 파일
.vscode
.idea
*.swp
*.swo

# 로그 파일
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 3. pnpm Store 관리 최적화

#### Store 상태 최적화 (선택적)
```dockerfile
# store 무결성 확인 및 불필요한 패키지 정리
RUN pnpm store prune
```

#### 의존성 사전 캐싱 (선택적)
```dockerfile
# 자주 사용되는 도구들 사전 설치
RUN pnpm config set store-dir /pnpm-store
```

## 🎯 Jenkins Pipeline 통합

### Pipeline 스크립트 예시

```groovy
pipeline {
    agent any
    
    environment {
        PNPM_STORE_VOLUME = 'jenkins-pnpm-store'
        IMAGE_NAME = 'server'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Setup') {
            steps {
                script {
                    // pnpm store 볼륨 생성 (존재하지 않을 경우)
                    sh """
                        podman volume ls | grep ${PNPM_STORE_VOLUME} || \
                        podman volume create ${PNPM_STORE_VOLUME}
                    """
                }
            }
        }
        
        stage('Build') {
            steps {
                sh """
                    podman build \
                        -v ${PNPM_STORE_VOLUME}:/pnpm-store \
                        -f devops/Dockerfile.server \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \
                        -t ${IMAGE_NAME}:latest \
                        .
                """
            }
        }
        
        stage('Store Maintenance') {
            // 주기적으로 store 정리 (선택적)
            when {
                expression { 
                    return currentBuild.number % 10 == 0  // 10번째 빌드마다
                }
            }
            steps {
                sh """
                    podman run --rm \
                        -v ${PNPM_STORE_VOLUME}:/pnpm-store \
                        node:22-alpine \
                        sh -c 'corepack enable && pnpm store prune'
                """
            }
        }
    }
    
    post {
        always {
            // 빌드 시간 및 캐시 효율성 로깅
            script {
                sh "echo 'Build completed in: ${currentBuild.duration}ms'"
            }
        }
    }
}
```

## 💡 추가 최적화 아이디어

### 1. Multi-architecture 지원
```dockerfile
# ARM64/AMD64 동시 지원
FROM --platform=$BUILDPLATFORM node:22-alpine AS base
```

### 2. 헬스체크 추가
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node /app/apps/server/dist/health-check.js || exit 1
```

### 3. 보안 강화
```dockerfile
# 비루트 사용자로 실행
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

## 🚀 구현 단계

### Phase 1: 기본 레이어 최적화
1. 의존성 설치 레이어 분리
2. 소스 코드 빌드 레이어 분리
3. 프로덕션 이미지 최적화

### Phase 2: pnpm Store 통합
1. Jenkins 볼륨 마운트 설정
2. pnpm store 경로 설정
3. 빌드 파이프라인 업데이트

### Phase 3: 고급 최적화
1. .dockerignore 최적화
2. 헬스체크 및 보안 설정
3. 모니터링 및 메트릭 수집

---

**예상 결과**: Jenkins pnpm store 활용 + Docker 레이어 최적화를 통해 **두 번째 빌드부터 70-90% 빌드 시간 단축** 달성 예상