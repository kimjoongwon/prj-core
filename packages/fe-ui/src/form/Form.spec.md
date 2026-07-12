# Form validation 통합 계획

> 생성일: 2026-07-04
> 타입: component spec
> 위치: `packages/fe-ui/src/form/Form/Form.tsx`

## 역할

`Form`은 `packages/fe-ui/src/form/**` 하위 도메인 Form들이 공통으로 사용하는 웹 폼 컨테이너입니다.
도메인 Form은 입력 필드 조합만 소유하고, 검증 실행과 검증 메시지 전달은 공통 `Form`과 `packages/fe-ui/src/input/**/index.tsx` wrapper가 나누어 맡습니다.

`Form`은 `common-schema`의 class-validator 기반 schema를 받고, schema와 field state를 `FormValidationContext`로 하위 input wrapper에 제공합니다.
input wrapper는 이미 가지고 있는 `state`와 `path`를 기준으로 해당 field를 검증하고 pure input 컴포넌트에 `isInvalid`, `errorMessage`, `isReadOnly`, `isDisabled`를 전달합니다.

명명은 `scheme`이 아니라 `schema`로 통일합니다.

## 목표

| 목표 | 설명 |
| --- | --- |
| common-schema 단일화 | FE Form 검증과 BE DTO 검증이 `packages/common-schema`의 같은 schema contract를 사용합니다. |
| Form 공통 컨테이너 | 도메인 Form은 root에서 공통 `Form`을 감싸고 schema/readOnly/state를 주입합니다. |
| input wrapper 검증 | `Name/index.tsx`에서 MobX binding과 validation binding을 수행하고 `Name/Name.tsx`는 pure 컴포넌트로 유지합니다. |
| submit 전 전체 검증 | submit capture 단계에서 schema 전체 검증을 실행하고 실패 시 native submit 전파를 막습니다. |
| timing별 field 검증 | onChange, onBlur, onFocus 단계에서 path 단위 검증을 실행할 수 있습니다. |
| readOnly 일괄 잠금 | detail mode는 route가 `readOnly`로 결정하고, Form은 하위 field를 일괄 잠급니다. |

## FE/BE 공통 Schema 계약

`packages/common-schema`는 프론트엔드와 백엔드가 함께 사용하는 검증 규칙의 단일 원천입니다.
같은 aggregate 또는 API 입력 모델은 FE와 BE에서 별도 수동 검증 규칙을 만들지 않고, 같은 schema class를 기준으로 검증합니다.

| 사용처 | 사용 방식 |
| --- | --- |
| FE Form | `Form`이 `schema` prop으로 `@cocrepo/schema`의 schema class를 받고, input wrapper가 field path 기준으로 검증 메시지를 표시합니다. |
| BE DTO | `packages/be-dto`의 request DTO가 `@cocrepo/schema`의 schema class를 `extends`해서 백엔드 검증 규칙의 기본값으로 사용합니다. |
| BE validation pipe | DTO에 상속된 class-validator decorator를 기준으로 request payload를 검증합니다. |
| 검증 메시지 | `common-schema` decorator와 validation message constant가 FE/BE 검증 메시지의 원천입니다. |

예시:

```ts
// FE
<Form state={state} schema={LoginSchema}>
	<TextField state={state} path="email" />
</Form>

// BE
export class LoginPayloadDto extends LoginSchema {
	// backend-only field 또는 Swagger metadata만 추가합니다.
}
```

`common-schema`는 검증 규칙만 소유합니다.
`defaultObject`, `options`, `fieldMeta`, `hiddenPaths`, `readOnlyPaths`, `disabledPaths`, `aiSchemas` 같은 런타임 폼 메타는 schema에 넣지 않습니다.

## 만들지 않을 것

| 대상 | 이유 |
| --- | --- |
| Form 내부 입력 state | 입력값은 route/page가 만든 MobX form state class가 소유합니다. |
| Form의 API 호출/라우터 이동 | submit 이후 mutation, navigation은 route/page 또는 feature가 소유합니다. |
| input pure 컴포넌트의 schema import | pure input은 표시 책임만 가지며 validation context를 알지 않습니다. |
| cloneElement 기반 ValidationBuilder 부활 | 과거 방식은 되살리지 않고 context + input wrapper 방식으로 현대화합니다. |
| field별 editable 판별 | detail/create/edit 판단은 route가 하고 Form은 `readOnly`만 기준으로 일괄 잠급니다. |

## 소유 범위

