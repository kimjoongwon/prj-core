import {
	BigIntIdValidation,
	StringValidation,
	UUIDValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Profile의 DB 필드 타입과 공통 검증입니다. */
export class ProfileSchema extends AbstractSchema {
	id!: string;

	@StringValidation()
	name!: string;

	@StringValidation()
	nickname!: string;

	@StringValidation()
	address!: string;

	@BigIntIdValidation()
	userSeq!: bigint;

	@UUIDValidation({ nullable: true })
	avatarFileId!: string | null;
}
