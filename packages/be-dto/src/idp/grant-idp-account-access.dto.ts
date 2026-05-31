import { UUIDField } from "@cocrepo/decorator";

export class GrantIdpAccountAccessDto {
	@UUIDField({ description: "권한을 부여할 Space ID" })
	spaceId!: string;

	@UUIDField({ description: "부여할 Role ID" })
	roleId!: string;
}
