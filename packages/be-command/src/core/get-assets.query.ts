import type { GetAssetsQueryInput } from "@cocrepo/input";

export class GetAssetsQuery implements GetAssetsQueryInput {
	readonly folderId?: GetAssetsQueryInput["folderId"];
	readonly tenantId?: GetAssetsQueryInput["tenantId"];
	readonly kind?: GetAssetsQueryInput["kind"];
	readonly status?: GetAssetsQueryInput["status"];
	readonly search?: GetAssetsQueryInput["search"];
	readonly statusFilter?: GetAssetsQueryInput["statusFilter"];
	readonly sort?: GetAssetsQueryInput["sort"];
	readonly skip?: GetAssetsQueryInput["skip"];
	readonly take?: GetAssetsQueryInput["take"];

	constructor(input: GetAssetsQueryInput) {
		Object.assign(this, input);
	}
}
