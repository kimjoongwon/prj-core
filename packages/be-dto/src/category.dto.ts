import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	EnumField,
	StringField,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import { type Category, CategoryTypes } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";

export class CategoryDto
	extends AbstractDto
	implements DomainEntityModel<Category, "categoryId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly categoryId?: never;

	@BigIntIdField()
	spaceId: bigint;

	@BigIntIdFieldOptional({ nullable: true })
	createdById: bigint | null;

	@StringField({ default: "" })
	name: string;

	@EnumField(() => CategoryTypes, { default: CategoryTypes.Role })
	type: CategoryTypes;

	@BigIntIdField({ nullable: true, default: null })
	parentId: bigint | null;

	@ClassField(() => CategoryDto, { required: false })
	parent?: CategoryDto;

	@ClassField(() => CategoryDto, { each: true, required: false })
	children?: CategoryDto[];
}
