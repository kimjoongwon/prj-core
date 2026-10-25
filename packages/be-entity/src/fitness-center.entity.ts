import {
	BigIntIdFieldMetadata,
	ClassField,
	StringFieldMetadata,
	UUIDFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { FitnessCenterSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Company } from "./company.entity";
import { Space } from "./space.entity";

@AbstractEntityFields()
export class FitnessCenter extends FitnessCenterSchema {
	/** 공개 식별자 ULID */
	declare id: FitnessCenterSchema["id"];

	@StringFieldMetadata()
	declare address: FitnessCenterSchema["address"];
	@StringFieldMetadata()
	declare phone: FitnessCenterSchema["phone"];
	@StringFieldMetadata()
	declare email: FitnessCenterSchema["email"];
	@BigIntIdFieldMetadata()
	declare companySeq: FitnessCenterSchema["companySeq"];
	@BigIntIdFieldMetadata()
	declare spaceSeq: FitnessCenterSchema["spaceSeq"];
	@UUIDFieldOptionalMetadata({ nullable: true })
	declare imageFileId: FitnessCenterSchema["imageFileId"];

	@ClassField(() => Company, { required: false, nullable: true })
	company?: Company;
	@ClassField(() => Space, { required: false, nullable: true })
	space?: Space;
}
