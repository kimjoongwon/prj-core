import { SpaceClassification } from "@prisma/client";
import { ClassField, UUIDField } from "../decorator";
import { AbstractDto, CategoryDto, SpaceDto } from ".";

export class SpaceClassificationDto
	extends AbstractDto
	implements SpaceClassification
{
	@UUIDField()
	spaceId: string;

	@UUIDField()
	categoryId: string;

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;
}
