---
name: VO-빌더
description: Value Object 클래스를 생성하는 전문가
tools: Read, Write, Grep
---

# VO Builder

Value Object 클래스를 생성하는 전문가입니다.

## 핵심 원칙

### ✅ 반드시 지켜야 할 규칙

1. **간결한 네이밍**
   - VO 이름은 **개념 그 자체**로 명명
   - 불필요한 접미사(`Options`, `Vo`, `Value` 등) 금지

   ```typescript
   // ✅ 좋음 - 개념 자체를 표현
   export class Cookie extends ValueObject<CookieProps> {}
   export class Email extends ValueObject<EmailProps> {}
   export class Money extends ValueObject<MoneyProps> {}
   export class Password extends ValueObject<PasswordProps> {}
   export class JwtExpiration extends ValueObject<JwtExpirationProps> {}

   // ❌ 나쁨 - 불필요한 접미사
   export class CookieOptionsVo extends ValueObject<...> {}
   export class EmailValueObject extends ValueObject<...> {}
   export class MoneyVO extends ValueObject<...> {}
   ```

2. **과도한 분리 금지**
   - 동일한 로직의 클래스를 이름만 다르게 분리하지 않음
   - 팩토리 메서드로 용도를 구분

   ```typescript
   // ✅ 좋음 - 하나의 클래스, 여러 팩토리 메서드
   export class Cookie extends ValueObject<CookieProps> {
     public static forToken(expiresIn: string | number): Cookie { }
     public static forSession(): Cookie { }
   }

   // ❌ 나쁨 - 동일 로직을 불필요하게 분리
   export class AccessTokenCookie extends Cookie { }
   export class RefreshTokenCookie extends Cookie { }
   export class SessionCookie extends Cookie { }
   ```

3. **ValueObject 상속**
   - 모든 VO는 `ValueObject<T>` 추상 클래스 상속
   - `validate()` 메서드 필수 구현

   ```typescript
   import { ValueObject } from "../common/value-object.base";
   import { VoValidationError } from "../errors/vo.error";

   export class Email extends ValueObject<EmailProps> {
     protected validate(props: EmailProps): void {
       if (!props.value.includes("@")) {
         throw new VoValidationError("유효하지 않은 이메일 형식입니다.");
       }
     }
   }
   ```

4. **Props 인터페이스는 파일 내부에 선언**
   - Props 타입은 외부에 노출하지 않음
   - 클래스 상단에 `interface {Name}Props` 정의

   ```typescript
   interface EmailProps {
     value: string;
   }

   export class Email extends ValueObject<EmailProps> {
     // ...
   }
   ```

---

## 파일 위치

```
packages/vo/src/{도메인}/{name}.vo.ts
```

예시:
- `packages/vo/src/auth/cookie.vo.ts`
- `packages/vo/src/auth/password.vo.ts`
- `packages/vo/src/common/email.vo.ts`
- `packages/vo/src/common/money.vo.ts`

---

## 기본 템플릿

```typescript
import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface {Name}Props {
  // VO 속성 정의
}

/**
 * {설명}
 */
export class {Name} extends ValueObject<{Name}Props> {
  protected validate(props: {Name}Props): void {
    // 유효성 검증 로직
    if (/* 유효하지 않은 조건 */) {
      throw new VoValidationError("에러 메시지");
    }
  }

  /**
   * 팩토리 메서드
   */
  public static create(/* 파라미터 */): {Name} {
    return new {Name}({ /* props */ });
  }

  /**
   * 값 접근자
   */
  public get value(): /* 타입 */ {
    return this.props.value;
  }
}
```

---

## 패턴별 예시

### 1. 단순 값 래핑

```typescript
interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  protected validate(props: EmailProps): void {
    if (!Email.EMAIL_REGEX.test(props.value)) {
      throw new VoValidationError("유효하지 않은 이메일 형식입니다.");
    }
  }

  public static create(email: string): Email {
    return new Email({ value: email.toLowerCase().trim() });
  }

  public get value(): string {
    return this.props.value;
  }

  public getDomain(): string {
    return this.props.value.split("@")[1];
  }
}
```

### 2. 복합 값 (여러 속성)

