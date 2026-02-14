/**
 * @cocrepo/api
 * Generated API client and types from OpenAPI specs using orval
 */

// ─── Server APIs (port 3006) ───
export * from "./apis";
export {
	AXIOS_INSTANCE,
	customInstance,
	setApiPersistStore,
	setLoginRedirectUrl,
} from "./libs/customAxios";
export * from "./model";

// ─── IDP APIs (port 3007) ───
// NOTE: IDP codegen 최초 실행 전에는 빈 파일일 수 있음
// export * from "./idp-apis";
// export * from "./idp-model";
export {
	IDP_AXIOS_INSTANCE,
	customIdpInstance,
	setIdpBaseUrl,
} from "./libs/customIdpAxios";
