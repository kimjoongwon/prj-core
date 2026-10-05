import {
	BigIntIdFieldMetadata,
	ClassField,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
	UUIDFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { FitnessCenterSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Company } from "./company.entity";
import { Space } from "./space.entity";

@AbstractEntityFields()
export class FitnessCenter extends FitnessCenterSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare fitnessCenterId: FitnessCenterSchema["fitnessCenterId"];

	@StringFieldMetadata()
	declare name: FitnessCenterSchema["name"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare label: FitnessCenterSchema["label"];
	@StringFieldMetadata()
	declare address: FitnessCenterSchema["address"];
	@StringFieldMetadata()
	declare phone: FitnessCenterSchema["phone"];
	@StringFieldMetadata()
	declare email: FitnessCenterSchema["email"];
	@BigIntIdFieldMetadata()
	declare companyId: FitnessCenterSchema["companyId"];
	@BigIntIdFieldMetadata()
	declare spaceId: FitnessCenterSchema["spaceId"];
	@UUIDFieldOptionalMetadata({ nullable: true })
	declare imageFileId: FitnessCenterSchema["imageFileId"];

	@ClassField(() => Company, { required: false, nullable: true })
	company?: Company;
	@ClassField(() => Space, { required: false, nullable: true })
	space?: Space;
}
