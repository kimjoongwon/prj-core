import { RoleClassification as RoleClassificationEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { RoleClassificationDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { Role } from "./role.entity";

@UseDto(RoleClassificationDto)
export class RoleClassification
	extends AbstractEntity<RoleClassificationDto>
	implements RoleClassificationEntity
{
	categoryId: string;
	roleId: string;

	category?: Category;
	role?: Role;
}
