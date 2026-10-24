import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** SpaceAssociation의 DB 필드 타입과 공통 검증입니다. */
export class SpaceAssociationSchema
	extends AbstractSchema
{
	id!: string;

	@BigIntIdValidation()
	spaceSeq!: bigint;

	@BigIntIdValidation()
	groupSeq!: bigint;
}
