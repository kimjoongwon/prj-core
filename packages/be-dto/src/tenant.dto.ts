import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Tenant } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { RoleDto } from "./role.dto";
import { SpaceDto } from "./space.dto";
import { UserDto } from "./user.dto";

export class TenantDto
	extends AbstractDto
	implements DomainEntityModel<Tenant, "tenantId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly tenantId?: never;

	@BigIntIdField()
	roleId: bigint;

	@BigIntIdField()
	userId: bigint;

	@BigIntIdField()
	spaceId: bigint;

	@ClassField(() => UserDto, { required: false })
	user?: UserDto;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;

	@ClassField(() => RoleDto, { required: false })
	role?: RoleDto;
}
