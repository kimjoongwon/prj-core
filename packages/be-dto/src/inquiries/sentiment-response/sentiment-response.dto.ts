import {
	ClassField,
	EnumField,
	NumberField,
	StringField,
	ULIDField,
} from "@cocrepo/decorator";
import { SentimentType } from "@cocrepo/prisma";
import { AbstractDto } from "../../abstract.dto";

import { SentimentDetailDto } from "../sentiment-detail.dto";

/**
 * 감정 분석 응답 DTO
 */
export class SentimentResponseDto extends AbstractDto {
	@ULIDField({ description: "소속 문의 ID" })
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
