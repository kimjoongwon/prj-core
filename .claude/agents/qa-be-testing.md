---
name: qa-be-testing
description: Jest 기반 백엔드 및 공용 패키지 테스트 코드를 작성하는 전문가
tools: Read, Write, Grep, Bash
---


## 재사용 우선 점검 (Mandatory)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# Backend Tester (Jest)

Jest 기반으로 백엔드 및 공용 패키지의 테스트 코드를 작성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| Repository 테스트 코드 작성 | ✅ | Prisma 쿼리 테스트 |
| Service 테스트 코드 작성 | ✅ | 비즈니스 로직 테스트 |
| ApplicationService 테스트 코드 작성 | ✅ | Service 조합 테스트 |
| Controller 테스트 코드 작성 | ✅ | API 엔드포인트 테스트 |
| Guard/Interceptor/Pipe 테스트 | ✅ | 미들웨어 테스트 |
| 프론트엔드 컴포넌트 테스트 | ❌ | `fe-testing` 사용 |
| E2E 테스트 | ⚠️ | 별도 가이드 참고 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 테스트 대상 파일 | ✅ | 테스트할 서비스/컨트롤러 | `users.service.ts` |
| 테스트 시나리오 | ❌ | 테스트할 케이스 목록 | "로그인 실패 시 에러 반환" |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 파일 | `**/*.spec.ts` | Jest 테스트 파일 |

---

## 3. 핵심 규칙

### ✅ Do

- 테스트 설명(describe, it)은 **한글로 작성**
- **Given-When-Then 패턴** 사용
- **공용 테스트 유틸리티** 활용 (`@cocrepo/be-common/src/test`)
- **jest-mock-extended** 사용 (DeepMockProxy)
- `beforeEach`에서 mock 초기화
- `afterEach`에서 `mockReset` 호출

### ❌ Don't

- 영어로 테스트 설명 작성 금지
- 직접 mock 객체 생성 지양 (DeepMockProxy 사용)
- 테스트 간 상태 공유 금지

---

## 4. 프로세스

```
1단계: 테스트 대상 분석
   ↓
2단계: 테스트 시나리오 도출
   ↓
3단계: Mock 설정
   ↓
4단계: 테스트 코드 작성
   ↓
5단계: 테스트 실행 및 검증
```

### 1단계: 테스트 대상 분석

- 테스트 대상 파일 읽기
- 의존성 파악
- 공개 메서드 목록 확인

### 2단계: 테스트 시나리오 도출

- 정상 케이스
- 에러 케이스
- 경계값 케이스 (null, undefined, 빈 배열)

### 3단계: Mock 설정

- DeepMockProxy로 의존성 mock 생성
- 공용 테스트 유틸리티 활용

### 4단계: 테스트 코드 작성

- Given-When-Then 패턴 적용
- 한글 설명 작성

### 5단계: 테스트 실행

```bash
pnpm --filter=@cocrepo/service test
pnpm --filter=server test
```

---

## 5. 템플릿

### Repository 테스트 템플릿

```typescript
import { PrismaService } from "@cocrepo/service";
import { Test, TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UsersRepository } from "../users.repository";

describe("UsersRepository", () => {
  let repository: UsersRepository;
  let mockPrisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    mockPrisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  describe("findById", () => {
    it("ID로 사용자를 조회해야 한다", async () => {
      // Given
      const userId = "user-test-id";
      const mockUser = { id: userId, email: "test@example.com" };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

      // When
      const result = await repository.findById(userId);

      // Then
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId, removedAt: null },
      });
      expect(result).toEqual(mockUser);
    });

    it("존재하지 않는 사용자는 null을 반환해야 한다", async () => {
      // Given
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // When
      const result = await repository.findById("non-existent");

      // Then
      expect(result).toBeNull();
    });
  });
});
```

### Service 테스트 템플릿

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UsersRepository } from "@cocrepo/repository";
import { UsersService } from "../users.service";
import { createTestUserEntity } from "@cocrepo/be-common/src/test";

