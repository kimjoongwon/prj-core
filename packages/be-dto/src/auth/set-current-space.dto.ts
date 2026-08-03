import { BigIntIdField } from "@cocrepo/decorator/field";
import { Expose } from "class-transformer";

export class SetCurrentSpaceDto {
	@BigIntIdField({
		description: "현재 선택할 Tenant ID",
		example: "1",
	})
	@Expose()
	tenantId: bigint;
}
