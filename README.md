# PRJ Core 모노레포

> 현대적인 풀스택 예약 플랫폼을 위한 모노레포 아키텍처

[![타입스크립트](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.18+-green.svg)](https://nodejs.org/)
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
| **Runtime**          | Node.js         | 22.18+ | JavaScript 런타임 |
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
│   ├── agent/                     # AI Agent 애플리케이션
│   │   └── package.json
│   ├── coin/                      # 코인/결제 애플리케이션
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
│   ├── api/                      # 자동 생성 API 클라이언트 (Orval)
│   ├── constant/                 # 공통 상수
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
│   │       └── *.entity.ts      # 엔티티 정의
│   ├── enum/                     # 공유 열거형
│   │   └── src/
│   │       └── *.enum.ts        # 카테고리, 그룹, 세션 타입 등
│   ├── hook/                     # 공유 React Hook
│   ├── prisma/                   # Prisma 스키마 & Client
│   │   └── prisma/
│   │       ├── models/          # Prisma 모델 정의
│   │       ├── migrations/      # DB 마이그레이션
│   │       └── seed.ts          # 시드 데이터
│   ├── repository/               # Repository 패턴 구현
│   │   └── src/
│   │       └── repositories/    # 각 엔티티별 Repository
│   ├── service/                  # 비즈니스 로직 & 서비스 레이어
│   │   └── src/
│   │       ├── usecase/         # UseCase/Handler 계층
│   │       ├── resources/       # 리소스별 서비스
│   │       └── utils/           # 서비스 유틸리티
│   ├── store/                    # 공유 상태 관리 (MobX)
│   ├── toolkit/                  # 유틸리티 함수
│   ├── type/                     # 공유 TypeScript 타입
│   │   └── src/
│   │       ├── config.types.ts  # 설정 관련 타입
│   │       ├── json.ts          # JSON 타입 (Prisma 7 호환)
│   │       ├── page-meta.ts     # 페이지네이션 타입
│   │       └── index.ts         # 타입 유틸리티 (Paths, Leaves 등)
│   ├── ui/                       # 공유 UI 컴포넌트
│   └── vo/                       # Value Object (도메인 불변 값)
│       └── src/
│           └── *.vo.ts          # Value Object 정의
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
        Agent[Agent App]
        Coin[Coin App]
    end

    subgraph "Foundation Packages"
        Type[type]
        Enum[enum]
        Constant[constant]
        Toolkit[toolkit]
    end

    subgraph "Data Layer"
        Prisma[prisma]
        VO[vo - Value Object]
        Entity[entity]
    end

    subgraph "Backend Core"
        Decorator[decorator]
        DTO[dto]
        Repository[repository]
        Service[service]
    end

    subgraph "Frontend Core"
        DesignSystem[design-system]
        UI[ui]
        Hook[hook]
        Store[store]
        ApiClient[api]
    end

    %% Application Dependencies
    Server --> Service
    Server --> Repository
    Server --> DTO
    Server --> Decorator
    Server --> Prisma
    Server --> Constant
    Server --> Toolkit

    Admin --> ApiClient
    Admin --> UI
    Admin --> Store
    Admin --> DesignSystem
    Admin --> Toolkit

    Storybook --> UI
    Storybook --> DesignSystem

    %% Backend Package Dependencies
    Service --> Repository
    Service --> DTO
    Service --> Entity
    Service --> VO
    Service --> Decorator
    Service --> Prisma
    Service --> Type
    Service --> Constant
    Service --> Toolkit

    Repository --> Prisma
    Repository --> Entity

    DTO --> Entity
    DTO --> Decorator
    DTO --> Enum
    DTO --> Constant
    DTO --> Toolkit

    Entity --> Prisma
    Entity --> Decorator
    Entity --> Type

    Decorator --> Prisma
    Decorator --> Constant
    Decorator --> Toolkit

    %% Frontend Package Dependencies
    UI --> Hook
    UI --> Type
    UI --> Toolkit
    UI --> ApiClient

    Hook --> Type
    Hook --> Toolkit

    Store --> Toolkit

    ApiClient --> Type

    DesignSystem --> UI
```

> **📝 참고**: 모노레포 아키텍처 개선으로 패키지가 재구성되었습니다.
>
> - `packages/schema` → `packages/prisma`로 변경
> - `packages/type`, `packages/vo`, `packages/repository`, `packages/service` 신규 추가
> - DTO, Entity, Enum, Decorator가 독립 패키지로 분리

## 🚀 시작하기

### 사전 요구사항

- **Node.js**: 22.18.0 이상
- **pnpm**: 10.16.0 이상
- **PostgreSQL**: 14.x 이상

### 설치

1. **저장소 클론**

```bash
git clone https://github.com/your-org/prj-core.git
cd prj-core
```

1. **의존성 설치**

```bash
pnpm install
```

1. **환경 변수 설정**

로컬 개발에서는 각 앱/패키지 디렉터리의 `.env.example`을 `.env`로 복사합니다.
`.env.local`과 `.env.development.local`은 사용하지 않습니다.

```bash
cp apps/core/api/.env.example apps/core/api/.env
cp packages/be-prisma/.env.example packages/be-prisma/.env
```

> **💡 참고**: `.env.example`는 커밋되는 템플릿이고, 실제 로컬 실행은 각 디렉터리의 `.env`만 사용합니다.
> 배포 환경 변수는 `prj-devops`의 OpenBao를 통해 주입됩니다.

1. **데이터베이스 마이그레이션**

```bash
cd packages/be-prisma
pnpm db:migrate
pnpm db:seed
```

### 개발 서버 실행

```bash
# 대화형 실행기
pnpm start

# 개별 실행
pnpm start:core-api        # Core API (http://localhost:3006)
pnpm start:admin-web       # Admin 웹앱 (http://localhost:3000)
pnpm start:proposal-web    # Proposal 웹앱 (http://localhost:3011/proposal)
pnpm start:tool-storybook  # Storybook (http://localhost:6006)
```

> Auth/IDP/OIDC endpoint는 `core-api`에서 함께 제공합니다.

## 🔧 환경 설정

### 환경 변수 관리

이 프로젝트의 환경 변수 규칙은 다음과 같습니다.

- 로컬 실행은 각 앱/패키지 디렉터리의 `.env`만 사용합니다.
- `.env.example`는 커밋되는 템플릿이며 런타임에서 직접 읽지 않습니다.
- `.env.local`, `.env.development.local`은 사용하지 않습니다.
- 배포 환경 변수는 `prj-devops`에서 관리하는 OpenBao를 통해 주입됩니다.

### 예제 파일

- `apps/core/api/.env.example`
- `packages/be-prisma/.env.example`
- 프로젝트별 env 키 표: [docs/env-reference.md](./docs/env-reference.md)

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
cd packages/prisma

# Prisma 명령어
pnpm prisma migrate dev      # 마이그레이션 생성 및 적용
pnpm prisma migrate deploy   # 프로덕션 마이그레이션
pnpm prisma db seed          # 시드 데이터 삽입
pnpm prisma studio           # Prisma Studio 실행
pnpm prisma generate         # Prisma Client 재생성
```

### API 클라이언트 재생성

```bash
cd packages/api

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

  커밋 메시지 형식과 허용 타입은 [프로젝트 공통 규칙](./AGENTS.md#커밋-메시지-규칙)을 따릅니다.

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
docker build -t prj-core-core-api:latest -f devops/Dockerfile.core-api .
docker build -t prj-core-admin-web:latest -f devops/Dockerfile.admin-web .
```

### Kubernetes 배포

Kubernetes 배포에서는 런타임 `.env` 파일을 사용하지 않습니다.
환경 변수는 `prj-devops`의 OpenBao 연동을 통해 주입됩니다.

## 📚 추가 문서

- [Prisma Schema 설계 가이드](./packages/be-prisma/prisma/models/task.example.md)
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
