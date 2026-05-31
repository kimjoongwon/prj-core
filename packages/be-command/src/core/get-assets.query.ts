import type { AssetQueryDto } from "@cocrepo/dto";

export class GetAssetsQuery {
	constructor(readonly query: AssetQueryDto) {}
}
