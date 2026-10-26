import type { QueryBus } from "@nestjs/cqrs";
import type { Response } from "express";
import { AssetsController } from "./assets.controller";

describe("AssetsController", () => {
	it("asset content query 결과를 이미지 응답으로 전달한다", async () => {
		const body = Buffer.from("asset-content");
		const queryBus = {
			execute: jest.fn().mockResolvedValue({
				body,
				contentType: "image/png",
				contentLength: body.length,
				etag: "asset-etag",
				fileName: "space-logo.png",
				lastModified: new Date("2026-01-01T00:00:00.000Z"),
			}),
		};
		const response = {
			setHeader: jest.fn(),
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const controller = new AssetsController(queryBus as unknown as QueryBus);

		await controller.getAssetContent(
			"01JASSET0000000000000000A1",
			response as unknown as Response,
		);

		expect(queryBus.execute).toHaveBeenCalledTimes(1);
		expect(response.setHeader).toHaveBeenCalledWith("Content-Type", "image/png");
		expect(response.setHeader).toHaveBeenCalledWith(
			"Content-Length",
			String(body.length),
		);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.send).toHaveBeenCalledWith(body);
	});
});
