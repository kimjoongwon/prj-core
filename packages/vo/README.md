# @cocrepo/vo

Value Object 패키지 - 도메인 불변 값 객체

## 개요

`@cocrepo/vo`는 도메인 주도 설계(DDD)의 Value Object 패턴을 구현한 패키지입니다. 비밀번호, 토큰, 이메일, 전화번호 등의 도메인 값들을 불변 객체로 캡슐화하여 타입 안전성과 도메인 로직의 명확성을 향상시킵니다.

## 특징

- **불변성(Immutability)**: 한 번 생성된 VO는 변경 불가
- **값 동등성(Value Equality)**: 내부 값으로 비교
- **자가 검증(Self Validation)**: 생성 시 자동으로 유효성 검증
- **타입 안전성**: `string` 대신 명확한 도메인 타입 사용
- **캡슐화**: 비즈니스 로직이 도메인 객체 내부에 응집

## 설치

```bash
pnpm add @cocrepo/vo
```

## 사용 방법

### Password VO

```typescript
import { PlainPassword, HashedPassword } from "@cocrepo/vo";

// 평문 비밀번호 생성 (검증 자동)
const plainPassword = PlainPassword.create("myPassword123!");

// 해시된 비밀번호 생성
const hashedPassword = await HashedPassword.fromPlain(plainPassword);

// DB 저장
const user = await prisma.user.create({
  data: {
    password: hashedPassword.value, // string 값 추출
  },
});

// 비밀번호 검증
const storedHash = HashedPassword.fromHash(user.password);
const isValid = await storedHash.compare(plainPassword); // true/false
```

### Token VO

```typescript
import { TokenPair } from "@cocrepo/vo";

// 토큰 쌍 생성
const tokenPair = TokenPair.fromStrings(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // accessToken
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // refreshToken
);

// 개별 토큰 접근
const accessToken = tokenPair.accessToken;
const refreshToken = tokenPair.refreshToken;

// 객체로 변환
const tokens = tokenPair.toObject();
// { accessToken: string, refreshToken: string }
```

### Cookie VO

```typescript
import { AccessTokenCookieOptions, RefreshTokenCookieOptions } from "@cocrepo/vo";

// Access Token 쿠키 옵션 생성
const accessCookieOptions = AccessTokenCookieOptions.forAccessToken("15m");

// Express Response에 쿠키 설정
res.cookie("accessToken", token, accessCookieOptions.toExpressCookieOptions());

// Refresh Token 쿠키 옵션 생성
const refreshCookieOptions = RefreshTokenCookieOptions.forRefreshToken("7d");
res.cookie("refreshToken", token, refreshCookieOptions.toExpressCookieOptions());
```

### Email/Phone VO

```typescript
import { Email, Phone } from "@cocrepo/vo";

// 이메일 생성 (자동 소문자 변환 및 검증)
const email = Email.create("user@Example.com");
console.log(email.value); // "user@example.com"
console.log(email.getDomain()); // "example.com"

// 전화번호 생성 (국제 형식 검증 및 E.164 정규화)
const phone = Phone.create("010-1234-5678", "KR");
console.log(phone.normalized); // "+821012345678"
console.log(phone.formatNational()); // "010-1234-5678"
console.log(phone.formatInternational()); // "+82 10-1234-5678"
```

## VO 목록

### 인증 (Auth)

#### Password
- `PlainPassword`: 평문 비밀번호 (길이, 형식 검증)
- `HashedPassword`: bcrypt 해시 비밀번호 (해싱, 비교)

#### Token
- `AccessToken`: JWT Access Token (형식 검증)
- `RefreshToken`: JWT Refresh Token (형식 검증)
- `TokenPair`: Access Token + Refresh Token 쌍

#### Cookie
- `JwtExpiration`: JWT 만료 시간 파싱 ("15m", "7d" → 밀리초)
- `CookieOptionsVo`: Express 쿠키 옵션
- `AccessTokenCookieOptions`: Access Token 전용 쿠키 옵션
- `RefreshTokenCookieOptions`: Refresh Token 전용 쿠키 옵션

### 연락처 (Contact)
- `Email`: 이메일 주소 (RFC 5322 형식 검증, 소문자 정규화)
- `Phone`: 전화번호 (국제 형식 검증, E.164 정규화)

## 아키텍처

### 기본 클래스

모든 VO는 `ValueObject<T>` 추상 클래스를 상속받습니다:

```typescript
abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.validate(props);      // 자가 검증
    this.props = Object.freeze(props); // 불변성 보장
  }

  public equals(other?: ValueObject<T>): boolean {
    // 값 동등성 비교
  }

  protected abstract validate(props: T): void;
  public getValue(): Readonly<T>;
}
```

### 검증 에러

VO 검증 실패 시 `VoValidationError`를 던집니다:

```typescript
try {
  const password = PlainPassword.create("123"); // 너무 짧음
} catch (error) {
  if (error instanceof VoValidationError) {
    console.error(error.message); // "비밀번호는 최소 8자 이상이어야 합니다."
  }
}
```

## 모범 사례

### 1. Service 레이어에서 VO 사용

```typescript
@Injectable()
export class AuthFacade {
  async signUp(dto: SignUpPayloadDto) {
    // DTO → VO 변환
    const plainPassword = PlainPassword.create(dto.password);
    const hashedPassword = await HashedPassword.fromPlain(plainPassword);

    // DB 저장 시 값 추출
    await this.prisma.user.create({
      data: {
        password: hashedPassword.value,
      },
    });
  }

  async login(dto: LoginPayloadDto) {
    const user = await this.usersService.getByEmail(dto.email);

    // 비밀번호 검증
    const plainPassword = PlainPassword.create(dto.password);
    const storedHash = HashedPassword.fromHash(user.password);
    const isValid = await storedHash.compare(plainPassword);

    if (!isValid) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    return user;
  }
}
```

### 2. Entity는 string 유지

```typescript
// ❌ Entity에 직접 VO 사용 (Prisma 호환성 문제)
export class User {
  email!: Email; // X
  phone!: Phone; // X
}

// ✅ Entity는 string 유지, Service에서 VO 사용
export class User {
  email!: string; // O
  phone!: string; // O
}

// Service에서 필요 시 VO로 변환
const emailVo = Email.create(user.email);
if (!emailVo.getDomain().endsWith("company.com")) {
  throw new Error("회사 이메일만 허용됩니다.");
}
```

### 3. DI 없이 직접 사용

```typescript
// ❌ VO를 DI 컨테이너에 등록하지 마세요
@Module({
  providers: [PlainPassword], // X
})

// ✅ 필요한 곳에서 직접 import하여 사용
import { PlainPassword } from "@cocrepo/vo";

const password = PlainPassword.create("myPassword");
```

## 개발

```bash
# 의존성 설치
pnpm install

# 빌드
pnpm build

# Watch 모드
pnpm start:dev

# 타입 체크
pnpm type-check

# 포맷팅
pnpm format
```

## 라이선스

UNLICENSED
