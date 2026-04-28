import { AssetQueryDto } from "@cocrepo/dto";
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
				folderId: "da004091-8d08-4878-bf35-251a04608868",
			},
			metadata,
		);

		expect(query).toBeInstanceOf(AssetQueryDto);
		expect(query.skip).toBe(0);
		expect(query.take).toBe(20);
		expect(
			query.toPrismaWhere({ spaceId: "61ddca20-1752-466e-b4da-879ebdbe54e3" }),
		).toEqual({
			spaceId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
			folderId: "da004091-8d08-4878-bf35-251a04608868",
			kind: "IMAGE",
			status: "READY",
			removedAt: null,
		});
	});
});
