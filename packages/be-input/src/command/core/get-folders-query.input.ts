export interface GetFoldersQueryInput {
	parentFolderId?: string;
	tenantId?: string;
	name?: string;
	statusFilter?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
