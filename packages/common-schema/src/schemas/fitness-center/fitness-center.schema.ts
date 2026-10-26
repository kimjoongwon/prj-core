import {
	BigIntIdValidation,
	StringValidation,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** FitnessCenter의 DB 필드 타입과 공통 검증입니다. 공간의 이름은 Space가 소유합니다. */
export class FitnessCenterSchema extends AbstractSchema {
	fitnessCenterId!: string;

	@StringValidation()
	address!: string;

	@StringValidation()
	phone!: string;

	@StringValidation()
	email!: string;

	@BigIntIdValidation()
	companyId!: bigint;

	@BigIntIdValidation()
	spaceId!: bigint;

	@UUIDValidationOptional({ nullable: true })
	imageFileId!: string | null;
}
