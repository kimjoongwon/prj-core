import {
	DateField,
	DateFieldOptional,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";

export class IdpAccountAccessGrantDto {
	@ULIDField({ description: "테넌트 ID" })
	tenantId!: string;

	@ULIDField({ description: "접근 대상 Space ID" })
	spaceId!: string;

	@StringField({ description: "접근 대상 Space 이름" })
	spaceName!: string;

	@StringFieldOptional({
		nullable: true,
		description: "접근 대상 Space 라벨",
	})
	spaceLabel!: string | null;

	@ULIDField({ description: "부여된 Role ID" })
	roleId!: string;

	@StringField({ description: "부여된 Role 식별자" })
	roleName!: string;

	@StringFieldOptional({
		nullable: true,
		description: "부여된 Role 표시명",
	})
	roleDisplayName!: string | null;

	@DateField({ description: "권한 부여일" })
	grantedAt!: Date;

	@DateFieldOptional({ nullable: true, description: "권한 변경일" })
	updatedAt!: Date | null;
}
