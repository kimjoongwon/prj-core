export interface GetUsersInput {
	search?: string;
	name?: string;
	email?: string;
	phone?: string;
	nickname?: string;
	role?: string;
	roles?: string[];
	status?: string;
	isActive?: boolean;
	isRemoved?: boolean;
	categorySeq?: bigint;
	groupIds?: bigint[];
	createdFrom?: Date;
	createdTo?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
