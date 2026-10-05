export interface IdpAccountListInput {
	search?: string;
	isActive?: boolean;
	isLocked?: boolean;
	sort?: string[];
	skip?: number;
	take?: number;
}
