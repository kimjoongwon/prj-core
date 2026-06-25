import type { GetTemplatesInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	createQueryOrderByBuilder,
} from "./query-input.mapper";

export function buildTemplateQueryWhere(
	input: GetTemplatesInput,
	baseWhere?: Prisma.TemplateWhereInput,
): Prisma.TemplateWhereInput {
	const where: Prisma.TemplateWhereInput = {
		...(baseWhere ?? {}),
		...(input.type ? { type: input.type } : {}),
		...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
	};

	if (input.search) {
		const search = containsFilter(input.search);
		where.OR = [{ code: search }, { name: search }];
	}

	return where;
}

export const buildTemplateQueryOrderBy = createQueryOrderByBuilder<
	GetTemplatesInput,
	Prisma.TemplateOrderByWithRelationInput
>();
