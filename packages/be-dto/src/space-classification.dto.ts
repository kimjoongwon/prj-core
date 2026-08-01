import { ClassField, ULIDField } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { SpaceClassification } from "@cocrepo/prisma";
import { AbstractDto, CategoryDto, SpaceDto } from ".";

export class SpaceClassificationDto
	extends AbstractDto
	implements DomainEntityModel<SpaceClassification>
{
	@ULIDField()
	spaceId: string;

	@ULIDField()
	categoryId: string;

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;
}
