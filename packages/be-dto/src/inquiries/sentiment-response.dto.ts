import {
	ClassField,
	DateField,
	EnumField,
	NumberField,
	StringField,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { SentimentType } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 감정 분석 상세 DTO
 */
export class SentimentDetailDto extends AbstractDto {
	@UUIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@UUIDFieldOptional({ description: "분석 대상 메시지 ID" })
	messageId!: string | null;

	@EnumField(() => SentimentType, { description: "감정 유형" })
	sentiment!: SentimentType;

	@NumberField({ description: "감정 점수 (-1.0 ~ 1.0)" })
	score!: number;

	@NumberField({ description: "분석 신뢰도 (0.0 ~ 1.0)" })
	confidence!: number;

	@NumberField({ nullable: true, description: "긴급도 점수 (0.0 ~ 1.0)" })
	urgency!: number | null;

	@DateField({ description: "분석 일시" })
	analyzedAt!: Date;
}

/**
 * 감정 분석 응답 DTO
 */
export class SentimentResponseDto extends AbstractDto {
	@UUIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@EnumField(() => SentimentType, { description: "전체 감정 유형" })
	overallSentiment!: SentimentType;

	@NumberField({ description: "전체 감정 점수 (-1.0 ~ 1.0)" })
	overallScore!: number;

	@NumberField({ description: "전체 분석 신뢰도 (0.0 ~ 1.0)" })
	overallConfidence!: number;

	@NumberField({ nullable: true, description: "긴급도 점수 (0.0 ~ 1.0)" })
	urgency!: number | null;

	@ClassField(() => SentimentDetailDto, {
		isArray: true,
		required: false,
		description: "메시지별 감정 분석 결과",
	})
	messageSentiments?: SentimentDetailDto[];

	@StringField({
		isArray: true,
		required: false,
		description: "주요 키워드 목록",
	})
	keywords?: string[];
}
