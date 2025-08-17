import { Path } from "path-parser";
import * as R from "remeda";

export function getUrlWithParamsAndQueryString(
	url: string,
	params: object = {},
	queryString?: string,
) {
	const path = new Path(url);

	let pathWithParams = "";
	if (R.isEmpty(params)) {
		pathWithParams = url;
	} else {
		pathWithParams = path.build(params);
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
		// @ts-ignore
		pathParamKeys.map((key) => [key, pathParams?.[key]]),
	);
}
