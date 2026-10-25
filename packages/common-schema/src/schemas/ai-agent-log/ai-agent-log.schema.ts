import type { AIAgentAction } from "@cocrepo/enum";
import type { JsonValue } from "@cocrepo/type";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** AIAgentLog의 DB 필드 타입과 공통 검증입니다. */
export class AIAgentLogSchema
	extends PickSchemaType(AbstractSchema, ["seq", "createdAt"] as const)
{
	id!: string;

	declare seq: bigint;

	declare createdAt: Date;

	inquirySeq!: bigint;

	messageSeq!: bigint | null;

	action!: AIAgentAction;

	input!: JsonValue;

	output!: JsonValue;

	confidence!: number | null;

	wasAccepted!: boolean | null;

	wasModified!: boolean | null;

	responseTimeMs!: number | null;

	model!: string | null;

	tokenCount!: number | null;

	errorMessage!: string | null;
}
