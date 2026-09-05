import { ServiceDocument } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class ServiceDocumentDto extends EntityResponseType(ServiceDocument, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"kind",
		"platform",
		"locale",
		"title",
		"summary",
		"content",
		"format",
		"version",
		"status",
		"isRequired",
		"displayOrder",
		"effectiveAt",
		"publishedAt",
	],
}) {}
