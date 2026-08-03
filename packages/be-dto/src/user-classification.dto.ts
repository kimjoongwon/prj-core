import { BigIntIdFieldOptional, ClassField } from "@cocrepo/decorator/field";
import type { DomainEntityModel, UserClassification } from "@cocrepo/entity";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { CategoryDto } from "./category.dto";
import { UserDto } from "./user.dto";

export class UserClassificationDto
	extends AbstractDto
	implements DomainEntityModel<UserClassification, "userClassificationId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly userClassificationId?: never;

	@BigIntIdFieldOptional()
	categoryId: bigint;

	@BigIntIdFieldOptional()
	userId: bigint;

	@ClassField(() => UserDto, { required: false })
	user?: UserDto[];

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;
}
