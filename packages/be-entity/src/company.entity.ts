import { AbstractEntity } from "./abstract.entity";
import type { FitnessCenter } from "./fitness-center.entity";

export class Company extends AbstractEntity {
	/** 공개 식별자 ULID */
	companyId!: string;

	name!: string;
	label!: string | null;
	address!: string;
	phone!: string;
	email!: string;
	businessNo!: string;
	logoImageFileId!: string | null;

	fitnessCenters?: FitnessCenter[];
}
