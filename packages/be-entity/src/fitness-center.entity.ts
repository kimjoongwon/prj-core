import {
	BigIntIdField,
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Company } from "./company.entity";
import { Space } from "./space.entity";

export class FitnessCenter extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	fitnessCenterId!: string;

	@StringField()
	name!: string;
	@StringFieldOptional({ nullable: true })
	label!: string | null;
	@StringField()
	address!: string;
	@StringField()
	phone!: string;
	@StringField()
	email!: string;
	@BigIntIdField()
	companyId!: bigint;
	@BigIntIdField()
	spaceId!: bigint;
	@UUIDFieldOptional({ nullable: true })
	imageFileId!: string | null;

	@ClassField(() => Company, { required: false, nullable: true })
	company?: Company;
	@ClassField(() => Space, { required: false, nullable: true })
	space?: Space;
}
