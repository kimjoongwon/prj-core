<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Server Application

NestJS 기반 백엔드 서버 애플리케이션입니다.

## 📂 폴더 구조

```
src/
├── shared/
│   ├── service/              # 비즈니스 로직 및 서비스 계층
│   │   ├── domain/           # 순수 비즈니스 로직 (도메인 계층)
│   │   │   └── auth.domain.ts         # 인증 비즈니스 로직
│   │   │       └── auth.domain.spec.ts
│   │   │
│   │   ├── application/      # 유즈케이스 조합 계층 (ApplicationService)
│   │   │   ├── auth.application-service.ts
│   │   │   ├── auth.application-service.spec.ts
│   │   │   └── aws.service.ts
│   │   │
│   │   ├── utils/            # 기술 유틸리티 서비스
│   │   │   ├── password.service.ts    # 암호화 관련 유틸
│   │   │   ├── token.service.ts       # JWT 토큰 관리
│   │   │   └── context.service.ts     # 요청 컨텍스트 관리
│   │   │
│   │   ├── resources/        # 데이터 리소스 서비스 (DB 접근)
│   │   │   ├── users.service.ts
│   │   │   ├── tenants.service.ts
│   │   │   └── ...
│   │   │
│   │   ├── prisma.service.ts # Prisma ORM 서비스
│   │   └── index.ts          # 서비스 export 모음
│   │
│   ├── controller/           # HTTP 컨트롤러 (라우팅)
│   │   ├── domains/          # 도메인별 컨트롤러
│   │   │   └── auth.controller.ts
│   │   └── resources/        # 리소스별 컨트롤러
│   │
│   ├── repository/           # 데이터 접근 계층
│   ├── interceptor/          # HTTP 인터셉터
│   ├── decorator/            # 커스텀 데코레이터
│   ├── strategy/             # Passport 인증 전략
│   └── util/                 # 유틸리티 함수
│
├── module/                   # NestJS 모듈
│   ├── auth.module.ts        # 인증 모듈
│   ├── app.module.ts
│   └── ...
│
├── main.ts                   # 애플리케이션 진입점
└── global.module.ts          # 글로벌 설정 모듈
```

## 🏗️ 아키텍처

### 계층 구조

| 계층 | 목적 | 위치 | 예시 |
|------|------|------|------|
| **Controller** | HTTP 요청 처리 | `controller/` | 라우팅, 요청 검증 |
| **ApplicationService** | 유즈케이스 조합 | `service/application/` | AuthApplicationService |
| **Domain** | 순수 비즈니스 로직 | `service/domain/` | AuthDomain (비즈니스 규칙) |
| **Utils** | 기술 구현 | `service/utils/` | 암호화, 토큰, 컨텍스트 |
| **Resources** | 데이터 접근 | `service/resources/` | 사용자, 테넌트 CRUD |
| **Repository** | DB 쿼리 | `repository/` | Prisma 쿼리 빌드 |

### 데이터 흐름

```
HTTP Request
    ↓
Controller (auth.controller.ts)
    ↓
ApplicationService (auth.application-service.ts - AuthApplicationService)
    ├── Domain 로직 위임 → auth.domain.ts
    │   ├── validateUser()
    │   ├── signUp()
    │   └── login()
    └── Util 조합
        ├── PasswordService
        ├── TokenService
        └── UsersService
    ↓
Repository (Prisma)
    ↓
Database
```

## 📋 서비스 계층 상세

### 1. Domain (비즈니스 로직)

**파일**: `service/domain/auth.domain.ts`

```typescript
// 순수 비즈니스 로직만 포함
- validateUser(email, password)    // 사용자 검증
- signUp(payload)                   // 회원가입
- login(email, password)            // 로그인
```

**특징**:
- 순수한 비즈니스 규칙만 포함
- 기술적 구현 없음 (HTTP, DB는 utils/resources 담당)
- 테스트가 명확하고 용이함
- 재사용성 높음

### 2. ApplicationService (서비스 조합 및 공개 인터페이스)

**파일**: `service/application/auth.application-service.ts`

```typescript
// 1️⃣ 실제 조합 (2개 이상 서비스 조합)
- getCurrentUser(token)             // Token 파싱 + User 조회
- getNewToken(refreshToken)         // Token 갱신 + 저장

// 2️⃣ 비즈니스 로직 위임 (Domain 호출)
- validateUser(email, password)     // domain.validateUser() 위임
- signUp(payload)                   // domain.signUp() 위임
- login(email, password)            // domain.login() 위임
```

**이중 역할**:

| 역할 | 메서드 | 목적 |
|------|--------|------|
| 조합 | getCurrentUser, getNewToken | Utils + Domain 조합 |
| 위임 | validateUser, signUp, login | Domain 비즈니스 로직 호출 |

**위임하는 이유**:

1. **단일 인터페이스 (Single Interface)**
   - Controller는 ApplicationService만 알면 됨
   - Domain 변경이 Controller에 영향 없음

