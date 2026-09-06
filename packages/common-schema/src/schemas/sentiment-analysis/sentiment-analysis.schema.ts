import { SentimentType } from "@cocrepo/enum";
import type { SentimentAnalysis as PrismaSentimentAnalysis } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	DateValidation,
	EnumValidation,
	NumberValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** SentimentAnalysis의 DB 필드 타입과 공통 검증입니다. */
export class SentimentAnalysisSchema
	extends PickSchemaType(AbstractSchema, [
		"id",
		"createdAt",
		"updatedAt",
	] as const)
	implements PrismaSentimentAnalysis
{
	sentimentAnalysisId!: PrismaSentimentAnalysis["sentimentAnalysisId"];

	declare id: PrismaSentimentAnalysis["id"];

	declare createdAt: PrismaSentimentAnalysis["createdAt"];

	declare updatedAt: PrismaSentimentAnalysis["updatedAt"];

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquiryId!: PrismaSentimentAnalysis["inquiryId"];

	@BigIntIdValidationOptional({ description: "분석 대상 메시지 ID" })
	messageId!: PrismaSentimentAnalysis["messageId"];

	@EnumValidation(() => SentimentType, { description: "감정 유형" })
	sentiment!: PrismaSentimentAnalysis["sentiment"];

	@NumberValidation({ description: "감정 점수 (-1.0 ~ 1.0)" })
	score!: PrismaSentimentAnalysis["score"];

	@NumberValidation({ description: "분석 신뢰도 (0.0 ~ 1.0)" })
	confidence!: PrismaSentimentAnalysis["confidence"];

	emotions!: PrismaSentimentAnalysis["emotions"];

	keywords!: PrismaSentimentAnalysis["keywords"];

	@NumberValidation({ nullable: true, description: "긴급도 점수 (0.0 ~ 1.0)" })
	urgency!: PrismaSentimentAnalysis["urgency"];

	@DateValidation({ description: "분석 일시" })
	analyzedAt!: PrismaSentimentAnalysis["analyzedAt"];
}
