export type AssetContentPayload = {
	body: Buffer;
	contentType: string;
	contentLength?: number;
	etag?: string;
	fileName: string;
	lastModified?: Date;
};
