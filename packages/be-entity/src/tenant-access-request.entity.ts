import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	DateFieldMetadata,
	EnumFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { TenantAccessRequestStatus } from "@cocrepo/enum";
import { TenantAccessRequestSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Role } from "./role.entity";
import { Space } from "./space.entity";
import { Tenant } from "./tenant.entity";
import { User } from "./user.entity";
@AbstractEntityFields()
export class TenantAccessRequest extends TenantAccessRequestSchema {
	@Exclude({ toPlainOnly: true })
	declare tenantAccessRequestId: TenantAccessRequestSchema["tenantAccessRequestId"];
	@BigIntIdFieldMetadata({ description: "신청자 ID" })
	declare requesterId: TenantAccessRequestSchema["requesterId"];

	@BigIntIdFieldMetadata({ description: "신청 대상 Space ID" })
	declare spaceId: TenantAccessRequestSchema["spaceId"];

	@BigIntIdFieldMetadata({ description: "희망 Role ID" })
	declare requestedRoleId: TenantAccessRequestSchema["requestedRoleId"];

	@BigIntIdFieldOptionalMetadata({
		description: "신청 시점 기존 Role ID",
		nullable: true,
	})
	declare previousRoleId: TenantAccessRequestSchema["previousRoleId"];

	@StringFieldOptionalMetadata({
		description: "신청 사유",
		nullable: true,
	})
	declare reason: TenantAccessRequestSchema["reason"];

	@EnumFieldMetadata(() => TenantAccessRequestStatus, {
		description: "신청 상태",
	})
	declare status: TenantAccessRequestSchema["status"];

	@BigIntIdFieldOptionalMetadata({
		description: "검토자 ID",
		nullable: true,
	})
	declare reviewerId: TenantAccessRequestSchema["reviewerId"];

	@StringFieldOptionalMetadata({
		description: "검토 코멘트",
		nullable: true,
	})
	declare reviewComment: TenantAccessRequestSchema["reviewComment"];

	@DateFieldMetadata({
		description: "검토 시각",
		nullable: true,
	})
	declare reviewedAt: TenantAccessRequestSchema["reviewedAt"];

	@BigIntIdFieldOptionalMetadata({
		description: "승인 적용 Tenant ID",
		nullable: true,
	})
	declare appliedTenantId: TenantAccessRequestSchema["appliedTenantId"];

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
