import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { RoleClassification } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { CategoryDto } from "./category.dto";
import { RoleDto } from "./role.dto";

export class RoleClassificationDto
	extends AbstractDto
	implements DomainEntityModel<RoleClassification, "roleClassificationId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly roleClassificationId?: never;

	@BigIntIdField()
	roleId: bigint;

	@BigIntIdField()
	categoryId: bigint;

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;

	@ClassField(() => RoleDto, { required: false })
	role?: RoleDto;
}
