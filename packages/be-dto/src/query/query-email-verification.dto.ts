import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { EmailVerificationStatus } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { QueryDto } from "./query.dto";

export class QueryEmailVerificationDto extends QueryDto {
	@StringFieldOptional({ description: "이메일 (부분 일치)" })
	readonly email?: string;

	@EnumFieldOptional(() => EmailVerificationStatus, { description: "상태" })
	readonly status?: EmailVerificationStatus;

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
