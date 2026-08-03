import "reflect-metadata";
import type { ActionAggregate } from "@cocrepo/aggregate";
import {
	CreateActionCommand,
	DeleteActionCommand,
	UpdateActionCommand,
} from "@cocrepo/command";
import { CreateActionUseCase } from "./create-action.usecase";
import { DeleteActionUseCase } from "./delete-action.usecase";
import { UpdateActionUseCase } from "./update-action.usecase";

function createActionAggregate() {
	return {
		createAction: jest.fn(),
		updateAction: jest.fn(),
		deleteAction: jest.fn(),
		getActionById: jest.fn(),
	} as unknown as jest.Mocked<ActionAggregate>;
}

describe("action use cases", () => {
	it("Given Action 생성 command When 실행하면 Then 생성 입력을 aggregate에 위임한다", async () => {
		const actions = createActionAggregate();
		const createdAction = {
			id: "action-101",
			name: "action.create",
		};
		actions.createAction.mockResolvedValue(
			createdAction as unknown as Awaited<
				ReturnType<ActionAggregate["createAction"]>
			>,
		);
		const command = new CreateActionCommand({
			name: "action.create",
			displayName: "Action Create",
			description: "Creates an action",
			group: "crud",
			order: 10,
			config: { method: "POST" },
		});
		const useCase = new CreateActionUseCase(actions);

		await expect(useCase.execute(command)).resolves.toBe(createdAction);
		expect(actions.createAction).toHaveBeenCalledWith({
			name: "action.create",
			displayName: "Action Create",
			description: "Creates an action",
			group: "crud",
			order: 10,
			config: { method: "POST" },
		});
	});

	it("Given Action 수정 command When 실행하면 Then 사전 조회 없이 변경만 aggregate에 위임한다", async () => {
		const actions = createActionAggregate();
		const updatedAction = {
			id: "action-101",
			name: "action.update",
		};
		actions.updateAction.mockResolvedValue(
			updatedAction as unknown as Awaited<
				ReturnType<ActionAggregate["updateAction"]>
			>,
		);
		const actionId = "action-101";
		const command = new UpdateActionCommand(actionId, {
			name: "action.update",
			config: { method: "PATCH" },
		});
		const useCase = new UpdateActionUseCase(actions);

		await expect(useCase.execute(command)).resolves.toBe(updatedAction);
		expect(actions.getActionById).not.toHaveBeenCalled();
		expect(actions.updateAction).toHaveBeenCalledWith(actionId, {
			name: "action.update",
			config: { method: "PATCH" },
		});
	});

	it("Given Action 삭제 command When 실행하면 Then 사전 조회 없이 삭제를 aggregate에 위임한다", async () => {
		const actions = createActionAggregate();
		const deletedAction = {
			id: "action-101",
			name: "action.delete",
		};
		actions.deleteAction.mockResolvedValue(
			deletedAction as unknown as Awaited<
				ReturnType<ActionAggregate["deleteAction"]>
			>,
		);
		const actionId = "action-101";
		const useCase = new DeleteActionUseCase(actions);

		await expect(
			useCase.execute(new DeleteActionCommand(actionId)),
		).resolves.toBe(deletedAction);
		expect(actions.getActionById).not.toHaveBeenCalled();
		expect(actions.deleteAction).toHaveBeenCalledWith(actionId);
	});
});
