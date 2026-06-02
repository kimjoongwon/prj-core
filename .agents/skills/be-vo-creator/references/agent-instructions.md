# Detailed Instructions for be-vo-builder

Source agent file: `.codex/agents/be-vo-builder.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.


## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# VO Builder

Value Object 클래스를 생성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 설명 |
|------|------|
| 도메인 값 캡슐화 | 이메일, 금액, 비밀번호 등 도메인 개념을 객체로 표현 |
| 유효성 검증 필요 | 값 생성 시 검증 로직이 필요한 경우 |
| 비즈니스 로직 포함 | 값과 관련된 연산/변환 로직 필요 |
| 불변성 보장 | 한번 생성된 값이 변경되면 안 되는 경우 |

### VO vs @cocrepo/schema 데코레이터

| 구분 | VO (be-vo) | @cocrepo/schema 데코레이터 |
|------|------------|---------------------------|
| 위치 | packages/be-vo | packages/common-schema |
| 용도 | 백엔드 도메인 로직 | DTO 검증 규칙 정의 |
| 런타임 | 인스턴스 생성 필요 | 클래스 필드 데코레이터 |
| 예시 | `Email.create(value)` | `@EmailField()` |

**언제 무엇을 사용하는가?**
- **VO**: 복잡한 도메인 로직, 불변성 보장, 값 연산 필요 시
- **@cocrepo/schema 데코레이터**: DTO 검증, 스키마 상속, 프론트엔드/백엔드 검증 규칙 공유

---

## 2. 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | 도메인 개념 | 캡슐화할 값의 개념 (이메일, 금액 등) |
| | 유효성 규칙 | 값이 유효한지 판단하는 조건 |
| | 연산 요구사항 | 값에 대해 수행할 연산 (선택) |
| **출력** | VO 클래스 | ValueObject를 상속한 불변 객체 |
| | 팩토리 메서드 | 다양한 생성 방법 제공 |

---

## 3. 핵심 규칙

- VO class는 class당 하나의 `*.vo.ts` 파일을 가집니다.
- VO class 파일에는 top-level props/interface/type/helper/constant를 함께 두지 않습니다.
- Props/Options/helper/constant는 같은 domain 폴더의 별도 파일로 분리합니다.

### ✅ Do

1. **간결한 네이밍** - 개념 그 자체로 명명
   ```typescript
   // ✅ 좋음 - 개념 자체를 표현
   export class Cookie extends ValueObject<CookieProps> {}
   export class Email extends ValueObject<EmailProps> {}
   export class Money extends ValueObject<MoneyProps> {}
   export class Password extends ValueObject<PasswordProps> {}
   ```

2. **팩토리 메서드로 용도 구분**
   ```typescript
   export class Cookie extends ValueObject<CookieProps> {
     public static forToken(expiresIn: string | number): Cookie { }
     public static forSession(): Cookie { }
   }
   ```

3. **ValueObject 상속 및 validate() 필수 구현**
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

4. **Props/Options/helper는 별도 파일로 분리**
   ```typescript
   // email.props.ts
   export interface EmailProps {
     value: string;
   }

   // email.vo.ts
   import type { EmailProps } from "./email.props";

   export class Email extends ValueObject<EmailProps> { }
   ```

### ❌ Don't

1. **불필요한 접미사 금지**
   ```typescript
   // ❌ 나쁨
   CookieOptionsVo
   EmailValueObject
   MoneyVO

   // ✅ 좋음
   Cookie
   Email
   Money
   ```

2. **과도한 상속/분리 금지**
   ```typescript
   // ❌ 동일 로직을 불필요하게 분리
   export class AccessTokenCookie extends Cookie { }
   export class RefreshTokenCookie extends Cookie { }

   // ✅ 팩토리 메서드로 구분
   Cookie.forToken("15m")   // Access Token용
   Cookie.forToken("7d")    // Refresh Token용
   ```

3. **여러 책임을 한 파일에 묶기 금지**
   ```typescript
   // ❌ 관련 VO와 helper를 하나의 파일에 묶음
   auth/
     token.vo.ts    // AccessToken, RefreshToken, TokenPair, TokenProps 포함

   // ✅ VO class와 계약 타입을 각각 파일로 분리하고 같은 폴더에 배치
   auth/
     access-token.vo.ts
     access-token.props.ts
     refresh-token.vo.ts
     refresh-token.props.ts
     token-pair.vo.ts
     token-pair.props.ts
   ```

---

## 4. 프로세스

```
0. owner contract 확인
   Read `app.context.md` 또는 관련 route `page.spec.md`의 backend contract 섹션
   → VO 계약은 허용 owner 문서의 backend contract 섹션에 반영한다
   ↓
