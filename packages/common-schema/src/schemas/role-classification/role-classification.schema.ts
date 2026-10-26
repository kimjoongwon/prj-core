import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** RoleClassification의 DB 필드 타입과 공통 검증입니다. */
export class RoleClassificationSchema
	extends AbstractSchema
{
	roleClassificationId!: string;

	@BigIntIdValidation()
	categoryId!: bigint;

	@BigIntIdValidation()
	roleId!: bigint;
}
