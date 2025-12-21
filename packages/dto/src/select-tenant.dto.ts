import { Expose } from "class-transformer";
import { UUIDField } from "@cocrepo/decorator";

export class SelectTenantDto {
	@UUIDField({
		description: "선택된 테넌트 ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@Expose()
	selectedTenantId: string;
}
