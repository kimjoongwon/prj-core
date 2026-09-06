import type { AssetStatus } from "@cocrepo/prisma/enums";

export const AssetStatusLabel: Record<AssetStatus, string> = {
	UPLOADING: "업로드 중",
	READY: "준비됨",
	FAILED: "실패",
};
