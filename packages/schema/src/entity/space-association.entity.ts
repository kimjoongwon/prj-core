import { SpaceAssociation as SpaceAssociationEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { SpaceAssociationDto } from "../dto/space-association.dto";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";

@UseDto(SpaceAssociationDto)
export class SpaceAssociation
	extends AbstractEntity<SpaceAssociationDto>
	implements SpaceAssociationEntity
{
	spaceId: string;
	groupId: string;

	group?: Group;
}
