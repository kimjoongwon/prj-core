import { ULIDField } from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { ActionConfigDto } from "../action-config.dto";

/**
 * Action 응답 DTO
 *
 * @description
 * CASL Action 정의를 표현합니다.
 * DDD 원칙에 따라 Action은 행위의 완전한 정의를 가집니다.
 */
export class ActionResponseDto {
	@ULIDField({ description: "Action ID" })
	@Expose()
	id!: string;

	@ApiProperty({
		description: "Action 이름 (create, read, read:masked:email 등)",
		example: "read:masked:email",
	})
	@Expose()
	name!: string;

	@ApiProperty({
		description: "표시명",
		example: "이메일 마스킹 조회",
		required: false,
		nullable: true,
	})
	@Expose()
	displayName?: string | null;

	@ApiProperty({
		description: "설명",
		example: "이메일을 마스킹하여 조회합니다",
		required: false,
		nullable: true,
	})
	@Expose()
	description?: string | null;

	@ApiProperty({
		description: "그룹 (crud, visibility, bulk, workflow)",
		example: "visibility",
		required: false,
		nullable: true,
	})
	@Expose()
	group?: string | null;

	@ApiProperty({
		description: "정렬 순서",
		example: 10,
	})
	@Expose()
	order!: number;

	@ApiProperty({
		description: "시스템 여부 (시스템 기본 Action인지)",
		example: true,
	})
	@Expose()
	isSystem!: boolean;

	@ApiProperty({
		description: "Action 설정 (마스킹, 포맷팅 등)",
		type: ActionConfigDto,
		required: false,
		nullable: true,
	})
	@Expose()
	@Type(() => ActionConfigDto)
	config?: ActionConfigDto | null;

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
