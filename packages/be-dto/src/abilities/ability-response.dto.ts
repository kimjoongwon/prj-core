import { UUIDField } from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ActionResponseDto } from "./action-response.dto";
import { SubjectResponseDto } from "./subject-response.dto";

/**
 * Ability 응답 DTO (CASL ABAC 기반)
 *
 * @description
 * DDD 원칙에 따라 Ability는 Role + Subject + Action + fields의 연결만 담당합니다.
 * 마스킹 등의 설정은 Action.config에서 가져옵니다.
 */
export class AbilityResponseDto {
	@UUIDField({ description: "Ability ID" })
	@Expose()
	id!: string;

	@UUIDField({ description: "Action ID" })
	@Expose()
	actionId!: string;

	@ApiProperty({
		description: "Action 상세 정보",
		type: ActionResponseDto,
		required: false,
	})
	@Expose()
	@Type(() => ActionResponseDto)
	action?: ActionResponseDto;

	@UUIDField({ description: "Subject ID" })
	@Expose()
	subjectId!: string;

	@ApiProperty({
		description: "Subject 상세 정보",
		type: SubjectResponseDto,
		required: false,
	})
	@Expose()
	@Type(() => SubjectResponseDto)
	subject?: SubjectResponseDto;

	@ApiProperty({
		description: "대상 필드 목록",
		example: ["email", "name"],
		type: [String],
	})
	@Expose()
	fields!: string[];

	@ApiProperty({
		description: "권한 조건 (JSON 형식)",
		example: { id: "${user.id}" },
		required: false,
		nullable: true,
	})
	@Expose()
	conditions?: Record<string, unknown> | null;

	@ApiProperty({
		description: "거부 권한 여부 (true: cannot, false: can)",
		example: false,
	})
	@Expose()
	inverted!: boolean;

	@ApiProperty({
		description: "거부 사유",
		example: "관리자만 삭제할 수 있습니다",
		required: false,
		nullable: true,
	})
	@Expose()
	reason?: string | null;

	@ApiProperty({
		description: "권한 이름 (고유 식별자)",
		example: "Read User Email Masked",
	})
	@Expose()
	name!: string;

	@ApiProperty({
		description: "권한 설명",
		example: "사용자 이메일을 마스킹하여 조회합니다",
		required: false,
		nullable: true,
	})
	@Expose()
	description?: string | null;

	@ApiProperty({
		description: "생성 일시",
		example: "2025-01-01T00:00:00.000Z",
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		description: "수정 일시",
		example: "2025-01-01T00:00:00.000Z",
		required: false,
		nullable: true,
	})
	@Expose()
	updatedAt?: Date | null;
}
