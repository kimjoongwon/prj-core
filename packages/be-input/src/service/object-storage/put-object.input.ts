import type { Readable } from "node:stream";

export interface PutObjectInput {
	key: string;
	body: Buffer | Uint8Array | string | Readable;
	contentType: string;
	contentLength?: number;
	checksum?: string;
	metadata?: Record<string, string>;
}
