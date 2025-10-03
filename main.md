# NestJS vs Spring Boot 요청 처리 아키텍처 가이드

## 📋 목차
1. [NestJS 요청 처리 플로우](#nestjs-요청-처리-플로우)
2. [Spring Boot 요청 처리 플로우](#spring-boot-요청-처리-플로우)
3. [레이어별 대응 관계](#레이어별-대응-관계)
4. [각 컴포넌트의 역할과 필연성](#각-컴포넌트의-역할과-필연성)
5. [Global vs Individual Guard 전략](#global-vs-individual-guard-전략)
6. [Filter의 실제 동작 원리](#filter의-실제-동작-원리)
7. [실무 적용 가이드](#실무-적용-가이드)

---

## NestJS 요청 처리 플로우

### 1. **HTTP Server** (Express/Fastify)
```typescript
// 기본 HTTP 서버 레벨
// Express middleware 또는 Fastify hooks
```

### 2. **Global Middleware**
```typescript
// main.ts
app.use(cors());
app.use(helmet());
app.use(express.json());
```

### 3. **CORS 설정** (별도 설정)
```typescript
app.enableCors({
  origin: true,
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
});
```

### 4. **Module Middleware**
```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```

### 5. **Global Guards**
```typescript
// main.ts
app.useGlobalGuards(new AuthGuard());
```

### 6. **Controller Guards**
```typescript
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {}
```

### 7. **Method Guards**
```typescript
@Get()
@UseGuards(AdminGuard)
getUserList() {}
```

### 8. **Global Interceptors**
```typescript
// main.ts
app.useGlobalInterceptors(new LoggingInterceptor());
```

### 9. **Controller/Method Interceptors**
```typescript
@UseInterceptors(TransformInterceptor)
@Get()
getUsers() {}
```

### 10. **Global Pipes**
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe());
```

### 11. **Parameter Pipes**
```typescript
@Get(':id')
getUser(@Param('id', ParseIntPipe) id: number) {}
```

### 12. **Route Handler** (Controller Method)
```typescript
@Get(':id')
async getUser(@Param('id') id: string) {
  return this.userService.findOne(id);
}
```

### 13. **Interceptors (after)** - 역순 실행

### 14. **Exception Filters** (예외 발생 시에만)
```typescript
// main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## Spring Boot 요청 처리 플로우

### 1. **Servlet Container** (Tomcat/Jetty/Undertow)
```java
// 기본 서블릿 컨테이너 레벨
```

### 2. **Servlet Filters**
```java
@Component
@Order(1)
public class CorsFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        // CORS 처리
        chain.doFilter(request, response);
    }
}
```

### 3. **DispatcherServlet**
```java
// Spring MVC의 중앙 디스패처
// 모든 HTTP 요청의 진입점
```

### 4. **HandlerMapping**
```java
// URL과 Controller 메소드 매핑
@RequestMapping("/api/users")
```

### 5. **HandlerInterceptor (preHandle)**
```java
@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 인증/인가 처리
        return true;
    }
}
```

### 6. **ArgumentResolver**
```java
// @RequestBody, @PathVariable 등 파라미터 바인딩
@PathVariable Long id
@RequestBody UserDto userDto
```

### 7. **Controller Method**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }
}
```

### 8. **HandlerInterceptor (postHandle)**
```java
@Override
public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
    // 후처리
}
```

### 9. **ResponseBodyAdvice**
```java
@ControllerAdvice
public class ResponseWrapper implements ResponseBodyAdvice {
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        return new ApiResponse<>(body);
    }
}
```

### 10. **ExceptionHandler**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(ex.getMessage()));
    }
}
```

### 11. **HandlerInterceptor (afterCompletion)**
```java
@Override
public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
    // 완료 후 정리
}
```

---

## ⚠️ 중요: Filter 용어 혼동 주의

### 🔄 용어는 같지만 역할이 다름!

| 프레임워크 | Filter의 역할 | 실행 시점 |
|-----------|-------------|----------|
| **NestJS Filter** | 예외 처리 전용 | 예외 발생 시에만 |
| **Spring Filter** | 요청/응답 인터셉터 | 모든 요청에서 |

### 🎯 정확한 역할 매핑
```
Spring Filter = NestJS Guard + NestJS Middleware
Spring @ExceptionHandler = NestJS Filter
```

---

## 레이어별 대응 관계 (수정됨)

| 순서 | NestJS | Spring Boot | 역할 |
|------|--------|-------------|------|
| 1 | **HTTP Server** | **Servlet Container** | 기본 HTTP 처리 |
| 2 | **Global Middleware** | **Servlet Filters** | CORS, 보안, 로깅 |
| 3 | **CORS 설정** | **CORS Filter** | 브라우저 보안 정책 |
| 4 | **Guards** | **Servlet Filters** (인증 부분) | 인증/인가 |
| 5 | **Interceptors (before)** | **HandlerInterceptor (preHandle)** | 전처리 |
| 6 | **Pipes** | **ArgumentResolver** | 데이터 변환/검증 |
| 7 | **Controller Method** | **Controller Method** | 비즈니스 로직 |
| 8 | **Interceptors (after)** | **HandlerInterceptor (postHandle)** | 후처리 |
| 9 | **Filters (예외 처리)** | **@ExceptionHandler** | 예외 처리 |
| 10 | - | **HandlerInterceptor (afterCompletion)** | 완료 후 정리 |

---

## 각 컴포넌트의 역할과 필연성

### 🔐 보안부터 비즈니스 로직까지의 필연적 순서

#### 1. **HTTP Server → Middleware**: "문지기가 먼저"
```
왜? 집에 들어오기 전에 현관에서 신원확인을 해야 하듯이
```
- HTTP 요청이 애플리케이션에 도달하기 전
- CORS, 보안 헤더, 로깅 등 **기본 안전장치**
- 잘못된 요청은 여기서 차단

#### 2. **Guards**: "경비원이 다음"
```
왜? 신원확인 후 출입권한을 체크해야 하므로
```
- 인증(Authentication): "너 누구야?"
- 인가(Authorization): "너 여기 들어올 수 있어?"
- **비즈니스 로직 실행 전**에 권한 체크 필수

#### 3. **Interceptors (before)**: "비서가 준비작업"
```
왜? 실제 업무 시작 전 준비가 필요하므로
```
- 요청 로깅, 캐싱 체크, 데이터 전처리
- Controller 실행 **전후를 감싸서** 모니터링

#### 4. **Pipes**: "데이터 검증 및 변환"
```
왜? 잘못된 데이터로 비즈니스 로직 실행하면 안되므로
```
- `string` → `number` 변환
- DTO 검증 (`@IsEmail`, `@IsNotEmpty`)
- **Controller에 깨끗한 데이터**만 전달

#### 5. **Controller Method**: "실제 업무 처리"
```
왜? 모든 준비가 끝났으니 이제 실제 일을 하자
```
- 인증 ✅, 권한 ✅, 데이터 검증 ✅
- **안전하게 비즈니스 로직 실행**

### 🏗️ 현실 세계와의 비교
```
건물 출입 과정과 동일:

1. 건물 입구 (HTTP Server)
2. 보안검색대 (Middleware - CORS, 보안)
3. 출입카드 체크 (Guards - 인증/인가)
4. 방문 목적 확인 (Interceptors - 로깅)
5. 서류 검토 (Pipes - 데이터 검증)
6. 실제 업무 처리 (Controller)
7. 결과 정리 (Interceptors - 응답 처리)
8. 문제 발생시 대응 (Filters - 예외 처리)
```

### 💡 핵심 원리
**"안전한 것부터 위험한 것 순으로"**
- 보안 검증 → 데이터 검증 → 비즈니스 로직 실행
- **신뢰할 수 없는 외부 → 신뢰할 수 있는 내부**로 점진적 이동

---

## Global vs Individual Guard 전략

### 🛡️ Global Guard 사용 케이스

#### 1. **기본 인증이 필요한 모든 API**
```typescript
// main.ts
app.useGlobalGuards(new JwtAuthGuard());

// 모든 엔드포인트에 기본 JWT 인증 적용
// 예외가 필요한 곳만 @Public() 데코레이터 사용
```

#### 2. **공통 보안 정책**
```typescript
// 모든 API에 Rate Limiting 적용
app.useGlobalGuards(new ThrottlerGuard());

// 모든 API에 기본 권한 체크
app.useGlobalGuards(new BasicAuthGuard());
```

#### 3. **감사 로깅 (Audit)**
```typescript
@Injectable()
export class AuditGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // 모든 요청을 로깅
    this.auditService.log(request.user, request.url, request.method);
    return true;
  }
}

// 모든 엔드포인트의 접근을 자동 로깅
app.useGlobalGuards(new AuditGuard());
```

### 🎯 Individual Guard가 더 적합한 케이스

#### 1. **인증이 선택적인 애플리케이션**
```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  login() {} // 인증 불필요

  @Post('register')
  register() {} // 인증 불필요
}

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard) // 인증 필요한 곳만
  getProfile() {}
}
```

#### 2. **역할별 세분화된 권한**
```typescript
@Controller('admin')
export class AdminController {
  @Get('users')
  @UseGuards(AdminGuard) // 관리자만
  getUsers() {}

  @Delete('users/:id')
  @UseGuards(SuperAdminGuard) // 최고 관리자만
  deleteUser() {}
}
```

### 🔄 Global + Individual Guard 조합 패턴

#### 패턴 1: Global 기본 + 개별 추가
```typescript
// main.ts - 모든 API에 기본 인증
app.useGlobalGuards(new JwtAuthGuard());

// controller - 특정 역할 추가 검증
@Controller('admin')
@UseGuards(AdminRoleGuard) // JwtAuthGuard + AdminRoleGuard
export class AdminController {}
```

#### 패턴 2: Global + 예외 처리
```typescript
// main.ts
app.useGlobalGuards(new JwtAuthGuard());

// 인증 불필요한 엔드포인트
@Post('login')
@Public() // JwtAuthGuard 건너뛰기
login() {}
```

### Public 데코레이터 구현
```typescript
// decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Public 엔드포인트는 인증 건너뛰기
    }

    return super.canActivate(context);
  }
}
```

### 📊 선택 기준 가이드

| 상황 | Global Guard | Individual Guard |
|------|-------------|-----------------|
| **80% 이상 API가 인증 필요** | ✅ Global + @Public | ❌ |
| **50% 미만 API가 인증 필요** | ❌ | ✅ Individual |
| **복잡한 권한 체계** | ❌ | ✅ Individual |
| **공통 보안 정책** | ✅ Global | ❌ |
| **감사/로깅** | ✅ Global | ❌ |
| **Rate Limiting** | ✅ Global | ❌ |

---

## Filter의 실제 동작 원리

### 🎯 Filter는 **예외 발생 시에만** 동작합니다

#### ❌ 일반적인 오해
"Filter가 요청과 응답 과정 모두에 관여한다"

#### ✅ 실제 동작
"Filter는 **예외가 발생했을 때만** 응답을 가로채서 처리합니다"

### 🔄 정확한 요청/응답 플로우

#### 정상적인 요청 플로우 (Filter 관여 안함)
```
HTTP Request
    ↓
Middleware
    ↓
Guards
    ↓
Interceptors (before)
    ↓
Pipes
    ↓
Controller Method ✅ 성공
    ↓
Interceptors (after)
    ↓
HTTP Response
```

#### 예외 발생 시 플로우 (Filter 관여함)
```
HTTP Request
    ↓
Middleware
    ↓
Guards ❌ 예외 발생
    ↓
Exception Filter 🛡️ 예외 처리
    ↓
HTTP Error Response
```

### 💡 주요 차이점 정리

| 컴포넌트 | 요청 관여 | 응답 관여 | 예외 관여 |
|---------|---------|---------|---------|
| **Middleware** | ✅ 항상 | ✅ 항상 | ❌ |
| **Guards** | ✅ 항상 | ❌ | ❌ |
| **Interceptors** | ✅ 항상 | ✅ 항상 | ❌ |
| **Pipes** | ✅ 항상 | ❌ | ❌ |
| **Filters** | ❌ | ✅ 예외시만 | ✅ 전용 |

### 🛠️ Filter 사용 예시

#### 전역 예외 처리
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}

// main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## 실무 적용 가이드

### 🎨 실제 main.ts 구성 예시

```typescript
async function bootstrap() {
  // =================================================================
  // 1. 애플리케이션 생성 및 기본 설정
  // =================================================================
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true, // 로거 설정 전까지 로그 버퍼링
  });

  const httpAdapterHost = app.get(HttpAdapterHost);

  // 로거 설정 (가장 먼저 설정하여 모든 로그 캐치)
  app.useLogger(app.get(Logger));

  // =================================================================
  // 2. Express 미들웨어 설정 (HTTP 레벨 - 가장 먼저 실행)
  // =================================================================
  // 쿠키 파싱 미들웨어 - 모든 요청에서 쿠키를 자동 파싱
  app.use(cookieParser());

  // Express 쿼리 파서 설정 - 복잡한 쿼리 객체 파싱 지원
  app.set("query parser", "extended");

  // =================================================================
  // 3. CORS 설정 (브라우저 보안 정책 - HTTP 레벨에서 처리)
  // =================================================================
  app.enableCors({
    origin: true, // 모든 도메인 허용 (개발환경용, 프로덕션에서는 특정 도메인 지정 권장)
    credentials: true, // 쿠키, 인증 헤더 포함 허용
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: "*", // 모든 헤더 허용
  });

  // =================================================================
  // 4. Global Exception Filters (모든 예외를 일관되게 처리)
  // =================================================================
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost.httpAdapter), // 전역 예외 처리
    new PrismaClientExceptionFilter(httpAdapterHost.httpAdapter), // Prisma 전용 예외 처리
  );

  // =================================================================
  // 5. Global Pipes (데이터 검증 및 변환 - Controller 실행 전)
  // =================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 자동 타입 변환 (string → number 등)
      whitelist: true, // DTO에 정의되지 않은 속성 자동 제거 (보안)
      forbidNonWhitelisted: false, // 정의되지 않은 속성 발견 시 에러 발생 여부
    }),
  );

  // =================================================================
  // 6. API 문서 설정 (Swagger)
  // =================================================================
  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME || "NestJS Application")
    .setVersion("1.0.0")
    .addBearerAuth() // JWT 토큰 인증 지원
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); // /api 경로에서 문서 제공

  // =================================================================
  // 7. 서버 시작 및 로깅
  // =================================================================
  const port = process.env.APP_PORT || 3006;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 서버가 ${port} 포트에서 시작되었습니다`);
  logger.log(`📱 환경: ${process.env.NODE_ENV}`);
  logger.log(`📊 API 문서: http://localhost:${port}/api`);
}
```

### 💡 추천 방식

**대부분의 엔터프라이즈 애플리케이션**:
```typescript
// 1. 기본 보안 - Global
app.useGlobalGuards(new JwtAuthGuard(), new ThrottlerGuard());

