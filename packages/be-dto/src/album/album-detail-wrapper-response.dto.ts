import { ClassField } from "@cocrepo/decorator";

import { AlbumDetailResponseDto } from "./album-detail-response.dto";

/**
 * 앨범 상세 조회 래퍼 응답 DTO
 */
export class AlbumDetailWrapperResponseDto {
	@ClassField(() => AlbumDetailResponseDto, {
		description: "앨범 상세 정보",
	})
	data!: AlbumDetailResponseDto;
}
