# PRJ Core 모노레포

> 현대적인 풀스택 예약 플랫폼을 위한 모노레포 아키텍처

[![타입스크립트](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.16-orange.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-latest-red.svg)](https://turbo.build/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748.svg)](https://www.prisma.io/)
[![라이선스](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [환경 설정](#-환경-설정)
- [개발 가이드](#-개발-가이드)
- [배포](#-배포)
- [라이선스](#-라이선스)

## 🎯 프로젝트 개요

**PRJ Core**는 필라테스, 헬스, 요가 등 다양한 피트니스 및 서비스 예약을 지원하는 멀티 도메인 예약 플랫폼입니다. Turborepo와 pnpm 워크스페이스를 활용한 Monorepo 아키텍처로 구성되어 있으며, 코드 재사용성과 개발 효율성을 극대화합니다.

> **⚠️ 중요 안내**  
> 이 프로젝트는 **학습 및 연구 목적**으로 제작되었습니다.
>
> - SI 프로젝트 수행을 위한 기본 기술 스택 학습
> - 모노레포 아키텍처 및 현대적인 개발 방법론 연구
> - 보안상 모든 환경 변수는 커밋되어 있지 않으며, 이미 커밋된 환경 변수는 전부 무효화(invalid)되었습니다.
> - 실제 배포용 프로젝트가 아닌 기술 학습을 위한 레퍼런스 프로젝트입니다.

### 핵심 설계 원칙

- **도메인 독립성**: 운동, 헤어샵, 마사지 등 다양한 비즈니스 도메인 확장 가능
- **타입 안정성**: TypeScript와 Prisma를 통한 end-to-end 타입 안정성
- **코드 재사용**: 공유 패키지를 통한 최대 코드 재사용
- **확장 가능성**: 멀티 테넌트 아키텍처로 무한 확장 가능

## ✨ 주요 기능

### 예약 관리

- 📅 **Timeline 기반 일정 관리**: 논리적 그룹으로 세션 관리
- 🔄 **반복 일정 지원**: 일회성/반복(주간, 월간) 세션
- 👥 **프로그램 관리**: 강사 배정, 정원 관리, 레벨 설정
- 🏃 **루틴 재사용**: 운동 루틴을 여러 프로그램에서 재사용

### 운동 관리

- 💪 **Exercise 시스템**: 운동별 세부 정보 (시간, 횟수, 이미지, 영상)
- 📊 **Activity 설정**: 운동 순서, 반복 횟수, 휴식 시간 커스터마이징
- 🎯 **Task 추상화**: 도메인 독립적 작업 관리

### 사용자 & 권한

- 🔐 **역할 기반 접근 제어 (RBAC)**: Space, Tenant 레벨 권한 관리
- 👤 **멀티 테넌트**: 여러 비즈니스를 하나의 플랫폼에서 관리
- 📱 **반응형 UI**: Admin 웹, 모바일 앱 지원

### 파일 관리

- 📁 **S3 통합**: AWS S3를 통한 이미지/영상 관리
- 🖼️ **이미지 최적화**: Sharp를 이용한 자동 리사이징

## 🛠 기술 스택

### Frontend

| 카테고리             | 기술            | 버전      | 설명                    |
| -------------------- | --------------- | --------- | ----------------------- |
| **Framework**        | React           | 19.0      | UI 라이브러리           |
| **Build Tool**       | Vite            | 6.0       | 번들러 및 개발 서버     |
| **Routing**          | TanStack Router | 1.x       | 타입 안전 라우팅        |
| **State Management** | MobX / Valtio   | 6.x / 2.x | 반응형 상태 관리        |
| **Data Fetching**    | TanStack Query  | 5.x       | 서버 상태 관리          |
| **UI Components**    | HeroUI          | 2.8       | 컴포넌트 라이브러리     |
| **Styling**          | Tailwind CSS    | 4.x       | 유틸리티 CSS 프레임워크 |
| **Animations**       | Framer Motion   | latest    | 애니메이션 라이브러리   |
| **DnD**              | dnd-kit         | 6.x       | 드래그 앤 드롭          |
| **Icons**            | Lucide React    | latest    | 아이콘 라이브러리       |

### Backend

| 카테고리             | 기술            | 버전 | 설명                |
| -------------------- | --------------- | ---- | ------------------- |
| **Framework**        | NestJS          | 11.x | Node.js 프레임워크  |
| **Runtime**          | Node.js         | 20+  | JavaScript 런타임   |
| **Language**         | TypeScript      | 5.8  | 타입스크립트        |
| **ORM**              | Prisma          | 6.x  | 데이터베이스 ORM    |
| **Database**         | PostgreSQL      | 14+  | 관계형 데이터베이스 |
| **Authentication**   | Passport.js     | 0.7  | 인증 미들웨어       |
| **Authorization**    | CASL            | 6.7  | 권한 관리           |
| **Validation**       | class-validator | 0.14 | DTO 검증            |
| **API Docs**         | Swagger         | 11.x | OpenAPI 문서화      |
| **File Storage**     | AWS S3          | 3.x  | 파일 스토리지       |
| **Email**            | Nodemailer      | 7.x  | 이메일 발송         |
| **Logging**          | Pino            | 9.x  | 고성능 로깅         |
| **Image Processing** | Sharp           | 0.34 | 이미지 최적화       |

### DevOps & Tools

| 카테고리              | 기술          | 버전          | 설명               |
| --------------------- | ------------- | ------------- | ------------------ |
| **Monorepo**          | Turborepo     | latest        | 빌드 시스템        |
| **Package Manager**   | pnpm          | 10.16         | 패키지 매니저      |
| **Linter**            | Biome         | 2.1           | 린터 및 포매터     |
| **Testing**           | Jest / Vitest | 30.x / latest | 테스팅 프레임워크  |
| **Secret Management** | OpenBao       | latest        | 환경 변수 관리     |
| **Storybook**         | Storybook     | 9.x           | UI 컴포넌트 문서화 |

## 📁 프로젝트 구조

```
prj-core/
├── apps/                          # 애플리케이션
│   ├── admin/                     # Admin 웹 애플리케이션 (React + Vite)
│   │   ├── src/
│   │   │   ├── routes/           # TanStack Router 라우트
│   │   │   ├── hooks/            # React Hooks
│   │   │   └── providers/        # Context Providers
│   │   └── package.json
│   ├── server/                    # Backend API (NestJS)
│   │   ├── src/
│   │   │   ├── module/           # 기능별 모듈
│   │   │   └── shared/           # 공유 리소스
│   │   ├── test/                 # E2E 테스트
│   │   └── package.json
│   └── storybook/                 # UI 컴포넌트 문서화
│       └── package.json
├── packages/                      # 공유 패키지
│   ├── api-client/               # 자동 생성 API 클라이언트 (Orval)
│   ├── constants/                # 공통 상수
│   │   └── src/
│   │       ├── routing/         # 프론트엔드 라우팅 상수
│   │       └── schema/          # 백엔드 스키마 상수
│   ├── decorator/                # NestJS 데코레이터 모음
│   │   └── src/
│   │       ├── field/           # 필드 데코레이터 (primitives, complex, specialized)
│   │       └── *.decorator.ts   # 인증, 권한, API 데코레이터
│   ├── design-system/            # HeroUI 기반 디자인 시스템
│   │   └── src/
│   │       ├── provider/        # DesignSystemProvider
│   │       ├── theme/           # 테마 설정 및 토큰
│   │       └── styles/          # 기본 스타일
│   ├── dto/                      # Data Transfer Objects
│   │   └── src/
│   │       ├── auth/            # 인증 관련 DTO
│   │       ├── create/          # 생성 DTO
│   │       ├── update/          # 수정 DTO
│   │       └── query/           # 조회 DTO
│   ├── entity/                   # 데이터베이스 엔티티 타입
│   │   └── src/
│   │       ├── *.entity.ts      # 엔티티 정의
│   │       └── types/           # JSON, 페이지네이션 타입
│   ├── enums/                    # 공유 열거형
│   │   └── src/
│   │       └── *.enum.ts        # 카테고리, 그룹, 세션 타입 등
│   ├── hooks/                    # 공유 React Hooks
│   ├── providers/                # 공유 Providers
│   ├── schema/                   # Prisma 스키마 (DB 전용)
│   │   └── prisma/
│   │       ├── models/          # Prisma 모델 정의
│   │       ├── migrations/      # DB 마이그레이션
│   │       └── seed.ts          # 시드 데이터
│   ├── store/                    # 공유 상태 관리 (MobX)
│   ├── toolkit/                  # 유틸리티 함수
│   ├── types/                    # 공유 TypeScript 타입
│   └── ui/                       # 공유 UI 컴포넌트
├── scripts/                       # 빌드/배포 스크립트
├── devops/                        # 인프라 설정
├── biome.json                     # Biome 설정
├── pnpm-workspace.yaml           # pnpm 워크스페이스 설정
├── turbo.json                     # Turborepo 설정
└── package.json                   # Root 패키지
```

### 패키지 의존성 다이어그램

```mermaid
graph TD
    subgraph Applications
        Admin[Admin App]
        Server[Server API]
        Storybook[Storybook]
    end

    subgraph "Core Packages"
        Constants[constants]
        Enums[enums]
        Types[types]
        Toolkit[toolkit]
    end

    subgraph "Backend Packages"
        Schema[schema - Prisma]
        Decorator[decorator]
        Entity[entity]
        DTO[dto]
    end

    subgraph "Frontend Packages"
        DesignSystem[design-system]
        UI[ui]
        Store[store]
        Hooks[hooks]
        ApiClient[api-client]
        Providers[providers]
    end

    %% Application Dependencies
    Admin --> ApiClient
    Admin --> UI
    Admin --> Store
    Admin --> DesignSystem
    Admin --> Hooks
    Admin --> Constants

    Server --> Schema
    Server --> DTO
    Server --> Entity
    Server --> Decorator
    Server --> Enums
    Server --> Constants

    Storybook --> UI
    Storybook --> DesignSystem

    %% Package Dependencies
    Decorator --> Constants
    Entity --> Decorator
    Entity --> Types
    DTO --> Entity
    DTO --> Decorator
    DTO --> Enums

    UI --> Toolkit
    UI --> Types
    Store --> Types
    ApiClient --> Types
    DesignSystem --> UI
```

> **📝 참고**: 기존 `packages/schema`에서 DTO, Entity, Enum, Decorator가 별도 패키지로 분리되었습니다.
> 마이그레이션 가이드: [docs/SCHEMA-REFACTORING.md](./docs/SCHEMA-REFACTORING.md)

## 🚀 시작하기

### 사전 요구사항

- **Node.js**: 20.x 이상
- **pnpm**: 10.16.0 이상
- **PostgreSQL**: 14.x 이상

### 설치

1. **저장소 클론**

```bash
git clone https://github.com/your-org/prj-core.git
cd prj-core
```

2. **의존성 설치**

```bash
pnpm install
```

3. **환경 변수 설정**

개발 환경에서는 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

> **💡 참고**: 프로덕션 환경에서는 Kubernetes에 배포된 **OpenBao**를 통해 환경 변수를 안전하게 관리하며, 배포 시점에 자동으로 주입됩니다.

4. **데이터베이스 마이그레이션**

```bash
cd packages/schema
pnpm prisma migrate dev
pnpm prisma db seed
```

### 개발 서버 실행

```bash
# 모든 애플리케이션 실행
pnpm start:dev

# 개별 실행
pnpm start:server      # NestJS 서버 (http://localhost:3000)
pnpm start:admin       # Admin 웹앱 (http://localhost:5173)
pnpm start:storybook   # Storybook (http://localhost:6006)
```

## 🔧 환경 설정

### 환경 변수 관리

이 프로젝트는 **Kubernetes에 배포된 OpenBao**를 통해 환경 변수를 안전하게 관리합니다. 배포 시점에 OpenBao에서 환경 변수를 자동으로 주입하여 보안성을 강화하고 설정을 중앙에서 관리합니다.

### 필수 환경 변수

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/prj_core

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-bucket-name

# Email (선택사항)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## 💻 개발 가이드

### 주요 명령어

```bash
# 빌드
pnpm build                    # 모든 패키지 및 앱 빌드
pnpm build:server            # 서버만 빌드
pnpm build:admin             # Admin 앱만 빌드
pnpm build:packages          # 패키지만 빌드

# 테스트
pnpm test                     # 모든 테스트 실행
pnpm test:watch              # Watch 모드
pnpm test:cov                # 커버리지 확인

# 린트 & 포맷
pnpm lint                     # 린트 검사
pnpm lint:fix                # 린트 자동 수정
pnpm format                   # 코드 포맷팅

# 타입 체크
pnpm type-check              # TypeScript 타입 검사

# 클린업
pnpm clean                    # 빌드 산출물 제거
```

### 패키지 관리

```bash
# 패키지 버전 업데이트
pnpm version:patch           # 패치 버전 업데이트 (0.0.x)
pnpm version:minor           # 마이너 버전 업데이트 (0.x.0)
pnpm version:major           # 메이저 버전 업데이트 (x.0.0)

# 패키지 배포
pnpm publish:packages        # 모든 패키지 배포
pnpm publish:dry             # Dry run (실제 배포 X)

# 릴리즈 (버전 업데이트 + 빌드 + 배포)
pnpm release:patch
pnpm release:minor
pnpm release:major
```

### 데이터베이스 관리

```bash
cd packages/schema

# Prisma 명령어
pnpm prisma migrate dev      # 마이그레이션 생성 및 적용
pnpm prisma migrate deploy   # 프로덕션 마이그레이션
pnpm prisma db seed          # 시드 데이터 삽입
pnpm prisma studio           # Prisma Studio 실행
pnpm prisma generate         # Prisma Client 재생성
```

### API 클라이언트 재생성

```bash
cd packages/api-client

# OpenAPI 스펙에서 클라이언트 생성
pnpm generate
```

### 코드 스타일 가이드

- **네이밍 컨벤션**
  - 코드: `camelCase` (TypeScript, JavaScript)
  - DB 테이블/컬럼: `snake_case` (PostgreSQL)
  - 컴포넌트: `PascalCase` (React)
  - 상수: `UPPER_SNAKE_CASE`

- **파일 구조**
  - 기능별 모듈화
  - 도메인 기반 디렉토리 구조
  - 공유 코드는 `packages/`에 위치

- **커밋 메시지**
  ```
  feat: 새로운 기능 추가
  fix: 버그 수정
  docs: 문서 수정
  style: 코드 포맷팅
  refactor: 코드 리팩토링
  test: 테스트 추가/수정
  chore: 빌드 설정 등
  ```

## 🏗 아키텍처

### 도메인 모델

```
[도메인 독립 계층]
Timeline → Session → Program → Routine → Activity → Task (추상)
                                           ↓
[도메인 전용 계층]                        Exercise (운동)
                                          Treatment (헤어샵 - 미래)
                                          Service (기타 - 미래)
```

- **Timeline**: 논리적 그룹핑 (예: "2025년 10월 첫째 주")
- **Session**: 실제 일정 (시작/종료 시간 포함)
- **Program**: 강사 배정, 정원 관리
- **Routine**: 재사용 가능한 운동 루틴
- **Activity**: 운동 순서, 반복 횟수, 휴식 시간
- **Task**: 도메인 독립적 추상 계층
- **Exercise**: 운동 도메인 (시간, 횟수, 이미지, 영상)

### 권한 관리 (RBAC)

```
Tenant (최상위 조직)
  ├── Space (하위 조직/지점)
  │   ├── Role (역할: OWNER, ADMIN, MEMBER)
  │   └── User (사용자)
  └── Permissions (CASL 기반 권한 관리)
```

## 🚢 배포

### 도커를 이용한 배포

```bash
# 프로덕션 빌드
pnpm build

# 도커 이미지 빌드
docker build -t prj-core-server:latest -f devops/Dockerfile.server .
docker build -t prj-core-admin:latest -f devops/Dockerfile.admin .
```

### Kubernetes 배포

Kubernetes 환경에서는 OpenBao를 통해 환경 변수가 자동으로 주입됩니다:

```

## 📚 추가 문서

- [Prisma Schema 설계 가이드](./packages/schema/prisma/models/task.example.md)
- [API 문서](http://localhost:3000/api/docs) (서버 실행 후 접속)
- [Storybook](http://localhost:6006) (Storybook 실행 후 접속)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 [ISC License](https://opensource.org/licenses/ISC) 하에 배포됩니다.

## 📧 문의

프로젝트 관련 문의사항은 이슈를 등록해주세요.

---

**타입스크립트, 리액트, NestJS, Prisma로 만들어졌습니다 ❤️**
```
