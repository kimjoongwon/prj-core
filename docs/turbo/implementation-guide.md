# Turbo 캐싱 최적화 구현 가이드

## 개요

이 문서는 분석된 캐싱 전략을 실제로 적용하기 위한 단계별 구현 가이드입니다.

## 🚀 Phase 1: 기본 최적화

### 1단계: 백업 및 현재 상태 확인

```bash
# 현재 설정 백업
cp turbo.json turbo.json.backup

# 현재 빌드 시간 측정
time pnpm build

# 캐시 상태 확인
pnpm turbo build --dry-run
```

### 2단계: 최적화된 turbo.json 적용

기존 `turbo.json`을 아래 설정으로 교체:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.local",
    "**/.env.development.local", 
    "pnpm-workspace.yaml",
    "pnpm-lock.yaml"
  ],
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    // === Build-Required 패키지 ===
    "@shared/schema#generate": {
      "inputs": [
        "prisma/**/*.prisma",
        ".env"
      ],
      "outputs": ["node_modules/.prisma/**"],
      "dependsOn": [],
      "env": ["DATABASE_URL"],
      "cache": true
    },
    "@shared/schema#build": {
      "inputs": [
        "src/**/*.ts",
        "tsconfig.json",
        "package.json",
        "tsup.config.*"
      ],
      "outputs": ["dist/**"],
      "dependsOn": ["@shared/schema#generate"],
      "env": ["NODE_ENV"],
      "cache": true
    },
    "@shared/api-client#build": {
      "inputs": [
        "src/**/*.ts",
        "orval.*.config.js",
        "tsconfig.json",
        "package.json",
        "tsup.config.*"
      ],
      "outputs": ["dist/**"],
      "dependsOn": [],
      "env": ["NODE_ENV"],
      "cache": true
    },
    "@shared/utils#build": {
      "inputs": [
        "src/**/*.ts",
        "tsconfig.json",
        "package.json",
        "tsup.config.*"
      ],
      "outputs": ["dist/**"],
      "dependsOn": [],
      "env": ["NODE_ENV"],
      "cache": true
    },
    
    // === Source-Only 패키지 ===
    "@shared/frontend#build": {
      "inputs": [
        "src/**/*.{ts,tsx,css}",
        "index.ts",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": [],
      "dependsOn": ["@shared/api-client#build", "@shared/hooks#build", "@shared/types#build", "@shared/utils#build"],
      "cache": false
    },
    "@shared/hooks#build": {
      "inputs": [
        "src/**/*.ts",
        "index.ts",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": [],
      "dependsOn": ["@shared/types#build", "@shared/utils#build"],
      "cache": false
    },
    "@shared/types#build": {
      "inputs": [
        "src/**/*.ts",
        "index.ts",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": [],
      "dependsOn": [],
      "cache": false
    },
    "@shared/vars#build": {
      "inputs": [
        "src/**/*.ts",
        "index.ts",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": [],
      "dependsOn": [],
      "cache": false
    },
    
    // === 애플리케이션 ===
    "admin#build": {
      "inputs": [
        "src/**/*.{ts,tsx,css}",
        "public/**/*",
        "index.html",
        "vite.config.ts",
        "tsconfig.json",
        "package.json",
        "tailwind.config.*"
      ],
      "outputs": ["dist/**"],
      "dependsOn": ["@shared/frontend#build", "@shared/api-client#build", "@shared/utils#build"],
      "env": ["NODE_ENV", "VITE_API_URL", "VITE_APP_NAME"],
      "cache": true
    },
    "mobile#build": {
      "inputs": [
        "src/**/*.{ts,tsx}",
        "app.json",
        "expo.json",
        "babel.config.js",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": [".expo/**", "dist/**"],
      "dependsOn": ["@shared/api-client#build", "@shared/hooks#build", "@shared/utils#build"],
      "env": ["NODE_ENV", "EXPO_PUBLIC_*"],
      "cache": true
    },
    "server#build": {
      "inputs": [
        "src/**/*.ts",
        "nest-cli.json",
        "tsconfig.json",
        "tsconfig.build.json",
        "package.json",
        "infrastructure/.swcrc"
      ],
      "outputs": ["dist/**"],
      "dependsOn": ["@shared/schema#build", "@shared/utils#build", "@shared/vars#build"],
      "env": ["NODE_ENV"],
      "cache": true
    },
    
    // === 일반 작업 ===
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "inputs": [
        "src/**/*.{ts,tsx}",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "jest.config.*",
        "vitest.config.*",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": ["coverage/**"],
      "dependsOn": ["^build"],
      "cache": true
    },
    "test:e2e": {
      "inputs": [
        "src/**/*.{ts,tsx}",
        "test/**/*.{ts,tsx}",
        "playwright.config.*",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": ["coverage/**", "test-results/**"],
      "dependsOn": ["^build"],
      "cache": true
    },
    "lint": {
      "inputs": [
        "src/**/*.{ts,tsx,js,jsx}",
        "biome.json",
        ".eslintrc.*",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": [],
      "dependsOn": [],
      "cache": true
    },
    "lint:fix": {
      "inputs": [
        "src/**/*.{ts,tsx,js,jsx}",
        "biome.json",
        ".eslintrc.*",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": [],
      "dependsOn": [],
      "cache": false
    },
    "format": {
      "inputs": [
        "src/**/*.{ts,tsx,js,jsx,css,md}",
        "biome.json",
        ".prettierrc.*",
        "package.json"
      ],
      "outputs": [],
      "dependsOn": [],
      "cache": false
    },
    "start:dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    },
    "db:push": {
      "cache": false,
      "env": ["DATABASE_URL"]
    }
  }
}
```

### 3단계: 검증 및 테스트

```bash
# 설정 검증
pnpm turbo build --dry-run

# 전체 빌드 테스트
pnpm turbo build

# 증분 빌드 테스트 (파일 변경 없이)
pnpm turbo build

# 특정 패키지 빌드 테스트
pnpm turbo build --filter=@shared/api-client
```

## 🔧 Phase 2: 고급 최적화

### 1단계: 개발 모드 설정 파일 생성

`turbo-dev.json` 생성:
```json
{
  "extends": ["//turbo.json"],
  "tasks": {
    "build": {
      "cache": true,
      "outputMode": "hash-only"
    },
    "start:dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"],
      "env": ["NODE_ENV", "PORT", "HOST"],
      "outputMode": "stream"
    },
    "test": {
      "cache": true,
      "outputMode": "new-only"
    }
  }
}
```

### 2단계: 배포 모드 설정 파일 생성

`turbo-prod.json` 생성:
```json
{
  "extends": ["//turbo.json"],
  "tasks": {
    "build": {
      "cache": true,
      "outputMode": "full"
    },
    "test": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "lint": {
      "cache": true
    }
  }
}
```

### 3단계: package.json 스크립트 업데이트

루트 `package.json`에 환경별 스크립트 추가:
```json
{
  "scripts": {
    "build": "turbo build",
    "build:dev": "turbo build --config=turbo-dev.json",
    "build:prod": "turbo build --config=turbo-prod.json",
    "start:dev": "turbo start:dev --config=turbo-dev.json",
    "test:prod": "turbo test --config=turbo-prod.json"
  }
}
```

## 📊 Phase 3: 모니터링 및 튜닝

### 1단계: 성능 측정 스크립트

`scripts/measure-build-performance.sh` 생성:
```bash
#!/bin/bash

echo "🧹 캐시 클리어..."
pnpm turbo build --force

echo "📊 첫 번째 빌드 (Cold Cache)..."
time pnpm turbo build > build-cold.log 2>&1

echo "🔄 두 번째 빌드 (Warm Cache)..."
time pnpm turbo build > build-warm.log 2>&1

echo "📈 작은 변경 후 빌드..."
touch packages/shared-utils/src/index.ts
time pnpm turbo build > build-incremental.log 2>&1

echo "✅ 성능 측정 완료!"
echo "로그 파일: build-cold.log, build-warm.log, build-incremental.log"
```

### 2단계: 캐시 상태 모니터링

```bash
# 캐시 히트율 확인
pnpm turbo build --summarize

# 의존성 그래프 시각화
pnpm turbo build --graph=dependency-graph.html

# 상세 빌드 로그
pnpm turbo build --verbose
```

### 3단계: 세부 튜닝

필요에 따라 다음 설정들을 조정:

```json
{
  "tasks": {
    "build": {
      // 병렬 처리 최적화
      "dependsOn": ["^build"],
      
      // 파일 해시 최적화
      "inputMode": "content-hash",
      
      // 출력 모드 최적화
      "outputMode": "new-only"
    }
  }
}
```

## 🔍 트러블슈팅

### 일반적인 문제와 해결책

#### 1. 캐시가 작동하지 않는 경우
```bash
# 캐시 상태 확인
pnpm turbo build --dry-run

# 입력 파일 확인
pnpm turbo build --verbose
```

#### 2. 빌드 의존성 오류
```bash
# 의존성 그래프 확인
pnpm turbo build --graph

# 특정 패키지만 빌드
pnpm turbo build --filter=package-name
```

#### 3. Prisma 생성 문제
```bash
# Prisma만 별도 실행
pnpm turbo @shared/schema#generate

# 데이터베이스 연결 없이 생성
DATABASE_URL="file:./dev.db" pnpm turbo @shared/schema#generate
```

## 📋 검증 체크리스트

### Phase 1 완료 후 확인사항
- [ ] 모든 앱이 정상적으로 빌드됨
- [ ] 캐시 히트율이 향상됨 (turbo build 두 번 실행 시)
- [ ] 빌드 시간이 단축됨
- [ ] 개발 서버 시작 시간이 개선됨

### Phase 2 완료 후 확인사항  
- [ ] 개발/배포 모드 구분 작동
- [ ] 환경별 설정이 올바르게 적용됨
- [ ] CI/CD 파이프라인 정상 작동

### Phase 3 완료 후 확인사항
- [ ] 성능 지표 수집 가능
- [ ] 팀원들이 새로운 스크립트 사용법 숙지
- [ ] 문서화 완료

## 🎯 최종 목표 달성 확인

다음 명령어들로 최적화 효과를 확인하세요:

```bash
# 전체 성능 측정
./scripts/measure-build-performance.sh

# 캐시 효율성 확인
pnpm turbo build --summarize

# 의존성 그래프 검토
pnpm turbo build --graph=final-graph.html
```

**예상 결과**:
- 캐시 히트 시 90%+ 시간 절약
- 증분 빌드 60-80% 시간 단축
- 개발 서버 시작 40% 개선

---

구현 중 문제가 발생하면 기존 설정(`turbo.json.backup`)으로 롤백하고 단계적으로 다시 적용하세요.