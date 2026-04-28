import { StringFieldOptional, UUIDField } from "@cocrepo/decorator";

export class CreateTenantAccessRequestDto {
	@UUIDField({
		description: "신청 대상 Space ID",
	})
	spaceId!: string;

	@UUIDField({
		description: "희망 Role ID",
	})
	requestedRoleId!: string;

	@StringFieldOptional({
		description: "신청 사유",
		maxLength: 1000,
		nullable: true,
	})
	reason?: string | null;
}
