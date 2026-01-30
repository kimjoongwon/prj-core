"use client";

import type { InputConfig } from "@cocrepo/type";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsIsoDateTime,
	parseAsString,
	type UseQueryStatesKeysMap,
	useQueryStates,
} from "nuqs";
import { useMemo } from "react";

/**
 * InputConfig 배열에서 nuqs 파서를 자동 생성하는 훅
 *
 * @example
 * ```tsx
 * const leftInputs: InputConfig[] = [
 *   { type: "search", id: "search", placeholder: "검색" },
 *   { type: "select", id: "status", props: { options: [...] } },
 * ];
 *
 * const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
 * // queryStates: { take: 20, skip: 0, search: "", status: "" }
 *
 * // API 호출에 사용
 * const { data } = useGetUsers({
 *   take: queryStates.take,
 *   skip: queryStates.skip,
 *   search: queryStates.search,
 *   status: queryStates.status,
 * });
 * ```
 */
export function useMetaDataGridQueryStates(inputs: InputConfig[] = []) {
	const parsers = useMemo(() => {
		const result: UseQueryStatesKeysMap = {
			// 기본 페이지네이션
			take: parseAsInteger.withDefault(20),
			skip: parseAsInteger.withDefault(0),
		};

		for (const input of inputs) {
			const key = input.props?.queryKey ?? input.id;

			switch (input.type) {
				case "search":
					result[key] = parseAsString.withDefault("");
					break;
				case "select":
					result[key] = parseAsString.withDefault(
						(input.props?.defaultValue as string) ?? "",
					);
					break;
				case "multi-select":
					result[key] = parseAsArrayOf(parseAsString).withDefault(
						(input.props?.defaultValue as string[]) ?? [],
					);
					break;
				case "date-range": {
					const keys = input.props?.queryKeys ?? {
						start: `${key}Start`,
						end: `${key}End`,
					};
					result[keys.start] = parseAsIsoDateTime;
					result[keys.end] = parseAsIsoDateTime;
					break;
				}
				// button, dropdown, chip-group, custom은 querystring과 연동하지 않음
			}
		}

		return result;
	}, [inputs]);

	return useQueryStates(parsers);
}
