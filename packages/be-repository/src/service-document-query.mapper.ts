import type { GetServiceDocumentsQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import { containsFilter, toPrismaOrderBy } from "./query-input.mapper";

export function buildServiceDocumentQueryWhere(
	input: GetServiceDocumentsQueryInput,
	baseWhere?: Prisma.ServiceDocumentWhereInput,
): Prisma.ServiceDocumentWhereInput {
	const where: Prisma.ServiceDocumentWhereInput = {
		...(baseWhere ?? {}),
		...(input.kind ? { kind: input.kind } : {}),
		...(input.platform ? { platform: input.platform } : {}),
		...(input.status ? { status: input.status } : {}),
		...(input.locale ? { locale: input.locale } : {}),
		...(input.isRequired !== undefined
			? { isRequired: input.isRequired }
			: {}),
	};

	if (input.search) {
		const search = containsFilter(input.search);
		where.OR = [{ title: search }, { summary: search }, { version: search }];
	}

	return where;
}

export function buildServiceDocumentQueryOrderBy(
	input: GetServiceDocumentsQueryInput,
) {
	return toPrismaOrderBy(input.sort) as Prisma.ServiceDocumentOrderByWithRelationInput[];
}
