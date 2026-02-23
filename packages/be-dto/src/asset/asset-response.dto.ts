import { ClassField, EnumField, NumberField, StringField } from "@cocrepo/decorator";
import { AssetStatus } from "@cocrepo/prisma";
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

/**
 * 에셋 목록 통계 정보
 */
export class AssetStatsDto {
	@NumberField({ description: "전체 에셋 수" })
	total!: number;

	@NumberField({ description: "이미지 수" })
	images!: number;

	@NumberField({ description: "비디오 수" })
	videos!: number;

	@NumberField({ description: "문서 수" })
	documents!: number;

	@NumberField({ description: "전체 용량 (bytes)" })
	totalSize!: number;
}

/**
 * 에셋 목록 페이지네이션 메타 정보
 */
export class AssetPaginationMetaDto {
	@NumberField({ description: "전체 에셋 수" })
	total!: number;

	@NumberField({ description: "건너뛴 항목 수 (offset)" })
	skip!: number;

	@NumberField({ description: "조회 항목 수" })
	take!: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages!: number;
}

/**
 * 에셋 일괄 삭제 DTO
 */
export class BatchDeleteAssetsDto {
	@StringField({
		each: true,
		description: "삭제할 에셋 ID 목록",
	})
	assetIds!: string[];
}

/**
 * 에셋 상태 변경 DTO
 */
export class UpdateAssetStatusDto {
	@EnumField(() => AssetStatus, {
		description: "변경할 상태 (UPLOADING, READY, FAILED)",
	})
	status!: AssetStatus;
}
