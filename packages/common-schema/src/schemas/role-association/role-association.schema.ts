import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** RoleAssociation의 DB 필드 타입과 공통 검증입니다. */
export class RoleAssociationSchema
	extends AbstractSchema
{
	id!: string;

	@BigIntIdValidation()
	roleSeq!: bigint;

	@BigIntIdValidation()
	groupSeq!: bigint;
}
