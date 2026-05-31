import { ActionAggregateRoot } from "@cocrepo/aggregate";
import { ACTION_ERRORS } from "@cocrepo/constant";
import { CreateActionDto, UpdateActionDto } from "@cocrepo/dto";
import { Action } from "@cocrepo/entity";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ActionFacade {
	constructor(private readonly actionsService: ActionAggregateRoot) {}

	getAllActions(): Promise<Action[]> {
		return this.getActions();
	}

	getActions(group?: string): Promise<Action[]> {
		return group
			? this.actionsService.getActionsByGroup(group)
			: this.actionsService.getAllActions();
	}

	getActionsByGroup(group: string): Promise<Action[]> {
		return this.actionsService.getActionsByGroup(group);
	}

	getActionById(id: string): Promise<Action> {
		return this.actionsService.getActionById(id);
	}

	createAction(dto: CreateActionDto): Promise<Action> {
		return this.actionsService.createAction({
			name: dto.name,
			displayName: dto.displayName,
			description: dto.description,
			group: dto.group,
			order: dto.order,
			isSystem: dto.isSystem,
			config: dto.config,
		});
	}

	async updateAction(id: string, dto: UpdateActionDto): Promise<Action> {
		const existingAction = await this.actionsService.getActionById(id);
		if (existingAction.isSystem) {
			throw new BadRequestException(
				ACTION_ERRORS.SYSTEM_ACTION_MODIFY_NOT_ALLOWED,
			);
		}

		return this.actionsService.updateAction(id, {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.displayName !== undefined && { displayName: dto.displayName }),
			...(dto.description !== undefined && { description: dto.description }),
			...(dto.group !== undefined && { group: dto.group }),
			...(dto.order !== undefined && { order: dto.order }),
			...(dto.isSystem !== undefined && { isSystem: dto.isSystem }),
			...(dto.config !== undefined && { config: dto.config }),
		});
	}

	async deleteAction(id: string): Promise<Action> {
		const existingAction = await this.actionsService.getActionById(id);
		if (existingAction.isSystem) {
			throw new BadRequestException(
				ACTION_ERRORS.SYSTEM_ACTION_DELETE_NOT_ALLOWED,
			);
		}

		return this.actionsService.deleteAction(id);
	}
}
