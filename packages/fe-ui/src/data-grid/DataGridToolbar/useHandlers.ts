"use client";

import { useMemo } from "react";
import type { DataGridToolbarState } from "./DataGridToolbar";

/** Toolbar 입력에서 발생하는 query 변경을 연결합니다. */
export const useHandlers = (state: DataGridToolbarState) => {
	const handlers = useMemo(
		() => ({
			changeQuery: (values: Record<string, unknown | null>) =>
				state.querySetter(values),
		}),
		[state],
	);
	return {
		...handlers,
		queryValues: state.query.filters,
		shouldRender: state.leftInputs.length > 0 || state.rightInputs.length > 0,
	};
};
