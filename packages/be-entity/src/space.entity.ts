import { LanguageCode, type Space as SpaceEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Company } from "./company.entity";
import type { Ground } from "./ground.entity";
import type { Policy } from "./policy.entity";
import type { SpaceAssociation } from "./space-association.entity";
import type { SpaceClassification } from "./space-classification.entity";
import type { Tenant } from "./tenant.entity";

export class Space extends AbstractEntity implements SpaceEntity {
	contentLanguageCode: LanguageCode;
	company?: Company | null;
	tenants?: Tenant[];
	spaceClassifications?: SpaceClassification[];
	spaceAssociations?: SpaceAssociation[];
	policies?: Policy[];

	// Flattened API relations derived from company.grounds for current Space screens.
	ground?: Ground;
	grounds?: Ground[];
}
