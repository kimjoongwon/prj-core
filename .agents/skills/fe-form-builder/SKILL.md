---
name: "fe-form-builder"
description: "이 skill은 `fe-form-agent` 역할로 일할 때 사용합니다. Prisma 모델을 기준으로 Form을 만드는 방법을 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# fe-form-builder

## XXXXForm 만드는 순서

### 1. Prisma 모델을 찾습니다

`XXXXForm`에서 `Form`을 뺀 `XXXX`가 모델 이름입니다.

- `UserForm` → `User`
- `UserClassificationForm` → `UserClassification`

Prisma 모델은 `packages/be-prisma/schema`에 있습니다. 파일 이름은 모델 이름을 kebab-case로 바꾼 형태입니다.

- `User` → `packages/be-prisma/schema/user.prisma`
- `UserClassification` → `packages/be-prisma/schema/user-classification.prisma`

파일을 바로 찾지 못하면 아래 명령으로 모델 위치를 찾습니다.

```bash
rg -n "^model XXXX\\b" packages/be-prisma/schema --glob '*.prisma'
```

찾은 파일에서 `model XXXX { ... }` 안의 필드만 확인합니다. 다른 모델의 필드를 가져오지 않습니다.

### 2. 이번 Form에 넣을 필드를 고릅니다

Prisma 모델의 모든 필드를 입력칸으로 만들지는 않습니다. 아래 순서로 고릅니다.

1. 모델이 직접 가진 필드를 모읍니다.
2. 시스템이 관리하는 필드와 관계 필드를 뺍니다.
3. 이번 Form에서 사용자가 직접 입력할 필드만 남깁니다.

필드는 다음 기준으로 나눕니다.

| Prisma 필드 | Form 처리 |
|---|---|
| 모델이 직접 가진 문자열, 숫자, Boolean, enum | 입력 후보 |
| `id`, `seq`, 생성일, 수정일, 삭제일 | 제외 |
| `@relation`에 사용되는 `userSeq`, `roleSeq` 같은 내부 조인 값 | 제외 |
| 다른 모델 타입이거나 다른 모델 타입의 배열인 필드 | 해당 모델의 Form에서 처리 |
| 서버가 자동으로 계산하거나 기록하는 필드 | 제외 |
| 이번 Form에서 사용자가 입력하지 않는 필드 | 제외 |

Prisma의 `?`는 데이터베이스에서 값이 없을 수 있다는 뜻입니다. 화면에서 필수인지 선택인지는 Form 요구사항과 검증 schema를 보고 정합니다.

예를 들어 `UserForm`을 만들면 `packages/be-prisma/schema/user.prisma`의 `model User`를 봅니다. 요청에 `name`, `password` 입력이 필요하다면 두 필드만 `UserForm`에 둡니다. `profiles: Profile[]`는 관계 필드이므로 `ProfileForm`이 맡습니다.

### 3. XXXXSchema를 확인합니다

새로 만들거나 구조를 정리하는 `XXXXForm`은 같은 필드를 검증하는 `XXXXSchema`를 사용합니다.

- `UserForm` → `UserSchema`
- `UserClassificationForm` → `UserClassificationSchema`

먼저 공용 schema가 있는지 찾습니다.

```bash
rg -n "class XXXXSchema\\b" packages/common-schema/src --glob '*.ts'
```

schema가 있으면 Form 필드와 schema 필드가 같은지 확인합니다. schema가 없거나 필드가 다르면 Form을 먼저 만들지 않고 `common-schema-builder` 작업으로 넘깁니다.

보고할 때는 아래 내용을 그대로 보고합니다.

```markdown

- Form: XXXXForm
- Prisma 모델: XXXX
- Prisma 파일: packages/be-prisma/schema/xxxx.prisma
- 필요한 schema: XXXXSchema
- Form 필드: fieldA, fieldB
- 검증 근거: Prisma 필드 주석과 기존 공용 검증 규칙
- 완료 조건: schema 생성, 공개 export, schema 검증 완료
- 완료 후 재개: fe-form-agent
```

`fe-form-agent`는 다른 subagent를 직접 실행하지 않습니다. 이 보고를 받은 상위 실행자가 `common-schema-builder`를 실행하고, 완료 결과를 받은 뒤 `fe-form-agent` 작업을 다시 이어갑니다.

schema 입력·산출물 전달만 보고하고 Form 생성 요청을 완료 처리하지 않습니다. 상위 실행자는 사용자의 추가 요청을 기다리지 않고 schema 생성과 Form 연결까지 이어서 실행합니다.

### 4. state를 선언합니다

