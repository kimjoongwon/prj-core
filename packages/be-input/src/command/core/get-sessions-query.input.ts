export interface GetSessionsQueryInput {
	timelineId?: bigint | null;
	search?: string | null;
	skip?: number;
	take?: number;
	sort?: string[];
}
