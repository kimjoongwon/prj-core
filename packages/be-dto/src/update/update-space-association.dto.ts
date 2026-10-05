import { SpaceAssociation } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateSpaceAssociationDto extends PartialType(
	PickType(SpaceAssociation, ["spaceId", "groupId"] as const),
) {}
