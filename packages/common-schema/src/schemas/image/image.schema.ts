import { AbstractSchema } from "../abstract.schema";

/** Image의 DB 필드 타입과 공통 검증입니다. */
export class ImageSchema extends AbstractSchema {
	imageId!: string;

	width!: number;

	height!: number;

	orientation!: number | null;

	colorSpace!: string | null;

	hasAlpha!: boolean;

	assetId!: bigint;
}
