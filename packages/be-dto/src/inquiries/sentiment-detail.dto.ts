import {
	DateField,
	EnumField,
	NumberField,
	ULIDField,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import { SentimentType } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 감정 분석 상세 DTO
 */
export class SentimentDetailDto extends AbstractDto {
	@ULIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@ULIDFieldOptional({ description: "분석 대상 메시지 ID" })
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
