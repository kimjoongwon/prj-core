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
{
	albumEntryId!: string;

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	@BigIntIdValidation({ description: "앨범 ID" })
	albumId!: bigint;

	@BigIntIdValidation({ description: "에셋 ID" })
	assetId!: bigint;

	@NumberValidation({ description: "표시 순서", int: true })
	position!: number;

	@StringValidationOptional({ nullable: true, description: "캡션" })
	caption!: string | null;
}
