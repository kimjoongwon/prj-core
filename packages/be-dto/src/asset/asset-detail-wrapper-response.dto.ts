import { ClassField } from "@cocrepo/decorator";

import { AssetDetailResponseDto } from "./asset-detail-response.dto";

/**
 * 에셋 상세 조회 래퍼 응답 DTO
 */
export class AssetDetailWrapperResponseDto {
	@ClassField(() => AssetDetailResponseDto, {
		description: "에셋 상세 정보",
	})
	data!: AssetDetailResponseDto;
}
