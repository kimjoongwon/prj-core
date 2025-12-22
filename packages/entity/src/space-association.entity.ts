import { SpaceAssociation as SpaceAssociationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";

export class SpaceAssociation
	extends AbstractEntity
	implements SpaceAssociationEntity
{
	spaceId!: string;
	groupId!: string;

	group?: Group;
}
