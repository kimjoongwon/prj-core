/**
 * Form field path별 validation error message map입니다.
 *
 * @template TField - form state 안에서 검증 가능한 field path union
 */
export type FormFieldErrors<TField extends string = string> = Partial<
	Record<TField, string>
>;

/**
 * common-schema class instance에서 form field key union을 추출합니다.
 *
 * @template TSchema - `@cocrepo/schema` schema class의 instance type
 */
export type FormSchemaField<TSchema extends object> = Extract<
	keyof TSchema,
	string
>;

/**
 * 모든 form state class가 공통으로 가져야 하는 feedback 상태입니다.
 *
 * `fieldErrors`는 input wrapper가 path 기준으로 표시하는 field error이고,
 * `errorMessage`는 submit/API 실패처럼 form 전체에 표시하는 message입니다.
 */
export interface FormFeedbackState<TField extends string = string> {
	fieldErrors: FormFieldErrors<TField>;
	errorMessage: string | null;
}

/**
 * Form validation layer가 있으면 사용할 수 있는 field/form error mutator 계약입니다.
 *
 * state class가 이 메서드를 구현하면 Form은 직접 객체를 조작하지 않고
 * state class의 메서드를 통해 error 상태를 변경합니다.
 */
export interface FormFeedbackActions<TField extends string = string> {
	setFieldError: (field: TField, message?: string | null) => void;
	clearFieldError: (field: TField) => void;
	clearFieldErrors: () => void;
	setErrorMessage: (message?: string | null) => void;
	clearErrorMessage: () => void;
}

/**
 * Form 컴포넌트와 route/page form state class 사이의 공통 계약입니다.
 *
 * 도메인별 form state는 자기 입력 field를 추가로 가지되,
 * feedback 상태는 이 계약의 이름과 의미를 그대로 사용합니다.
 */
export interface FormStateContract<TField extends string = string>
	extends FormFeedbackState<TField>,
		Partial<FormFeedbackActions<TField>> {}

/**
 * common-schema schema instance type을 원천으로 삼는 form state 계약입니다.
 *
 * 도메인 Form은 별도 field union을 선언하지 않고
 * `FormSchemaStateContract<LoginSchema>`처럼 schema에서 field key를 추출합니다.
 */
export interface FormSchemaStateContract<TSchema extends object>
	extends FormStateContract<FormSchemaField<TSchema>> {}
