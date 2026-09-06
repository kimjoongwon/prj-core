import type { Video as PrismaVideo } from "@cocrepo/prisma";
import { AbstractSchema } from "../abstract.schema";

/** Video의 DB 필드 타입과 공통 검증입니다. */
export class VideoSchema extends AbstractSchema implements PrismaVideo {
	videoId!: PrismaVideo["videoId"];

	width!: PrismaVideo["width"];

	height!: PrismaVideo["height"];

	durationMs!: PrismaVideo["durationMs"];

	frameRate!: PrismaVideo["frameRate"];

	codec!: PrismaVideo["codec"];

	bitrate!: PrismaVideo["bitrate"];

	hasAudio!: PrismaVideo["hasAudio"];

	assetId!: PrismaVideo["assetId"];
}
