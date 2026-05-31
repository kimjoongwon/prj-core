import { ClassField } from "@cocrepo/decorator";
import type { AssetDto } from "../asset/asset.dto";
import { DerivativeDto } from "./derivative.dto";

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
