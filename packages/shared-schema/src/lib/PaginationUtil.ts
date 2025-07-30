import { isEmpty } from "remeda";

export class PaginationUtil {
	static getPage = ({
		skip,
		take,
	}: {
		skip?: number;
		take?: number;
	}): number => {
		const actualSkip = skip || 0;
		const actualTake = take || 10;

		if (actualTake === 0) {
			throw new Error("Take must be greater than 0");
		}
		const page = Math.floor(actualSkip / actualTake) + 1;
		return page;
	};

	static toArgs = <T extends object>(query: T) => {
		if (isEmpty(query as any)) {
			return {};
		}
		return Object.entries(query)
			.map(([key, value]) => {
				let object;
				if (key === "take" || key === "skip") {
					object = {
						[key]: value,
					};
					return object;
				}

				if (key.endsWith("SortOrder")) {
					object = {
						orderBy: {
							[key.replace("SortOrder", "")]: value,
						},
					};

					return object;
				}

				object = {
					where: {
						[key]: value,
					},
				};

				return object;
			})
			.reduce(
				(acc, curr) => {
					const { where = {}, orderBy = {} } = acc;
					const { where: currWhere = {}, orderBy: currOrderBy = {} } = curr;

					return {
						...acc,
						...curr,
						where: {
							...where,
							...currWhere,
						},
						orderBy: {
							...orderBy,
							...currOrderBy,
						},
					};
				},
				{ where: {}, orderBy: {} },
			);
	};
}
