import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant";
import { GroundDto } from "../ground.dto";

export class CreateGroundDto extends OmitType(GroundDto, [
	...COMMON_ENTITY_FIELDS,
	"space",
]) {}
