import { UUIDField } from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 선택된 Space 변경 응답 DTO
 *
 * Space 변경 후 업데이트된 selectedSpaceId를 반환합니다.
 */
export class UpdateSelectedSpaceResponseDto {
	@ApiProperty({
		description: "업데이트된 선택 Space ID",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@UUIDField({ description: "업데이트된 선택 Space ID" })
	selectedSpaceId: string;
}
