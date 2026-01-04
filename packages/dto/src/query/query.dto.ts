import { NumberFieldOptional } from "@cocrepo/decorator";
import { defaultsDeep, isEmpty, merge } from "@cocrepo/toolkit";
import { PageMetaDto } from "./page-meta.dto";

export class QueryDto {
	@NumberFieldOptional({
		minimum: 1,
		default: undefined,
		int: true,
	})
	readonly skip?: number = undefined;

	@NumberFieldOptional({
		minimum: 1,
		maximum: 50,
		default: undefined,
		int: true,
	})
	readonly take?: number = undefined;

	private toQueryArgs<T extends object>(query: T) {
		if (isEmpty(query)) {
			return {};
		}

		const result: Record<string, unknown> = {};
		const where: Record<string, unknown> = {};
		const orderBy: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(query)) {
			if (key === "take" || key === "skip") {
				result[key] = value;
			} else if (key.endsWith("SortOrder")) {
				orderBy[key.replace("SortOrder", "")] = value;
			} else {
				where[key] = value;
			}
		}

		if (Object.keys(where).length > 0) {
			result.where = where;
		}
		if (Object.keys(orderBy).length > 0) {
			result.orderBy = orderBy;
		}

		return result;
	}

	toArgs<T>(rawArgs?: T) {
		const args = this.toQueryArgs(this);
		const newArgs = defaultsDeep(args, {
			orderBy: {
				createdAt: "desc",
			},
		});

		// rawArgs가 있으면 newArgs를 rawArgs로 덮어쓰기 (모든 nested depth에서 동작)
		if (rawArgs) {
			return merge({}, newArgs, rawArgs) as T;
		}

		return {
			...newArgs,
		} as T;
	}

	toCountArgs<T>(includeRemovedItems = false) {
		const args = this.toQueryArgs(this) as Record<string, unknown>;
		delete args.include;
		delete args.skip;
		delete args.take;
		delete args.orderBy;
		if (!includeRemovedItems) {
			args.where = {
				...args.where,
				removedAt: null,
			};
		}
		return args as T;
	}

	toPageMetaDto(totalCount: number) {
		return new PageMetaDto(this.skip, this.take, totalCount);
	}
}