// 2. 세부 권한 - Individual
@UseGuards(AdminGuard, ResourceOwnerGuard)

// 3. 예외 처리 - Decorator
@Public()
```

이렇게 하면 **보안은 기본으로, 유연성도 확보**할 수 있습니다!

---

## 🚨 실무 혼동 방지 가이드

### NestJS 개발자가 Spring을 배울 때

#### ❌ 흔한 실수
```java
// 실수: NestJS "Filter"를 찾으려고 함
// NestJS Filter = 예외 처리
@Component
public class MyFilter implements Filter {
    // Spring Filter는 예외 처리가 아니라 요청/응답 인터셉터!
}
```

#### ✅ 올바른 접근
```java
// Spring에서 예외 처리는 @ExceptionHandler
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(401).body(new ErrorResponse(ex.getMessage()));
    }
}

// Spring Filter는 NestJS Guard + Middleware 역할
@Component
@Order(1)
public class JwtAuthenticationFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // 1. Guard 역할 - 인증 확인
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String token = extractToken(httpRequest);

        if (!isValidToken(token)) {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return; // 차단
        }

        // 2. Middleware 역할 - 요청 전처리
        System.out.println("Request: " + httpRequest.getRequestURI());

        chain.doFilter(request, response);

        // 3. Middleware 역할 - 응답 후처리
        System.out.println("Response completed");
    }
}
```

### Spring 개발자가 NestJS를 배울 때

#### ❌ 흔한 실수
```typescript
// 실수: Spring "Filter"를 찾으려고 함
// Spring Filter = 요청/응답 인터셉터
@Injectable()
export class MyFilter implements ExceptionFilter {
  // NestJS Filter는 예외 처리 전용!
  catch(exception: any, host: ArgumentsHost) {}
}
```

#### ✅ 올바른 접근
```typescript
// NestJS에서 요청 인터셉터는 Guard + Middleware
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Spring Filter의 인증 부분
  canActivate(context: ExecutionContext): boolean {
    return super.canActivate(context);
  }
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  // Spring Filter의 요청/응답 처리 부분
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request:', req.url);

    res.on('finish', () => {
      console.log('Response completed');
    });

    next();
  }
}

