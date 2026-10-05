import "reflect-metadata";
import type { SpaceAggregate } from "@cocrepo/aggregate";
import { GetCurrentSpaceQuery, SetCurrentSpaceCommand } from "@cocrepo/command";
import type { UserService } from "@cocrepo/service";
import { ForbiddenException } from "@nestjs/common";
import type { ClsService } from "nestjs-cls";
import { GetCurrentSpaceUseCase } from "./get-current-space.usecase";
import { SetCurrentSpaceUseCase } from "./set-current-space.usecase";

const activeTenant = {
	id: 201n,
	spaceId: 101n,
	removedAt: null,
};
const currentSpace = {
	id: 101n,
	spaceId: "01J00000000000000000001001",
	fitnessCenter: {
		name: "Current Fitness Center",
		company: {
			name: "Current Company",
		},
	},
};

function createDependencies(currentTenantId: bigint | null = activeTenant.id) {
	const user = {
		id: 301n,
		userId: "01J00000000000000000002001",
		currentTenantId,
		tenants: [activeTenant],
	};
	const cls = {
		get: jest.fn().mockReturnValue(user),
	} as unknown as ClsService;
	const spaces = {
		findByIdsWithFitnessCenter: jest.fn().mockResolvedValue([currentSpace]),
	} as unknown as jest.Mocked<SpaceAggregate>;
	const users = {
		setCurrentTenant: jest.fn().mockResolvedValue(undefined),
	} as unknown as jest.Mocked<UserService>;

	return { cls, spaces, user, users };
}

describe("current-space use cases", () => {
	it("Given 저장된 활성 currentTenantId When 현재 Space를 조회하면 Then fitnessCenter.company 포함 Space를 반환한다", async () => {
		const { cls, spaces } = createDependencies();
		const useCase = new GetCurrentSpaceUseCase(cls, spaces);

		await expect(useCase.execute(new GetCurrentSpaceQuery())).resolves.toEqual({
			...currentSpace,
			tenantId: activeTenant.id,
		});
	});

	it("Given currentTenantId가 없거나 접근할 수 없음 When 현재 Space를 조회하면 Then null을 반환한다", async () => {
		const noSelection = createDependencies(null);
		const invalidSelection = createDependencies(999n);

		await expect(
			new GetCurrentSpaceUseCase(noSelection.cls, noSelection.spaces).execute(
				new GetCurrentSpaceQuery(),
			),
		).resolves.toBeNull();
		await expect(
			new GetCurrentSpaceUseCase(
				invalidSelection.cls,
				invalidSelection.spaces,
			).execute(new GetCurrentSpaceQuery()),
		).resolves.toBeNull();
	});

	it("Given 활성 Tenant 선택 요청 When 현재 Space를 설정하면 Then 선택된 fitnessCenter.company 포함 Space를 반환한다", async () => {
		const { cls, spaces, users } = createDependencies(null);
		const useCase = new SetCurrentSpaceUseCase(cls, spaces, users);

		await expect(
			useCase.execute(
				new SetCurrentSpaceCommand({ tenantId: activeTenant.id }),
			),
		).resolves.toEqual({ ...currentSpace, tenantId: activeTenant.id });
		expect(users.setCurrentTenant).toHaveBeenCalledWith(301n, activeTenant.id);
	});

	it("Given 소유하지 않은 Tenant When 현재 Space를 설정하면 Then 저장하지 않고 거부한다", async () => {
		const { cls, spaces, users } = createDependencies(null);
		const useCase = new SetCurrentSpaceUseCase(cls, spaces, users);

		await expect(
			useCase.execute(new SetCurrentSpaceCommand({ tenantId: 999n })),
		).rejects.toBeInstanceOf(ForbiddenException);
		expect(users.setCurrentTenant).not.toHaveBeenCalled();
	});
});
