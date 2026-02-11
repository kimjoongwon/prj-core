# @cocrepo/schema

프론트엔드와 백엔드에서 공유하는 검증 스키마 패키지입니다.

## 특징

- **NestJS 의존성 없음**: 순수 `class-validator` + `class-transformer` 기반
- **브라우저 호환**: 프론트엔드에서 직접 사용 가능
- **타입 안전**: TypeScript 완벽 지원
- **한글 에러 메시지**: 사용자 친화적인 검증 메시지

## 설치

```bash
pnpm add @cocrepo/schema
```

## 사용법

### 프론트엔드에서 사용

```typescript
import { LoginSchema, validateSchema } from '@cocrepo/schema';

// 폼 데이터 검증
const result = await validateSchema(LoginSchema, {
  email: 'user@example.com',
  password: 'password123',
});

if (result.isValid) {
  // 검증 성공
  console.log(result.data); // LoginSchema 인스턴스
  await login(result.data);
} else {
  // 검증 실패
  result.errors.forEach(error => {
    console.log(`${error.field}: ${error.messages.join(', ')}`);
  });
}
```

### 단일 필드 검증

```typescript
import { LoginSchema, validateField } from '@cocrepo/schema';

// 이메일 필드만 검증
const emailError = await validateField(LoginSchema, 'email', 'invalid-email');

if (emailError) {
  console.log(emailError.messages); // ['유효한 이메일 주소를 입력해주세요.']
}
```

### 백엔드에서 사용 (NestJS DTO 확장)

```typescript
// dto/sign-up-payload.dto.ts
import { SignUpSchema } from '@cocrepo/schema';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpPayloadDto extends SignUpSchema {
  @ApiProperty({ example: 'user@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  password: string;

  @ApiProperty({ example: '홍길동' })
  name: string;
}
```

> **tsconfig 설정 필요**: `useDefineForClassFields: false`, `strictPropertyInitialization: false`

## 제공 데코레이터

### 기본 타입

| 데코레이터 | 설명 | 옵션 |
|-----------|------|------|
| `@String()` | 문자열 필드 | `required`, `minLength`, `maxLength`, `toLowerCase`, `toUpperCase`, `trim` |
| `@Number()` | 숫자 필드 | `required`, `int`, `min`, `max` |
| `@Boolean()` | 불리언 필드 | `required` |
| `@DateField()` | 날짜 필드 | `required`, `minDate`, `maxDate` |
| `@Enum()` | 열거형 필드 | `required`, `each` |

### 특수 타입

| 데코레이터 | 설명 | 옵션 |
|-----------|------|------|
| `@Email()` | 이메일 필드 (자동 소문자 변환) | `required` |
| `@Password()` | 비밀번호 필드 | `minLength`, `strong` |
| `@Phone()` | 전화번호 필드 (한국) | `required` |
| `@UUID()` | UUID 필드 | `required`, `version`, `each` |

### Optional 버전

모든 데코레이터는 `Optional` 버전을 제공합니다:

```typescript
class UserSchema {
  @Email()
  email: string;           // 필수

  @EmailOptional()
  altEmail?: string;       // 선택

  @StringOptional({ maxLength: 100 })
  bio?: string;            // 선택
}
```

## 제공 스키마

### Auth

```typescript
import { LoginSchema, SignUpSchema } from '@cocrepo/schema';

// LoginSchema 필드: email, password
// SignUpSchema 필드: nickname, spaceId, email, name, phone, password
```

## 검증 메시지 커스터마이징

```typescript
import { VALIDATION_MESSAGES } from '@cocrepo/schema';

console.log(VALIDATION_MESSAGES.REQUIRED);        // '필수 입력 항목입니다.'
console.log(VALIDATION_MESSAGES.EMAIL_FORMAT);    // '유효한 이메일 주소를 입력해주세요.'
console.log(VALIDATION_MESSAGES.MIN_LENGTH(8));   // '최소 8자 이상 입력해주세요.'
```

## 아키텍처

```
@cocrepo/schema (이 패키지)
├── 순수 class-validator 기반
├── 브라우저/Node.js 호환
└── 프론트엔드/백엔드 공유

@cocrepo/decorator
├── @cocrepo/schema 확장
├── Swagger 데코레이터 추가
└── NestJS 전용

@cocrepo/dto
├── @cocrepo/schema 스키마 extend
├── Swagger 메타데이터
└── NestJS 전용
```

## 라이선스

ISC
