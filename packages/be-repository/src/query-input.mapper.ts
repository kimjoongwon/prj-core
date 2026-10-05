export type PrismaOrderBy = Record<string, "asc" | "desc">;

export interface SortQueryInput {
	sort?: string[] | null;
}

export interface QueryOrderByOptions<TOrderBy extends object = PrismaOrderBy> {
	allowedFields?: readonly Extract<keyof TOrderBy, string>[];
	defaultOrderBy?: readonly TOrderBy[];
}

const SORT_DESC_PREFIX = "-";

export function containsFilter(value: string | null | undefined) {
	if (!value) {
		return undefined;
	}

	return { contains: value, mode: "insensitive" } as const;
}

export function dateRangeFilter(
	from: Date | null | undefined,
	to: Date | null | undefined,
) {
	if (!from && !to) {
		return undefined;
	}

	return {
		...(from ? { gte: from } : {}),
		...(to ? { lte: to } : {}),
	};
}

export function removedAtFilter(isRemoved: boolean): { not: null } | null {
	return isRemoved ? { not: null } : null;
}

/**
 * API sort wire shape를 Prisma orderBy 배열로 변환합니다.
 */
export function toPrismaOrderBy<TOrderBy extends object = PrismaOrderBy>(
	sort: string[] | null | undefined,
	options?: QueryOrderByOptions<TOrderBy>,
): TOrderBy[] {
	const allowedFields = options?.allowedFields
		? new Set<string>(options.allowedFields)
		: undefined;
	const orderBy = (sort ?? []).flatMap((entry) => {
		const direction = entry.startsWith(SORT_DESC_PREFIX) ? "desc" : "asc";
		const field = entry.startsWith(SORT_DESC_PREFIX) ? entry.slice(1) : entry;

		if (allowedFields && !allowedFields.has(field)) {
			return [];
		}

		return [{ [field]: direction } satisfies PrismaOrderBy];
	});

	return orderBy.length > 0
		? (orderBy as TOrderBy[])
		: ([...(options?.defaultOrderBy ?? [{ createdAt: "desc" }])] as TOrderBy[]);
}

/**
 * sort 필드를 가진 query input 전체를 Prisma orderBy 배열로 변환합니다.
 */
export function buildQueryOrderBy<TOrderBy extends object = PrismaOrderBy>(
	input: SortQueryInput,
	options?: QueryOrderByOptions<TOrderBy>,
): TOrderBy[] {
	return toPrismaOrderBy(input.sort, options);
}

/**
 * 도메인별 query mapper에서 재사용할 orderBy builder를 만듭니다.
 */
export function createQueryOrderByBuilder<
	TInput extends SortQueryInput,
	TOrderBy extends object = PrismaOrderBy,
>(options?: QueryOrderByOptions<TOrderBy>) {
	return (input: TInput): TOrderBy[] => buildQueryOrderBy(input, options);
}
