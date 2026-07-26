import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

/** Policy에 포함할 Ability 항목 입력입니다. */
export class SyncPolicyEntryItemDto {
	@ApiProperty({
		description: "Policy에 포함할 Ability ID",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@IsNotEmpty({ message: "Ability ID를 입력해주세요" })
	@IsUUID("4", { message: "유효한 UUID 형식이 아닙니다" })
	abilityId!: string;
}
