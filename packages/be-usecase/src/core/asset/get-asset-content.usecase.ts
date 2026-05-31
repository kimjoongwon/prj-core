import { AssetAggregateRoot } from "@cocrepo/aggregate";
import { GetAssetContentQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAssetContentQuery)
export class GetAssetContentUseCase
	implements IQueryHandler<GetAssetContentQuery>
{
	constructor(private readonly assetService: AssetAggregateRoot) {}

	execute(query: GetAssetContentQuery): Promise<unknown> {
		return this.assetService.getAssetContent(query.assetId);
	}
}
