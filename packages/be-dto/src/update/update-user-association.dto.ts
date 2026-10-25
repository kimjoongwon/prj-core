import { UserAssociation } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateUserAssociationDto extends PartialType(
	PickType(UserAssociation, ["userSeq", "groupSeq"] as const),
) {}
