# @cocrepo/decorator

NestJS 애플리케이션을 위한 데코레이터 모음 패키지입니다.

## 설치

```bash
pnpm add @cocrepo/decorator
```

## 주요 기능

### 필드 데코레이터

DTO 및 엔티티 클래스에 사용하는 필드 정의 데코레이터입니다. Swagger 문서, 유효성 검증, 타입 변환을 통합 처리합니다.

#### 기본 타입 (Primitives)

```typescript
import { StringField, NumberField, BooleanField, DateField } from '@cocrepo/decorator';

class CreateUserDto {
  @StringField({ description: '사용자 이름', minLength: 2, maxLength: 50 })
  name: string;

  @NumberField({ description: '나이', min: 0, max: 150 })
  age: number;

  @BooleanField({ description: '활성 상태' })
  isActive: boolean;

  @DateField({ description: '생년월일' })
  birthDate: Date;
}
```

#### 특수 타입 (Specialized)

```typescript
import {
  EmailField,
  PasswordField,
  PhoneField,
  UUIDField,
  UrlField
} from '@cocrepo/decorator';

class SignUpDto {
  @EmailField({ description: '이메일 주소' })
  email: string;

  @PasswordField({ description: '비밀번호', minLength: 8 })
  password: string;

  @PhoneField({ description: '전화번호' })
  phone: string;

  @UUIDField({ description: '고유 식별자' })
  id: string;

  @UrlField({ description: '프로필 이미지 URL' })
  profileImage?: string;
}
```

#### 복합 타입 (Complex)

```typescript
import { EnumField, ClassField } from '@cocrepo/decorator';
import { CategoryTypes } from '@cocrepo/enums';

class CreateCategoryDto {
  @EnumField(() => CategoryTypes, { description: '카테고리 타입' })
  type: CategoryTypes;

  @ClassField(() => AddressDto, { description: '주소 정보' })
  address: AddressDto;
}
```

### 선택적 필드

모든 필드 데코레이터는 `Optional` 접두사 버전을 제공합니다:

```typescript
import { OptionalStringField, OptionalNumberField } from '@cocrepo/decorator';

class UpdateUserDto {
  @OptionalStringField({ description: '사용자 이름' })
  name?: string;

  @OptionalNumberField({ description: '나이' })
  age?: number;
}
```

---

### 인증/권한 데코레이터

#### Auth

컨트롤러 메서드에 인증 정보를 주입합니다:

```typescript
import { Auth } from '@cocrepo/decorator';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Auth() user: AuthUser) {
    return user;
  }
}
```

#### Roles

역할 기반 접근 제어를 설정합니다:

```typescript
import { Roles } from '@cocrepo/decorator';

@Controller('admin')
export class AdminController {
  @Roles('ADMIN', 'OWNER')
  @Get('dashboard')
  getDashboard() {
    // ADMIN 또는 OWNER 역할만 접근 가능
  }
}
```

#### RoleCategories / RoleGroups

역할 카테고리/그룹 기반 접근 제어:

```typescript
import { RoleCategories, RoleGroups } from '@cocrepo/decorator';

@RoleCategories('SYSTEM', 'TENANT')
@RoleGroups('ADMIN')
@Controller('settings')
export class SettingsController {
  // ...
}
```

#### Public / PublicRoute

공개 엔드포인트를 설정합니다:

```typescript
import { Public, PublicRoute } from '@cocrepo/decorator';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  login() {
    // 인증 없이 접근 가능
  }

  @PublicRoute()
  @Get('health')
  healthCheck() {
    // 인증 없이 접근 가능
  }
}
```

---

### API 문서 데코레이터

#### ApiResponseEntity

Swagger 응답 스키마를 정의합니다:

```typescript
import { ApiResponseEntity } from '@cocrepo/decorator';

@Controller('users')
export class UsersController {
  @ApiResponseEntity(UserDto)
  @Get(':id')
  getUser(@Param('id') id: string) {
    // ...
  }
}
```

---

### 유틸리티 데코레이터

#### UseDto / UseEntity

DTO 또는 엔티티 클래스를 메타데이터로 설정합니다:

```typescript
import { UseDto, UseEntity } from '@cocrepo/decorator';

@UseDto(UserDto)
@UseEntity(UserEntity)
export class User {
  // ...
}
```

---

## 파일 구조

```
src/
├── field/                    # 필드 데코레이터
│   ├── base/                # 기본 설정
│   │   ├── field-options.types.ts
│   │   └── optional-field.factory.ts
│   ├── primitives/          # 기본 타입
│   │   ├── string.field.ts
│   │   ├── number.field.ts
│   │   ├── boolean.field.ts
│   │   └── date.field.ts
│   ├── complex/             # 복합 타입
│   │   ├── class.field.ts
│   │   └── enum.field.ts
│   └── specialized/         # 특수 타입
│       ├── email.field.ts
│       ├── password.field.ts
│       ├── phone.field.ts
│       ├── url.field.ts
│       ├── uuid.field.ts
│       └── tmpkey.field.ts
├── auth.decorator.ts        # 인증 데코레이터
├── roles.decorator.ts       # 역할 데코레이터
├── role-categories.decorator.ts
├── role-groups.decorator.ts
├── public.decorator.ts      # 공개 라우트
├── public-route.decorator.ts
├── api-response-entity.decorator.ts
├── property.decorators.ts   # 속성 데코레이터
├── transform.decorators.ts  # 변환 데코레이터
├── validator.decorators.ts  # 유효성 검증
├── swagger.schema.ts        # Swagger 스키마
├── use-dto.decorator.ts
├── use-entity.decorator.ts
└── constants/
    └── validation-messages.ts  # 유효성 검증 메시지
```

## 의존성

- `@cocrepo/constants` - 상수 값
- `@cocrepo/toolkit` - 유틸리티 함수
- `@nestjs/common` (peer)
- `@nestjs/swagger` (peer)
- `class-validator` (peer)
- `class-transformer` (peer)
