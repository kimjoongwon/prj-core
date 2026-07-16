import {
	ClassField,
	EnumField,
	StringField,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { type Category, CategoryTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class CategoryDto extends AbstractDto implements Category {
	@UUIDField()
	spaceId: string;

	@UUIDFieldOptional({ nullable: true })
	createdById: string | null;

	@StringField({ default: "" })
	name: string;

	@EnumField(() => CategoryTypes, { default: CategoryTypes.Role })
	type: CategoryTypes;

	@UUIDField({ nullable: true, default: null })
	parentId: string | null;

	@ClassField(() => CategoryDto, { required: false })
	parent?: CategoryDto;

	@ClassField(() => CategoryDto, { each: true, required: false })
	children?: CategoryDto[];
}
