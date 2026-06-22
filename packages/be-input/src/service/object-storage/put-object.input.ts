export interface PutObjectInput {
	key: string;
	body: Buffer | Uint8Array | string;
	contentType: string;
	contentLength?: number;
	checksum?: string;
	metadata?: Record<string, string>;
}
