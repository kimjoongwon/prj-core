---
name: "common-schema-builder"
description: "이 skill은 `common-schema-builder` 역할로 일할 때 사용합니다. Form이 사용할 공용 검증 schema를 만듭니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# common-schema-builder

## Form 작업에서 받은 입력·산출물

`fe-form-agent`가 schema 생성을 요청하면 아래 정보를 받습니다.

- Form 이름
- Prisma 모델 이름과 파일 경로
- 만들 schema 이름
- Form이 사용하는 필드
- 검증 규칙의 근거

필수 정보가 빠졌다면 추측해서 만들지 않고 누락된 내용을 보고합니다.

예시:

```markdown

- Form: UserForm
- Prisma 모델: User
- Prisma 파일: packages/be-prisma/schema/user.prisma
- 필요한 schema: UserSchema
- Form 필드: name, email, phone, password
```

## schema 만드는 순서

### 1. 기존 schema를 찾습니다

```bash
rg -n "class XXXXSchema\\b" packages/common-schema/src --glob '*.ts'
```

- 같은 schema가 있으면 새로 만들지 않고 필드와 검증 규칙을 확인합니다.
- 필요한 필드가 빠졌다면 기존 schema를 보완합니다.

### 2. 필드 소유권을 확인합니다

Prisma 파일의 `model XXXX { ... }`를 읽고 요청받은 필드가 그 모델의 직접 필드인지 확인합니다.

- 다른 모델의 필드는 넣지 않습니다.
- `id`, `seq`, 생성일, 수정일과 내부 조인 필드는 넣지 않습니다.
- 최종 Create/Update DTO의 다른 Form 필드를 섞지 않습니다.
- 최종 DTO는 여러 Form schema를 합쳐 사용할 수 있지만, 한 schema가 DTO 전체를 소유하지 않습니다.

### 3. 검증 규칙을 정합니다

먼저 같은 필드에 이미 사용 중인 공용 검증 규칙을 찾습니다. 규칙이 없다면 Prisma의 타입과 필수 여부, 필드 주석, 승인된 요구사항을 확인합니다.

길이 제한이나 형식처럼 Prisma만으로 알 수 없는 규칙은 임의로 만들지 않습니다. 근거가 없으면 필요한 규칙을 보고합니다.

| 값 | 데코레이터 |
|---|---|
| 일반 문자열 | `@String()` 또는 `@StringOptional()` |
| 이메일 | `@Email()` 또는 `@EmailOptional()` |
| 전화번호 | `@Phone()` 또는 `@PhoneOptional()` |
| 비밀번호 | `@Password()` |
| 숫자 | `@Number()` 또는 `@NumberOptional()` |
| Boolean | `@Boolean()` 또는 `@BooleanOptional()` |
| enum | `@Enum()` |
| 날짜 | `@Date()` |
| ULID | `@ULID()` 또는 `@ULIDOptional()` |

공용 데코레이터는 `packages/common-schema/src/decorators`에서 확인하고 재사용합니다. `class-validator` 데코레이터를 schema에서 직접 조합하지 않습니다.

### 4. schema와 export를 만듭니다

모델 schema는 모델 이름의 도메인 폴더에 둡니다.

```text
packages/common-schema/src/schemas/<domain>/<name>.schema.ts
```

예:

- `UserSchema` → `schemas/user/user.schema.ts`
- `UserClassificationSchema` → `schemas/user-classification/user-classification.schema.ts`

schema 파일과 같은 폴더의 `index.ts`, 상위 `schemas/index.ts`에서 공개 export 합니다.

```ts
import { Email, Password, Phone, String } from "../../decorators";

/** User 모델의 공용 입력 검증 규칙입니다. */
export class UserSchema {
  @String({ minLength: 2, maxLength: 50 })
  name: string;

  @Email()
  email: string;

  @Phone()
  phone: string;

  @Password()
  password: string;
}
```

## 역할 범위

`common-schema-builder`는 입력값 검증 규칙만 맡습니다. 아래 항목은 만들지 않습니다.

- Form 컴포넌트와 state
- API DTO와 API 호출
- Prisma 모델
- input 종류, label, options, 기본값
- 화면의 숨김, 읽기 전용, 비활성화 규칙

## 검증

- schema를 만들거나 고치면 단위 테스트도 함께 작성합니다.
- 올바른 값이 통과하는지 확인합니다.
- 잘못된 값이 각 필드에서 실패하는지 확인합니다.
- trim, 소문자 변환, 전화번호 정리 같은 변환 결과를 확인합니다.
- schema를 상속하는 기존 schema가 있다면 상속된 검증이 유지되는지 확인합니다.
- `@cocrepo/schema` 타입 검사, 빌드, 정적 검사를 실행합니다.

## 완료 보고

완료하면 schema를 기다리던 Form 작업으로 다시 입력·산출물 전달합니다.

```markdown

- 생성 또는 수정한 schema 경로
- 공개 import 이름
- schema 필드와 검증 규칙
```

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.

## Schema 단독 실행

- Prisma 모델, 승인된 Form 요구사항과 기존 schema convention을 프로젝트에서 찾아 schema 입력을 구성한다.
- 자신의 소유 범위에서 공용 validation schema와 관련 검증을 생성하고 완료한다.
- Form 구현을 실행하거나 특정 Form agent로 결과를 돌려보내지 않고 산출물 경로와 검증 근거만 보고한다.

