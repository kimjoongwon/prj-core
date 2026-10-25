import { Company } from "@cocrepo/entity";
import { FitnessCenterDto } from "./fitness-center.dto";
import { EntityResponseType } from "./mapped-types";

export class CompanyDto extends EntityResponseType(Company, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"name",
		"label",
		"address",
		"phone",
		"email",
		"businessNo",
		"logoImageFileId",
		"fitnessCenters",
	] as const,
	relations: {
		fitnessCenters: () => FitnessCenterDto,
	},
}) {
	declare fitnessCenters?: FitnessCenterDto[];
}