| 영역 | 담당 owner | 변경 대상 |
| --- | --- | --- |
| schema 검증 유틸 | `common-schema-builder` | `packages/common-schema/src/utils/validate.ts` |
| Form state 타입 계약 | `common-type-builder` | `packages/common-type/src/form-state.ts` |
| BE DTO schema 상속 | `be-dto-builder` | `packages/be-dto/**` |
| Form 컨테이너/컨텍스트 | `fe-form-agent` | `packages/fe-ui/src/form/Form/**`, `packages/fe-ui/src/form/index.ts` |
| 도메인 Form 마이그레이션 | `fe-form-agent` | `packages/fe-ui/src/form/*Form/*.tsx` |
| input wrapper 검증 연결 | `fe-input-agent` | `packages/fe-ui/src/input/**/index.tsx` |
| route state class 주입 | `fe-route-agent` | `apps/*/web/src/app/**/page.tsx` |
| Screen 정리 | `fe-screen-agent` | `packages/fe-ui/src/screen/**` |
| Storybook | `fe-storybook-agent` | `*.stories.tsx` |

## 공개 API

### FormProps

```ts
import type { ComponentProps, ReactNode } from "react";
import type { Form as HeroForm } from "@heroui/react";
import type { SchemaClass } from "@cocrepo/schema";
import type { FormSchemaStateContract } from "@cocrepo/type";

export type FormValidationTiming = "onChange" | "onBlur" | "onFocus";

export interface FormProps<
	TState extends object,
	TSchema extends object,
>
	extends Omit<ComponentProps<typeof HeroForm>, "children" | "validationErrors"> {
	children: ReactNode;
	state: TState & FormSchemaStateContract<TSchema>;
	schema?: SchemaClass<TSchema>;
	readOnly?: boolean;
	validationTimings?: FormValidationTiming[];
}
```

기본 `validationTimings`는 `["onBlur"]`입니다.
submit capture 검증은 timing 설정과 별개로 항상 실행합니다.

`Form`은 submit/cancel/click handler props를 새로 정의하지 않습니다.
필요한 경우 상위 screen/feature/page가 native `onSubmitCapture`, `onClickCapture` 같은 React event를 기존 HeroUI Form props로 전달합니다.

### 사용 예시

```tsx
import { LoginSchema } from "@cocrepo/schema";
import { Form } from "../Form";
import { TextField } from "../../input/TextField";

export const LoginForm = observer(({ state, readOnly = false }: LoginFormProps) => {
	return (
		<Form state={state} schema={LoginSchema} readOnly={readOnly}>
			<TextField state={state} path="email" label="이메일" />
			<TextField state={state} path="password" label="비밀번호" type="password" />
		</Form>
	);
});
```

## FormValidationContext

`Form`은 하위 input wrapper가 사용할 context를 제공합니다.

```ts
export interface FormValidationContextValue {
	state: object;
	schema?: SchemaClass<object>;
	readOnly: boolean;
	validationTimings: FormValidationTiming[];
	getFieldError: (path: string) => string | undefined;
	setFieldError: (path: string, message?: string) => void;
	validateField: (path: string, value: unknown, timing: FormValidationTiming) => boolean;
	validateAll: () => boolean;
}
```

`getFieldError`와 `setFieldError`는 기본적으로 `state.fieldErrors[path]`를 사용합니다.
`state.fieldErrors`는 route/page가 생성한 form state class에 반드시 있어야 합니다.
`Form`은 누락된 `fieldErrors`를 런타임에 새로 만들지 않습니다.
기존 `state.errors`는 새 계약에서 사용하지 않습니다.

## 공통 state class 계약

route/page는 form state class를 만들고 도메인 Form에 주입합니다.
모든 Form state class는 `@cocrepo/type`의 `FormStateContract`를 기준으로 feedback 상태 이름을 통일합니다.

```ts
import type { LoginSchema } from "@cocrepo/schema";
import type { FormSchemaStateContract } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";

export class LoginFormState implements FormSchemaStateContract<LoginSchema> {
	email = "";
	password = "";
	fieldErrors: FormSchemaStateContract<LoginSchema>["fieldErrors"] = {};
	errorMessage: string | null = null;
	isSubmitting = false;

	constructor(response?: LoginResponseDto) {
		makeAutoObservable(this);
		if (response) {
			this.email = response.email ?? "";
		}
	}

	clearFieldError(path: keyof LoginSchema & string): void {
		delete this.fieldErrors[path];
	}

	setFieldError(path: keyof LoginSchema & string, message?: string | null): void {
		if (message) {
			this.fieldErrors[path] = message;
			return;
		}
		delete this.fieldErrors[path];
	}
}
```

