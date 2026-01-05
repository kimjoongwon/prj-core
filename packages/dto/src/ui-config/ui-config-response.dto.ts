import {
	BooleanField,
	ClassField,
	EnumField,
	NumberField,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { type SortDirection, UIConfigScopeEnum } from "./ui-config.types";

/**
 * 정렬 설정 DTO
 */
export class SortConfigDto {
	@StringField({ description: "정렬 기준 필드명" })
	@Expose()
	field!: string;

	@ApiProperty({
		description: "정렬 방향",
		enum: ["asc", "desc"],
		example: "desc",
	})
	@Expose()
	direction!: SortDirection;
}

/**
 * 필드 설정 DTO
 *
 * 테이블 컬럼, 폼 필드 등의 개별 필드 설정을 나타냅니다.
 */
export class FieldConfigDto {
	@StringField({ description: "필드명 (예: name, email, createdAt)" })
	@Expose()
	field!: string;

	@BooleanField({ description: "표시 여부" })
	@Expose()
	visible!: boolean;

	@NumberField({ description: "표시 순서 (0부터 시작)", minimum: 0, int: true })
	@Expose()
	order!: number;

	@StringFieldOptional({ description: "라벨 오버라이드" })
	@Expose()
	label?: string;

	@ApiPropertyOptional({
		description: "너비 오버라이드 (픽셀 또는 비율)",
		oneOf: [{ type: "string" }, { type: "number" }],
		example: "150px",
	})
	@Expose()
	width?: string | number;
}

/**
 * 테이블 뷰 설정 DTO
 */
export class TableViewConfigDto {
	@ClassField(() => FieldConfigDto, {
		isArray: true,
		description: "필드별 설정 목록",
	})
	@Expose()
	@Type(() => FieldConfigDto)
	fields!: FieldConfigDto[];

	@ApiPropertyOptional({
		description: "기본 정렬 설정",
		type: () => SortConfigDto,
	})
	@Expose()
	@Type(() => SortConfigDto)
	defaultSort?: SortConfigDto;

	@NumberFieldOptional({
		description: "페이지 크기",
		minimum: 1,
		maximum: 100,
		int: true,
	})
	@Expose()
	pageSize?: number;
}

/**
 * UIConfig 응답 DTO
 *
 * UI 설정 조회 API의 응답 형식입니다.
 */
export class UIConfigResponseDto {
	@UUIDField({ description: "UIConfig ID" })
	@Expose()
	id!: string;

	@StringField({ description: "엔티티명 (예: User, Reservation, Ground)" })
	@Expose()
	entity!: string;

	@StringField({ description: "뷰 타입 (table, form, detail, card)" })
	@Expose()
	view!: string;

	@EnumField(() => UIConfigScopeEnum, {
		description: "설정 범위 (GLOBAL, ROLE, USER)",
	})
	@Expose()
	scope!: UIConfigScopeEnum;

	@UUIDFieldOptional({
		description: "범위 ID (ROLE이면 roleId, USER면 userId)",
	})
	@Expose()
	scopeId?: string | null;

	@ApiProperty({
		description: "설정 데이터 (JSON)",
		type: () => TableViewConfigDto,
	})
	@Expose()
	@Type(() => TableViewConfigDto)
	config!: TableViewConfigDto;

	@UUIDField({ description: "Space ID" })
	@Expose()
	spaceId!: string;

	@ApiProperty({
		description: "생성 일시",
		type: Date,
	})
	@Expose()
	createdAt!: Date;

	@ApiPropertyOptional({
		description: "수정 일시",
		type: Date,
		nullable: true,
	})
	@Expose()
	updatedAt?: Date | null;
}

/**
 * UIConfig 간소화된 응답 DTO
 *
 * 사용자에게 필요한 설정만 포함하는 간소화된 응답입니다.
 * 프론트엔드에서 코드 기본값과 병합할 때 사용됩니다.
 */
export class UIConfigSimpleResponseDto {
	@StringField({ description: "엔티티명" })
	@Expose()
	entity!: string;

	@StringField({ description: "뷰 타입" })
	@Expose()
	view!: string;

	@ApiProperty({
		description: "설정 데이터 (JSON)",
		type: () => TableViewConfigDto,
	})
	@Expose()
	@Type(() => TableViewConfigDto)
	config!: TableViewConfigDto;
}
