import "reflect-metadata";
import type { SpaceAggregate } from "@cocrepo/aggregate";
import { GetCurrentSpaceQuery, SetCurrentSpaceCommand } from "@cocrepo/command";
import type { UserService } from "@cocrepo/service";
import { ForbiddenException } from "@nestjs/common";
import type { ClsService } from "nestjs-cls";
import { GetCurrentSpaceUseCase } from "./get-current-space.usecase";
import { SetCurrentSpaceUseCase } from "./set-current-space.usecase";

const activeTenant = {
	id: "tenant-current-id",
	spaceId: "space-current-id",
	removedAt: null,
};
const currentSpace = {
	id: "space-current-id",
	ground: { name: "Current Ground" },
};

function createDependencies(currentTenantId: string | null = activeTenant.id) {
	const user = {
		id: "user-id",
		currentTenantId,
		tenants: [activeTenant],
	};
	const cls = {
		get: jest.fn().mockReturnValue(user),
	} as unknown as ClsService;
	const spaces = {
		findByIdsWithGround: jest.fn().mockResolvedValue([currentSpace]),
	} as unknown as jest.Mocked<SpaceAggregate>;
	const users = {
		setCurrentTenant: jest.fn().mockResolvedValue(undefined),
	} as unknown as jest.Mocked<UserService>;

	return { cls, spaces, user, users };
}

describe("current-space use cases", () => {
	it("저장된 활성 currentTenantId의 Space를 반환한다", async () => {
		const { cls, spaces } = createDependencies();
		const useCase = new GetCurrentSpaceUseCase(cls, spaces);

		await expect(useCase.execute(new GetCurrentSpaceQuery())).resolves.toEqual({
			...currentSpace,
			tenantId: activeTenant.id,
		});
	});

	it("currentTenantId가 없거나 접근할 수 없으면 null을 반환한다", async () => {
		const noSelection = createDependencies(null);
		const invalidSelection = createDependencies("tenant-invalid-id");

		await expect(
			new GetCurrentSpaceUseCase(
				noSelection.cls,
				noSelection.spaces,
			).execute(new GetCurrentSpaceQuery()),
		).resolves.toBeNull();
		await expect(
			new GetCurrentSpaceUseCase(
				invalidSelection.cls,
				invalidSelection.spaces,
			).execute(new GetCurrentSpaceQuery()),
		).resolves.toBeNull();
	});

	it("활성 Tenant 선택을 저장하고 선택된 Space를 반환한다", async () => {
		const { cls, spaces, users } = createDependencies(null);
		const useCase = new SetCurrentSpaceUseCase(cls, spaces, users);

		await expect(
			useCase.execute(new SetCurrentSpaceCommand({ tenantId: activeTenant.id })),
		).resolves.toEqual({ ...currentSpace, tenantId: activeTenant.id });
		expect(users.setCurrentTenant).toHaveBeenCalledWith(
			"user-id",
			activeTenant.id,
		);
	});

	it("소유하지 않은 Tenant는 저장하지 않는다", async () => {
		const { cls, spaces, users } = createDependencies(null);
		const useCase = new SetCurrentSpaceUseCase(cls, spaces, users);

		await expect(
			useCase.execute(
				new SetCurrentSpaceCommand({ tenantId: "tenant-invalid-id" }),
			),
		).rejects.toBeInstanceOf(ForbiddenException);
		expect(users.setCurrentTenant).not.toHaveBeenCalled();
	});
});
