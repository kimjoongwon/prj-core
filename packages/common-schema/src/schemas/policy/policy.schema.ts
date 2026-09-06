import type { Policy as PrismaPolicy } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Policy의 DB 필드 타입과 공통 검증입니다. */
export class PolicySchema extends AbstractSchema implements PrismaPolicy {
	policyId!: PrismaPolicy["policyId"];

	@BigIntIdValidation({ description: "Space ID" })
	spaceId!: PrismaPolicy["spaceId"];

	@BigIntIdValidation({ nullable: true, description: "생성자 ID" })
	createdById!: PrismaPolicy["createdById"];

	@StringValidation({ description: "정책 식별자" })
	name!: PrismaPolicy["name"];

	displayName!: PrismaPolicy["displayName"];

	description!: PrismaPolicy["description"];
}