2. **추후 확장성**
   - ApplicationService에서 비즈니스 로직 전후 처리 추가 가능

   ```typescript
   async login(payload) {
     // 전처리: 로그인 시도 감사 로깅
     this.auditService.log('LOGIN_ATTEMPT', payload.email);

     // Domain 호출
     const result = await this.authDomain.login(payload);

     // 후처리: 성공 감사 로깅
     this.auditService.log('LOGIN_SUCCESS', payload.email);

     return result;
   }
   ```

3. **계층별 책임 명확화**
   - ApplicationService: 공개 인터페이스 + 크로스커팅 관심사
   - Domain: 순수 비즈니스 로직
   - Controller: HTTP 처리

4. **테스트 격리**
   - ApplicationService 테스트: Domain 모킹으로 조합만 검증
   - Domain 테스트: 실제 비즈니스 로직만 검증

**특징**:
- Domain 로직을 통제된 방식으로 노출
- 기술적 유틸리티 조합 (TokenService, PasswordService)
- 컨트롤러의 공개 인터페이스 역할
- ApplicationService를 통한 유즈케이스 조합 분리

### 3. Utils (기술 유틸리티)

**파일**: `service/utils/`

```typescript
PasswordService
- validatePassword(password, hash)
- hashPassword(password)
- static validateHash(password, hash)
- static generateHash(password)

TokenService
- generateAccessToken(payload)
- generateRefreshToken(payload)
- generateTokens(payload)
- setAccessTokenCookie(res, token)
- setRefreshTokenCookie(res, token)
- clearTokenCookies(res)

ContextService
- setAuthUser(), getAuthUser()
- setAuthUserId(), getAuthUserId()
- setTenant(), getTenant()
- setToken(), getToken()
```

**특징**:
- 기술 구현만 담당 (암호화, JWT, 컨텍스트)
- 다른 서비스에서 재사용 가능
- 프레임워크/라이브러리 의존성 최소화

### 4. Resources (데이터 리소스)

**파일**: `service/resources/`

```typescript
UsersService
- getByEmail(email)
- getByIdWithTenants(userId)
- create(data)
- getManyByQuery(query)

TenantsService
- create(), findMany(), update(), delete()

... (다른 리소스 서비스들)
```

**특징**:
- 데이터 접근 로직
- Repository와 협력
- CRUD 작업 담당

## 🧪 테스트 구조

### Domain 테스트

**파일**: `service/domain/auth.domain.spec.ts`

```typescript
// 비즈니스 로직 테스트
- validateUser() 테스트
- signUp() 테스트
- login() 테스트
```

### ApplicationService 테스트

**파일**: `service/application/auth.application-service.spec.ts`

```typescript
// 통합 테스트 (domain 위임 확인)
- getCurrentUser() 테스트
- getNewToken() 테스트
- validateUser() → domain 위임 확인
- signUp() → domain 위임 확인
- login() → domain 위임 확인
```

## 🔄 주요 특징

### 관심사 분리 (Separation of Concerns)

- **Domain**: 순수 비즈니스 규칙만
- **ApplicationService**: 도메인 로직 노출 + 서비스 조합 + 크로스커팅 관심사
- **Utils**: 기술 구현 (암호화, JWT, 컨텍스트)
- **Resources**: 데이터 접근 (CRUD)

### 재사용성

- Utils는 모든 계층에서 사용 가능
- Domain은 순수하게 유지, ApplicationService를 통해 노출
- Resources는 어디서든 필요한 곳에 주입 가능

### 테스트 용이성

- **Domain 테스트**: 순수 비즈니스 로직만 검증
  ```typescript
  // 의존성 모킹만으로 테스트 가능
  AuthDomain(mockUsers, mockPassword, mockToken, mockPrisma)
  ```

- **ApplicationService 테스트**: 서비스 조합 및 위임 검증
  ```typescript
  // Domain 모킹으로 조합만 검증
  AuthService(mockDomain, mockUsers, mockJwt, mockToken)
  ```

- 모킹이 간단하고 책임이 명확함

### 확장성 (추후 개선)

**현재 (기본 구조)**:
```typescript
async login(payload) {
  return this.authDomain.login(payload);
}
```

**추후 (감사 로깅 추가)**:
```typescript
async login(payload) {
  this.auditService.log('LOGIN_ATTEMPT', payload.email);
  const result = await this.authDomain.login(payload);
  this.auditService.log('LOGIN_SUCCESS', payload.email);
  return result;
}
```

**추후 (권한 검증 추가)**:
```typescript
async login(payload) {
  // 권한 검증
  if (this.isBlocked(payload.email)) {
    throw new ForbiddenException();
  }
  // 로그인 진행
  return this.authDomain.login(payload);
}
```

**장점**:
- Controller 수정 없음 (ApplicationService만 수정)
- Domain은 순수하게 유지
- 기능 추가가 격리됨

### 계층 추가 시 절차

| 추가할 기능 | 추가 위치 | 수정 범위 |
|----------|---------|---------|
| 새 비즈니스 로직 | Domain | Domain + Domain 테스트 |
| 감사/권한 처리 | ApplicationService | ApplicationService + ApplicationService 테스트 |
| 새 유틸 기능 | Utils | Utils 확장 |
| 새 데이터 접근 | Resources | Resources + Repository |

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
