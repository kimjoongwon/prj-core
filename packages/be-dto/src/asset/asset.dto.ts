import { NumberField, StringFieldOptional } from "@cocrepo/decorator/field";
import { Asset } from "@cocrepo/entity";
import { DerivativeDto } from "../derivative/derivative.dto";
import { FolderDto } from "../folder/folder.dto";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class AssetDto extends EntityResponseType(Asset, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"folderId",
		"kind",
		"status",
		"originalName",
		"storageKey",
		"mimeType",
		"extension",
		"checksum",
		"metadata",
		"createdById",
		"folder",
		"derivatives",
	],
	relations: { folder: () => FolderDto, derivatives: () => DerivativeDto },
	extraFields: ["sizeBytes", "publicUrl"],
}) {
	@NumberField({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: number;

	@StringFieldOptional({
		nullable: true,
		description: "공개 접근 가능한 에셋 URL",
	})
	publicUrl!: string | null;
	declare folder?: FolderDto;
	declare derivatives?: import("../derivative/derivative.dto").DerivativeDto[];
}
