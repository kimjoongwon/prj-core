import { PasswordHistory } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class PasswordHistoryDto extends EntityResponseType(PasswordHistory, {
	pick: ["id", "createdAt", "userId"] as const,
}) {}
