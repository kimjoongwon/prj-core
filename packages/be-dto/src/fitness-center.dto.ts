import {
	ClassField,
	EnumField,
	StringField,
	StringFieldOptional,
	ULIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import {
	type FitnessCenter as FitnessCenterEntity,
	LanguageCode,
} from "@cocrepo/prisma";
import { Expose } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { CompanyDto } from "./company.dto";

/**
 * Space별 피트니스센터 상세 응답에서 콘텐츠 언어를 함께 제공하는 최소 Space 정보입니다.
 */
export class FitnessCenterSpaceDto {
	@ULIDField()
	id: string;

	@EnumField(() => LanguageCode)
	contentLanguageCode: LanguageCode;
}

export class FitnessCenterDto
	extends AbstractDto
	implements DomainEntityModel<FitnessCenterEntity>
{
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

	@ULIDField()
	companyId: string;

	@UUIDFieldOptional({ nullable: true })
	imageFileId: string | null;

	@ULIDField()
	spaceId: string;

	@ClassField(() => CompanyDto, { required: false, nullable: true })
	company?: CompanyDto | null;

	@ClassField(() => FitnessCenterSpaceDto, { required: false, nullable: true })
	space?: FitnessCenterSpaceDto | null;
}
