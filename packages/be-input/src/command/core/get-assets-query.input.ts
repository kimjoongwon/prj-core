import type { AssetKind, AssetStatus } from "@cocrepo/prisma";

export interface GetAssetsQueryInput {
	folderId?: bigint;
	spaceId?: bigint;
	kind?: AssetKind;
	status?: AssetStatus;
	search?: string;
	statusFilter?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
