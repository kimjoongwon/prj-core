import { isEmpty } from "es-toolkit/compat";

/**
 * URL 템플릿의 파라미터를 실제 값으로 치환
 * @example
 * buildPath('/user/:id/posts/:postId', { id: '123', postId: '456' })
 * // → '/user/123/posts/456'
 */
function buildPath(template: string, params: Record<string, any>): string {
	return template.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, key) => {
		const value = params[key];
		if (value === undefined || value === null) {
			return match; // 값이 없으면 원본 유지
		}
		return String(value);
	});
}

export function getUrlWithParamsAndQueryString(
	url: string,
	params: object = {},
	queryString?: string,
) {
	let pathWithParams = "";
	if (isEmpty(params)) {
		pathWithParams = url;
	} else {
		pathWithParams = buildPath(url, params);
	}

	if (queryString) {
		pathWithParams = `${pathWithParams}?${queryString}`;
	}

	return pathWithParams;
}

export function convertFromPathParamsToQueryParams({
	pathParamKeys,
	pathParams,
}: {
	pathParamKeys: string[];
	pathParams: object;
}) {
	return Object.fromEntries(
		pathParamKeys.map((key) => [key, pathParams?.[key]]),
	);
}
