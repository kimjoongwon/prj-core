import { ClassField } from "@cocrepo/decorator";
import { FolderDto } from "./folder.dto";

/**
 * 폴더 상세 응답 DTO
 */
export class FolderDetailResponseDto extends FolderDto {
	// FolderDto에 모든 필드가 포함됨
}

/**
 * 폴더 상세 조회 래퍼 응답 DTO
 */
export class FolderDetailWrapperResponseDto {
	@ClassField(() => FolderDetailResponseDto, {
		description: "폴더 상세 정보",
	})
	data!: FolderDetailResponseDto;
}
