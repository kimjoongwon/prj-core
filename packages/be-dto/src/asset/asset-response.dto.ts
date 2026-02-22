import { ClassField } from "@cocrepo/decorator";
import { AssetDto } from "./asset.dto";

/**
 * 에셋 상세 응답 DTO
 */
export class AssetDetailResponseDto extends AssetDto {
	// AssetDto에 모든 필드가 포함됨
}

/**
 * 에셋 상세 조회 래퍼 응답 DTO
 */
export class AssetDetailWrapperResponseDto {
	@ClassField(() => AssetDetailResponseDto, {
		description: "에셋 상세 정보",
	})
	data!: AssetDetailResponseDto;
}
