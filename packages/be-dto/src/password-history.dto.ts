import { ResponseExcludedField } from "@cocrepo/constant";
import { DateField, StringField, UUIDField } from "@cocrepo/decorator";
import type { PasswordHistory } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";

export class PasswordHistoryDto implements PasswordHistory {
	@UUIDField({ description: "ID" })
	id!: string;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@UUIDField({ description: "사용자 ID" })
	userId!: string;

	@Exclude()
	@StringField({ description: ResponseExcludedField })
	passwordHash!: string;
}
