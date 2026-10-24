export interface GetSessionsQueryInput {
	timelineSeq?: bigint | null;
	search?: string | null;
	skip?: number;
	take?: number;
	sort?: string[];
}
