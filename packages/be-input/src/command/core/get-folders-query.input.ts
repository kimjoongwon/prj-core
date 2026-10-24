export interface GetFoldersQueryInput {
	parentFolderSeq?: bigint;
	spaceSeq?: bigint;
	name?: string;
	statusFilter?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
