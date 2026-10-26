import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** SpaceClassification의 DB 필드 타입과 공통 검증입니다. */
export class SpaceClassificationSchema
	extends AbstractSchema
{
	spaceClassificationId!: string;

	@BigIntIdValidation()
	categoryId!: bigint;

	@BigIntIdValidation()
	spaceId!: bigint;
}
