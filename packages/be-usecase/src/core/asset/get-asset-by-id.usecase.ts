import { AssetAggregate } from "@cocrepo/aggregate";
import { GetAssetByIdQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetAssetByIdQuery)
export class GetAssetByIdUseCase implements IQueryHandler<GetAssetByIdQuery> {
	constructor(private readonly assetService: AssetAggregate) {}

	execute(query: GetAssetByIdQuery): Promise<unknown> {
		return this.assetService.getAssetById(query.assetId);
	}
}
