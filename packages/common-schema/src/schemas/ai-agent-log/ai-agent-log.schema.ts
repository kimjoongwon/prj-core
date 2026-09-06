import type { AIAgentLog as PrismaAIAgentLog } from "@cocrepo/prisma";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** AIAgentLog의 DB 필드 타입과 공통 검증입니다. */
export class AIAgentLogSchema
	extends PickSchemaType(AbstractSchema, ["id", "createdAt"] as const)
	implements PrismaAIAgentLog
{
	aiAgentLogId!: PrismaAIAgentLog["aiAgentLogId"];

	declare id: PrismaAIAgentLog["id"];

	declare createdAt: PrismaAIAgentLog["createdAt"];

	inquiryId!: PrismaAIAgentLog["inquiryId"];

	messageId!: PrismaAIAgentLog["messageId"];

	action!: PrismaAIAgentLog["action"];

	input!: PrismaAIAgentLog["input"];

	output!: PrismaAIAgentLog["output"];

	confidence!: PrismaAIAgentLog["confidence"];

	wasAccepted!: PrismaAIAgentLog["wasAccepted"];

	wasModified!: PrismaAIAgentLog["wasModified"];

	responseTimeMs!: PrismaAIAgentLog["responseTimeMs"];

	model!: PrismaAIAgentLog["model"];

	tokenCount!: PrismaAIAgentLog["tokenCount"];

	errorMessage!: PrismaAIAgentLog["errorMessage"];
}
