import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import { DeleteFilter } from "@cocrepo/enum";
import { Transform } from "class-transformer";
import { QueryDto } from "../query/query.dto";

/**
 * 사용자 목록 조회용 Query DTO
 *
 * 페이지네이션(skip/take)은 부모 QueryDto에서 상속합니다.
 * page/limit 필드를 직접 선언하지 않습니다 — Prisma와 동일한 skip/take를 사용합니다.
 *
 * 필터 계약: name, email, phone, createdFrom/createdTo
 * 커스텀 처리: nickname(릴레이션), roles(릴레이션), status(특수), categoryId(릴레이션), groupIds(릴레이션)
 */
export class QueryUsersDto extends QueryDto {
	@StringFieldOptional({
		description: "이름 검색",
	})
	name?: string;

	@StringFieldOptional({
		description: "이메일 검색",
	})
	email?: string;

	@StringFieldOptional({
		description: "전화번호 검색",
	})
	phone?: string;

	@StringFieldOptional({
		description: "닉네임 검색",
	})
	nickname?: string;

	@StringFieldOptional({
		each: true,
		description: "역할 필터 (복수 선택 가능)",
	})
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	roles?: string[];

	@EnumFieldOptional(() => DeleteFilter, {
		description: "상태 필터 (active: 활성, deleted: 삭제됨)",
	})
	status?: DeleteFilter;

	@ULIDFieldOptional({
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

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, email. 예: ?sort=name&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];
}
