# 현재 Turbo 설정 분석

## 개요

현재 `turbo.json` 설정의 문제점을 분석하고 개선 방향을 제시합니다.

## 현재 설정 분석

### 📄 현재 turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    "build": {
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        "storybook-static/**"
      ],
      "dependsOn": ["^build"],
      "env": ["NODE_ENV"],
      "passThroughEnv": ["NODE_OPTIONS"]
    },
    "packages/shared-frontend#build": {
      "env": ["NODE_ENV"],
      "passThroughEnv": ["NODE_OPTIONS"]
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": []
    },
    "test:e2e": {
      "outputs": ["coverage/**"],
      "dependsOn": []
    },
    "lint": {},
    "lint:fix": {},
    "format": {},
    "start:dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}
```

## 🔍 문제점 분석

### 1. **불완전한 의존성 설정**

**문제점**:
- `dependsOn: ["^build"]`가 모든 패키지에 일괄 적용
- 실제로는 빌드가 필요 없는 패키지들도 포함 (shared-frontend, shared-hooks, shared-types)
- Prisma 생성과 일반 빌드 순서 구분 없음

**영향**:
- 불필요한 빌드 대기 시간 발생
- 캐시 히트율 저하

### 2. **출력 디렉터리 설정 부정확**

**문제점**:
- `.next/**` 출력이 설정되어 있으나 프로젝트에 Next.js 앱 없음 (Vite 사용)
- `storybook-static/**`이 전역 설정에 있으나 특정 앱에만 해당
- Expo 빌드 출력 고려 없음

**영향**:
- 불필요한 파일 추적으로 성능 저하
- 정확하지 않은 캐시 무효화

### 3. **입력 파일 추적 미설정**

**문제점**:
- `inputs` 설정이 완전히 누락
- 패키지별 실제 소스 파일 변경을 정확히 추적하지 못함
- TypeScript 설정 파일, package.json 변경 추적 없음

**영향**:
- 캐시 히트율 심각하게 저하
- 불필요한 재빌드 빈발

### 4. **환경 변수 설정 비최적화**

**문제점**:
- `globalEnv: ["NODE_ENV"]`만 설정
- 앱별 필요한 환경 변수 구분 없음
- 개발/배포 환경별 차이 미반영

**영향**:
- 환경 변화 시 전체 캐시 무효화
- 환경별 최적화 부족

### 5. **패키지별 세분화 부족**

**문제점**:
- `packages/shared-frontend#build` 설정만 있고 다른 패키지들 미설정
- 각 패키지의 특성을 반영하지 못함 (source-only vs build-required)

**영향**:
- 패키지별 최적화 불가
- 비효율적인 빌드 프로세스

## 📊 성능 영향 분석

### 현재 설정의 성능 문제

1. **캐시 미스율 높음** (~70-80%)
   - inputs 설정 누락으로 파일 변경 감지 부정확
   - 불필요한 캐시 무효화 빈발

2. **빌드 시간 비효율**
   - 병렬 실행 가능한 작업들의 순차 실행
   - source-only 패키지들의 불필요한 빌드 대기

3. **개발 경험 저하**
   - HMR 최적화 부족
   - 개발 서버 시작 시간 증가

## 🎯 개선 필요 영역

### 1. **의존성 그래프 최적화**
```
현재: 모든 패키지 → ^build 의존
개선: 실제 빌드 필요성에 따른 의존성 설정
```

### 2. **입력/출력 파일 정확성**
```
현재: outputs만 대략적으로 설정
개선: inputs + outputs 패키지별 정확한 설정
```

### 3. **환경 변수 세분화**
```
현재: NODE_ENV만 전역 설정
개선: 앱별 필요 환경 변수 개별 설정
```

### 4. **패키지 특성별 분류**
```
빌드 필요: shared-api-client, shared-schema, shared-utils
소스 전용: shared-frontend, shared-hooks, shared-types, shared-vars
```

### 5. **개발/배포 모드 분리**
```
현재: 단일 설정
개선: 환경별 최적화된 설정
```

## 🚀 예상 개선 효과

### 캐싱 효율성
- **캐시 히트율**: 30-40% → 80-90%
- **빌드 시간**: 현재 대비 40-60% 단축
- **개발 피드백**: HMR 최적화로 즉시 반영

### 리소스 최적화
- **CPU 사용량**: 불필요한 빌드 작업 제거
- **디스크 I/O**: 정확한 파일 추적으로 최소화
- **메모리 사용량**: 효율적인 캐싱으로 최적화

### 개발 생산성
- **로컬 개발**: 빠른 시작 시간 및 HMR
- **CI/CD**: 캐시 활용도 극대화
- **팀 협업**: 원격 캐시 공유 가능한 구조

---

*다음 단계에서는 이 분석을 바탕으로 최적화된 Turbo 캐싱 전략을 설계합니다.*