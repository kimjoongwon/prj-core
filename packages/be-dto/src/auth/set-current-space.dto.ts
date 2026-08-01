import { ULIDField } from "@cocrepo/decorator";
import { Expose } from "class-transformer";

export class SetCurrentSpaceDto {
	@ULIDField({
		description: "현재 선택할 Tenant ID",
		example: "01J00000000000000000000000",
	})
	@Expose()
	tenantId: string;
}
