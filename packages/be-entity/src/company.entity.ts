import type { Company as CompanyEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { FitnessCenter } from "./fitness-center.entity";

export class Company extends AbstractEntity implements CompanyEntity {
	name!: string;
	label!: string | null;
	address!: string;
	phone!: string;
	email!: string;
	businessNo!: string;
	logoImageFileId!: string | null;

	fitnessCenters?: FitnessCenter[];
}
