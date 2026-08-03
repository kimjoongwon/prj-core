import {
	BigIntIdField,
	ClassField,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import {
	type FitnessCenter as FitnessCenterEntity,
	LanguageCode,
} from "@cocrepo/prisma";
import { Exclude, Expose } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { CompanyDto } from "./company.dto";

/**
 * Space별 피트니스센터 상세 응답에서 콘텐츠 언어를 함께 제공하는 최소 Space 정보입니다.
 */
export class FitnessCenterSpaceDto {
	@BigIntIdField()
	id: bigint;

	@EnumField(() => LanguageCode)
	contentLanguageCode: LanguageCode;
}

export class FitnessCenterDto
	extends AbstractDto
	implements DomainEntityModel<FitnessCenterEntity, "fitnessCenterId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly fitnessCenterId?: never;

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

	@BigIntIdField()
	companyId: bigint;

	@UUIDFieldOptional({ nullable: true })
	imageFileId: string | null;

	@BigIntIdField()
	spaceId: bigint;

	@ClassField(() => CompanyDto, { required: false, nullable: true })
	company?: CompanyDto | null;

	@ClassField(() => FitnessCenterSpaceDto, { required: false, nullable: true })
	space?: FitnessCenterSpaceDto | null;
}
