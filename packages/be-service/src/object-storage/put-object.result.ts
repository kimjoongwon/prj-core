export interface PutObjectResult {
	key: string;
	publicUrl: string | null;
	etag?: string;
}
