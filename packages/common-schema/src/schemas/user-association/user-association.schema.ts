import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** UserAssociation의 DB 필드 타입과 공통 검증입니다. */
export class UserAssociationSchema
	extends AbstractSchema
{
	userAssociationId!: string;

	@BigIntIdValidation()
	userId!: bigint;

	@BigIntIdValidation()
	groupId!: bigint;
}