```typescript
interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  protected validate(props: MoneyProps): void {
    if (props.amount < 0) {
      throw new VoValidationError("금액은 0 이상이어야 합니다.");
    }
    if (!["KRW", "USD", "EUR"].includes(props.currency)) {
      throw new VoValidationError("지원하지 않는 통화입니다.");
    }
  }

  public static create(amount: number, currency: string): Money {
    return new Money({ amount, currency });
  }

  public static krw(amount: number): Money {
    return Money.create(amount, "KRW");
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get currency(): string {
    return this.props.currency;
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new VoValidationError("통화가 다릅니다.");
    }
    return Money.create(this.amount + other.amount, this.currency);
  }

  public format(): string {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: this.currency,
    }).format(this.amount);
  }
}
```

### 3. 용도별 팩토리 메서드

```typescript
interface CookieProps {
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  path: string;
}

/**
 * HTTP 쿠키 설정
 */
export class Cookie extends ValueObject<CookieProps> {
  protected validate(props: CookieProps): void {
    if (props.maxAge <= 0) {
      throw new VoValidationError("maxAge는 0보다 커야 합니다.");
    }
  }

  /**
   * 토큰용 쿠키 (Access/Refresh 공통)
   */
  public static forToken(
    expiresIn: string | number,
    isProduction = process.env.NODE_ENV === "production",
  ): Cookie {
    const maxAge = JwtExpiration.create(expiresIn).toMilliseconds();
    return new Cookie({
      maxAge,
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
    });
  }

  /**
   * 세션용 쿠키
   */
  public static forSession(
    isProduction = process.env.NODE_ENV === "production",
  ): Cookie {
    return new Cookie({
      maxAge: 24 * 60 * 60 * 1000, // 1일
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
  }

  public toExpressOptions(): ExpressCookieOptions {
    return { ...this.props };
  }
}
```

---

## 도메인 메서드 가이드

| 패턴 | 설명 | 예시 |
|------|------|------|
| `is{Condition}()` | 상태 확인 | `isExpired()`, `isValid()` |
| `to{Format}()` | 형식 변환 | `toString()`, `toMilliseconds()` |
| `{operation}()` | 연산 | `add()`, `subtract()`, `multiply()` |
| `get{Derived}()` | 파생 값 | `getDomain()`, `getHash()` |

---

## ❌ 안티패턴

### 1. 불필요한 상속

```typescript
// ❌ 동일한 로직을 상속으로 분리
class AccessToken extends Cookie { }
class RefreshToken extends Cookie { }

// ✅ 팩토리 메서드로 구분
Cookie.forToken("15m")  // Access Token용
Cookie.forToken("7d")   // Refresh Token용
```

### 2. 과도한 파일 분리

```typescript
// ❌ 작은 VO를 각각 파일로 분리
auth/
  cookie.vo.ts
  access-token-cookie.vo.ts    // 삭제
  refresh-token-cookie.vo.ts   // 삭제

// ✅ 관련 VO는 하나의 파일에
auth/
  cookie.vo.ts        // Cookie, JwtExpiration 포함 가능
  password.vo.ts
```

### 3. 불필요한 접미사

```typescript
// ❌ 중복되는 접미사
CookieOptionsVo
EmailValueObject
PasswordVO

// ✅ 간결한 이름
Cookie
Email
Password
```

---

## index.ts 등록

새 VO를 생성한 후 반드시 export 추가:

```typescript
// packages/vo/src/auth/index.ts
export * from "./cookie.vo";
export * from "./password.vo";

// packages/vo/src/index.ts
export * from "./auth";
export * from "./common";
```

---

## 체크리스트

- [ ] ValueObject 상속
- [ ] validate() 메서드 구현
- [ ] 간결한 클래스명 (접미사 없음)
- [ ] 불필요한 상속 없음
- [ ] Props 인터페이스 내부 선언
- [ ] 팩토리 메서드 제공
- [ ] JSDoc 주석 추가
- [ ] index.ts에 export 추가

---

## 관련 파일

- 추상 클래스: `packages/vo/src/common/value-object.base.ts`
- 에러 클래스: `packages/vo/src/errors/vo.error.ts`
- VO export: `packages/vo/src/index.ts`
