import {
	ClassField,
	DateField,
	EnumField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { TenantAccessRequest } from "@cocrepo/prisma";
import { TenantAccessRequestStatus } from "@cocrepo/prisma";
import { AbstractDto } from "../../abstract.dto";
import { RoleDto } from "../../role.dto";
import { SpaceDto } from "../../space.dto";
import { TenantDto } from "../../tenant.dto";
import { UserDto } from "../../user.dto";

export class TenantAccessRequestDto
	extends AbstractDto
	implements TenantAccessRequest
{
	@UUIDField({ description: "신청자 ID" })
	requesterId!: string;

	@UUIDField({ description: "신청 대상 Space ID" })
	spaceId!: string;

	@UUIDField({ description: "희망 Role ID" })
	requestedRoleId!: string;

	@UUIDFieldOptional({
		description: "신청 시점 기존 Role ID",
		nullable: true,
	})
	previousRoleId!: string | null;

	@StringFieldOptional({
		description: "신청 사유",
		nullable: true,
	})
	reason!: string | null;

	@EnumField(() => TenantAccessRequestStatus, {
		description: "신청 상태",
	})
	status!: TenantAccessRequestStatus;

	@UUIDFieldOptional({
		description: "검토자 ID",
		nullable: true,
	})
	reviewerId!: string | null;

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

	@UUIDFieldOptional({
		description: "승인 적용 Tenant ID",
		nullable: true,
	})
	appliedTenantId!: string | null;

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
