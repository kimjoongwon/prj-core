import { ClassField } from "@cocrepo/decorator";
import { DerivativeDto } from "./derivative.dto";
import type { AssetDto } from "../asset/asset.dto";

/**
 * 파생 리소스 상세 응답 DTO (관계 포함)
 */
export class DerivativeDetailResponseDto extends DerivativeDto {
	@ClassField(() => require("../asset/asset.dto").AssetDto, {
		required: false,
		description: "원본 에셋",
	})
	asset?: AssetDto;
}

/**
 * 파생 리소스 상세 조회 래퍼 응답 DTO
 */
export class DerivativeDetailWrapperResponseDto {
	@ClassField(() => DerivativeDetailResponseDto, {
		description: "파생 리소스 상세 정보",
	})
	data!: DerivativeDetailResponseDto;
}
