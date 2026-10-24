import { SpaceAssociation } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateSpaceAssociationDto extends PickType(SpaceAssociation, [
	"spaceSeq",
	"groupSeq",
] as const) {}
