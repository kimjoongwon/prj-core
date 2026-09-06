import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	DateField,
	EnumField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { TenantAccessRequestStatus } from "@cocrepo/enum";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Role } from "./role.entity";
import { Space } from "./space.entity";
import { Tenant } from "./tenant.entity";
import { User } from "./user.entity";
export class TenantAccessRequest extends AbstractEntity {
	@Exclude({ toPlainOnly: true })
	tenantAccessRequestId!: string;
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

	@ClassField(() => User, { required: false })
	requester?: User;

	@ClassField(() => User, { required: false, nullable: true })
	reviewer?: User | null;

	@ClassField(() => Space, { required: false })
	space?: Space;

	@ClassField(() => Role, { required: false })
	requestedRole?: Role;

	@ClassField(() => Role, { required: false, nullable: true })
	previousRole?: Role | null;

	@ClassField(() => Tenant, { required: false, nullable: true })
	appliedTenant?: Tenant | null;
}
