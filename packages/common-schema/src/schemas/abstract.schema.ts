import {
	BigIntIdValidation,
	DateValidation,
} from "../decorators/model-validation";
/** DB 모델이 공유하는 식별자와 수명 주기 필드 검증입니다. */
export class AbstractSchema {
	@BigIntIdValidation() id!: bigint;
	@DateValidation() createdAt!: Date;
	@DateValidation({ nullable: true }) updatedAt!: Date | null;
	@DateValidation({ nullable: true }) removedAt!: Date | null;
}
