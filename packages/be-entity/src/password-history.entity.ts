import {
	BigIntIdFieldMetadata,
	DateFieldMetadata,
} from "@cocrepo/decorator/field";
import { PasswordHistorySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

@AbstractEntityFields()
export class PasswordHistory extends PasswordHistorySchema {
	@BigIntIdFieldMetadata({ description: "ID" })
	declare seq: bigint;
	@DateFieldMetadata({ description: "생성일" })
	declare createdAt: Date;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare id: PasswordHistorySchema["id"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "사용자 ID" })
	declare userSeq: PasswordHistorySchema["userSeq"];
	@Exclude({ toPlainOnly: true })
	declare passwordHash: PasswordHistorySchema["passwordHash"];
}
