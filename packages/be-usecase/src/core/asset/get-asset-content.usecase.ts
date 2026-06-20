import { AssetAggregate } from "@cocrepo/aggregate";
import { GetAssetContentQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAssetContentQuery)
export class GetAssetContentUseCase {
	constructor(private readonly assetService: AssetAggregate) {}

	execute(query: GetAssetContentQuery): Promise<unknown> {
		return this.assetService.getAssetContent(query.assetId);
	}
}
