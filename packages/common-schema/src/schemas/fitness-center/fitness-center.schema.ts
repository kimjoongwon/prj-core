import type { FitnessCenter as PrismaFitnessCenter } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	StringValidation,
	StringValidationOptional,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** FitnessCenter의 DB 필드 타입과 공통 검증입니다. */
export class FitnessCenterSchema
	extends AbstractSchema
	implements PrismaFitnessCenter
{
	fitnessCenterId!: PrismaFitnessCenter["fitnessCenterId"];

	@StringValidation()
	name!: PrismaFitnessCenter["name"];

	@StringValidationOptional({ nullable: true })
	label!: PrismaFitnessCenter["label"];

	@StringValidation()
	address!: PrismaFitnessCenter["address"];

	@StringValidation()
	phone!: PrismaFitnessCenter["phone"];

	@StringValidation()
	email!: PrismaFitnessCenter["email"];

	@BigIntIdValidation()
	companyId!: PrismaFitnessCenter["companyId"];

	@BigIntIdValidation()
	spaceId!: PrismaFitnessCenter["spaceId"];

	@UUIDValidationOptional({ nullable: true })
	imageFileId!: PrismaFitnessCenter["imageFileId"];
}