공통 타입 원본은 `packages/common-type/src/form-state.ts`입니다.

| 타입 | 역할 |
| --- | --- |
| `FormFieldErrors<TField>` | field path별 validation message map입니다. |
| `FormSchemaField<TSchema>` | schema instance type에서 field key union을 추출합니다. |
| `FormFeedbackState<TField>` | `fieldErrors`와 `errorMessage`를 묶는 최소 feedback state입니다. |
| `FormFeedbackActions<TField>` | `setFieldError`, `clearFieldError`, `clearFieldErrors`, `setErrorMessage`, `clearErrorMessage` mutator 계약입니다. |
| `FormStateContract<TField>` | 도메인 form state class가 구현하는 공통 계약입니다. |
| `FormSchemaStateContract<TSchema>` | field union을 수동 선언하지 않고 schema instance type을 원천으로 삼는 form state 계약입니다. |

`errorMessage`는 field validation이 아니라 submit/API 실패처럼 form 전체에 표시하는 message입니다.
field validation message는 항상 `fieldErrors[path]`에 저장합니다.
응답 DTO 모델을 쓰는 edit form state는 constructor 또는 `restore(dto)`에서 응답 값을 form field로 변환합니다.
Form 컴포넌트는 DTO 변환을 알지 않습니다.

## common-schema 보강

기존 `validateSchemaSync`와 `validateField`는 유지하되, UI Form에서 쓰기 좋은 동기 API를 추가합니다.

```ts
export interface FieldErrorMap {
	[path: string]: string | undefined;
}

export function validateFieldSync<T extends object>(
	schema: SchemaClass<T>,
	state: unknown,
	path: string,
): FieldError | null;

export function validateSchemaToFieldErrorsSync<T extends object>(
	schema: SchemaClass<T>,
	state: unknown,
): FieldErrorMap;
```

`validateFieldSync`는 단일 field만 검증하되, class-validator가 다른 required field를 같이 실패시키지 않도록 `skipMissingProperties: true`를 사용합니다.
중첩 path가 필요한 경우 `tools.get(state, path)`로 값을 꺼내고 schema instance에는 path 구조를 복원해서 넣습니다.

전체 submit 검증은 `validateSchemaSync(schema, state)`를 기준으로 field error map을 생성합니다.
메시지는 `common-schema` decorator가 반환한 translation key 또는 문구를 그대로 사용하고, input pure 컴포넌트의 `translateNode`가 화면 번역을 담당합니다.

## Form 구현 흐름

1. `"use client"`를 선언합니다.
2. `@heroui/react`의 `Form`을 감싼 pure wrapper가 아니라 validation context provider를 포함한 공통 컨테이너를 만듭니다.
3. `state.fieldErrors`가 없으면 개발 계약 위반으로 보고 검증을 수행하지 않습니다.
4. `validateField(path, value, timing)`은 timing이 `validationTimings`에 포함된 경우에만 실행합니다.
5. field 검증 성공 시 `fieldErrors[path]`를 제거합니다.
6. field 검증 실패 시 첫 번째 메시지를 `fieldErrors[path]`에 저장합니다.
7. `validateAll()`은 schema 전체 검증을 실행하고 모든 field error를 갱신합니다.
8. `onSubmitCapture`에서 `validateAll()`이 실패하면 `event.preventDefault()`와 `event.stopPropagation()`을 호출합니다.
9. `readOnly=true`이면 validation은 표시만 유지하고 field event validation은 실행하지 않습니다.

상위에서 넘긴 `onSubmitCapture`가 있으면 Form 내부 검증 성공 후 호출합니다.
검증 실패 시 상위 submit handler는 호출하지 않습니다.

## input wrapper 구현 계약

input wrapper는 `useFormField`로 값을 동기화한 뒤 `useFormValidationField(path)`를 호출합니다.
pure input으로 내려가는 `isInvalid`와 `errorMessage`는 명시 prop이 있으면 명시 prop을 우선합니다.

