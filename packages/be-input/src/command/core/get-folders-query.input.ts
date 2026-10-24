export interface GetFoldersQueryInput {
	parentFolderId?: string;
	spaceId?: string;
	name?: string;
	statusFilter?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
