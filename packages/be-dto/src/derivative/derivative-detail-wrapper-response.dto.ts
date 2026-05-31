import { ClassField } from "@cocrepo/decorator";

import { DerivativeDetailResponseDto } from "./derivative-detail-response.dto";

/**
 * 파생 리소스 상세 조회 래퍼 응답 DTO
 */
export class DerivativeDetailWrapperResponseDto {
	@ClassField(() => DerivativeDetailResponseDto, {
		description: "파생 리소스 상세 정보",
	})
	data!: DerivativeDetailResponseDto;
}
