import { ULIDField } from "@cocrepo/decorator";
import { Expose } from "class-transformer";

export class SelectTenantDto {
	@ULIDField({
		description: "선택된 테넌트 ID",
		example: "01J00000000000000000000000",
	})
	@Expose()
	selectedTenantId: string;
}
