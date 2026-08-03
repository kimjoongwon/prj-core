export interface GetFoldersQueryInput {
	parentFolderId?: bigint;
	spaceId?: bigint;
	name?: string;
	statusFilter?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
