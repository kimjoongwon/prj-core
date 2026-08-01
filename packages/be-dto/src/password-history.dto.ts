import { ResponseExcludedField } from "@cocrepo/constant";
import { DateField, StringField, ULIDField } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { PasswordHistory } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";

export class PasswordHistoryDto implements DomainEntityModel<PasswordHistory> {
	@ULIDField({ description: "ID" })
	id!: string;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@ULIDField({ description: "사용자 ID" })
	userId!: string;

	@Exclude()
	@StringField({ description: ResponseExcludedField })
	passwordHash!: string;
}
