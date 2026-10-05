import { Ability } from "@cocrepo/entity";
import { ApiProperty } from "@nestjs/swagger";
import { EntityResponseType } from "../mapped-types";
import { ActionResponseDto } from "./action-response.dto";
import { SubjectResponseDto } from "./subject-response.dto";

export class AbilityResponseDto extends EntityResponseType(Ability, {
	pick: [
		"id",
		"actionId",
		"action",
		"subjectId",
		"subject",
		"inverted",
		"name",
		"createdAt",
		"updatedAt",
	] as const,
	relations: {
		action: () => ActionResponseDto,
		subject: () => SubjectResponseDto,
	},
	extraFields: ["fields", "conditions", "reason", "description"],
}) {
	declare action?: ActionResponseDto;
	declare subject?: SubjectResponseDto;
	@ApiProperty({
		description: "대상 필드 목록",
		example: ["email", "name"],
		type: [String],
	})
	fields!: string[];

	@ApiProperty({
		description: "권한 조건 (JSON 형식)",
		example: { id: "${user.id}" },
		nullable: true,
	})
	conditions!: Record<string, unknown> | null;

	@ApiProperty({
		description: "거부 사유",
		example: "관리자만 삭제할 수 있습니다",
		nullable: true,
	})
	reason!: string | null;

	@ApiProperty({
		description: "권한 설명",
		example: "사용자 이메일을 마스킹하여 조회합니다",
		nullable: true,
	})
	description!: string | null;
}
