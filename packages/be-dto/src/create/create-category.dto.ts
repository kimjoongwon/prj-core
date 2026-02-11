import { OmitType } from "@nestjs/swagger";
import { CategoryDto } from "../category.dto";
import { COMMON_ENTITY_FIELDS } from "../constant";

export class CreateCategoryDto extends OmitType(CategoryDto, [
	...COMMON_ENTITY_FIELDS,
	"children",
	"parent",
]) {}
