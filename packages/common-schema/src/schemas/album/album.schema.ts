import type { Album as PrismaAlbum } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Album의 DB 필드 타입과 공통 검증입니다. */
export class AlbumSchema extends AbstractSchema implements PrismaAlbum {
	albumId!: PrismaAlbum["albumId"];

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: PrismaAlbum["spaceId"];

	@StringValidation({ description: "앨범명" })
	name!: PrismaAlbum["name"];

	@StringValidationOptional({ nullable: true, description: "앨범 설명" })
	description!: PrismaAlbum["description"];

	@BigIntIdValidationOptional({ nullable: true, description: "커버 에셋 ID" })
	coverAssetId!: PrismaAlbum["coverAssetId"];

	@NumberValidation({ description: "정렬 순서", int: true })
	sortOrder!: PrismaAlbum["sortOrder"];

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: PrismaAlbum["createdById"];
}
