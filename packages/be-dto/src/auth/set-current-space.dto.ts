import { ULIDField } from "@cocrepo/decorator/field";
import { Expose } from "class-transformer";

export class SetCurrentSpaceDto {
	@ULIDField({
		description: "현재 선택할 Tenant 공개 ID (ULID)",
		example: "01JTENANT00000000000000000K",
	})
	@Expose()
	tenantId: string;
}
