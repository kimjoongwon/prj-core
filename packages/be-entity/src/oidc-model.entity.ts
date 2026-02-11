import type { JsonValue } from "@cocrepo/type";
import type { OidcModel as OidcModelEntity } from "@cocrepo/prisma";

export class OidcModel implements OidcModelEntity {
	id!: string;
	createdAt!: Date;
	updatedAt!: Date | null;
	key!: string;
	modelType!: string;
	payload!: JsonValue;
	expiresAt!: Date | null;
	userCode!: string | null;
	grantId!: string | null;
	uid!: string | null;

	isExpired(): boolean {
		if (!this.expiresAt) return false;
		return this.expiresAt.getTime() < Date.now();
	}
}
