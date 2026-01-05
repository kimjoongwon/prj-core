import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	Min,
	ValidateNested,
} from "class-validator";
import { type SortDirection, UIConfigScopeEnum } from "./ui-config.types";

/**
 * 정렬 설정 저장 DTO
 */
export class SaveSortConfigDto {
	@ApiProperty({
		description: "정렬 기준 필드명",
		example: "createdAt",
	})
	@IsString({ message: "정렬 필드는 문자열이어야 합니다" })
	field!: string;

	@ApiProperty({
		description: "정렬 방향",
		enum: ["asc", "desc"],
		example: "desc",
	})
	@IsIn(["asc", "desc"], { message: "정렬 방향은 asc 또는 desc여야 합니다" })
	direction!: SortDirection;
}

/**
 * 필드 설정 저장 DTO
 */
export class SaveFieldConfigDto {
	@ApiProperty({
		description: "필드명",
		example: "name",
	})
	@IsString({ message: "필드명은 문자열이어야 합니다" })
	field!: string;

	@ApiProperty({
		description: "표시 여부",
		example: true,
	})
	@IsBoolean({ message: "표시 여부는 boolean이어야 합니다" })
	visible!: boolean;

	@ApiProperty({
		description: "표시 순서 (0부터 시작)",
		example: 0,
		minimum: 0,
	})
	@IsInt({ message: "순서는 정수여야 합니다" })
	@Min(0, { message: "순서는 0 이상이어야 합니다" })
	order!: number;

	@ApiPropertyOptional({
		description: "라벨 오버라이드",
		example: "사용자명",
	})
	@IsOptional()
	@IsString({ message: "라벨은 문자열이어야 합니다" })
	label?: string;

	@ApiPropertyOptional({
		description: "너비 오버라이드",
		oneOf: [{ type: "string" }, { type: "number" }],
		example: "150px",
	})
	@IsOptional()
	width?: string | number;
}

/**
 * UI 설정 저장 요청 DTO
 *
 * 사용자가 테이블 컬럼 설정을 변경할 때 사용됩니다.
 */
export class SaveUIConfigDto {
	@ApiProperty({
		description: "필드별 설정 목록",
		type: [SaveFieldConfigDto],
		example: [
			{ field: "name", visible: true, order: 0 },
			{ field: "email", visible: true, order: 1 },
			{ field: "createdAt", visible: false, order: 2 },
		],
	})
	@IsArray({ message: "fields는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => SaveFieldConfigDto)
	fields!: SaveFieldConfigDto[];

	@ApiPropertyOptional({
		description: "기본 정렬 설정",
		type: () => SaveSortConfigDto,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => SaveSortConfigDto)
	defaultSort?: SaveSortConfigDto;

	@ApiPropertyOptional({
		description: "페이지 크기",
		example: 20,
		minimum: 1,
		maximum: 100,
	})
	@IsOptional()
	@IsInt({ message: "페이지 크기는 정수여야 합니다" })
	@Min(1, { message: "페이지 크기는 1 이상이어야 합니다" })
	@Max(100, { message: "페이지 크기는 100 이하여야 합니다" })
	pageSize?: number;
}

/**
 * 관리자용 UI 설정 저장 DTO
 *
 * 관리자가 GLOBAL 또는 ROLE 범위의 설정을 저장할 때 사용됩니다.
 */
export class SaveUIConfigAdminDto extends SaveUIConfigDto {
	@ApiProperty({
		description: "설정 범위",
		enum: UIConfigScopeEnum,
		example: UIConfigScopeEnum.GLOBAL,
	})
	@IsEnum(UIConfigScopeEnum, { message: "유효한 설정 범위를 입력해주세요" })
	scope!: UIConfigScopeEnum;

	@ApiPropertyOptional({
		description: "범위 ID (ROLE 범위인 경우 roleId)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@IsOptional()
	@IsUUID("4", { message: "유효한 UUID를 입력해주세요" })
	scopeId?: string;
}
