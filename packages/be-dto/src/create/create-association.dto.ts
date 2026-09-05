import { UserAssociation } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateAssociationDto extends PickType(UserAssociation, [
	"userId",
	"groupId",
] as const) {}
