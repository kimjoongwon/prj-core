import { BigIntIdField } from "@cocrepo/decorator/field";

export class GrantIdpAccountAccessDto {
	@BigIntIdField({ description: "권한을 부여할 Space ID" })
	spaceId!: bigint;

	@BigIntIdField({ description: "부여할 Role ID" })
	roleId!: bigint;
}
