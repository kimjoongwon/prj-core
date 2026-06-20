export interface HttpRequestLike {
	headers?: Record<string, string | string[] | undefined>;
	ip?: string;
	socket?: {
		remoteAddress?: string;
	};
}
