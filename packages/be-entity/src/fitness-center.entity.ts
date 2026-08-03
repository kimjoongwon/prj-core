import { AbstractEntity } from "./abstract.entity";
import type { Company } from "./company.entity";
import type { Space } from "./space.entity";

export class FitnessCenter extends AbstractEntity {
	/** 공개 식별자 ULID */
	fitnessCenterId!: string;

	name!: string;
	label!: string | null;
	address!: string;
	phone!: string;
	email!: string;
	companyId!: bigint;
	spaceId!: bigint;
	imageFileId!: string | null;

	company?: Company;
	space?: Space;
}
