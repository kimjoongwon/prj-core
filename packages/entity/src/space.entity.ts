import type { Space as SpaceEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Ground } from "./ground.entity";
import type { SpaceAssociation } from "./space-association.entity";
import type { SpaceClassification } from "./space-classification.entity";
import type { Tenant } from "./tenant.entity";

export class Space extends AbstractEntity implements SpaceEntity {
	tenants?: Tenant[];
	spaceClassifications?: SpaceClassification[];
	spaceAssociations?: SpaceAssociation[];
	ground?: Ground;
}
