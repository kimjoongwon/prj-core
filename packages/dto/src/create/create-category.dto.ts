import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { CategoryDto } from "../category.dto";

export class CreateCategoryDto extends OmitType(CategoryDto, [
	...COMMON_ENTITY_FIELDS,
	"children",
	"parent",
]) {}
