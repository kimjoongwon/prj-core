import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant/entity-common-fields";
import { UserDto } from "../user.dto";

export class CreateUserDto extends OmitType(UserDto, [
	...COMMON_ENTITY_FIELDS,
	"associations",
	"tenants",
	"profiles",
	"classification",
]) {}
