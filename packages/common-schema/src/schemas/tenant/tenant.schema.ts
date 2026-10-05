import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Tenant의 DB 필드 타입과 공통 검증입니다. */
export class TenantSchema extends AbstractSchema {
	tenantId!: string;

	@BigIntIdValidation()
	userId!: bigint;

	@BigIntIdValidation()
	spaceId!: bigint;

	@BigIntIdValidation()
	roleId!: bigint;
}
