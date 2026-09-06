import type { Timeline as PrismaTimeline } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Timeline의 DB 필드 타입과 공통 검증입니다. */
export class TimelineSchema extends AbstractSchema implements PrismaTimeline {
	timelineId!: PrismaTimeline["timelineId"];

	@BigIntIdValidation()
	spaceId!: PrismaTimeline["spaceId"];

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: PrismaTimeline["createdById"];

	@StringValidation()
	name!: PrismaTimeline["name"];

	@StringValidationOptional({ nullable: true })
	description!: PrismaTimeline["description"];
}
