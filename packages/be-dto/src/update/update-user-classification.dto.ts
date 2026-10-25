import { UserClassification } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateUserClassificationDto extends PartialType(
	PickType(UserClassification, ["categorySeq", "userSeq"] as const),
) {}
