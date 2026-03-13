import { CreateGroupDto, QueryGroupDto, UpdateGroupDto } from "@cocrepo/dto";
import { Group } from "@cocrepo/entity";
import { GroupService, SpaceContext } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GroupFacade {
	constructor(
		private readonly groupsService: GroupService,
		private readonly spaceContext: SpaceContext,
	) {}

	getAll(query: QueryGroupDto): Promise<Group[]> {
		return this.getGroups(query);
	}

	getGroups(query: QueryGroupDto): Promise<Group[]> {
		return this.groupsService.getAll(query);
	}

	getById(id: string): Promise<Group> {
		return this.getGroupById(id);
	}

	getGroupById(id: string): Promise<Group> {
		return this.groupsService.getById(id);
	}

	create(dto: CreateGroupDto): Promise<Group> {
		return this.createGroup(dto);
	}

	createGroup(dto: CreateGroupDto): Promise<Group> {
		return this.groupsService.create(dto, this.spaceContext.spaceId!);
	}

	update(id: string, dto: UpdateGroupDto): Promise<Group> {
		return this.updateGroup(id, dto);
	}

	updateGroup(id: string, dto: UpdateGroupDto): Promise<Group> {
		return this.groupsService.update(id, dto);
	}

	delete(id: string): Promise<Group> {
		return this.deleteGroup(id);
	}

	deleteGroup(id: string): Promise<Group> {
		return this.groupsService.delete(id);
	}
}
