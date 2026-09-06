import type { Image as PrismaImage } from "@cocrepo/prisma";
import { AbstractSchema } from "../abstract.schema";

/** Image의 DB 필드 타입과 공통 검증입니다. */
export class ImageSchema extends AbstractSchema implements PrismaImage {
	imageId!: PrismaImage["imageId"];

	width!: PrismaImage["width"];

	height!: PrismaImage["height"];

	orientation!: PrismaImage["orientation"];

	colorSpace!: PrismaImage["colorSpace"];

	hasAlpha!: PrismaImage["hasAlpha"];

	assetId!: PrismaImage["assetId"];
}
