import { LanguageCode } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { FitnessCenter } from "./fitness-center.entity";
import type { Policy } from "./policy.entity";
import type { SpaceAssociation } from "./space-association.entity";
import type { SpaceClassification } from "./space-classification.entity";
import type { Tenant } from "./tenant.entity";

export class Space extends AbstractEntity {
	/** 공개 식별자 ULID */
	spaceId!: string;

	contentLanguageCode: LanguageCode;
	tenants?: Tenant[];
	spaceClassifications?: SpaceClassification[];
	spaceAssociations?: SpaceAssociation[];
	policies?: Policy[];
	fitnessCenter?: FitnessCenter | null;
}
