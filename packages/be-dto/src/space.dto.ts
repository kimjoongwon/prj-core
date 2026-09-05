import { Space } from "@cocrepo/entity";
import { FitnessCenterDto } from "./fitness-center.dto";
import { EntityResponseType } from "./mapped-types";
import { SpaceAssociationDto } from "./space-association.dto";
import { SpaceClassificationDto } from "./space-classification.dto";
import { TenantDto } from "./tenant.dto";

export class SpaceDto extends EntityResponseType(Space, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"tenantId",
		"contentLanguageCode",
		"tenants",
		"spaceClassification",
		"spaceAssociations",
		"fitnessCenter",
	] as const,
	relations: {
		tenants: () => TenantDto,
		spaceClassification: () => SpaceClassificationDto,
		spaceAssociations: () => SpaceAssociationDto,
		fitnessCenter: () => FitnessCenterDto,
	},
}) {
	declare tenants?: TenantDto[];
	declare spaceClassification?: SpaceClassificationDto;
	declare spaceAssociations?: SpaceAssociationDto[];
	declare fitnessCenter?: FitnessCenterDto;
}
