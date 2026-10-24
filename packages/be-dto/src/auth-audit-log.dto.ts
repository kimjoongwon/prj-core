import { AuthAuditLog } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class AuthAuditLogDto extends EntityResponseType(AuthAuditLog, {
	pick: [
		"id",
		"createdAt",
		"email",
		"userSeq",
		"result",
		"failureReason",
		"ipAddress",
		"userAgent",
		"clientId",
	] as const,
}) {}
