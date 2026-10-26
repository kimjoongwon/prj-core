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
	declare id: bigint;
	@DateFieldMetadata({ description: "생성일" })
	declare createdAt: Date;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare passwordHistoryId: PasswordHistorySchema["passwordHistoryId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "사용자 ID" })
	declare userId: PasswordHistorySchema["userId"];
	@Exclude({ toPlainOnly: true })
	declare passwordHash: PasswordHistorySchema["passwordHash"];
}
