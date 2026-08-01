import {
	ClassField,
	EnumField,
	StringField,
	ULIDField,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import { type Category, CategoryTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class CategoryDto
	extends AbstractDto
	implements DomainEntityModel<Category>
{
	@ULIDField()
	spaceId: string;

	@ULIDFieldOptional({ nullable: true })
	createdById: string | null;

	@StringField({ default: "" })
	name: string;

	@EnumField(() => CategoryTypes, { default: CategoryTypes.Role })
	type: CategoryTypes;

	@ULIDField({ nullable: true, default: null })
	parentId: string | null;

	@ClassField(() => CategoryDto, { required: false })
	parent?: CategoryDto;

	@ClassField(() => CategoryDto, { each: true, required: false })
	children?: CategoryDto[];
}