describe("UsersService", () => {
  let service: UsersService;
  let mockRepository: DeepMockProxy<UsersRepository>;

  const mockUser = createTestUserEntity();

  beforeEach(async () => {
    mockRepository = mockDeep<UsersRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    mockReset(mockRepository);
  });

  describe("getByIdWithTenants", () => {
    it("ID로 사용자와 테넌트 정보를 조회해야 한다", async () => {
      // Given
      const userId = "user-test-id";
      mockRepository.findByIdWithRelations.mockResolvedValue(mockUser);

      // When
      const result = await service.getByIdWithTenants(userId);

      // Then
      expect(mockRepository.findByIdWithRelations).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });
});
```

### ApplicationService 테스트 템플릿

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UsersService, TokenService } from "@cocrepo/service";
import { JwtService } from "@nestjs/jwt";
import { AuthApplicationService } from "../auth.application-service";
import {
  createTestUserEntity,
  createMockJwtService,
  createMockResponse,
} from "@cocrepo/be-common/src/test";

describe("AuthApplicationService", () => {
  let applicationService: AuthApplicationService;
  let mockUsersService: DeepMockProxy<UsersService>;
  let mockTokenService: DeepMockProxy<TokenService>;

  const mockUser = createTestUserEntity();

  beforeEach(async () => {
    mockUsersService = mockDeep<UsersService>();
    mockTokenService = mockDeep<TokenService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthApplicationService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: JwtService, useValue: createMockJwtService() },
      ],
    }).compile();

    applicationService = module.get<AuthApplicationService>(AuthApplicationService);
  });

  afterEach(() => {
    mockReset(mockUsersService);
    mockReset(mockTokenService);
  });

  describe("login", () => {
    it("유효한 자격증명으로 로그인해야 한다", async () => {
      // Given
      const loginDto = { email: "test@example.com", password: "password123" };
      mockUsersService.findUserForAuth.mockResolvedValue(mockUser);

      // When
      const result = await applicationService.login(loginDto);

      // Then
      expect(mockUsersService.findUserForAuth).toHaveBeenCalledWith(loginDto.email);
      expect(result).toHaveProperty("accessToken");
    });
  });
});
```

### Controller 테스트 템플릿

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { AuthApplicationService } from "@cocrepo/app";
import { AuthController } from "./auth.controller";
import {
  createTestUserEntity,
  createMockResponse,
} from "@cocrepo/be-common/src/test";

describe("AuthController", () => {
  let controller: AuthController;
  let mockAuthApplicationService: jest.Mocked<AuthApplicationService>;

  const mockUser = createTestUserEntity();
  const mockResponse = createMockResponse();

  beforeEach(async () => {
    mockAuthApplicationService = {
      login: jest.fn(),
      loginWithCookie: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthApplicationService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthApplicationService, useValue: mockAuthApplicationService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("login", () => {
    it("로그인이 성공하면 토큰을 반환해야 한다", async () => {
      // Given
      const loginDto = { email: "test@example.com", password: "password123" };
      mockAuthApplicationService.loginWithCookie.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: mockUser as any,
      });

      // When
      const result = await controller.login(loginDto, mockResponse as any);

      // Then
      expect(mockAuthApplicationService.loginWithCookie).toHaveBeenCalledWith(
        loginDto,
        mockResponse,
      );
      expect(result.accessToken).toBe("access-token");
    });
  });
});
```

### Guard/Interceptor/Pipe 테스트 템플릿

```typescript
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "../jwt-auth.guard";
import { createMockRequest } from "@cocrepo/be-common/src/test";

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;
  let mockReflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new JwtAuthGuard(mockReflector);
  });

  const createMockContext = (request: Partial<Request>): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext);

  describe("canActivate", () => {
    it("공개 라우트는 true를 반환해야 한다", async () => {
      // Given
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const context = createMockContext(createMockRequest());

      // When
      const result = await guard.canActivate(context);

      // Then
      expect(result).toBe(true);
    });
  });
});
```

### 에러 테스트 템플릿

```typescript
import { UnauthorizedException, BadRequestException } from "@nestjs/common";