```ts
const validation = useFormValidationField(path);

const handleChange = (nextValue: string | number) => {
	formField.setValue(nextValue);
	validation.validate("onChange", nextValue);
	onChange?.(nextValue);
};

const handleBlur = (nextValue: string | number) => {
	validation.validate("onBlur", nextValue);
	onBlur?.(nextValue);
};

return (
	<PureTextField
		{...rest}
		value={formField.state.value}
		isReadOnly={rest.isReadOnly ?? validation.readOnly}
		isDisabled={rest.isDisabled ?? validation.readOnly}
		isInvalid={rest.isInvalid ?? validation.isInvalid}
		errorMessage={rest.errorMessage ?? validation.errorMessage}
		onChange={handleChange}
		onBlur={handleBlur}
	/>
);
```

적용 대상은 다음 순서로 진행합니다.

| 순서 | input | 이유 |
| --- | --- | --- |
| 1 | `TextField/index.tsx` | 대부분의 Form이 사용하는 기본 text/number/password/email field입니다. |
| 2 | `TextArea/index.tsx` | 긴 text field validation이 필요합니다. |
| 3 | `Select/index.tsx` | required/select validation이 많습니다. |
| 4 | `RadioGroup/index.tsx` | enum 선택 validation에 사용합니다. |
| 5 | `Checkbox/index.tsx` | boolean agreement/flag validation에 사용합니다. |
| 6 | `Switch/index.tsx` | boolean field validation에 사용합니다. |
| 7 | `StringListInput/index.tsx` | string array field validation에 사용합니다. |

## 도메인 Form 마이그레이션 규칙

도메인 Form은 다음 형태로 정리합니다.

1. root를 `<Form state={state} schema={SomeSchema} readOnly={readOnly}>`로 감쌉니다.
2. `state.errors.xxx`, `state.fieldErrors.xxx`를 input에 직접 전달하지 않습니다.
3. field error clear helper를 Form에서 제거합니다.
4. `onChangeEmail`, `onChangeName` 같은 field별 handler props를 제거하고 `state/path` binding으로 통일합니다.
5. submit/cancel handler props는 form 계층에서 제거하고 semantic signal만 남깁니다.
6. `readOnly`는 Form에만 전달하고, 필드별 예외 잠금이 필요할 때만 input prop으로 override합니다.

예외:

- 검색어 입력처럼 입력값 변경이 API 검색을 트리거하는 field는 `onValueChange` 같은 leaf event를 유지할 수 있습니다.
- field가 실제 저장 path와 다른 UI-only path를 쓰는 경우에는 schema path가 있는 hidden field 또는 route state method에서 값을 동기화합니다.
- confirm password처럼 schema에 없는 cross-field 검증은 schema에 추가하거나 `Form`의 `extraValidators` 확장을 별도 spec으로 승인한 뒤 진행합니다.

## Schema / Payload 설계 원칙

Form migration은 화면 컴포넌트 단위가 아니라 aggregate root와 API payload 계약 단위로 진행합니다.
같은 aggregate의 create, edit, detail 화면은 하나의 `XXXXEditScreen`과 하나의 도메인 Form을 공유하고, route가 create/edit/detail 모드를 결정합니다.

| 계약 | 소유 | 역할 |
| --- | --- | --- |
| `PayloadSchema` | `packages/common-schema` | API body 검증의 원천입니다. FE submit 전 검증과 BE request DTO 상속에 함께 사용합니다. |
| `FormSchema` | `packages/common-schema` | 화면 state가 payload와 다를 때만 둡니다. UI-only field나 cross-field 검증을 포함할 수 있습니다. |
| request DTO | `packages/be-dto` | Swagger metadata와 backend-only field만 추가합니다. 검증 규칙은 가능한 한 `PayloadSchema`를 상속합니다. |
| response DTO model | `packages/be-dto` / generated API type | edit/detail route가 받은 응답을 form state class의 `restore(dto)`에 주입합니다. |
| form state class | route/page 또는 form state 파일 | observable field, `fieldErrors`, `errorMessage`, 응답 hydrate를 소유합니다. |
| payload mapper | route 또는 route-owned mapper | create/update payload 조립을 소유합니다. Form 컴포넌트는 mapper를 호출하지 않습니다. |
| runtime form meta | backend bootstrap DTO | `defaultObject`, `options`, `fieldMeta`, `hiddenPaths`, `readOnlyPaths`, `disabledPaths`, `aiSchemas`를 소유합니다. schema에 넣지 않습니다. |

`PayloadSchema`는 실제 API body만 표현합니다.
예를 들어 `SignUpPayloadSchema`에는 `confirmPassword`를 넣지 않고, `SignUpFormSchema`에서만 `confirmPassword`와 password match 검증을 다룹니다.

