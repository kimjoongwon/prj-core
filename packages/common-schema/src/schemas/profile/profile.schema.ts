import type { Profile as PrismaProfile } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	StringValidation,
	UUIDValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Profile의 DB 필드 타입과 공통 검증입니다. */
export class ProfileSchema extends AbstractSchema implements PrismaProfile {
	profileId!: PrismaProfile["profileId"];

	@StringValidation()
	name!: PrismaProfile["name"];

	@StringValidation()
	nickname!: PrismaProfile["nickname"];

	@StringValidation()
	address!: PrismaProfile["address"];

	@BigIntIdValidation()
	userId!: PrismaProfile["userId"];

	@UUIDValidation({ nullable: true })
	avatarFileId!: PrismaProfile["avatarFileId"];
}
