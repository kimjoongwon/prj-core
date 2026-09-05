import { SpaceClassification } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateSpaceClassificationDto extends PartialType(
	PickType(SpaceClassification, ["spaceId", "categoryId"] as const),
) {}
