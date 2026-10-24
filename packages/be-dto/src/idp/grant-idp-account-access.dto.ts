import { BigIntIdField } from "@cocrepo/decorator/field";

export class GrantIdpAccountAccessDto {
	@BigIntIdField({ description: "권한을 부여할 Space ID" })
	spaceSeq!: bigint;

	@BigIntIdField({ description: "부여할 Role ID" })
	roleSeq!: bigint;
}
