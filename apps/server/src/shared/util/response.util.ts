export const RESPONSE_WRAPPER_FLAG = Symbol("shared:response-wrapper");

export interface ResponseWrapOptions<TMeta = unknown> {
	message?: string;
	status?: number;
	meta?: TMeta;
}

export type WrappedResponse<TData, TMeta = unknown> = {
	[RESPONSE_WRAPPER_FLAG]: true;
	data: TData;
	meta?: TMeta;
	message?: string;
	status?: number;
};

export const wrapResponse = <TData, TMeta = unknown>(
	data: TData,
	options: ResponseWrapOptions<TMeta> = {},
): WrappedResponse<TData, TMeta> => ({
	[RESPONSE_WRAPPER_FLAG]: true,
	data,
	meta: options.meta,
	message: options.message,
	status: options.status,
});

export const isWrappedResponse = (
	value: unknown,
): value is WrappedResponse<unknown> =>
	Boolean(
		value &&
			typeof value === "object" &&
			(value as WrappedResponse<unknown>)[RESPONSE_WRAPPER_FLAG] === true,
	);
