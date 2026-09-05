import { NumberField } from "@cocrepo/decorator/field";
import { Derivative } from "@cocrepo/entity";
import { AssetDto } from "../asset/asset.dto";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class DerivativeDetailResponseDto extends EntityResponseType(
	Derivative,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceId",
			"createdById",
			"assetId",
			"kind",
			"profile",
			"storageKey",
			"mimeType",
			"width",
			"height",
			"durationMs",
			"asset",
		],
		relations: { asset: () => AssetDto },
		extraFields: ["sizeBytes"],
	},
) {
	@NumberField({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: number;
	declare asset?: AssetDto;
}
