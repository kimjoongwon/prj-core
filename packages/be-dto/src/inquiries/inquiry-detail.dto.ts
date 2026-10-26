import { ClassField } from "@cocrepo/decorator/field";
import { Inquiry } from "@cocrepo/entity";
import type { InquiryCategory } from "@cocrepo/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { EntityResponseType } from "../mapped-types/entity-response-type";
import { InquiryParticipantDto } from "./inquiry-participant.dto";
import { InquiryThreadDto } from "./inquiry-thread.dto";
import { SentimentResultDto } from "./sentiment-result.dto";

export class InquiryDetailDto extends EntityResponseType(Inquiry, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"createdById",
		"inquiryNumber",
		"title",
		"category",
		"channel",
		"source",
		"status",
		"priority",
		"customerId",
		"assigneeId",
		"isRealtimeChat",
		"isSlaResponseBreached",
		"isSlaResolveBreached",
		"lastMessageAt",
		"unreadCount",
		"firstResponseAt",
		"resolvedAt",
		"closedAt",
		"slaResponseDue",
		"slaResolveDue",
		"threads",
		"participants",
	],
	relations: {
		threads: () => InquiryThreadDto,
		participants: () => InquiryParticipantDto,
	},
	extraFields: ["sentiment"],
}) {
	// 상세 API에 이미 공개한 설명 문구만 보존하며 검증과 필드 타입은 Entity에서 재사용합니다.
	@ApiProperty({ description: "문의 카테리" })
	declare category: InquiryCategory;
	@ClassField(() => SentimentResultDto, {
		nullable: true,
		description: "감정 분석 결과",
	})
	sentiment?: SentimentResultDto | null;
	declare threads: InquiryThreadDto[];
	declare participants: InquiryParticipantDto[];
}
