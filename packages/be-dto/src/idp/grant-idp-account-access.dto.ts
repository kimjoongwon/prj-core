import { ULIDField } from "@cocrepo/decorator/field";

export class GrantIdpAccountAccessDto {
	@ULIDField({ description: "권한을 부여할 Space 공개 ID (ULID)" })
	spaceId!: string;

	@ULIDField({ description: "부여할 Role 공개 ID (ULID)" })
	roleId!: string;
}
