export interface E2ERequestLike {
	url(): string;
	method(): string;
	headers(): Record<string, string>;
	postDataJSON?(): unknown;
}
