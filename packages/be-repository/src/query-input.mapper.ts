export type PrismaOrderBy = Record<string, "asc" | "desc">;

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

export function toPrismaOrderBy(
	sort: string[] | undefined,
	options?: {
		allowedFields?: readonly string[];
		defaultOrderBy?: PrismaOrderBy[];
	},
): PrismaOrderBy[] {
	const allowedFields = options?.allowedFields
		? new Set(options.allowedFields)
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
		? orderBy
		: (options?.defaultOrderBy ?? [{ createdAt: "desc" }]);
}
