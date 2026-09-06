import type { AssetKind } from "@cocrepo/prisma/enums";

export const AssetKindLabel: Record<AssetKind, string> = {
	IMAGE: "이미지",
	VIDEO: "비디오",
	DOCUMENT: "문서",
};
