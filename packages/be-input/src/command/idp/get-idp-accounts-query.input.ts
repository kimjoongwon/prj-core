export interface GetIdpAccountsQueryInput {
	search?: string;
	isActive?: boolean;
	isLocked?: boolean;
	sort?: string[];
	skip?: number;
	take?: number;
}
