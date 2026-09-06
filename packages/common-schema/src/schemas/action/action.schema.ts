import type { Action as PrismaAction } from "@cocrepo/prisma";
import {
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Action의 DB 필드 타입과 공통 검증입니다. */
export class ActionSchema extends AbstractSchema implements PrismaAction {
	actionId!: PrismaAction["actionId"];

	@StringValidation()
	name!: PrismaAction["name"];

	@StringValidationOptional({ nullable: true })
	displayName!: PrismaAction["displayName"];

	@StringValidationOptional({ nullable: true })
	description!: PrismaAction["description"];

	@StringValidationOptional({ nullable: true })
	group!: PrismaAction["group"];

	@NumberValidation()
	order!: PrismaAction["order"];

	config!: PrismaAction["config"];
}
