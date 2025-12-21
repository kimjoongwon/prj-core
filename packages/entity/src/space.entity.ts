import { Space as SpaceEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Ground } from "./ground.entity";
import { SpaceAssociation } from "./space-association.entity";
import { SpaceClassification } from "./space-classification.entity";
import { Tenant } from "./tenant.entity";

export class Space extends AbstractEntity implements SpaceEntity {
	tenants?: Tenant[];
	spaceClassifications?: SpaceClassification[];
	spaceAssociations?: SpaceAssociation[];
	ground?: Ground;
}
