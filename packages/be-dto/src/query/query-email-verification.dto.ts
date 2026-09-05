import {
	DateFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Transform } from "class-transformer";
import { EntityQueryType } from "./entity-query-type";
import { EmailVerification } from "@cocrepo/entity";

export class QueryEmailVerificationDto extends EntityQueryType(EmailVerification, [
	"status",
] as const) {
	@StringFieldOptional({ description: "이메일 (부분 일치)" })
	readonly email?: string;


	@DateFieldOptional({ description: "시작일 (createdAt >= startDate)" })
	readonly startDate?: Date;

	@DateFieldOptional({ description: "종료일 (createdAt <= endDate)" })
	readonly endDate?: Date;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 허용 필드: createdAt, email, status. 예: ?sort=email&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	readonly sort?: string[];
}
