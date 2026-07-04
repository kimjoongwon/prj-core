import type { DataGridState } from "@cocrepo/type";
import { DATA_GRID_DEFAULT_PAGE_SIZE } from "./constants";

function getQueryNumber(value: unknown, fallback: number) {
	return typeof value === "number" ? value : fallback;
}

export function getPageState(state: DataGridState) {
	const take = getQueryNumber(
		state.query.values.take,
		DATA_GRID_DEFAULT_PAGE_SIZE,
	);
	const skip = getQueryNumber(state.query.values.skip, 0);

	return {
		take,
		skip,
		currentPage: Math.floor(skip / Math.max(take, 1)) + 1,
	};
}