`FormSchema`는 payload와 화면 state가 다를 때만 생성합니다.
다음 field는 payload schema에 넣지 않습니다.

| field 유형 | 예시 | 처리 |
| --- | --- | --- |
| 확인용 field | `confirmPassword` | `FormSchema` 또는 승인된 cross-field validator에서 검증합니다. |
| 검색어 field | `exerciseQuery`, `customerKeyword` | UI state로만 유지하고 payload mapper에서 제외합니다. Modal content 검색어는 해당 domain state가 소유합니다. |
| 표시명 snapshot | `routineName`, `instructorName` | 응답 hydrate와 화면 표시용으로만 둡니다. |
| picker open state | `app.modal.current` | form state에 복제하지 않고 전역 `ModalStore`가 소유합니다. |
| payload 파생 field | `durationMin`, `durationSec` | `FormSchema`에서 검증 후 mapper가 `duration`으로 변환합니다. |
| indexed child error | `redirectUriErrors`, `variableErrors` | 배열 path error로 통합하거나 별도 child schema migration slice에서 처리합니다. |

## Form 대상 인벤토리

현재 `packages/fe-ui/src/form` 기준 migration 대상은 다음과 같습니다.
`LoginForm`만 schema-derived state 계약을 일부 적용했고, 나머지는 `errors`, `fieldErrors`, `submitError`, `error`가 혼재되어 있습니다.

| 우선순위 | Form | 현재 error shape | 필요한 schema / payload 계약 | 비고 |
| --- | --- | --- | --- | --- |
| 1 | `LoginForm` | `fieldErrors`, `errorMessage` | `LoginSchema`, `LoginPayloadDto extends LoginSchema` | 첫 slice입니다. |
| 1 | `ForgotPasswordForm` | `errorMessage` | `ForgotPasswordPayloadSchema` | email 단일 payload입니다. |
| 1 | `ResetPasswordForm` | `submitError` | `ResetPasswordPayloadSchema`, `ResetPasswordFormSchema` | token은 route param이고, password policy는 runtime 정책입니다. |
| 1 | `OidcLoginForm` | `error` | `OidcLoginPayloadSchema` 또는 `LoginSchema + remember` | `remember`만 추가됩니다. |
| 1 | `SignUpForm` | `fieldErrors`, `errorMessage` | `SignUpPayloadSchema`, `SignUpFormSchema` | `confirmPassword`와 `nickname = name` mapping을 명시합니다. |
| 2 | `ActionForm` | `errors` | `ActionPayloadSchema` | name pattern 검증을 schema로 이동합니다. |
| 2 | `RoleForm` | `errors` | `RolePayloadSchema` | create는 `name` 필수, update는 `name` 제외입니다. |
| 2 | `PolicyForm` | 없음 | `PolicyPayloadSchema`, `SyncPolicyAbilitiesSchema` | policy 기본정보와 ability sync payload를 분리합니다. |
| 2 | `TimelineForm` | `errors` | `TimelinePayloadSchema` | name/description 기본 검증입니다. |
| 3 | `GroundForm` | `errors` | `GroundPayloadSchema` | 이미 state class가 있으므로 `errors -> fieldErrors`와 schema 상속을 우선 적용합니다. |
| 3 | `TaskExerciseForm` | `errors` | `TaskExercisePayloadSchema`, `TaskExerciseFormSchema` | `durationMin/durationSec -> duration` mapper가 필요합니다. |
| 3 | `AbilityForm` | 없음 | `AbilityPayloadSchema`, `AbilityFormSchema` | `fields` string과 `conditions` JSON 입력을 payload로 변환합니다. |
| 3 | `TimelineSessionForm` | `errors` | `TimelineSessionPayloadSchema`, `TimelineSessionFormSchema` | `type`별 required 조건과 date order 검증이 필요합니다. |
| 3 | `TimelineSessionProgramForm` | `errors` | `ProgramPayloadSchema`, `ProgramFormSchema` | picker query/name field는 UI-only입니다. |
| 4 | `RoutineForm` | `errors` | `RoutinePayloadSchema`, `RoutineFormSchema`, `RoutineActivityItemSchema` | activities 배열과 empty warning flow를 분리합니다. |
| 4 | `TemplateForm` | `errors`, `variableErrors` | `TemplatePayloadSchema`, `TemplateVariableItemSchema`, `TemplateFormSchema` | `formData` 구조와 payload 구조를 정렬해야 합니다. |
| 4 | `OidcClientForm` | `errors`, `redirectUriErrors` | `OidcClientPayloadSchema`, `OidcClientFormSchema`, login UI child schema | redirect URI 배열과 login UI nested object를 분리합니다. |
| 4 | `InquiryForm` | `errors` | `CreateInquiryPayloadSchema`, `UpdateInquiryPayloadSchema`, `InquiryFormSchema` | bootstrap meta는 schema가 아니라 서버 form bootstrap DTO에 남깁니다. |
| 5 | `RolePolicyAssignmentForm` | 없음 | `SyncRolePoliciesSchema` | 목록 assignment 전용 payload입니다. |
| 5 | `VariableInputForm`, `VariableEditTable` | prop 기반 `errors` | child item schema | Template migration 중 child component로 정리합니다. |
| 5 | `OidcConsentPanel`, `InquiryReplyForm` | submit/message state | 별도 command payload schema | 표준 edit form migration 이후 처리합니다. |

