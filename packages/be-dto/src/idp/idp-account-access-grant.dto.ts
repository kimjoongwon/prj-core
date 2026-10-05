import {
	BigIntIdField,
	DateField,
	DateFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

export class IdpAccountAccessGrantDto {
	@BigIntIdField({ description: "테넌트 ID" })
	tenantId!: bigint;

	@BigIntIdField({ description: "접근 대상 Space ID" })
	spaceId!: bigint;

	@StringField({ description: "접근 대상 Space 이름" })
	spaceName!: string;

	@StringFieldOptional({
		nullable: true,
		description: "접근 대상 Space 라벨",
	})
	spaceLabel!: string | null;

	@BigIntIdField({ description: "부여된 Role ID" })
	roleId!: bigint;

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
