import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Ability } from "./ability.entity";
import { AbstractEntity } from "./abstract.entity";
import type { Policy } from "./policy.entity";
/** Policy와 Ability를 연결하는 구성 링크입니다. */
export class PolicyEntry extends AbstractEntity {
	@Exclude({ toPlainOnly: true })
	policyEntryId!: string;
	@BigIntIdField({ description: "PolicyEntry ID" })
	declare id: bigint;

	@BigIntIdField({ description: "Policy ID" })
	policyId!: bigint;

	@BigIntIdField({ description: "Ability ID" })
	abilityId!: bigint;

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