## common-schema 추출 후보

schema는 domain별 폴더를 만들고 barrel export를 추가합니다.
기존 `LoginSchema`, `SignUpSchema`, `CommunityPostSchema`는 유지하되, 이름과 책임이 payload인지 form인지 명확해야 합니다.

| domain | schema 후보 | 사용처 |
| --- | --- | --- |
| `auth` | `LoginSchema`, `OidcLoginPayloadSchema`, `ForgotPasswordPayloadSchema`, `ResetPasswordPayloadSchema`, `SignUpPayloadSchema`, `SignUpFormSchema` | auth Form, auth/idp DTO |
| `access-control` | `ActionPayloadSchema`, `RolePayloadSchema`, `PolicyPayloadSchema`, `SyncPolicyAbilitiesSchema`, `SyncRolePoliciesSchema`, `AbilityPayloadSchema`, `AbilityFormSchema` | Action/Role/Policy/Ability CRUD |
| `space` | `SpacePayloadSchema`, `GroundPayloadSchema` | Space create, Ground edit |
| `task` | `TaskExercisePayloadSchema`, `TaskExerciseFormSchema` | Task exercise create/edit |
| `routine` | `RoutinePayloadSchema`, `RoutineFormSchema`, `RoutineActivityItemSchema` | Routine create/edit |
| `timeline` | `TimelinePayloadSchema`, `TimelineSessionPayloadSchema`, `TimelineSessionFormSchema`, `ProgramPayloadSchema`, `ProgramFormSchema` | Timeline, Session, Program create/edit |
| `template` | `TemplatePayloadSchema`, `TemplateFormSchema`, `TemplateVariableItemSchema` | Template create/edit |
| `oidc` | `OidcClientPayloadSchema`, `OidcClientFormSchema`, `OidcClientLoginUiSchema` | OIDC client create/edit |
| `inquiry` | `CreateInquiryPayloadSchema`, `UpdateInquiryPayloadSchema`, `InquiryFormSchema` | Inquiry create/edit |

Update DTO는 기본적으로 `PartialType(CreateXDto)`를 유지할 수 있습니다.
단, update에서 수정 불가능한 field가 있으면 `OmitType(CreateXDto, ["field"])`를 먼저 적용합니다.
Form state는 edit 화면에서 모든 표시 field를 가질 수 있지만, route mapper는 update API가 받는 field만 payload로 보냅니다.

## Payload mapper 계약

route는 create/edit/detail 결정을 소유합니다.
`XXXXEditScreen`과 도메인 Form은 현재 mode를 스스로 판단하지 않습니다.

```ts
const state = useLocalObservable(() => new GroundFormState());

useEffect(() => {
	if (ground) {
		state.restore(ground);
	}
}, [ground, state]);

const onSubmit = () => {
	const payload = toUpdateGroundPayload(state);
	updateGround({ spaceId, data: payload });
};
```

payload mapper는 다음 규칙을 따릅니다.

1. schema 검증 대상 field만 payload로 보냅니다.
2. UI-only field는 payload에서 제외합니다.
3. trim, empty string to `undefined`/`null`, number parsing, JSON parsing 같은 wire 변환을 명시합니다.
4. create/update 차이는 route가 선택한 mapper 이름으로 드러냅니다.
5. mapper는 API 호출, toast, router navigation을 하지 않습니다.
6. mapper가 JSON parse 같은 payload 변환 실패를 감지하면 field error 형태로 돌려줄 수 있어야 합니다.

권장 파일 배치는 migration slice에서 결정하되, Form 컴포넌트 파일에는 mapper를 두지 않습니다.
state class 파일 또는 route-owned `*.mapper.ts`에 두고, Screen/Form은 payload mapper를 import하지 않습니다.

