import type { FitnessCenter as FitnessCenterEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Company } from "./company.entity";
import type { Space } from "./space.entity";

export class FitnessCenter
	extends AbstractEntity
	implements FitnessCenterEntity
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
