import type { AssetKind, AssetStatus } from "@cocrepo/prisma";

export interface GetAssetsQueryInput {
	folderSeq?: bigint;
	spaceSeq?: bigint;
	kind?: AssetKind;
	status?: AssetStatus;
	search?: string;
	statusFilter?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
