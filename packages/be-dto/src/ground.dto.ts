import {
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Ground as GroundEntity } from "@cocrepo/prisma";
import { Expose } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { CompanyDto } from "./company.dto";
import { SpaceDto } from "./space.dto";

export class GroundDto extends AbstractDto implements GroundEntity {
	@StringField()
	@Expose()
	name: string;

	@StringFieldOptional({ nullable: true })
	label: string | null;

	@StringField()
	address: string;

	@StringField()
	phone: string;

	@StringField()
	email: string;

	@UUIDField()
	companyId: string;

	@UUIDFieldOptional({ nullable: true })
	imageFileId: string | null;

	@ClassField(() => CompanyDto, { required: false, nullable: true })
	company?: CompanyDto | null;

	// Flattened Company fields kept for current Space/Ground API responses.
	@StringField()
	businessNo: string;

	@UUIDFieldOptional({ nullable: true })
	logoImageFileId: string | null;

	@UUIDField()
	spaceId: string;

	@ClassField(() => SpaceDto, { required: false, nullable: true })
	space?: SpaceDto | null;
}