## State class extraction 계약

도메인 Form state는 interface literal에서 class로 이동합니다.
route는 class instance를 생성해서 Screen/Form에 주입합니다.

```ts
export class TimelineFormState
	implements FormSchemaStateContract<TimelinePayloadSchema>
{
	name = "";
	description = "";
	fieldErrors: FormSchemaStateContract<TimelinePayloadSchema>["fieldErrors"] = {};
	errorMessage: string | null = null;

	constructor(dto?: TimelineResponseDto | null) {
		makeAutoObservable(this);
		this.restore(dto);
	}

	restore(dto?: TimelineResponseDto | null) {
		if (!dto) {
			return this;
		}
		this.name = dto.name ?? "";
		this.description = dto.description ?? "";
		this.fieldErrors = {};
		this.errorMessage = null;
		return this;
	}
}
```

state class는 다음만 소유합니다.

- observable field 값
- `fieldErrors`와 `errorMessage`
- 응답 DTO에서 form field로 복원하는 `restore(dto)`
- field error mutator
- 화면 전용 computed 값

state class는 다음을 소유하지 않습니다.

- API mutation 호출
- router navigation
- toast
- create/edit/detail mode 판단
- Screen title/action composition

## LoginForm 첫 적용 범위

첫 구현 slice는 `LoginForm`으로 제한합니다.

| 파일 | 변경 |
| --- | --- |
| `packages/common-type/src/form-state.ts` | `FormStateContract`, `FormFieldErrors` 등 공통 form feedback 계약 추가 |
| `packages/common-type/src/index.ts` | form state 계약 export |
| `packages/common-schema/src/utils/validate.ts` | UI용 sync field error map helper 추가 |
| `packages/fe-ui/package.json` | `@cocrepo/schema` 의존성 추가 |
| `packages/fe-ui/src/form/Form/Form.tsx` | 공통 Form 구현 |
| `packages/fe-ui/src/form/Form/FormValidationContext.tsx` | context와 hook 구현 |
| `packages/fe-ui/src/form/Form/index.ts` | Form export |
| `packages/fe-ui/src/form/index.ts` | Form public export |
| `packages/fe-ui/src/input/TextField/index.tsx` | validation context 연결 |
| `packages/fe-ui/src/form/LoginForm/LoginForm.tsx` | root Form 적용, `LoginSchema` 연결 |
| `packages/fe-ui/src/form/LoginForm/LoginForm.test.tsx` | blur/submit validation 테스트 추가 |

LoginForm 이후 `SignUpForm`을 두 번째 slice로 진행합니다.
`SignUpForm`은 현재 field별 handler props와 manual fieldErrors가 많으므로, `LoginForm`에서 계약이 안정된 뒤 옮깁니다.

## 검증 시나리오

### 단위 테스트

| 테스트 대상 | 검증 항목 | 테스트 파일 | owner |
| --- | --- | --- | --- |
| Form | submit 전 전체 검증 실패 시 submit 전파 차단 | `packages/fe-ui/src/form/Form/Form.test.tsx` | `fe-form-agent` |
| Form | schema error를 `state.fieldErrors`에 저장 | `packages/fe-ui/src/form/Form/Form.test.tsx` | `fe-form-agent` |
| Form | `readOnly=true`이면 하위 field가 잠김 | `packages/fe-ui/src/form/Form/Form.test.tsx` | `fe-form-agent` |
| TextField wrapper | onBlur에서 path 검증 후 errorMessage 전달 | `packages/fe-ui/src/input/TextField/TextField.test.tsx` | `fe-input-agent` |
| LoginForm | LoginSchema 기준 email/password validation 표시 | `packages/fe-ui/src/form/LoginForm/LoginForm.test.tsx` | `fe-form-agent` |
| common-type | Form state feedback 계약 export | `packages/common-type/src/form-state.ts` type-check | `common-type-builder` |

### 정적 검증

| 검증 항목 | 명령 | 통과 기준 |
| --- | --- | --- |
| fe-ui typecheck | `pnpm --filter @cocrepo/ui type-check` | 타입 오류 없음 |
| common-type typecheck | `pnpm --filter @cocrepo/type type-check` | 타입 오류 없음 |
| common-schema typecheck | `pnpm --filter @cocrepo/schema type-check` | 타입 오류 없음 |
| manual error prop 제거 확인 | `rg "state\\.errors|state\\.fieldErrors" packages/fe-ui/src/form/LoginForm packages/fe-ui/src/form/SignUpForm` | 마이그레이션된 Form에는 field error 직접 전달 없음 |
| raw input 금지 | `rg "<input|<select|<textarea" packages/fe-ui/src/form` | form 계층에서 raw 입력 요소 신규 추가 없음 |

