import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { EmailVerificationStatus, type Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryEmailVerificationDto extends PrismaQueryDto<Prisma.EmailVerificationWhereInput> {
	@StringFieldOptional({ description: "이메일 (부분 일치)" })
	readonly email?: string;

	@EnumFieldOptional(() => EmailVerificationStatus, { description: "상태" })
	readonly status?: EmailVerificationStatus;

	@DateFieldOptional({ description: "시작일 (createdAt >= startDate)" })
	readonly startDate?: Date;

	@DateFieldOptional({ description: "종료일 (createdAt <= endDate)" })
	readonly endDate?: Date;

	protected excludeFromAutoMap(): string[] {
		return ["startDate", "endDate"];
	}

}
