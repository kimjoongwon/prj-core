/**
 * @cocrepo/api
 * Generated API client and types from OpenAPI specs using orval
 */

// ─── Server APIs (port 3006) ───
export * from "./apis";
export * from "./apis-assets";
export {
	AXIOS_INSTANCE,
	customInstance,
	setApiPersistStore,
	setLoginRedirectUrl,
} from "./libs/customAxios";
export * from "./model";

// ─── IDP APIs (port 3007) ───
export * from "./idp-apis";

// idp-model 고유 타입만 export (model과 중복되는 72개 타입 제외)
export * from "./idp-model/abortResultDto";
export * from "./idp-model/consentResultDto";
export * from "./idp-model/executePasswordResetBody";
export * from "./idp-model/forgotPasswordResultDto";
export * from "./idp-model/interactionClientDto";
export * from "./idp-model/interactionDataDto";
export * from "./idp-model/interactionDataDtoClient";
export * from "./idp-model/interactionDataDtoParams";
export * from "./idp-model/interactionDataDtoPrompt";
export * from "./idp-model/interactionDataDtoSession";
export * from "./idp-model/loginErrorDto";
export * from "./idp-model/loginSuccessDto";
export * from "./idp-model/oidcLoginPayloadDto";
export * from "./idp-model/passwordPolicyDto";
export * from "./idp-model/requestPasswordResetBody";
export * from "./idp-model/resetPasswordErrorDto";
export * from "./idp-model/resetPasswordResultDto";
export * from "./idp-model/tokenValidationDto";
export {
	IDP_AXIOS_INSTANCE,
	customIdpInstance,
	setIdpBaseUrl,
	setIdpLoginRedirectUrl,
	setIdpPersistStore,
} from "./libs/customIdpAxios";
