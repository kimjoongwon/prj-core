import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { UserAssociationDto } from "../user-association.dto";

export class CreateAssociationDto extends OmitType(UserAssociationDto, [
	...COMMON_ENTITY_FIELDS,
]) {}
