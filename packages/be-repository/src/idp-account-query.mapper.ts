import type { IdpAccountListInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	createQueryOrderByBuilder,
} from "./query-input.mapper";

export function buildIdpAccountQueryWhere(
	input: IdpAccountListInput,
	baseWhere?: Prisma.UserWhereInput,
): Prisma.UserWhereInput {
	const where: Prisma.UserWhereInput = {
		...(baseWhere ?? {}),
		// 활성/잠금 상태는 UserStatus 1:1 관계를 통해 필터링합니다.
		...(input.isActive !== undefined
			? { status: { isActive: input.isActive } }
			: {}),
	};
	const and: Prisma.UserWhereInput[] = [];

	if (input.search) {
		const search = containsFilter(input.search);
		and.push({ OR: [{ name: search }, { email: search }] });
	}

	if (input.isLocked === true) {
		and.push({
			OR: [
				{ status: { isPermanentlyLocked: true } },
				{ status: { lockedUntil: { gt: new Date() } } },
			],
		});
	}

	if (and.length > 0) {
		const existingAnd =
			where.AND === undefined
				? []
				: Array.isArray(where.AND)
					? where.AND
					: [where.AND];
		where.AND = [...existingAnd, ...and];
	}

	return where;
}

// lastLoginAt는 정렬 입력으로 허용하되 실제 orderBy는 withStatusRelationOrderBy가
// status 관계 경로로 치환해 전달합니다.
const IDP_ACCOUNT_SORTABLE_FIELDS = [
	"createdAt",
	"name",
	"email",
	"lastLoginAt",
] as unknown as readonly Extract<
	keyof Prisma.UserOrderByWithRelationInput,
	string
>[];

export const buildIdpAccountQueryOrderBy = createQueryOrderByBuilder<
	IdpAccountListInput,
	Prisma.UserOrderByWithRelationInput
>({
	allowedFields: IDP_ACCOUNT_SORTABLE_FIELDS,
});

/**
 * 정렬 필드 중 UserStatus 관계로 이동한 필드(lastLoginAt)를
 * 관계 경로 orderBy로 치환합니다.
 */
export function withStatusRelationOrderBy(
	orderBy: Prisma.UserOrderByWithRelationInput[],
): Prisma.UserOrderByWithRelationInput[] {
	return orderBy.map((entry) => {
		if (!("lastLoginAt" in entry)) {
			return entry;
		}

		const direction = (entry as Record<string, "asc" | "desc">)[
			"lastLoginAt"
		];
		return { status: { lastLoginAt: direction } };
	});
}
