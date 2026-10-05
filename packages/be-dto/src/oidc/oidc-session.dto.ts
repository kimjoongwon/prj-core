import { DateField, StringFieldOptional } from "@cocrepo/decorator/field";
import { OidcModel } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";

export class OidcSessionDto extends EntityResponseType(OidcModel, {
	pick: ["id", "key", "modelType", "createdAt"] as const,

	extraFields: ["grantId", "uid", "accountId", "expiresAt"],
}) {
	@StringFieldOptional({ description: "Grant ID (토큰 폐기용)" })
	grantId: string | null;

	@StringFieldOptional({ description: "세션 UID" })
	uid: string | null;

	@StringFieldOptional({ description: "계정 ID" })
	accountId: string | null;

	@DateField({ nullable: true })
	expiresAt: Date | null;
}
