export interface GetObjectResult {
	body: Buffer;
	contentType?: string;
	contentLength?: number;
	etag?: string;
	lastModified?: Date;
}
