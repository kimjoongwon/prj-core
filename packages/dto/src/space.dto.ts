import { BooleanField, ClassField } from "@cocrepo/decorator";
import type { Space } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { GroundDto } from "./ground.dto";
import { SpaceAssociationDto } from "./space-association.dto";
import { SpaceClassificationDto } from "./space-classification.dto";
import { TenantDto } from "./tenant.dto";

export class SpaceDto extends AbstractDto implements Space {
	@BooleanField()
	isSystem!: boolean;

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

	@ClassField(() => GroundDto, { required: false })
	ground?: GroundDto;
}