Form은 입력값을 직접 만들지 않고 `state`로 받습니다. `state`에는 화면에 표시할 필드를 하나씩 적습니다.

```tsx
interface UserFormState extends FormSchemaStateContract<UserSchema> {
  name: string;
  password: string;
}

interface UserFormProps {
  state: UserFormState;
}
```

조회 결과 전체를 `state`로 사용하지 않습니다. Form이 맡은 필드만 선언합니다.

### 5. 최종 API DTO와 분리합니다

최종 Create/Update DTO는 여러 Form의 값을 합친 결과입니다. 하나의 Form이 최종 DTO 전체를 소유하지 않습니다.

예를 들어 회원 생성 DTO는 `UserForm`, `UserClassificationForm` 등 여러 Form의 값을 함께 받을 수 있습니다. 각 Form은 자기 Prisma 모델의 필드만 맡고, 최종 DTO 조합은 Form 밖에서 처리합니다.

따라서 최종 Create/Update DTO를 보고 `XXXXForm`의 필드를 정하거나, DTO 전체를 `XXXXFormState`로 사용하지 않습니다.

### 6. 필드에 맞는 input을 고릅니다

기존 input은 `packages/fe-ui/src/input`에서 찾습니다.

| 값의 형태 | 기본 input |
|---|---|
| 짧은 문자열, 이메일, 전화번호, 비밀번호 | `TextField` |
| 긴 문자열 | `TextArea` |
| Boolean | `Checkbox` 또는 `Switch` |
| enum 또는 선택 목록 | `Select` 또는 `RadioGroup` |
| 문자열 목록 | `StringListInput` |
| HTML 내용 | `HtmlEditor` |

필드의 `/// @displayName`이 있으면 input의 기본 label로 사용합니다. 필요한 input이 없으면 Form 안에서 새로 만들지 않고 `fe-input-agent` 작업으로 넘깁니다.

### 7. schema를 연결합니다

- `state`는 사용자가 현재 입력한 값입니다.
- `schema`는 입력값 검사 규칙입니다.
- input의 `path`는 검사할 필드 이름입니다.

세 곳의 필드 이름은 같아야 합니다. `path="email"`이면 state와 schema에도 `email`이 있어야 합니다.

`common-schema-builder`가 만든 schema를 state 타입과 `Form`에 연결합니다. 기존 구현은 `LoginForm`을 참고할 수 있지만 필드는 복사하지 않습니다.

```tsx
interface UserFormState extends FormSchemaStateContract<UserSchema> {
  name: string;
  password: string;
}

interface UserFormProps {
  state: UserFormState;
}

<Form state={state} schema={UserSchema}>
  <TextField path="name" state={state} />
  <TextField path="password" state={state} />
</Form>
```

이 예시에서는 state, schema, path의 연결 방법만 참고합니다. 각 Form의 필드는 해당 Prisma 모델과 Form 요구사항에서 확인합니다.

## 구현 규칙

- Form은 `packages/fe-ui/src/form/<Name>/<Name>.tsx`에 둡니다.
- Form 안에서 `useState`, `useReducer`, `useLocalObservable`로 입력값을 만들지 않습니다.
- Form은 API 호출, route 이동, 저장, 취소를 처리하지 않습니다.
- 저장 버튼은 `type="submit"`처럼 바깥에서 알아볼 수 있는 표준 속성을 사용합니다.
- 공개 Form은 `packages/fe-ui/src/form/index.ts`에서 내보냅니다.

## 검증

Form을 만들어 달라는 요청이면 Form과 단위 테스트를 함께 작성합니다. Form을 검증해 달라는 요청이면 아래 항목을 확인해 알려줍니다.

- Form 이름과 Prisma 모델 이름이 맞는가
- state 필드가 해당 Prisma 모델에 실제로 있는가
- 다른 모델의 필드가 섞이지 않았는가
- `XXXXSchema`가 존재하고 공개 export 되었는가
- state, schema, input의 `path` 이름이 같은가
- 기존 input을 사용했는가
- 필드 표시, state 값, 검증 메시지, `readOnly` 동작을 테스트했는가

Storybook 스토리가 필요하면 `fe-storybook-agent` 작업으로 넘깁니다.

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.

## Form 선행조건

- Form이 공용 validation schema를 요구하면 구현 전에 해당 schema를 프로젝트에서 찾는다.
- 필수 공용 schema가 없으면 이를 대신 만들거나 다른 agent를 실행하지 않고 변경 없이 `입력 필요`로 보고한다.
- schema가 존재하면 Form 필드, validation 연결, submit payload와 오류 표시를 구현하고 Form 범위 검증을 끝낸다.

