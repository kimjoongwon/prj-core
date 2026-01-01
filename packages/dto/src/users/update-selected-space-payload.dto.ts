import { UUIDField } from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 선택된 Space 변경 요청 DTO
 *
 * 사용자가 현재 작업 중인 Space를 변경할 때 사용합니다.
 */
export class UpdateSelectedSpacePayloadDto {
	@ApiProperty({
		description: "변경할 Space ID",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@UUIDField({ description: "변경할 Space ID" })
	spaceId: string;
}
