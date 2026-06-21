import { ClassField, EnumField, UUIDFieldOptional } from "@cocrepo/decorator";
import { LanguageCode, type Space } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { CompanyDto } from "./company.dto";
import { GroundDto } from "./ground.dto";
import { SpaceAssociationDto } from "./space-association.dto";
import { SpaceClassificationDto } from "./space-classification.dto";
import { TenantDto } from "./tenant.dto";

export class SpaceDto extends AbstractDto implements Space {
	@UUIDFieldOptional({
		description: "이 Space 접근에 사용할 Tenant ID",
		nullable: true,
	})
	tenantId?: string | null;

	@EnumField(() => LanguageCode, {
		description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
		default: LanguageCode.ko_KR,
	})
	contentLanguageCode: LanguageCode;

	@ClassField(() => TenantDto, {
		required: false,
		swagger: false,
		isArray: true,
	})
	tenants?: TenantDto[];

	@ClassField(() => SpaceClassificationDto, {
		required: false,
	})
	spaceClassification?: SpaceClassificationDto;

	@ClassField(() => SpaceAssociationDto, {
		required: false,
		each: true,
		isArray: true,
	})
	spaceAssociations?: SpaceAssociationDto[];

	@ClassField(() => CompanyDto, { required: false })
	company?: CompanyDto;

	@ClassField(() => GroundDto, { required: false })
	ground?: GroundDto;
}
