import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { SpaceClassification } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { CategoryDto } from "./category.dto";
import { SpaceDto } from "./space.dto";

export class SpaceClassificationDto
	extends AbstractDto
	implements DomainEntityModel<SpaceClassification, "spaceClassificationId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly spaceClassificationId?: never;

	@BigIntIdField()
	spaceId: bigint;

	@BigIntIdField()
	categoryId: bigint;

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;
}
