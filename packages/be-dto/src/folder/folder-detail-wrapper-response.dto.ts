import { ClassField } from "@cocrepo/decorator/field";

import { FolderDetailResponseDto } from "./folder-detail-response.dto";

/**
 * 폴더 상세 조회 래퍼 응답 DTO
 */
export class FolderDetailWrapperResponseDto {
	@ClassField(() => FolderDetailResponseDto, {
		description: "폴더 상세 정보",
	})
	data!: FolderDetailResponseDto;
}
