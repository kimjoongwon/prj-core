import { BigIntIdFieldMetadata, ClassField } from "@cocrepo/decorator/field";
import { PolicyEntrySchema } from "@cocrepo/schema";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Ability } from "./ability.entity";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import type { Policy } from "./policy.entity";
/** Policy와 Ability를 연결하는 구성 링크입니다. */
@AbstractEntityFields()
export class PolicyEntry extends PolicyEntrySchema {
	@Exclude({ toPlainOnly: true })
	declare policyEntryId: PolicyEntrySchema["policyEntryId"];
	@BigIntIdFieldMetadata({ description: "PolicyEntry ID" })
	declare id: bigint;

	@BigIntIdFieldMetadata({ description: "Policy ID" })
	declare policyId: PolicyEntrySchema["policyId"];

	@BigIntIdFieldMetadata({ description: "Ability ID" })
	declare abilityId: PolicyEntrySchema["abilityId"];

	@ApiProperty({
		description: "생성 일시",
		example: "2026-01-01T00:00:00.000Z",
	})
	declare createdAt: Date;

	@ApiProperty({
		description: "수정 일시",
		example: "2026-01-01T00:00:00.000Z",
		nullable: true,
	})
	declare updatedAt: Date | null;

	@ApiProperty({
		description: "삭제 일시",
		example: "2026-01-01T00:00:00.000Z",
		nullable: true,
	})
	declare removedAt: Date | null;
	policy?: Policy;
	@ClassField(() => Ability, {
		required: false,
		description: "연결된 Ability 상세 정보",
	})
	ability?: Ability;
}
