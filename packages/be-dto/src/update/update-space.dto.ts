import { Space } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateSpaceDto extends PartialType(
	PickType(Space, ["tenantId", "contentLanguageCode"] as const),
) {}