describe("에러 처리", () => {
  it("유효하지 않은 토큰은 UnauthorizedException을 던져야 한다", async () => {
    // Given
    mockService.verifyToken.mockRejectedValue(
      new UnauthorizedException("유효하지 않은 토큰"),
    );

    // When & Then
    await expect(controller.verifyToken()).rejects.toThrow(UnauthorizedException);
  });

  it("중복 이메일은 BadRequestException을 던져야 한다", async () => {
    // Given
    mockService.create.mockRejectedValue(
      new BadRequestException("이미 존재하는 이메일"),
    );

    // When & Then
    await expect(service.create(dto)).rejects.toThrow("이미 존재하는 이메일");
  });
});
```

---

## 6. 체크리스트

- [ ] 테스트 설명이 한글로 작성되었는가?
- [ ] Given-When-Then 패턴을 따르는가?
- [ ] 공용 테스트 유틸리티를 활용했는가?
- [ ] jest-mock-extended의 DeepMockProxy를 사용했는가?
- [ ] beforeEach에서 mock을 초기화했는가?
- [ ] afterEach에서 mockReset을 호출했는가?
- [ ] 에러 케이스를 테스트했는가?
- [ ] 경계값(null, undefined, 빈 배열)을 테스트했는가?

---

## 7. 연관 에이전트

### 선행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| repository-builder | 테스트 대상 | Repository 구현 완료 후 |
| service-builder | 테스트 대상 | Service 구현 완료 후 |
| be-app-builder | 테스트 대상 | ApplicationService 구현 완료 후 |
| controller-builder | 테스트 대상 | Controller 구현 완료 후 |

### 후행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| (없음) | - | 테스트 완료 후 종료 |

### 관련 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| fe-testing | 대응 | 프론트엔드 테스트 담당 |

---

## 8. 프로젝트별 참고사항

### 적용 범위

| 위치 | 테스트 파일 패턴 | 환경 |
|------|-----------------|------|
| `apps/server` | `**/*.spec.ts` | node |
| `packages/be-common` | `**/*.spec.ts` | node |
| `packages/be-app` | `**/__tests__/**/*.spec.ts` | node |
| `packages/be-integration` | `**/__tests__/**/*.spec.ts` | node |
| `packages/be-service` | `**/__tests__/**/*.spec.ts` | node |
| `packages/be-repository` | `**/__tests__/**/*.spec.ts` | node |
| `packages/be-entity` | `**/__tests__/**/*.spec.ts` | node |
| `packages/be-dto` | `**/__tests__/**/*.spec.ts` | node |
| `packages/be-vo` | `**/__tests__/**/*.spec.ts` | node |

### 테스트 파일 위치

```
packages/{package}/src/__tests__/{file}.spec.ts
apps/core/api/src/module/{module}/{file}.spec.ts
```

### 공용 테스트 유틸리티

```typescript
import {
  createMockPrismaService,
  createTestUser,
  createTestUserEntity,
  createTestTokens,
  createMockJwtService,
  createMockConfigService,
  createMockRequest,
  createMockResponse,
  setupTestModule,
  setupTestController,
} from "@cocrepo/be-common/src/test";
```

### Mock 패턴

#### DeepMockProxy 사용

```typescript
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

// 타입 안전한 전체 mock
const mockService: DeepMockProxy<UsersService> = mockDeep<UsersService>();

// 메서드 mock 설정
mockService.findById.mockResolvedValue(mockUser);
mockService.findById.mockRejectedValue(new Error("Not found"));

// mock 초기화
mockReset(mockService);
```

#### 부분 Mock (jest.Mocked)

```typescript
// 필요한 메서드만 mock
const mockApplicationService: jest.Mocked<AuthApplicationService> = {
  login: jest.fn(),
  logout: jest.fn(),
} as unknown as jest.Mocked<AuthApplicationService>;
```

### 테스트 실행 명령어

```bash
# 특정 패키지 테스트
pnpm --filter=@cocrepo/service test
pnpm --filter=@cocrepo/app test

# Watch 모드
pnpm --filter=@cocrepo/service test:watch

# Coverage
pnpm --filter=@cocrepo/service test --coverage

# 서버 앱 테스트
pnpm --filter=server test

# E2E 테스트
pnpm --filter=server test:e2e
```

### 관련 파일

- 테스트 유틸리티: `packages/be-common/src/test/test-utils.ts`
- 테스트 설정: `packages/*/jest.config.js`
- E2E 테스트: `apps/core/api/test/`
