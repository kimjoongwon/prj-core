import type { JsonValue } from "@cocrepo/type";
import { SentimentType } from "@cocrepo/enum";
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
{
	sentimentAnalysisId!: string;

	declare id: bigint;

	declare createdAt: Date;

	declare updatedAt: Date | null;

	@BigIntIdValidation({ description: "소속 문의 ID" })
	inquiryId!: bigint;

	@BigIntIdValidationOptional({ description: "분석 대상 메시지 ID" })
	messageId!: bigint | null;

	@EnumValidation(() => SentimentType, { description: "감정 유형" })
	sentiment!: SentimentType;

	@NumberValidation({ description: "감정 점수 (-1.0 ~ 1.0)" })
	score!: number;

	@NumberValidation({ description: "분석 신뢰도 (0.0 ~ 1.0)" })
	confidence!: number;

	emotions!: JsonValue;

	keywords!: JsonValue;

	@NumberValidation({ nullable: true, description: "긴급도 점수 (0.0 ~ 1.0)" })
	urgency!: number | null;

	@DateValidation({ description: "분석 일시" })
	analyzedAt!: Date;
}
