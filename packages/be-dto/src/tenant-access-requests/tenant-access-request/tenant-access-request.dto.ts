import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	DateField,
	EnumField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { TenantAccessRequest } from "@cocrepo/prisma";
import { TenantAccessRequestStatus } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "../../abstract.dto";
import { RoleDto } from "../../role.dto";
import { SpaceDto } from "../../space.dto";
import { TenantDto } from "../../tenant.dto";
import { UserDto } from "../../user.dto";

export class TenantAccessRequestDto
	extends AbstractDto
	implements DomainEntityModel<TenantAccessRequest, "tenantAccessRequestId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly tenantAccessRequestId?: never;

	@BigIntIdField({ description: "신청자 ID" })
	requesterId!: bigint;

	@BigIntIdField({ description: "신청 대상 Space ID" })
	spaceId!: bigint;

	@BigIntIdField({ description: "희망 Role ID" })
	requestedRoleId!: bigint;

	@BigIntIdFieldOptional({
		description: "신청 시점 기존 Role ID",
		nullable: true,
	})
	previousRoleId!: bigint | null;

	@StringFieldOptional({
		description: "신청 사유",
		nullable: true,
	})
	reason!: string | null;

	@EnumField(() => TenantAccessRequestStatus, {
		description: "신청 상태",
	})
	status!: TenantAccessRequestStatus;

	@BigIntIdFieldOptional({
		description: "검토자 ID",
		nullable: true,
	})
	reviewerId!: bigint | null;

	@StringFieldOptional({
		description: "검토 코멘트",
		nullable: true,
	})
	reviewComment!: string | null;

	@DateField({
		description: "검토 시각",
		nullable: true,
	})
	reviewedAt!: Date | null;

	@BigIntIdFieldOptional({
		description: "승인 적용 Tenant ID",
		nullable: true,
	})
	appliedTenantId!: bigint | null;

	@ClassField(() => UserDto, { required: false })
	requester?: UserDto;

	@ClassField(() => UserDto, { required: false, nullable: true })
	reviewer?: UserDto | null;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;

	@ClassField(() => RoleDto, { required: false })
	requestedRole?: RoleDto;

	@ClassField(() => RoleDto, { required: false, nullable: true })
	previousRole?: RoleDto | null;

	@ClassField(() => TenantDto, { required: false, nullable: true })
	appliedTenant?: TenantDto | null;
}