1. 도메인 개념 분석
   - 캡슐화할 값 식별
   - 유효성 규칙 정의
   ↓
2. Props/Options/helper 파일 정의
   - 내부 속성 설계
   - `{name}.props.ts`, `{name}.options.ts`, `{name}.helper.ts`처럼 별도 파일로 분리
   ↓
3. VO 클래스 구현
   - ValueObject 상속
   - validate() 구현
   - 팩토리 메서드 추가
   - getter/도메인 메서드 추가
   ↓
4. index.ts export 추가
   ↓
5. VO Contract 생성/업데이트
   → VO Contract summary
```

---

## 5. 템플릿

### 기본 템플릿

```typescript
import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";
import type { {Name}Props } from "./{name}.props";

/**
 * {설명}
 */
export class {Name} extends ValueObject<{Name}Props> {
  protected validate(props: {Name}Props): void {
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

### 단순 값 래핑

```typescript
import type { EmailProps } from "./email.props";

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

### 복합 값 (여러 속성)

```typescript
import type { MoneyProps } from "./money.props";

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

### 용도별 팩토리 메서드

```typescript
import type { CookieProps } from "./cookie.props";

export class Cookie extends ValueObject<CookieProps> {
  protected validate(props: CookieProps): void {
    if (props.maxAge <= 0) {
      throw new VoValidationError("maxAge는 0보다 커야 합니다.");
    }
  }

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

  public static forSession(
    isProduction = process.env.NODE_ENV === "production",
  ): Cookie {
    return new Cookie({
      maxAge: 24 * 60 * 60 * 1000,
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

## 6. 체크리스트

- [ ] ValueObject 상속
- [ ] validate() 메서드 구현
- [ ] 간결한 클래스명 (접미사 없음)
- [ ] 불필요한 상속 없음
- [ ] Props/Options/helper가 VO class 파일에서 분리됨
- [ ] 팩토리 메서드 제공
- [ ] 도메인 메서드 추가 (필요시)
- [ ] JSDoc 주석 추가
- [ ] index.ts에 export 추가
- [ ] VO Contract 변경 필요 시 허용 owner 문서에 반영 또는 보고

## 6-1. VO Contract 형식

VO Contract는 backend VO 전용 spec 파일로 분리하지 않고 `app.context.md`, route `page.spec.md`, 또는 owner spec 섹션에 기록합니다.

---

## 7. 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|----------|------|
| **선행** | technical-designer | 도메인 개념 정의 |
| **후행** | entity-builder | Entity에서 VO 사용 |
| | service-builder | Service에서 VO 활용 |
| **관련** | dto-builder | DTO ↔ VO 변환 |

---

## 8. 프로젝트별 참고사항

### 파일 위치

```
packages/be-vo/src/{도메인}/{name}.vo.ts
```

예시:
- `packages/be-vo/src/auth/cookie.vo.ts`
- `packages/be-vo/src/auth/password.vo.ts`
- `packages/be-vo/src/common/email.vo.ts`
- `packages/be-vo/src/common/money.vo.ts`

### 도메인 메서드 네이밍 가이드

| 패턴 | 설명 | 예시 |
|------|------|------|
| `is{Condition}()` | 상태 확인 | `isExpired()`, `isValid()` |
| `to{Format}()` | 형식 변환 | `toString()`, `toMilliseconds()` |
| `{operation}()` | 연산 | `add()`, `subtract()`, `multiply()` |
| `get{Derived}()` | 파생 값 | `getDomain()`, `getHash()` |

### index.ts 등록

새 VO를 생성한 후 반드시 export 추가:

```typescript
// packages/be-vo/src/auth/index.ts
export * from "./cookie.vo";
export * from "./password.vo";

// packages/be-vo/src/index.ts
export * from "./auth";
export * from "./common";
```

### 관련 파일

- 추상 클래스: `packages/be-vo/src/common/value-object.base.ts`
- 에러 클래스: `packages/be-vo/src/errors/vo.error.ts`
- VO export: `packages/be-vo/src/index.ts`
