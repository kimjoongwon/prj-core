import {
	DateFieldOptional,
	EnumFieldOptional,
	NumberFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { Transform } from "class-transformer";
import { QueryDto } from "../query/query.dto";

/**
 * 회원 상태 필터
 */
export enum UserStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	REMOVED = "removed",
}

/**
 * 정렬 가능 필드
 */
export enum UserSortField {
	CREATED_AT = "createdAt",
	NAME = "name",
	EMAIL = "email",
}

/**
 * 회원 목록 조회용 Query DTO
 */
export class QueryUsersDto extends QueryDto {
	@StringFieldOptional({
		description: "통합 검색어 (이름, 이메일, 전화번호, 닉네임)",
	})
	search?: string;

	@StringFieldOptional({
		each: true,
		description: "역할 필터 (복수 선택 가능)",
	})
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	roles?: string[];

	@EnumFieldOptional(() => UserStatus, {
		description: "상태 필터 (active, inactive, removed)",
	})
	status?: UserStatus;

	@UUIDFieldOptional({
		description: "분류 카테고리 ID",
	})
	categoryId?: string;

	@StringFieldOptional({
		each: true,
		description: "그룹 ID 목록 (복수 선택 가능)",
	})
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	groupIds?: string[];

	@DateFieldOptional({
		description: "가입일 시작 (ISO8601)",
	})
	createdFrom?: Date;

	@DateFieldOptional({
		description: "가입일 종료 (ISO8601)",
	})
	createdTo?: Date;

	@EnumFieldOptional(() => UserSortField, {
		description: "정렬 기준 필드",
	})
	sortBy?: UserSortField;

	@EnumFieldOptional(() => SortOrder, {
		description: "정렬 순서 (asc, desc)",
	})
	sortOrder?: SortOrder;

	@NumberFieldOptional({
		minimum: 1,
		default: 1,
		int: true,
		description: "페이지 번호",
	})
	page?: number = 1;

	@NumberFieldOptional({
		minimum: 1,
		maximum: 100,
		default: 20,
		int: true,
		description: "페이지 크기",
	})
	limit?: number = 20;

	/**
	 * skip 값을 계산합니다 (페이지네이션용)
	 */
	getSkip(): number {
		const page = this.page ?? 1;
		const limit = this.limit ?? 20;
		return (page - 1) * limit;
	}

	/**
	 * take 값을 반환합니다 (페이지네이션용)
	 */
	getTake(): number {
		return this.limit ?? 20;
	}
}
