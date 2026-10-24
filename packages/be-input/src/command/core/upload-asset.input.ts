export interface UploadAssetCommandInput {
	folderSeq: bigint;
}

export interface UploadedAssetFileInput {
	originalname: string;
	mimetype: string;
	size: number;
	buffer?: Buffer;
	path?: string;
}