// NestJS에서 예외 처리는 Filter
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message
    });
  }
}
```

### 🎯 Spring Filter의 다양한 역할 예시

#### 1. 인증 필터 (NestJS Guard 역할)
```java
@Component
@Order(2)
public class JwtAuthenticationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // 공개 경로 확인 (NestJS @Public()와 유사)
        if (isPublicPath(httpRequest.getRequestURI())) {
            chain.doFilter(request, response);
            return;
        }

        // JWT 토큰 검증 (NestJS JwtAuthGuard와 동일)
        String token = extractToken(httpRequest);
        if (!jwtTokenProvider.validateToken(token)) {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return; // 차단
        }

        chain.doFilter(request, response);
    }

    private boolean isPublicPath(String uri) {
        return uri.startsWith("/auth/") || uri.startsWith("/public/");
    }
}
```

#### 2. CORS 필터 (NestJS Middleware 역할)
```java
@Component
@Order(1)
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // CORS 헤더 설정 (NestJS CORS 설정과 동일)
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "*");

        // Preflight 요청 처리
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        if ("OPTIONS".equals(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }
}
```

### 📊 프레임워크별 컴포넌트 역할 완전 정리

| 기능 | NestJS | Spring Boot | 코드 예시 |
|------|--------|-------------|----------|
| **CORS 처리** | `app.enableCors()` | `CorsFilter` | 위 CORS 필터 참조 |
| **인증 확인** | `JwtAuthGuard` | `AuthenticationFilter` | 위 인증 필터 참조 |
| **권한 확인** | `RoleGuard` | `AuthorizationFilter` | 역할 기반 필터 |
| **요청 로깅** | `LoggingMiddleware` | `LoggingFilter` | 요청/응답 로깅 |
| **예외 처리** | `ExceptionFilter` | `@ExceptionHandler` | 예외 응답 변환 |
| **데이터 검증** | `ValidationPipe` | `@Valid` + `ArgumentResolver` | DTO 검증 |

### 🎪 실무 팁: "Filter"라는 단어를 들었을 때

#### NestJS 환경에서
```
"Filter" = 예외 처리
→ try-catch의 글로벌 버전
→ 에러가 날 때만 실행됨
```

#### Spring 환경에서
```
"Filter" = 요청 가로채기
→ 모든 요청에서 실행됨
→ 인증, 로깅, CORS 등 모든 것
```

---

## 📋 결론

### 핵심 원칙
1. **보안 먼저**: 인증/인가를 비즈니스 로직보다 먼저 처리
2. **데이터 검증**: 컨트롤러 실행 전 모든 입력 데이터 검증
3. **예외 처리**: 일관된 에러 응답으로 사용자 경험 향상
4. **레이어 분리**: 각 레이어의 책임을 명확히 구분

### 실무 적용 포인트
- **Global Guard**: 80% 이상 API가 인증 필요한 경우
- **Individual Guard**: 복잡한 권한이나 선택적 인증이 필요한 경우
- **NestJS Filter**: 예외 처리 전용, 요청/응답 모두 관여하지 않음
- **Spring Filter**: 요청/응답 인터셉터, NestJS Guard + Middleware 역할
- **Interceptor**: 실제 요청/응답 모두 관여하는 컴포넌트

### ⚠️ 용어 혼동 방지 요약
```
같은 "Filter"라는 이름이지만:
- NestJS Filter = 예외 처리만
- Spring Filter = 모든 요청 처리

Spring 개발자 → NestJS: Filter는 예외만 처리한다!
NestJS 개발자 → Spring: Filter는 모든 요청을 처리한다!
```

이 가이드를 통해 NestJS와 Spring Boot의 요청 처리 아키텍처를 정확히 이해하고, 프레임워크 간 이동 시 혼동 없이 적절한 레이어에 로직을 배치할 수 있습니다.