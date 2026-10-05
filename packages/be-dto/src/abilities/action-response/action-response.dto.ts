import { Action } from "@cocrepo/entity";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { EntityResponseType } from "../../mapped-types";
import { ActionConfigDto } from "../action-config.dto";

export class ActionResponseDto extends EntityResponseType(Action, {
	pick: ["id", "name", "order", "createdAt", "updatedAt"] as const,

	extraFields: ["displayName", "description", "group", "config"],
}) {
	@ApiProperty({
		description: "표시명",
		example: "이메일 마스킹 조회",
		nullable: true,
	})
	displayName!: string | null;

	@ApiProperty({
		description: "설명",
		example: "이메일을 마스킹하여 조회합니다",
		nullable: true,
	})
	description!: string | null;

	@ApiProperty({
		description: "그룹 (crud, visibility, bulk, workflow)",
		example: "visibility",
		nullable: true,
	})
	group!: string | null;

	@ApiProperty({
		description: "Action 설정 (마스킹, 포맷팅 등)",
		type: ActionConfigDto,
		nullable: true,
	})
	@Type(() => ActionConfigDto)
	config!: ActionConfigDto | null;
}
