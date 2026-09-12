import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { DECORATORS } from "@nestjs/swagger";
import { describe, expect, it } from "vitest";
import { CreateOidcClientDto } from "./create-oidc-client.dto";

const oidcClientBody = {
	clientId: "admin-web",
	name: "관리자 웹",
	redirectUris: ["https://example.com/callback"],
	grantTypes: ["authorization_code"],
	responseTypes: ["code"],
	tokenEndpointAuthMethod: "none",
	scope: "openid profile",
	isFirstParty: true,
};

const validationPipe = new ValidationPipe({
	transform: true,
	whitelist: true,
	forbidNonWhitelisted: true,
});

function validateOidcClientRequest(body: object) {
	return validationPipe.transform(body, {
		type: "body",
		metatype: CreateOidcClientDto,
	});
}

describe("CreateOidcClientDto의 Entity 파생 계약", () => {
	it("skipConsent는 선택 입력이며 저장 기본값과 Entity 메서드를 추가하지 않는다", async () => {
		const request = await validateOidcClientRequest(oidcClientBody);

		expect(request).toBeInstanceOf(CreateOidcClientDto);
		expect(request).not.toHaveProperty("skipConsent");
		expect(request).not.toHaveProperty("isPublicClient");
		expect(
			Reflect.getMetadata(
				DECORATORS.API_MODEL_PROPERTIES,
				CreateOidcClientDto.prototype,
				"skipConsent",
			),
		).toMatchObject({ type: Boolean, required: false });
	});

	it.each([
		true,
		false,
		"true",
		"false",
	])("skipConsent=%s의 기존 boolean 변환을 유지한다", async (skipConsent) => {
		await expect(
			validateOidcClientRequest({ ...oidcClientBody, skipConsent }),
		).resolves.toMatchObject({
			skipConsent: skipConsent === true || skipConsent === "true",
		});
	});

	it.each([
		null,
		"invalid",
	])("skipConsent=%s는 선택 입력이어도 거부한다", async (skipConsent) => {
		await expect(
			validateOidcClientRequest({ ...oidcClientBody, skipConsent }),
		).rejects.toThrow();
	});
});
