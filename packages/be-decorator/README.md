# @cocrepo/decorator

NestJS 애플리케이션을 위한 데코레이터 모음 패키지입니다.

## 설치

```bash
pnpm add @cocrepo/decorator
```

## 주요 기능

### 필드 데코레이터

DTO 및 엔티티 클래스에 사용하는 필드 정의 데코레이터입니다. Swagger 문서, 유효성 검증, 타입 변환을 통합 처리합니다.

#### Schema 상속 Entity의 메타데이터

공통 값 검증의 원천은 `@cocrepo/schema`입니다. 기존 `StringField` 등은 Schema의 순수 `StringValidation`과 백엔드 메타데이터를 조합하므로 API 전용 DTO 필드에서 계속 사용할 수 있습니다.

Schema에서 검증을 상속한 Entity 필드는 `StringFieldMetadata`, `StringFieldOptionalMetadata`처럼 기존 이름 뒤에 `Metadata`를 붙인 API를 사용합니다. 이 API는 Swagger와 class-transformer만 등록하고 `class-validator` 규칙을 추가하지 않습니다. Optional metadata도 Swagger의 `required: false`만 지정하며 상속한 검증을 선택 입력으로 바꾸지 않습니다.

```ts
class Role extends RoleSchema {
  @StringFieldMetadata({ description: "역할 식별자", maxLength: 50 })
  declare name: RoleSchema["name"];
}
```

지원 대상은 String, Number, Boolean, Date, Email, Phone, ULID, UUID, BigIntId, TmpKey, URL, Password, Enum입니다. `EnumFieldMetadata`와 `EnumFieldOptionalMetadata`는 기존과 같은 enum 콜백을 받습니다. `PasswordFieldMetadata`는 평문 입력 문서화용이며 저장된 해시에 적용하지 않습니다.

`ClassField`는 관계 객체의 중첩 검증·변환과 `CLASS_FIELD_OPTIONS_METADATA`를 유지합니다. JSON scalar 등 Schema에서 이미 검증하는 필드는 `ClassFieldMetadata`로 변환과 관계 옵션만 추가할 수 있습니다. `each`와 `isArray`, nullable, 설명, 지연 타입 콜백의 기존 의미는 유지됩니다.

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
import { InquiryCategory } from '@cocrepo/enum';

class CreateInquiryDto {
  @EnumField(() => InquiryCategory, { description: '문의 카테고리' })
  category: InquiryCategory;

  @ClassField(() => AddressDto, { description: '주소 정보' })
  address: AddressDto;
}
```

#### ClassField 관계 옵션 재사용

Entity에서 정의한 관계의 대상을 응답 DTO로 교체할 때는 `@cocrepo/decorator/field`가 공개하는 `CLASS_FIELD_OPTIONS_METADATA`와 `ClassFieldOptionsMetadata`를 사용합니다. 메타데이터는 클래스의 prototype과 필드 이름으로 조회하며 상위 클래스의 선언도 읽을 수 있습니다.

```typescript
import {
  CLASS_FIELD_OPTIONS_METADATA,
  ClassField,
  type ClassFieldOptionsMetadata,
} from '@cocrepo/decorator/field';

const relationMetadata = Reflect.getMetadata(
  CLASS_FIELD_OPTIONS_METADATA,
  User.prototype,
  'role',
) as ClassFieldOptionsMetadata;

ClassField(() => RoleDto, relationMetadata.fieldOptions)(UserDto.prototype, 'role');
```

- `fieldOptions`는 전달된 설명·상세 옵션을 보존하며, `required`·`nullable`·`each`·`isArray`·`swagger`의 기본값을 각각 `true`·`false`·`false`·`false`·`true`로 확정합니다.
- `each`는 중첩 검증과 배열 변환, `isArray`는 Swagger 배열 표시에 사용됩니다. 기존 동작에 맞춰 두 옵션은 독립적이며, 배열 관계는 필요한 두 옵션을 명시합니다.
- `apiPropertyOptions`는 기존 `ApiProperty` 호출에 전달한 옵션을 보존합니다. 생략된 옵션까지 그대로 유지해야 하는 helper는 이 객체의 `type`만 교체해 Swagger 정보를 구성합니다. `swagger: false`일 때는 `undefined`입니다.
- 메타데이터 저장·조회는 관계 타입 콜백을 실행하지 않습니다. `apiPropertyOptions.type`도 지연 함수입니다.
- 이 메타데이터는 `ClassField`가 소유한 옵션만 기록합니다. 별도로 붙인 검증·변환 데코레이터는 Nest Mapped Types의 메타데이터 복사로 보존해야 합니다. 반환 옵션은 공유되는 읽기 전용 계약이므로 수정하지 않습니다.

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

- `@cocrepo/constant` - 상수 값
- `@cocrepo/toolkit` - 유틸리티 함수
- `@nestjs/common` (peer)
- `@nestjs/swagger` (peer)
- `class-validator` (peer)
- `class-transformer` (peer)
