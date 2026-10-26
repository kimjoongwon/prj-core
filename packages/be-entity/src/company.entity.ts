import {
	ClassField,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
	UUIDFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { CompanySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { FitnessCenter } from "./fitness-center.entity";

@AbstractEntityFields()
export class Company extends CompanySchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare companyId: CompanySchema["companyId"];

	@StringFieldMetadata()
	declare name: CompanySchema["name"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare label: CompanySchema["label"];
	@StringFieldMetadata()
	declare address: CompanySchema["address"];
	@StringFieldMetadata()
	declare phone: CompanySchema["phone"];
	@StringFieldMetadata()
	declare email: CompanySchema["email"];
	@StringFieldMetadata()
	declare businessNo: CompanySchema["businessNo"];
	@UUIDFieldOptionalMetadata({ nullable: true })
	declare logoImageFileId: CompanySchema["logoImageFileId"];

	@ClassField(() => FitnessCenter, {
		required: false,
		each: true,
		isArray: true,
	})
	fitnessCenters?: FitnessCenter[];
}
