# 프로젝트 의존성 분석

## 개요

이 문서는 Turbo 캐싱 전략 최적화를 위한 프로젝트 내 애플리케이션과 패키지 간의 의존성을 분석합니다.

## 프로젝트 구조

```
prj-core/
├── apps/
│   ├── admin/      # Vite + React 관리자 앱
│   ├── mobile/     # Expo + React Native 모바일 앱
│   └── server/     # NestJS 백엔드 서버
└── packages/
    ├── shared-api-client/    # 생성된 API 클라이언트
    ├── shared-frontend/      # UI 컴포넌트 라이브러리
    ├── shared-hooks/         # React 훅 라이브러리
    ├── shared-schema/        # Prisma 스키마 & 엔티티
    ├── shared-types/         # TypeScript 타입 정의
    ├── shared-utils/         # 유틸리티 함수
    └── shared-vars/          # 환경 변수 & 상수
```

## 애플리케이션별 의존성 분석

### 🖥️ Admin App (apps/admin)
- **프레임워크**: Vite + React + TypeScript
- **라우팅**: TanStack Router
- **UI**: TailwindCSS + HeroUI
- **빌드 출력**: `dist/**`

**워크스페이스 의존성**:
- `@shared/frontend` → UI 컴포넌트
- `@shared/api-client` → API 호출
- `@shared/utils` → 유틸리티 함수

**주요 외부 의존성**:
- React 19.x
- TanStack Router/Query/Table
- Vite + SWC
- TailwindCSS 4.x
- HeroUI

### 📱 Mobile App (apps/mobile)
- **프레임워크**: Expo + React Native
- **개발 도구**: Storybook
- **빌드**: Expo 관리 (전통적인 dist 출력 없음)

**워크스페이스 의존성**:
- `@shared/api-client` → API 호출
- `@shared/hooks` → React 훅
- `@shared/utils` → 유틸리티 함수

**주요 외부 의존성**:
- React 19.0.0
- React Native 0.79.5
- Expo 53.x
- Storybook 9.x

### 🖧 Server App (apps/server)
- **프레임워크**: NestJS + TypeScript
- **데이터베이스**: Prisma
- **빌드**: NestJS CLI + SWC
- **빌드 출력**: `dist/**`

**워크스페이스 의존성**:
- `@shared/schema` → 데이터베이스 스키마 & 엔티티
- `@shared/utils` → 유틸리티 함수
- `@shared/vars` → 환경 변수

**주요 외부 의존성**:
- NestJS 11.x
- Prisma
- SWC 컴파일러
- JWT, CASL, Mailer 등

## 패키지별 의존성 분석

### 📦 Build 필요 패키지

#### `@shared/api-client`
- **목적**: OpenAPI 스펙에서 생성된 API 클라이언트
- **빌드 도구**: tsup
- **빌드 출력**: `dist/**`
- **코드 생성**: Orval (OpenAPI → TypeScript)

**의존성**:
- `@tanstack/react-query` → API 상태 관리
- `axios` → HTTP 클라이언트

**캐싱 고려사항**:
- OpenAPI 스펙 변경 시 재생성 필요
- 환경별 설정 파일 (dev/stg/prod)

#### `@shared/schema`
- **목적**: Prisma 스키마 및 데이터베이스 엔티티
- **빌드 도구**: Prisma Generate + tsup
- **빌드 출력**: `dist/**` + Prisma 생성 파일

**복잡한 빌드 프로세스**:
1. `prisma generate` → Prisma Client 생성
2. `tsup` → TypeScript 컴파일

**캐싱 고려사항**:
- Prisma 스키마 파일 변경 추적 필요
- 데이터베이스 연결 상태 무관하게 빌드 가능해야 함

#### `@shared/utils`
- **목적**: 범용 유틸리티 함수
- **빌드 도구**: tsup
- **빌드 출력**: `dist/**` (CJS + ESM)

**Peer Dependencies**:
- class-transformer, class-validator
- dayjs, remeda, path-parser

### 📂 Source-Only 패키지

#### `@shared/frontend`
- **목적**: UI 컴포넌트 라이브러리
- **빌드**: 불필요 (소스 파일 직접 사용)
- **사이드 이펙트**: CSS 파일

**내부 의존성**:
- `@shared/api-client` → API 연동
- `@shared/hooks` → React 훅
- `@shared/types` → 타입 정의
- `@shared/utils` → 유틸리티

**특징**:
- 모든 의존성을 devDependencies로 관리
- CSS 사이드 이펙트 존재

#### `@shared/hooks`
- **목적**: 재사용 가능한 React 훅
- **빌드**: 불필요 (소스 파일 직접 사용)

**Peer Dependencies**:
- React, MobX, lodash-es

**내부 의존성**:
- `@shared/types`
- `@shared/utils`

#### `@shared/types`
- **목적**: 공통 TypeScript 타입 정의
- **빌드**: 불필요 (타입 정의만)

**특징**:
- 순수 타입 정의 패키지
- 다른 패키지에서 널리 참조됨

## 의존성 그래프

### 계층 구조
```
Level 1 (Foundation):
- @shared/types (타입 정의)
- @shared/vars (상수 & 환경변수)

Level 2 (Core Utilities):
- @shared/utils (유틸리티 - types 의존)
- @shared/schema (스키마 - 독립적)

Level 3 (Business Logic):
- @shared/api-client (API - 독립적)
- @shared/hooks (훅 - types, utils 의존)

Level 4 (UI Components):
- @shared/frontend (UI - api-client, hooks, types, utils 의존)

Level 5 (Applications):
- admin (frontend, api-client, utils 의존)
- mobile (api-client, hooks, utils 의존)
- server (schema, utils, vars 의존)
```

### 빌드 종속성 순서
1. `@shared/schema` (Prisma generate 필요)
2. `@shared/utils` (독립적 빌드)
3. `@shared/api-client` (독립적 빌드)
4. Applications (위 패키지들 의존)

## 캐싱 최적화 인사이트

### 🎯 빌드 캐싱 대상
- **@shared/api-client**: OpenAPI 스펙 + 소스 변경 추적
- **@shared/schema**: Prisma 스키마 + TypeScript 소스 변경 추적
- **@shared/utils**: TypeScript 소스 변경 추적
- **Applications**: 각각의 소스 + 의존 패키지 변경 추적

### 📁 소스 추적 대상
- **@shared/frontend**: TypeScript + CSS 변경 추적
- **@shared/hooks**: TypeScript 변경 추적  
- **@shared/types**: TypeScript 변경 추적
- **@shared/vars**: TypeScript 변경 추적

### ⚡ 성능 고려사항
1. **병렬 빌드 가능**: api-client, utils는 독립적으로 빌드 가능
2. **순차 빌드 필요**: schema → applications (Prisma Client 의존성)
3. **캐시 무효화 최소화**: 타입 전용 패키지들의 변경은 빌드에 영향 없음
4. **환경별 설정**: API 클라이언트의 환경별 생성 설정 분리 필요

### 🔄 Turbo 캐싱 전략 권장사항
1. **입력 파일 추적 세분화**: 각 패키지별 실제 사용되는 파일만 추적
2. **출력 디렉터리 명확화**: dist, .next, storybook-static 등 정확한 출력 경로 설정
3. **환경 변수 최적화**: 캐싱에 영향을 주는 환경 변수만 선별적 포함
4. **의존성 순서 최적화**: 병렬 실행 가능한 작업과 순차 실행 필요한 작업 구분

---

*이 분석을 바탕으로 다음 단계에서는 현재 Turbo 설정 분석 및 최적화된 캐싱 전략을 수립합니다.*