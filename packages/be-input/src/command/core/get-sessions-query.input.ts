export interface GetSessionsQueryInput {
	timelineId?: string | null;
	search?: string | null;
	skip?: number;
	take?: number;
	sort?: string[];
}
