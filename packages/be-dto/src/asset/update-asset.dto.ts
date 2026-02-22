import { PartialType } from "@nestjs/swagger";
import { CreateAssetDto } from "./create-asset.dto";

/**
 * 에셋 수정 DTO
 */
export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
