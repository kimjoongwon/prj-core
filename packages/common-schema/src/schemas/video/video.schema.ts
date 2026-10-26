import { AbstractSchema } from "../abstract.schema";

/** Video의 DB 필드 타입과 공통 검증입니다. */
export class VideoSchema extends AbstractSchema {
	videoId!: string;

	width!: number;

	height!: number;

	durationMs!: number;

	frameRate!: number | null;

	codec!: string | null;

	bitrate!: number | null;

	hasAudio!: boolean;

	assetId!: bigint;
}
