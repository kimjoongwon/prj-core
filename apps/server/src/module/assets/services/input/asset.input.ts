import type { AssetKind, AssetStatus } from "@cocrepo/prisma";
import type { JsonValue } from "@cocrepo/type";

/**
 * Asset Service Input Types
 */
export interface CreateAssetInput {
	folderId: string;
	kind: AssetKind;
	status?: AssetStatus;
	originalName: string;
	mimeType: string;
	sizeBytes: bigint;
	storageKey: string;
	checksum?: string | null;
	extension?: string | null;
	metadata?: JsonValue;
	creatorId?: string | null;
}

export interface UpdateAssetInput {
	folderId?: string;
	kind?: AssetKind;
	status?: AssetStatus;
	originalName?: string;
	storageKey?: string;
	checksum?: string | null;
	extension?: string | null;
	metadata?: JsonValue;
}

export interface CreateImageDetailInput {
	width?: number;
	height?: number;
	dpi?: number | null;
	colorSpace?: string | null;
}

export interface CreateVideoDetailInput {
	duration?: number | null;
	width?: number;
	height?: number;
	codec?: string | null;
	bitrate?: number | null;
	frameRate?: number | null;
}

export interface CreateDocumentDetailInput {
	pageCount?: number | null;
	author?: string | null;
	title?: string | null;
}

export interface CreateAssetWithDetailsInput {
	asset: CreateAssetInput;
	image?: CreateImageDetailInput;
	video?: CreateVideoDetailInput;
	document?: CreateDocumentDetailInput;
}
