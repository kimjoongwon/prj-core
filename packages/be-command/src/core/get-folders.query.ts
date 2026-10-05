import type { GetFoldersQueryInput } from "@cocrepo/input";

export class GetFoldersQuery implements GetFoldersQueryInput {
	readonly parentFolderId?: GetFoldersQueryInput["parentFolderId"];
	readonly spaceId?: GetFoldersQueryInput["spaceId"];
	readonly name?: GetFoldersQueryInput["name"];
	readonly statusFilter?: GetFoldersQueryInput["statusFilter"];
	readonly sort?: GetFoldersQueryInput["sort"];
	readonly skip?: GetFoldersQueryInput["skip"];
	readonly take?: GetFoldersQueryInput["take"];

	constructor(input: GetFoldersQueryInput) {
		Object.assign(this, input);
	}
}
