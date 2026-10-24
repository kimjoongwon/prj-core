import { SpaceClassification } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateSpaceClassificationDto extends PickType(
	SpaceClassification,
	["spaceSeq", "categorySeq"] as const,
) {}
