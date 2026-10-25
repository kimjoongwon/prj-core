import { AssetQueryDto } from "@cocrepo/dto";
import { buildAssetQueryWhere } from "@cocrepo/repository";
import { type ArgumentMetadata, ValidationPipe } from "@nestjs/common";

describe("AssetQueryDto", () => {
	const pipe = new ValidationPipe({
		transform: true,
		whitelist: true,
	});

	const metadata: ArgumentMetadata = {
		type: "query",
		metatype: AssetQueryDto,
		data: undefined,
	};

	it("enum 필터를 contains가 아닌 정확 매칭으로 변환해야 한다", async () => {
		const spaceId = "01JSPACE0000000000000000QA";
		const folderId = "01JFLDR0000000000000000FLD";
		const query = await pipe.transform(
			{
				take: "20",
				skip: "0",
				kind: "IMAGE",
				status: "READY",
				folderId,
			},
			metadata,
		);

		expect(query).toBeInstanceOf(AssetQueryDto);
		expect(query.skip).toBe(0);
		expect(query.take).toBe(20);
		expect(
			buildAssetQueryWhere(query, {
				space: { id: spaceId },
			}),
		).toEqual({
			space: { id: spaceId },
			folder: { id: folderId },
			kind: "IMAGE",
			status: "READY",
			removedAt: null,
		});
	});
});
