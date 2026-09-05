import {
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { FitnessCenter } from "./fitness-center.entity";

export class Company extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	companyId!: string;

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
	@StringField()
	businessNo!: string;
	@UUIDFieldOptional({ nullable: true })
	logoImageFileId!: string | null;

	@ClassField(() => FitnessCenter, {
		required: false,
		each: true,
		isArray: true,
	})
	fitnessCenters?: FitnessCenter[];
}
