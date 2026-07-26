import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class SyncPolicyAbilitiesDto {
	@ApiProperty({
		description:
			"Policy에 연결할 Ability ID 목록입니다. 전체 동기화 방식으로 반영됩니다.",
		type: [String],
		example: ["550e8400-e29b-41d4-a716-446655440001"],
	})
	@IsArray({ message: "abilityIds는 배열이어야 합니다" })
	@IsUUID("4", { each: true, message: "유효한 UUID 형식이 아닙니다" })
	abilityIds!: string[];
}
