import type { AlbumEntry as PrismaAlbumEntry } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	NumberValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** AlbumEntry의 DB 필드 타입과 공통 검증입니다. */
export class AlbumEntrySchema
	extends AbstractSchema
	implements PrismaAlbumEntry
{
	albumEntryId!: PrismaAlbumEntry["albumEntryId"];

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: PrismaAlbumEntry["spaceId"];

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: PrismaAlbumEntry["createdById"];

	@BigIntIdValidation({ description: "앨범 ID" })
	albumId!: PrismaAlbumEntry["albumId"];

	@BigIntIdValidation({ description: "에셋 ID" })
	assetId!: PrismaAlbumEntry["assetId"];

	@NumberValidation({ description: "표시 순서", int: true })
	position!: PrismaAlbumEntry["position"];

	@StringValidationOptional({ nullable: true, description: "캡션" })
	caption!: PrismaAlbumEntry["caption"];
}
