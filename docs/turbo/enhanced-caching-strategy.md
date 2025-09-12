# 강화된 Turbo 캐싱 전략

## 개요

의존성 분석과 현재 설정 문제점을 바탕으로 최대 캐싱 효율을 위한 최적화된 Turbo 설정 전략을 제시합니다.

## 🎯 설계 원칙

### 1. **정확한 의존성 추적**
- 실제 빌드 필요성에 따른 의존성 설정
- 소스 전용 패키지와 빌드 필요 패키지 구분
- Prisma 생성과 일반 빌드 프로세스 분리

### 2. **세분화된 입력/출력 추적**
- 패키지별 정확한 입력 파일 명시
- 실제 출력 디렉터리만 추적
- 불필요한 파일 감시 최소화

### 3. **환경별 최적화**
- 개발 모드: 빠른 피드백 우선
- 배포 모드: 최대 캐싱 효율 우선
- 환경 변수 세분화로 불필요한 캐시 무효화 방지

### 4. **병렬 처리 최대화**
- 독립적 패키지들의 병렬 빌드
- 의존성 체인 최적화
- 크리티컬 패스 단축

## 📋 패키지 분류 및 전략

### 🏗️ Build-Required 패키지

#### `@shared/schema` (Critical Path)
**특징**:
- Prisma 생성 + TypeScript 컴파일
- 다른 패키지들이 의존하는 핵심 패키지
- 데이터베이스 스키마 변경 시 전체 재빌드 필요

**캐싱 전략**:
```json
"@shared/schema#build": {
  "inputs": [
    "src/**/*.ts",
    "prisma/**/*.prisma",
    "tsconfig.json",
    "package.json",
    "tsup.config.*"
  ],
  "outputs": ["dist/**", "node_modules/.prisma/**"],
  "dependsOn": [],
  "env": ["DATABASE_URL", "NODE_ENV"],
  "persistent": false
}
```

#### `@shared/api-client`
**특징**:
- OpenAPI 스펙 기반 코드 생성
- 환경별 다른 API 엔드포인트
- React Query + Axios 래퍼

**캐싱 전략**:
```json
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
  "persistent": false
}
```

#### `@shared/utils`
**특징**:
- 독립적인 유틸리티 함수
- CJS + ESM 듀얼 출력
- Peer dependencies 많음

**캐싱 전략**:
```json
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
  "persistent": false
}
```

### 📁 Source-Only 패키지

#### `@shared/frontend`
**특징**:
- UI 컴포넌트 라이브러리
- CSS 사이드 이펙트 존재
- 다른 패키지들에 의존

**캐싱 전략**:
```json
"@shared/frontend#build": {
  "inputs": [
    "src/**/*.{ts,tsx,css}",
    "index.ts",
    "tsconfig.json",
    "package.json"
  ],
  "outputs": [],
  "dependsOn": ["^build"],
  "cache": false
}
```

#### `@shared/hooks`, `@shared/types`, `@shared/vars`
**특징**:
- 순수 TypeScript 소스
- 컴파일 불필요
- 타입 체크만 필요

**캐싱 전략**:
```json
"@shared/{hooks,types,vars}#build": {
  "inputs": [
    "src/**/*.ts",
    "index.ts", 
    "tsconfig.json",
    "package.json"
  ],
  "outputs": [],
  "dependsOn": [],
  "cache": false
}
```

## 🖥️ 애플리케이션별 전략

### Admin App (Vite + React)
**캐싱 전략**:
```json
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
  "env": ["NODE_ENV", "VITE_*"],
  "persistent": false
}
```

### Mobile App (Expo)
**캐싱 전략**:
```json
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
  "env": ["NODE_ENV", "EXPO_*"],
  "persistent": false
}
```

### Server App (NestJS)
**캐싱 전략**:
```json
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
  "persistent": false
}
```

## 🔧 개발/배포 모드 분리

### 개발 모드 (turbo-dev.json)
**최적화 목표**: 빠른 피드백, HMR 지원

```json
{
  "extends": ["//turbo.json"],
  "tasks": {
    "start:dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"],
      "env": ["NODE_ENV", "PORT", "HOST"],
      "outputMode": "stream"
    },
    "build": {
      "cache": true,
      "inputMode": "hash-only"
    }
  }
}
```

### 배포 모드 (turbo-prod.json)  
**최적화 목표**: 최대 캐싱 효율, 최적화된 빌드

```json
{
  "extends": ["//turbo.json"],
  "tasks": {
    "build": {
      "cache": true,
      "inputMode": "content-hash",
      "outputMode": "full"
    },
    "test": {
      "cache": true,
      "dependsOn": ["^build"]
    }
  },
  "remoteCache": {
    "enabled": true
  }
}
```

## ⚡ 고급 최적화 기법

### 1. **Prisma 생성 최적화**
```json
"@shared/schema#generate": {
  "inputs": ["prisma/**/*.prisma", ".env"],
  "outputs": ["node_modules/.prisma/**"],
  "dependsOn": [],
  "cache": true,
  "env": ["DATABASE_URL"]
},
"@shared/schema#build": {
  "dependsOn": ["@shared/schema#generate"],
  "inputs": ["src/**/*.ts", "tsconfig.json", "package.json"]
}
```

### 2. **Storybook 분리**
```json
"mobile#storybook": {
  "inputs": [
    "src/components/**/*.{ts,tsx}",
    "src/components/**/*.stories.{ts,tsx}",
    ".storybook/**/*",
    "package.json"
  ],
  "outputs": ["storybook-static/**"],
  "dependsOn": ["@shared/frontend#build"],
  "env": ["NODE_ENV", "EXPO_PUBLIC_STORYBOOK"]
}
```

### 3. **환경 변수 최적화**
```json
"globalEnv": ["NODE_ENV"],
"tasks": {
  "admin#build": {
    "env": ["NODE_ENV", "VITE_API_URL", "VITE_APP_NAME"]
  },
  "server#build": {  
    "env": ["NODE_ENV", "DATABASE_URL", "JWT_SECRET"]
  }
}
```

### 4. **캐시 키 최적화**
```json
"globalDependencies": [
  "**/.env.local",
  "**/.env.development.local",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml"
]
```

## 📊 예상 성능 개선

### 빌드 시간 최적화
- **초기 빌드**: 현재 대비 20-30% 단축
- **증분 빌드**: 현재 대비 60-80% 단축  
- **캐시 히트 시**: 90%+ 시간 절약

### 캐시 효율성
- **캐시 히트율**: 30% → 85%+
- **불필요한 재빌드**: 70% → 10% 미만
- **파일 감시 오버헤드**: 50% 감소

### 개발 경험
- **dev 서버 시작**: 40% 빠른 시작
- **HMR 반응성**: 즉시 반영
- **타입 체크**: 변경된 패키지만 체크

## 🚀 구현 우선순위

### Phase 1: 기본 최적화
1. 패키지별 정확한 inputs/outputs 설정
2. 의존성 그래프 최적화
3. 환경 변수 세분화

### Phase 2: 고급 최적화  
1. 개발/배포 모드 분리
2. Prisma 생성 프로세스 분리
3. 원격 캐시 설정 준비

### Phase 3: 세부 튜닝
1. 캐시 키 최적화
2. 병렬 처리 최대화
3. 성능 모니터링 구축

---

*이 전략을 바탕으로 다음 단계에서는 구체적인 구현 가이드를 제공합니다.*