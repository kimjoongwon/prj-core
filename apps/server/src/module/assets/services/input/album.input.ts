/**
 * Album Service Input Types
 */
export interface CreateAlbumInput {
	name: string;
	description?: string | null;
	coverAssetId?: string | null;
	sortOrder?: number;
}

export interface UpdateAlbumInput {
	name?: string;
	description?: string | null;
	coverAssetId?: string | null;
	sortOrder?: number;
}

export interface AddAlbumEntryInput {
	albumId: string;
	assetId: string;
	caption?: string | null;
}

export interface ReorderAlbumEntriesInput {
	entryPositions: Array<{ assetId: string; position: number }>;
}