## 단계별 실행 계획

| 단계 | 담당 | 산출물 | 완료 기준 |
| --- | --- | --- | --- |
| 0 | `orch-delivery` / `fe-form-agent` | 이 spec의 schema/payload inventory | migration 대상, 우선순위, owner 경계가 문서화됨 |
| 1 | `common-type-builder` | `FormStateContract`, `FormSchemaStateContract` | 모든 Form state가 공유할 `fieldErrors`/`errorMessage` 계약과 schema-derived field 계약 export |
| 2 | `common-schema-builder` | sync field validation helper | 단일 field와 전체 schema를 field error map으로 변환 |
| 3 | `fe-form-agent` | `Form` + validation context | HeroUI Form 감싸기, submit capture 검증, readOnly context |
| 4 | `fe-input-agent` | `TextField/index.tsx` validation binding | LoginForm field error가 TextField에 표시됨 |
| 5 | `fe-form-agent` | LoginForm 마이그레이션 | `FormSchemaStateContract<LoginSchema>` 구현, LoginSchema 적용, manual validation 제거 |
| 6 | `common-schema-builder` + `be-dto-builder` | auth schema / DTO 정리 | ForgotPassword, ResetPassword, OidcLogin, SignUp payload/form schema가 FE/BE에서 같은 원천을 사용 |
| 7 | `fe-form-agent` + `fe-route-agent` | auth Form state class 정리 | Auth route가 class state를 생성하고 Form은 `schema/readOnly/state`만 받음 |
| 8 | `fe-input-agent` | TextArea/Select/RadioGroup/Checkbox/Switch/StringListInput 확장 | 각 wrapper가 동일한 validation context 계약 사용 |
| 9 | `common-schema-builder` + `be-dto-builder` | 단순 CRUD schema / DTO 정리 | Action, Role, Policy, Timeline request DTO가 schema 원천을 공유 |
| 10 | `fe-form-agent` + `fe-route-agent` | 단순 CRUD Form migration | `errors` 직접 전달 제거, route mapper로 create/update payload 조립 |
| 11 | `common-schema-builder` + `be-dto-builder` | mapper 필요 CRUD schema / DTO 정리 | Ground, TaskExercise, Ability, TimelineSession, Program의 `PayloadSchema`와 필요한 `FormSchema`가 분리됨 |
| 12 | `fe-form-agent` + `fe-route-agent` | mapper 필요 CRUD Form migration | UI-only field가 payload에서 제외되고 route mapper가 wire 변환을 소유 |
| 13 | `common-schema-builder` + `be-dto-builder` | 복잡 Form schema / DTO 정리 | Routine, Template, OidcClient, Inquiry의 child schema와 payload schema가 분리됨 |
| 14 | `fe-form-agent` + `fe-route-agent` | 복잡 Form migration | nested/array error가 field path 계약으로 통합되고 bootstrap meta는 schema와 분리 |
| 15 | `fe-storybook-agent` | story 상태 보강 | validation/readOnly/detail/create/edit 상태 story 추가 |

## 승인 기준

- 도메인 Form은 공통 `Form`을 root로 사용합니다.
- `Form`은 schema를 받고 input wrapper는 context에서 schema를 읽습니다.
- `Name/Name.tsx` pure 컴포넌트는 validation schema를 import하지 않습니다.
- `Name/index.tsx`는 `useFormField`와 validation binding을 함께 처리합니다.
- 도메인 Form state는 별도 `XXXFormField` union을 선언하지 않고 `FormSchemaStateContract<Schema>`로 schema field를 원천으로 삼습니다.
- 모든 도메인 Form state class는 `FormStateContract`의 `fieldErrors`, `errorMessage` 이름과 의미를 유지합니다.
- route는 create/edit/detail mode를 결정하고 `readOnly`와 state class를 주입합니다.
- Form은 편집 가능 여부와 검증만 걱정하고 API 호출/route 이동을 소유하지 않습니다.
- common-schema decorator 메시지가 UI validation message의 원천입니다.
- FE Form과 BE DTO는 같은 `@cocrepo/schema` schema class를 기준으로 검증합니다.
