import {
	ClassField,
	EnumField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator";
import { Category, CategoryTypes } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class CategoryDto extends AbstractDto implements Category {
	@UUIDField()
	tenantId: string;

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
