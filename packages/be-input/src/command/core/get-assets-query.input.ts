import type { AssetKind, AssetStatus } from "@cocrepo/prisma";

export interface GetAssetsQueryInput {
	folderId?: string;
	spaceId?: string;
	kind?: AssetKind;
	status?: AssetStatus;
	search?: string;
	statusFilter?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
