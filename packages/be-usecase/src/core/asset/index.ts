import { DeleteAssetUseCase } from "./delete-asset.usecase";
import { GetAssetByIdUseCase } from "./get-asset-by-id.usecase";
import { GetAssetContentUseCase } from "./get-asset-content.usecase";
import { GetAssetsUseCase } from "./get-assets.usecase";
import { MoveAssetUseCase } from "./move-asset.usecase";
import { UploadAssetUseCase } from "./upload-asset.usecase";

export const AssetQueryHandlers = [
	GetAssetsUseCase,
	GetAssetByIdUseCase,
	GetAssetContentUseCase,
];

export const AssetCommandHandlers = [
	MoveAssetUseCase,
	UploadAssetUseCase,
	DeleteAssetUseCase,
];

export * from "./delete-asset.usecase";
export * from "./get-asset-by-id.usecase";
export * from "./get-asset-content.usecase";
export * from "./get-assets.usecase";
export * from "./move-asset.usecase";
export * from "./upload-asset.usecase";
