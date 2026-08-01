import { ULIDField } from "@cocrepo/decorator";

export class GrantIdpAccountAccessDto {
	@ULIDField({ description: "권한을 부여할 Space ID" })
	spaceId!: string;

	@ULIDField({ description: "부여할 Role ID" })
	roleId!: string;
}
