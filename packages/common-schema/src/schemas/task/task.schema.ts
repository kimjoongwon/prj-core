import type { Task as PrismaTask } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Task의 DB 필드 타입과 공통 검증입니다. */
export class TaskSchema extends AbstractSchema implements PrismaTask {
	taskId!: PrismaTask["taskId"];

	@BigIntIdValidation()
	spaceId!: PrismaTask["spaceId"];

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: PrismaTask["createdById"];
}
