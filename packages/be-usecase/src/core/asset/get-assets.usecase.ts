import { AssetAggregateRoot } from "@cocrepo/aggregate";
import { GetAssetsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAssetsQuery)
export class GetAssetsUseCase implements IQueryHandler<GetAssetsQuery> {
	constructor(private readonly assetService: AssetAggregateRoot) {}

	async execute(query: GetAssetsQuery): Promise<unknown> {
		const assetResult = await this.assetService.getAssets(query.query);
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		return buildOffsetPaginatedResponse(
			assetResult.data,
			assetResult.totalCount,
			skip,
			take,
		);
	}
}
