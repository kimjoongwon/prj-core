import { Space } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateSpaceDto extends PickType(Space, [
	"tenantId",
	"contentLanguageCode",
] as const) {}
