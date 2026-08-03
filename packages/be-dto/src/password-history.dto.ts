import { BigIntIdField, DateField } from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { PasswordHistory } from "@cocrepo/prisma";

export class PasswordHistoryDto
	implements
		DomainEntityModel<PasswordHistory, "passwordHistoryId" | "passwordHash">
{
	@BigIntIdField({ description: "ID" })
	id!: bigint;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@BigIntIdField({ description: "사용자 ID" })
	userId!: bigint;
}
