import { BooleanField, NumberField } from "@cocrepo/decorator";

export class PageMetaDto {
	@NumberField()
	readonly skip: number;

	@NumberField()
	readonly take: number;

	@NumberField()
	readonly totalCount: number;

	@NumberField()
	readonly pageCount: number;

	@BooleanField()
	readonly hasPreviousPage: boolean;

	@BooleanField()
	readonly hasNextPage: boolean;

	private static getPage(skip: number, take: number): number {
		const actualSkip = skip || 0;
		const actualTake = take || 10;
		if (actualTake === 0) {
			throw new Error("Take must be greater than 0");
		}
		return Math.floor(actualSkip / actualTake) + 1;
	}

	constructor(skip: number = 0, take: number = 10, totalCount: number = 0) {
		const page = PageMetaDto.getPage(skip, take);
		this.skip = skip;
		this.take = take;
		this.totalCount = totalCount;
		this.pageCount = Math.ceil(totalCount / this.take);
		this.hasPreviousPage = page > 1;
		this.hasNextPage = page < this.pageCount;
	}
}
