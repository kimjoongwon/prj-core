import {
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Company as CompanyEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { FitnessCenterDto } from "./fitness-center.dto";

export class CompanyDto
	extends AbstractDto
	implements DomainEntityModel<CompanyEntity>
{
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

	@UUIDFieldOptional({ nullable: true })
	logoImageFileId: string | null;

	@ClassField(() => FitnessCenterDto, {
		required: false,
		each: true,
		isArray: true,
	})
	fitnessCenters?: FitnessCenterDto[];
}
