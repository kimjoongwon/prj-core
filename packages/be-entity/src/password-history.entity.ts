import { BigIntIdField, DateField } from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";

export class PasswordHistory extends AbstractEntity {
	@BigIntIdField({ description: "ID" })
	declare id: bigint;
	@DateField({ description: "생성일" })
	declare createdAt: Date;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	passwordHistoryId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdField({ description: "사용자 ID" })
	userId!: bigint;
	@Exclude({ toPlainOnly: true })
	passwordHash!: string;
}
