import { SentimentAnalysis } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class SentimentResultDto extends EntityResponseType(SentimentAnalysis, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"inquiryId",
		"messageId",
		"sentiment",
		"score",
		"confidence",
		"urgency",
		"analyzedAt",
	],
}) {}
