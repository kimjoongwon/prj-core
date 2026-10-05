export interface OffsetPaginationMeta {
	total: number;
	skip: number;
	take: number;
	totalPages: number;
}

export interface OffsetPaginatedResponse<TData> {
	data: TData;
	meta: OffsetPaginationMeta;
}

export interface OffsetStatsPaginatedResponse<TData>
	extends OffsetPaginatedResponse<TData> {
	stats: {
		total: number;
	};
}

export interface PagePaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface PagePaginatedResponse<TData> {
	data: TData;
	meta: PagePaginationMeta;
}
