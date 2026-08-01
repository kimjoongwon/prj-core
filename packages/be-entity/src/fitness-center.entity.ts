import type { FitnessCenter as FitnessCenterEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Company } from "./company.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Space } from "./space.entity";

export class FitnessCenter
	extends AbstractEntity
	implements DomainEntityModel<FitnessCenterEntity>
{
	name!: string;
	label!: string | null;
	address!: string;
	phone!: string;
	email!: string;
	companyId!: string;
	spaceId!: string;
	imageFileId!: string | null;

	company?: Company;
	space?: Space;
}
