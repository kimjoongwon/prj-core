import { BadRequestException } from "@nestjs/common";
import { OidcClientAggregate } from "../src/idp/oidc-client.aggregate";

describe("OidcClientAggregate", () => {
	type CreateInput = Parameters<OidcClientAggregate["create"]>[0];
	type UpdateInput = Parameters<OidcClientAggregate["update"]>[1];

	const buildClient = (overrides: Partial<CreateInput> = {}) => ({
		id: 101n,
		oidcClientId: "01J00000000000000000000001",
		clientId: "partner-web",
		clientSecret: "secret",
		name: "Partner Web",
		redirectUris: ["https://partner.example.com/callback"],
		loginUrl: null,
		defaultReturnTo: null,
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email",
		isActive: true,
		isFirstParty: false,
		skipConsent: false,
		loginUi: null,
		logoUri: null,
		policyUri: null,
		tosUri: null,
		removedAt: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		isPublicClient: () => false,
		isConfidentialClient: () => true,
		...overrides,
	});

	const buildRepository = () => ({
		findByClientId: jest.fn(),
		findByOidcClientId: jest.fn(),
		create: jest.fn(async (input: Partial<CreateInput>) => buildClient(input)),
		updateById: jest.fn(async (_id: bigint, input: Partial<UpdateInput>) =>
			buildClient(input),
		),
	});

	const buildCreateInput = (
		overrides: Partial<CreateInput> = {},
	): CreateInput => ({
		clientId: "partner-web",
		clientSecret: "secret",
		name: "Partner Web",
		redirectUris: ["https://partner.example.com/callback"],
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email",
		isFirstParty: false,
		skipConsent: false,
		...overrides,
	});

	it("first-party가 아닌 클라이언트는 consent 생략 생성이 거부된다", async () => {
		const repository = buildRepository();
		repository.findByClientId.mockResolvedValue(null);
		const service = new OidcClientAggregate(repository as never);

		await expect(
			service.create(buildCreateInput({ skipConsent: true })),
		).rejects.toBeInstanceOf(BadRequestException);
		expect(repository.create).not.toHaveBeenCalled();
	});

	it("first-party 클라이언트는 consent 생략 생성이 허용된다", async () => {
		const repository = buildRepository();
		repository.findByClientId.mockResolvedValue(null);
		const service = new OidcClientAggregate(repository as never);

		await service.create(
			buildCreateInput({ isFirstParty: true, skipConsent: true }),
		);

		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				isFirstParty: true,
				skipConsent: true,
			}),
		);
	});

	it("기존 consent 생략 클라이언트를 third-party로 낮추는 수정은 거부된다", async () => {
		const repository = buildRepository();
		repository.findByOidcClientId.mockResolvedValue(
			buildClient({ isFirstParty: true, skipConsent: true }),
		);
		const service = new OidcClientAggregate(repository as never);

		await expect(
			service.update("01J00000000000000000000001", {
				isFirstParty: false,
			} satisfies UpdateInput),
		).rejects.toBeInstanceOf(BadRequestException);
		expect(repository.updateById).not.toHaveBeenCalled();
	});
});
