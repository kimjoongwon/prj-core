import { AssetAggregate } from "@cocrepo/aggregate";
import { GetAssetsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAssetsQuery)
export class GetAssetsUseCase {
	constructor(private readonly assetService: AssetAggregate) {}

	async execute(query: GetAssetsQuery): Promise<unknown> {
		const assetResult = await this.assetService.getAssets(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		return buildOffsetPaginatedResponse(
			assetResult.data,
			assetResult.totalCount,
			skip,
			take,
		);
	}
}
