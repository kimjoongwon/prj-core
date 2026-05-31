import type {
	OffsetPaginatedResponse,
	OffsetPaginationMeta,
	OffsetStatsPaginatedResponse,
	PagePaginatedResponse,
	PagePaginationMeta,
} from "@cocrepo/type";

export function buildOffsetPaginationMeta(
	total: number,
	skip: number,
	take: number,
): OffsetPaginationMeta {
	return {
		total,
		skip,
		take,
		totalPages: take > 0 ? Math.ceil(total / take) : 1,
	};
}

export function buildOffsetPaginatedResponse<TData>(
	data: TData,
	total: number,
	skip: number,
	take: number,
): OffsetPaginatedResponse<TData> {
	return {
		data,
		meta: buildOffsetPaginationMeta(total, skip, take),
	};
}

export function buildOffsetStatsPaginatedResponse<TData>(
	data: TData,
	total: number,
	skip: number,
	take: number,
): OffsetStatsPaginatedResponse<TData> {
	return {
		...buildOffsetPaginatedResponse(data, total, skip, take),
		stats: {
			total,
		},
	};
}

export function buildPagePaginationMeta(
	total: number,
	page: number,
	limit: number,
): PagePaginationMeta {
	return {
		total,
		page,
		limit,
		totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
	};
}

export function buildPagePaginatedResponse<TData>(
	data: TData,
	total: number,
	page: number,
	limit: number,
): PagePaginatedResponse<TData> {
	return {
		data,
		meta: buildPagePaginationMeta(total, page, limit),
	};
}
