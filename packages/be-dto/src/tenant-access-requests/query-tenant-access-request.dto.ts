import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { type Prisma, TenantAccessRequestStatus } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "../query/prisma-query.dto";

export class QueryTenantAccessRequestDto extends PrismaQueryDto<Prisma.TenantAccessRequestWhereInput> {
	@StringFieldOptional({
		description: "검색어 (신청자 이름/이메일, 시설명)",
	})
	search?: string;

	@EnumFieldOptional(() => TenantAccessRequestStatus, {
		description: "신청 상태 필터",
	})
	status?: TenantAccessRequestStatus;

	@UUIDFieldOptional({
		description: "Space ID 필터",
	})
	spaceId?: string;

	@UUIDFieldOptional({
		description: "신청자 ID 필터",
	})
	requesterId?: string;

	@DateFieldOptional({
		description: "신청일 시작 (ISO8601)",
	})
	createdFrom?: Date;

	@DateFieldOptional({
		description: "신청일 종료 (ISO8601)",
	})
	createdTo?: Date;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 예: ?sort=-createdAt&sort=status",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

	protected excludeFromAutoMap(): string[] {
		return ["search"];
	}

	toPrismaWhere(
		baseWhere?: Partial<Prisma.TenantAccessRequestWhereInput>,
	): Prisma.TenantAccessRequestWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		if (this.search) {
			const search = this.containsFilter(this.search);
			where.OR = [
				{ requester: { name: search } },
				{ requester: { email: search } },
				{ space: { ground: { is: { name: search } } } },
				{ requestedRole: { displayName: search } },
				{ requestedRole: { name: search } },
			];
		}

		return where;
	}
}
