export class PrismaClient {}

export const Prisma = {};
export const AssetKind = {
	IMAGE: "IMAGE",
	VIDEO: "VIDEO",
	DOCUMENT: "DOCUMENT",
} as const;
export const AssetStatus = {
	UPLOADING: "UPLOADING",
	READY: "READY",
	FAILED: "FAILED",
} as const;
