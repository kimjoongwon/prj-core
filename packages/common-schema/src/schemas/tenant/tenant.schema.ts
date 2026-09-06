import type { Tenant as PrismaTenant } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Tenant의 DB 필드 타입과 공통 검증입니다. */
export class TenantSchema extends AbstractSchema implements PrismaTenant {
	tenantId!: PrismaTenant["tenantId"];

	@BigIntIdValidation()
	userId!: PrismaTenant["userId"];

	@BigIntIdValidation()
	spaceId!: PrismaTenant["spaceId"];

	@BigIntIdValidation()
	roleId!: PrismaTenant["roleId"];
}
