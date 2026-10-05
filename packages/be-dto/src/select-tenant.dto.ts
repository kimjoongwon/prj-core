import { BigIntIdField } from "@cocrepo/decorator/field";
import { Expose } from "class-transformer";

export class SelectTenantDto {
	@BigIntIdField({
		description: "선택된 테넌트 ID",
		example: "1",
	})
	@Expose()
	selectedTenantId: bigint;
}
