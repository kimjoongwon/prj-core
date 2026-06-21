import {
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Company as CompanyEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { GroundDto } from "./ground.dto";
import { SpaceDto } from "./space.dto";

export class CompanyDto extends AbstractDto implements CompanyEntity {
	@StringField()
	name: string;

	@StringFieldOptional({ nullable: true })
	label: string | null;

	@StringField()
	address: string;

	@StringField()
	phone: string;

	@StringField()
	email: string;

	@StringField()
	businessNo: string;

	@UUIDField()
	spaceId: string;

	@UUIDFieldOptional({ nullable: true })
	logoImageFileId: string | null;

	@ClassField(() => SpaceDto, { required: false, nullable: true })
	space?: SpaceDto | null;

	@ClassField(() => GroundDto, { required: false, isArray: true })
	grounds?: GroundDto[];
}
