import type { SpaceAssociation as SpaceAssociationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Group } from "./group.entity";

export class SpaceAssociation
	extends AbstractEntity
	implements DomainEntityModel<SpaceAssociationEntity>
{
	spaceId!: string;
	groupId!: string;

	group?: Group;
}
