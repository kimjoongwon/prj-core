import {
	ClassField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Company as CompanyEntity } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { FitnessCenterDto } from "./fitness-center.dto";

export class CompanyDto
	extends AbstractDto
	implements DomainEntityModel<CompanyEntity, "companyId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly companyId?: never;

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
