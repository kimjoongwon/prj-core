export interface KoaLikeRequest {
	method?: string;
	url?: string;
	header?: (name: string) => string | undefined;
	headers?: Record<string, string | string[] | undefined>;
}
