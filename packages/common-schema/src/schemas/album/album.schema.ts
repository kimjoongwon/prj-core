import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Album의 DB 필드 타입과 공통 검증입니다. */
export class AlbumSchema extends AbstractSchema {
	albumId!: string;

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: bigint;

	@StringValidation({ description: "앨범명" })
	name!: string;

	@StringValidationOptional({ nullable: true, description: "앨범 설명" })
	description!: string | null;

	@BigIntIdValidationOptional({ nullable: true, description: "커버 에셋 ID" })
	coverAssetId!: bigint | null;

	@NumberValidation({ description: "정렬 순서", int: true })
	sortOrder!: number;

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;
}
