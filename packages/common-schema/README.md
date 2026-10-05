# @cocrepo/schema

프론트엔드와 백엔드가 함께 사용하는 타입과 값 검증을 소유하는 브라우저 호환 패키지입니다. 검증은 `class-validator`만 사용하며 입력값을 변환하지 않습니다.

## 원천과 소비 경계

- 모델별 `RoleSchema`, `UserSchema` 등이 필드 타입과 공통 검증을 함께 소유합니다. 소비자는 Schema 클래스 또는 `InferSchema<typeof UserSchema>`로 입력 타입을 추론하며 Prisma Client나 생성 타입을 필요로 하지 않습니다.
- `AbstractSchema`는 공통 `id`, `createdAt`, `updatedAt`, `removedAt` 필드를 소유합니다. 조회 옵션에 따라 포함되는 관계 객체는 Schema에 넣지 않습니다.
- 공통 검증의 원천은 모델 Schema입니다. Entity는 해당 Schema를 상속해 Swagger·Transform·관계·도메인 동작만 추가합니다. DTO는 Entity에서 필요한 필드를 선택합니다.
- 기존 Entity에 검증이 없던 필드는 Schema에 타입만 선언합니다. persistence adapter는 Prisma 값을 Schema/Entity 계약에 맞춰 전달하며, DB 변경 때문에 기존 API에 새로운 필수값·형식 규칙을 추가하지 않습니다.
- `StringValidation`, `NumberValidation` 등은 기존 백엔드 Field의 값 검증 계약입니다. `String`, `Phone`, `Password` 등은 기존 입력 전용 메시지와 제약을 제공합니다. 둘 다 변환·Swagger 메타데이터를 등록하지 않습니다.
- DB enum 타입과 런타임 값은 브라우저 안전한 `@cocrepo/enum`, JSON 값 타입은 `@cocrepo/type`에서 가져옵니다.
- `class-transformer`, `reflect-metadata`, Nest 및 Prisma Client 런타임·타입은 사용하지 않습니다. Schema 소비에 `emitDecoratorMetadata`가 필요하지 않습니다.

## 입력 Schema 파생

```ts
import { RoleSchema, PickSchemaType, PartialSchemaType } from "@cocrepo/schema";

class CreateRoleSchema extends PickSchemaType(RoleSchema, [
  "name", "displayName", "description",
] as const) {}

class UpdateRoleSchema extends PartialSchemaType(
  PickSchemaType(RoleSchema, ["displayName", "description"] as const),
) {}
```

```ts
import { type InferSchema, UserSchema } from "@cocrepo/schema";

type UserInput = InferSchema<typeof UserSchema>;
```

`PickSchemaType`은 선택한 필드의 class-validator 메타데이터만 복사합니다. 원본 생성자, 기본값, 도메인 메서드를 실행하거나 상속하지 않습니다. 검증 데코레이터가 없는 필드는 타입으로만 선택됩니다. 이 helper는 일반 객체 변환 또는 응답 직렬화 도구가 아닙니다.

`PartialSchemaType`은 Nest `PartialType`의 기본 동작처럼 `undefined`와 `null`을 선택 입력으로 처리합니다. 개별 모델의 `*ValidationOptional`은 `undefined`만 허용하며, `null`은 `nullable: true`가 있을 때만 허용합니다. 단순히 `{required: false}`라는 옵션을 넣는 것만으로 모든 scalar 검증을 선택 입력으로 바꾸지는 않습니다. 기존 백엔드 계약과 동일하게 Optional 데코레이터를 사용합니다.

## Form 계약

- `LoginSchema`: `UserSchema`의 `email/password` 검증에서 파생하고 로그인 평문 비밀번호 제약을 추가합니다.
- `UserFormSchema`: `UserSchema`의 `name/email/phone/password`에서 파생하고 기존 Form의 이름 길이·전화번호·평문 비밀번호 제약을 추가합니다.
- `CategoryFormSchema`: 모델의 `name`을 재사용하고 wire 형식인 문자열 `parentId`를 별도로 선언합니다. DB `bigint`와 문자열 입력을 같은 상속 필드로 덮어쓰지 않습니다.
- `SignUpSchema`, `CommunityPostSchema`: 모델과 의미가 다른 입력 필드는 해당 입력 계약에 유지합니다.
- 전체 DB 필드를 가진 모델 Schema를 생성 Form 전체 검증에 그대로 전달하지 않습니다. 필요한 입력 필드를 선택한 Schema를 전달합니다.

```ts
import { LoginSchema, validateSchemaSync } from "@cocrepo/schema";

const validation = validateSchemaSync(LoginSchema, {
  email: "user@example.com",
  password: "password123",
});
```

검증 helper는 `Object.assign(new Schema(), input)`으로 인스턴스를 만든 후 검증합니다. 숫자·날짜 변환, trim, 이메일 소문자 변환, 전화번호 정규화를 수행하지 않습니다. 백엔드 API 입력 정규화는 Entity 또는 DTO Transform이 소유합니다. 단일 필드 오류는 `validateField`/`validateFieldSync`, Form 오류 맵은 `validateSchemaToFieldErrorsSync`로 얻습니다.

## 검증

`pnpm --filter @cocrepo/schema type-check`, `build`, `lint`, `test`로 Schema 추론 타입과 파생 검증, 선택·null 계약, 초기값 비유입, 평문/저장 비밀번호 분리, 변환 없는 입력 검증 및 private Prisma package 비참조 경계를 확인합니다.
