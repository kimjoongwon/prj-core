export interface UploadAssetCommandInput {
	folderId: string;
}

export interface UploadedAssetFileInput {
	originalname: string;
	mimetype: string;
	size: number;
	buffer?: Buffer;
	path?: string;
}
