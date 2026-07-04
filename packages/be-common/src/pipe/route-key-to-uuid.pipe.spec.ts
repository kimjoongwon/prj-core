import { type ArgumentMetadata } from "@nestjs/common";
import { RouteKeyToUuidPipe } from "./route-key-to-uuid.pipe";

describe("RouteKeyToUuidPipe", () => {
	const pipe = new RouteKeyToUuidPipe();
	const uuid = "018f9e5e-1d3b-7a91-bc21-1e0d9c3d01ab";
	const routeKey = "AY-eXh07epG8IR4NnD0Bqw";

	const paramMetadata = (data: string): ArgumentMetadata => ({
		type: "param",
		data,
		metatype: String,
	});

	it("short route key를 UUID로 복원한다", () => {
		expect(pipe.transform(routeKey, paramMetadata("templateId"))).toBe(uuid);
	});

	it("legacy UUID path param은 그대로 통과한다", () => {
		expect(pipe.transform(uuid, paramMetadata("templateId"))).toBe(uuid);
	});

	it("id param도 UUID route key 변환 대상이다", () => {
		expect(pipe.transform(routeKey, paramMetadata("id"))).toBe(uuid);
	});

	it("id 계열이 아닌 param은 변환하지 않는다", () => {
		expect(pipe.transform(routeKey, paramMetadata("languageCode"))).toBe(
			routeKey,
		);
	});

	it("param이 아닌 값은 변환하지 않는다", () => {
		const metadata: ArgumentMetadata = {
			type: "body",
			data: "templateId",
			metatype: Object,
		};

		expect(pipe.transform(routeKey, metadata)).toBe(routeKey);
	});

	it("id 계열 param의 invalid 값은 기존 param pipe가 처리하도록 그대로 둔다", () => {
		expect(pipe.transform("not-a-route-key", paramMetadata("templateId"))).toBe(
			"not-a-route-key",
		);
	});
});
