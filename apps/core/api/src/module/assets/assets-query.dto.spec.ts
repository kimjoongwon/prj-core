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
		const query = await pipe.transform(
			{
				take: "20",
				skip: "0",
				kind: "IMAGE",
				status: "READY",
				folderId: "01J0000000000000000000D000",
			},
			metadata,
		);

		expect(query).toBeInstanceOf(AssetQueryDto);
		expect(query.skip).toBe(0);
		expect(query.take).toBe(20);
		expect(
			buildAssetQueryWhere(query, {
				space: { id: "01J00000000000000000000001" },
			}),
		).toEqual({
			space: { id: "01J00000000000000000000001" },
			folder: { id: "01J0000000000000000000D000" },
			kind: "IMAGE",
			status: "READY",
			removedAt: null,
		});
	});
});
