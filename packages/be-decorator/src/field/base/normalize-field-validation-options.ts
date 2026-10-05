type FieldOptionsWithPattern = {
	pattern?: string | RegExp;
};

/** Swagger가 허용하는 RegExp 패턴을 공용 검증의 문자열 패턴 계약으로 변환합니다. */
export function normalizeFieldOptionsForValidation<
	TOptions extends FieldOptionsWithPattern,
>(
	options: TOptions,
): Omit<TOptions, "pattern"> & { pattern?: string } {
	return {
		...options,
		pattern:
			options.pattern instanceof RegExp
				? options.pattern.source
				: options.pattern,
	};
}
