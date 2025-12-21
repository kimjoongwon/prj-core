import { SpaceAssociation as SpaceAssociationEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";

export class SpaceAssociation extends AbstractEntity implements SpaceAssociationEntity {
	spaceId!: string;
	groupId!: string;

	group?: Group;
}
