import { StringFieldOptional } from "@cocrepo/decorator/field";

export class ReviewTenantAccessRequestDto {
	@StringFieldOptional({
		description: "승인/반려 코멘트",
		maxLength: 1000,
		nullable: true,
	})
	reviewComment?: string | null;
}
