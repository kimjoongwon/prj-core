import { CreateGroupDto, QueryGroupDto, UpdateGroupDto } from "@cocrepo/dto";
import { Group } from "@cocrepo/entity";
import { GroupsService, SpaceContext } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GroupsApplicationService {
	constructor(
		private readonly groupsService: GroupsService,
		private readonly spaceContext: SpaceContext,
	) {}

	getGroups(query: QueryGroupDto): Promise<Group[]> {
		return this.groupsService.getAll(query);
	}

	getGroupById(id: string): Promise<Group> {
		return this.groupsService.getById(id);
	}

	createGroup(dto: CreateGroupDto): Promise<Group> {
		return this.groupsService.create(dto, this.spaceContext.spaceId!);
	}

	updateGroup(id: string, dto: UpdateGroupDto): Promise<Group> {
		return this.groupsService.update(id, dto);
	}

	deleteGroup(id: string): Promise<Group> {
		return this.groupsService.delete(id);
	}
}
